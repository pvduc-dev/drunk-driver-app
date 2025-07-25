import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Driver, Trip, TripStatus } from '@lib/db-lib';
import { Model, Types } from 'mongoose';
import { NotifyLibService } from '@lib/notify-lib';

@Injectable()
export class TripsService {
  private logger = new Logger(TripsService.name);
  constructor(
    @InjectQueue('SEARCH_DRIVER') private readonly searchDriverQueue: Queue,
    @InjectQueue('CANCEL_SEACHING')
    private readonly cancelSearchingQueue: Queue,
    @InjectQueue('CANCEL_REQUEST')
    private readonly cancelRequestQueue: Queue,
    @InjectModel(Trip.name) private readonly tripModel: Model<Trip>,
    private readonly notifyLibService: NotifyLibService,
    @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
  ) {}

  async getTrips(driverId: string, status: string[]) {
    const trips = await this.tripModel
      .find({
        driver: driverId,
        status: { $in: status },
      })
      .populate('customer')
      .populate('driver');
    if (!trips) {
      throw new NotFoundException('Không tìm thấy chuyển đi');
    }
    return trips;
  }

  async getTrip(tripId: string) {
    const trip = await this.tripModel
      .findById(tripId)
      .populate('customer')
      .populate('driver');
    if (!trip) {
      throw new NotFoundException('Không tìm thấy chuyển đi');
    }
    return trip;
  }

  async acceptTrip(tripId: string, driverId: string) {
    const trip = await this.tripModel.findByIdAndUpdate(
      tripId,
      {
        driver: driverId,
        status: TripStatus.ARRIVING,
      },
      { new: true },
    );
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    await this.notifyLibService.push({
      userId: trip.customer as string,
      title: 'Đã tìm thấy tài xế cho bạn',
      body: `Tài xế sẽ đến địa điểm của bạn trong khoảng 10 phút`,
      data: {
        event: 'ARRIVING',
        tripId,
      },
    });
    return trip;
  }

  async sentRequest(tripId: string, driverId: string) {
    const trip = await this.tripModel.findByIdAndUpdate(
      tripId,
      { status: TripStatus.REQUESTED, driver: driverId },
      { new: true },
    );
    await this.notifyLibService.push({
      userId: driverId,
      title: 'Yêu cầu đặt xe mới',
      body: `Có một yêu cầu đặt xe mới gần bạn.`,
      data: {
        event: 'SEARCHING_DRIVER',
        tripId,
      },
    });
    await this.cancelRequestQueue.add(
      'CANCEL_REQUEST',
      {
        tripId,
      },
      {
        delay: 3000,
        jobId: tripId,
      },
    );
    return trip;
  }

  async arriveTrip(tripId: string) {
    const trip = await this.tripModel.findOneAndUpdate(
      { _id: tripId },
      { status: TripStatus.ARRIVING },
      { new: true },
    );
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  async cancelByDriver(tripId: string): Promise<void> {
    const trip = await this.tripModel.findOneAndUpdate(
      { _id: tripId },
      {
        status: TripStatus.CANCELLED_BY_DRIVER,
      },
      { new: true },
    );
    if (trip) {
      await this.notifyLibService.push({
        userId: trip.customer as string,
        title: 'Tài xế đã hủy chuyển đi của bạn',
        body: `Tài xế đã hủy chuyển đi của bạn`,
        data: {
          event: 'CANCELLED_BY_DRIVER',
          tripId,
        },
      });
    }
  }

  async cancelByTimeout(tripId: string) {
    const trip: Trip | null = await this.tripModel.findByIdAndUpdate(
      tripId,
      { status: TripStatus.CANCELLED_BY_SYSTEM },
      { new: true },
    );
    if (trip) {
      const searchDriverJob: Job = await this.searchDriverQueue.getJob(
        trip.id as string,
      );
      if (searchDriverJob) {
        await searchDriverJob.remove();
      }
      const cancelRequestJob: Job = await this.cancelRequestQueue.getJob(
        trip.id as string,
      );
      if (cancelRequestJob) {
        await cancelRequestJob.remove();
      }
      await this.notifyLibService.push({
        userId: (trip.customer as unknown as Types.ObjectId)?.toString(),
        title: 'Không thể tìm thấy tài xế cho bạn',
        body: `Không thể tìm thấy tài xế cho bạn`,
        data: {
          event: 'CANCELLED_BY_SYSTEM',
          tripId,
        },
      });
    }
  }

  async startTrip(tripId: string): Promise<void> {
    const trip = await this.tripModel.findOneAndUpdate(
      { _id: tripId },
      { status: TripStatus.IN_PROGRESS, startedAt: new Date() },
      { new: true },
    );
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    await this.notifyLibService.push({
      userId: trip.customer as string,
      title: 'Tài xế đã tới điểm đón',
      body: `Tài xế đã tới điểm đón bạn`,
      data: {
        event: 'IN_PROGRESS',
        tripId,
      },
    });
  }

  async completeTrip(tripId: string): Promise<void> {
    const trip = await this.tripModel.findByIdAndUpdate(
      tripId,
      {
        status: TripStatus.COMPLETED,
        completedAt: new Date(),
      },
      { new: true },
    );
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    await this.driverModel.findByIdAndUpdate(trip.driver as string, {
      currentTripId: '',
    });
    await this.notifyLibService.push({
      userId: trip.customer as string,
      title: 'Chuyển đi đã hoàn thành',
      body: `Chuyển đi đã hoàn thành`,
      data: {
        event: 'COMPLETED',
        tripId,
      },
    });
  }

  async rejectTrip(tripId: string): Promise<void> {
    const trip = await this.tripModel.findByIdAndUpdate(
      tripId,
      { status: TripStatus.PENDING, driver: null },
      { new: true },
    );
    await this.searchDriverQueue.add(
      trip?.id as string,
      {
        trip: trip,
      },
      {
        jobId: trip?.id as string,
      },
    );
  }

  async getCurrentTrip(driverId: string) {
    const driver = await this.driverModel.findById(driverId);
    if (!driver!.currentTripId) {
      throw new NotFoundException('Hiện tại tài xế không có chuyển đi nào');
    }
    return await this.tripModel.findById(driver!.currentTripId);
  }
}
