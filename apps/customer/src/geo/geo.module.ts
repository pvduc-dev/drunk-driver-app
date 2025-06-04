import { Module } from '@nestjs/common';
import { GeoLibModule } from '@lib/geo-lib';
import { GeoController } from './geo.controller';

@Module({
  imports: [GeoLibModule],
  providers: [],
  controllers: [GeoController],
})
export class GeoModule {}
