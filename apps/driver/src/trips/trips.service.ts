import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Trip } from '@lib/db-lib';
import { Model } from 'mongoose';
import { NotifyLibService } from '@lib/notify-lib';

@Injectable()
export class TripsService {
  constructor(
    @InjectQueue('trips') private readonly tripsQueue: Queue,
    @InjectModel(Trip.name) private readonly tripModel: Model<Trip>,
    private readonly notifyLibService: NotifyLibService,
  ) {}

  async getTrips(driverId: string) {
    const trips = await this.tripModel.find({ driverId });
    return trips;
  }

  async getTrip(tripId: string) {
    const trip = await this.tripModel.findById(tripId);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  async acceptTrip(tripId: string, driverId: string) {
    const trip = await this.tripModel.findByIdAndUpdate(
      tripId,
      {
        driverId,
        status: 'accepted',
      },
      { new: true },
    );
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    await this.notifyLibService.push({
      userId: trip.customerId as string,
      title: 'Đã tìm thấy tài xế cho bạn',
      body: `Tài xế sẽ đến địa điểm của bạn trong khoảng 10 phút`,
      data: {
        event: 'TRIP_ACCEPTED',
        tripId,
      },
    });
    return trip;
  }

  async arriveTrip(tripId: string) {
    const trip = await this.tripModel.findOneAndUpdate(
      { _id: tripId },
      { status: 'processing' },
      { new: true },
    );
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  async cancelByDriver(tripId: string) {
    const trip = await this.tripModel.findOneAndUpdate(
      { _id: tripId },
      {
        status: 'cancelled',
      },
      { new: true },
    );
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    await this.notifyLibService.push({
      userId: trip.customerId as string,
      title: 'Tài xế đã hủy chuyển đi của bạn',
      body: `Tài xế đã hủy chuyển đi của bạn`,
      data: {
        event: 'TRIP_CANCELLED',
        tripId,
      },
    });
    return trip;
  }

  async cancelByTimeout(tripId: string) {
    const trip = await this.tripModel.findOneAndUpdate(
      { _id: tripId, status: 'pending' },
      { status: 'cancelled' },
      { new: true },
    );
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    await this.notifyLibService.push({
      userId: trip.customerId as string,
      title: 'Không thể tìm thấy tài xế cho bạn',
      body: `Không thể tìm thấy tài xế cho bạn`,
      data: {
        event: 'TRIP_TIMEOUT',
        tripId,
      },
    });
    return trip;
  }

  async startTrip(tripId: string) {
    const trip = await this.tripModel.findOneAndUpdate(
      { _id: tripId },
      { status: 'processing', startedAt: new Date() },
      { new: true },
    );
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  async completeTrip(tripId: string) {
    const trip = await this.tripModel.findOneAndUpdate(
      { _id: tripId, status: 'processing' },
      {
        status: 'completed',
        completedAt: new Date(),
      },
      { new: true },
    );
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  async rejectTrip(tripId: string) {
    const trip = await this.tripModel.findOneAndUpdate(
      { _id: tripId },
      { status: 'pending' },
      { new: true },
    );
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }
}
