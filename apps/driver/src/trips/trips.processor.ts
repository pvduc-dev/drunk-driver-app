import { Processor, WorkerHost } from '@nestjs/bullmq';
import { DelayedError, Job } from 'bullmq';
import { TripsService } from './trips.service';
import { DriversService } from '../drivers/drivers.service';
import { Trip, Location, TripStatus } from '@lib/db-lib';
import { Logger } from '@nestjs/common';

@Processor('SEARCH_DRIVER')
export class SearchDriverProcessor extends WorkerHost {
  constructor(
    private readonly tripsService: TripsService,
    private readonly driversService: DriversService,
  ) {
    super();
  }

  async process(job: Job, token: string): Promise<void> {
    const trip = job.data.trip as Trip;
    const driver = await this.driversService.getNearest(
      trip.pickup.location as Location,
    );
    if (driver) {
      await this.tripsService.sentRequest(
        trip.id as string,
        driver.id as string,
      );
    } else {
      Logger.log('No driver found');
      await job.moveToDelayed(Date.now() + 500, token);
      throw new DelayedError();
    }
  }
}

@Processor('CANCEL_REQUEST')
export class RequestSentTimeoutProcessor extends WorkerHost {
  constructor(private readonly tripsService: TripsService) {
    super();
  }

  async process(job: Job): Promise<void> {
    const tripId = job.data.tripId as string;
    const trip: Trip = await this.tripsService.getTrip(tripId);
    if (trip.status === TripStatus.REQUESTED) {
      await this.tripsService.rejectTrip(tripId);
    }
  }
}

@Processor('CANCEL_SEACHING')
export class SearchDriverTimeoutProcessor extends WorkerHost {
  constructor(private readonly tripsService: TripsService) {
    super();
  }

  async process(job: Job, token: string): Promise<void> {
    const trip: Trip = job.data.trip as Trip;
    try {
      if (trip.status === TripStatus.REQUESTED) {
        await job.moveToDelayed(Date.now() + 500, token);
        throw new DelayedError();
      } else {
        await this.tripsService.cancelByTimeout(trip.id as string);
      }
    } catch (error) {
      Logger.log('Cancel searching', error);
    }
  }
}
