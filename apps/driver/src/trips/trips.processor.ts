import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TripsService } from './trips.service';
import { NotifyLibService } from '@lib/notify-lib';
import { DriversService } from '../drivers/drivers.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { fromEvent, timeout, take, map, tap, TimeoutError } from 'rxjs';

@Processor('trips')
export class TripsProcessor extends WorkerHost {
  constructor(
    private readonly tripsService: TripsService,
    private readonly driversService: DriversService,
    private readonly notifyLibService: NotifyLibService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    super();
  }

  process(job: Job): Promise<any> {
    return new Promise((resolve, reject) => {
      if (job.data.tripId) {
        const tripId = job.data.tripId as string;
        this.driversService
          .getNearestDriver(tripId)
          .then((driverId) => {
            console.log(driverId);
          })
          .catch((err) => {
            console.log(err);
          });
        console.log('DEBUG: send notification to driver');
        fromEvent(this.redis, 'message')
          .pipe(
            timeout(1000),
            take(1),
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            map(([_, message]) => message as string),
            tap(() => {
              this.redis.unsubscribe(tripId).catch((err: Error) => {
                reject(err);
              });
            }),
          )
          .subscribe({
            next: (message) => {
              if (message === 'DRIVER_ACCEPT') {
                resolve(true);
              } else {
                reject(new Error('Driver did not accept the trip'));
              }
            },
            error: (err: Error) => {
              if (err instanceof TimeoutError) {
                reject(new Error('SEARCH_DRIVER_TIMEOUT'));
              } else {
                reject(new Error('TRIP_FAILED'));
              }
            },
          });

        this.redis.subscribe(tripId).catch((err: Error) => {
          reject(err);
        });
      }
    });
  }
}
