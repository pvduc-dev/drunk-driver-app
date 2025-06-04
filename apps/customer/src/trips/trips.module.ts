import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { DbLibModule } from '@lib/db-lib';
import { GeoLibModule } from '@lib/geo-lib';
import { BullModule } from '@nestjs/bullmq';
import { NotifyLibModule } from '@lib/notify-lib';

@Module({
  imports: [
    DbLibModule,
    GeoLibModule,
    BullModule.registerQueue({
      name: 'trips',
    }),
    NotifyLibModule,
  ],
  providers: [TripsService],
  controllers: [TripsController],
})
export class TripsModule {}
