import { Location, Trip } from '@lib/db-lib';
import { GeoLibService } from '@lib/geo-lib';
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
    @InjectQueue('trips') private readonly tripsQueue: Queue,
  ) {}

  async createTrip(trip: Trip): Promise<Trip> {
    const direction = await this.geoLibService.getDirection(
      trip.pickup.location as Location,
      trip.dropoff.location as Location,
    );
    // const alreadyTrip = await this.tripModel.findOne({
    //   pickup: trip.pickup,
    //   dropoff: trip.dropoff,
    //   status: { $ne: 'completed' },
    // });
    // if (alreadyTrip) {
    //   throw new BadRequestException('Trip already exists');
    // }
    const createdTrip = await this.tripModel.create({
      ...trip,
      path: direction.path,
      distance: direction.distance,
      price: direction.distance * 100000,
    });

    await this.tripsQueue.add(
      'find-driver',
      {
        tripId: createdTrip._id,
      },
      {
        attempts: 10,
        backoff: {
          type: 'fixed',
          delay: 0,
        },
      },
    );

    return createdTrip;
  }

  async getTrips(customerId: string): Promise<Trip[]> {
    return this.tripModel.find({ customerId });
  }

  async getTrip(tripId: string): Promise<Trip> {
    const trip = await this.tripModel.findById(tripId);
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

  async cancelTrip(tripId: string): Promise<Trip> {
    const trip = await this.tripModel.findOneAndUpdate(
      { _id: tripId, status: 'pending' },
      { status: 'cancelled' },
      { new: true },
    );
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    await this.tripsQueue.remove(`trip-${tripId}`);
    return trip;
  }
}
