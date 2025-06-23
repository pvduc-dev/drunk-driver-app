import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { DbLibModule } from '@lib/db-lib';
import { DriversModule } from '../drivers/drivers.module';
import { NotifyLibModule } from '@lib/notify-lib';
import {
  SearchDriverProcessor,
  RequestSentTimeoutProcessor,
  SearchDriverTimeoutProcessor,
} from './trips.processor';
import { JobLibModule } from '@lib/job-lib';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    DbLibModule,
    DriversModule,
    NotifyLibModule,
    JobLibModule,
    BullModule.registerQueue({
      name: 'SEARCH_DRIVER',
    }),
    BullModule.registerQueue({
      name: 'CANCEL_SEACHING',
    }),
    BullModule.registerQueue({
      name: 'CANCEL_REQUEST',
    }),
  ],
  providers: [
    TripsService,
    SearchDriverProcessor,
    RequestSentTimeoutProcessor,
    SearchDriverTimeoutProcessor,
  ],
  controllers: [TripsController],
})
export class TripsModule {}
