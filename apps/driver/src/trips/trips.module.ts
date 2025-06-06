import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { DbLibModule } from '@lib/db-lib';
import { BullModule } from '@nestjs/bullmq';
import { DriversModule } from '../drivers/drivers.module';
import { NotifyLibModule } from '@lib/notify-lib';
import { TripsProcessor } from './trips.processor';

@Module({
  imports: [
    DbLibModule,
    DriversModule,
    NotifyLibModule,
    BullModule.registerQueue({
      name: 'trips',
    }),
  ],
  providers: [TripsService, TripsProcessor],
  controllers: [TripsController],
})
export class TripsModule {}
