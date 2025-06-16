import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { TripsService } from './trips.service';

@QueueEventsListener('trips')
export class TripsEvent extends QueueEventsHost {
  constructor(private readonly tripsService: TripsService) {
    super();
  }

  @OnQueueEvent('failed')
  async onFailed(args: {
    failedReason: string;
    jobId: string;
    prev?: string;
  }): Promise<void> {
    if (args.failedReason === 'SEARCH_DRIVER_TIMEOUT') {
      await this.tripsService.cancelByTimeout(args.jobId);
    }
  }
}
