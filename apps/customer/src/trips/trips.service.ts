import { Customer, Location, Trip, TripStatus } from '@lib/db-lib';
import { GeoLibService } from '@lib/geo-lib';
import { NotifyLibService } from '@lib/notify-lib';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bullmq';
import { Model } from 'mongoose';

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name) private readonly tripModel: Model<Trip>,
    private readonly geoLibService: GeoLibService,
    @InjectQueue('SEARCH_DRIVER') private readonly searchDriverQueue: Queue,
    @InjectQueue('CANCEL_SEACHING')
    private readonly cancelSearchingQueue: Queue,
    private readonly notifyService: NotifyLibService,
  ) {}

  async createTrip(trip: Trip): Promise<Trip> {
    const direction = await this.geoLibService.getDirection(
      trip.pickup.location as Location,
      trip.dropoff.location as Location,
    );
    const createdTrip = await this.tripModel.create({
      ...trip,
      path: direction.path,
      distance: direction.distance,
      price: direction.distance * 100000,
    });

    await this.searchDriverQueue.add(
      createdTrip.id as string,
      {
        trip: createdTrip,
      },
      {
        jobId: createdTrip.id as string,
      },
    );
    await this.cancelSearchingQueue.add(
      createdTrip.id as string,
      {
        trip: createdTrip,
      },
      {
        delay: 3000000,
        jobId: createdTrip.id as string,
      },
    );

    return {
      id: createdTrip.id,
      status: createdTrip.status,
      pickup: createdTrip.pickup,
      dropoff: createdTrip.dropoff,
    };
  }

  async getTrips(customerId: string): Promise<Trip[]> {
    return this.tripModel.find({ customer: customerId as Customer });
  }

  async getTrip(tripId: string): Promise<Trip> {
    const trip = await this.tripModel
      .findById(tripId)
      .populate('driver')
      .populate('customer');
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  async updateTrip(tripId: string, trip: Trip): Promise<Trip> {
    const updatedTrip = await this.tripModel.findByIdAndUpdate(tripId, trip, {
      new: true,
    });
    if (!updatedTrip) {
      throw new NotFoundException('Trip not found');
    }
    return updatedTrip;
  }

  async cancelTrip(tripId: string): Promise<void> {
    const trip = await this.tripModel.findOneAndUpdate(
      { _id: tripId },
      { status: TripStatus.CANCELLED_BY_CUSTOMER },
      { new: true },
    );
    await this.notifyService.push({
      userId: trip?.customer?.id as string,
      title: 'Trip cancelled',
      body: 'Your trip has been cancelled',
      data: {
        event: 'CUSTOMER_CANCEL_TRIP',
        tripId: tripId,
      },
    });
    await this.searchDriverQueue.remove(tripId);
    await this.cancelSearchingQueue.remove(tripId);
  }

  async getCurrentTrip(customerId: string): Promise<Trip> {
    const trip = await this.tripModel
      .findOne({
        customer: customerId,
        status: {
          $nin: [
            TripStatus.COMPLETED,
            TripStatus.CANCELLED_BY_DRIVER,
            TripStatus.CANCELLED_BY_SYSTEM,
            TripStatus.CANCELLED_BY_CUSTOMER,
            TripStatus.FAILED,
            TripStatus.NO_SHOW,
          ],
        },
      })
      .populate('driver')
      .populate('customer');
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }
}
