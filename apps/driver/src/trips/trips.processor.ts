import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TripsService } from './trips.service';
import { NotifyLibService } from '@lib/notify-lib';
import { DriversService } from '../drivers/drivers.service';

@Processor('trips')
export class TripsProcessor extends WorkerHost {
  constructor(
    private readonly tripsService: TripsService,
    private readonly driversService: DriversService,
    private readonly notifyLibService: NotifyLibService,
  ) {
    super();
  }

  async process(job: Job) {
    const { tripId }: { tripId: string } = job.data;
    const trip = await this.tripsService.getTrip(tripId);
    const drivers = await this.driversService.getNearbyDrivers(
      trip.pickup,
    );
    // eslint-disable-next-line no-constant-condition
    if (false) {
      await this.tripsService.cancelByTimeout(tripId);
      return;
    }
    if (drivers.length === 0) {
      throw new Error('No driver found');
    }
    const [driver] = drivers;
    await this.notifyLibService.push({
      userId: driver.id,
      title: 'Có khách hàng tìm tài xế gần đây',
      body: `Khách hàng đang tìm tài xế ở vị trí ${trip.pickup.description}`,
      data: {
        event: 'TRIP_FOUND',
        tripId,
      },
    });
  }
}
