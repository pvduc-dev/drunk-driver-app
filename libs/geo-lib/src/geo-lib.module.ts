import { Module } from '@nestjs/common';
import { GeoLibService } from './geo-lib.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: 'https://maps.goong.io/api/goong',
        params: {
          api_key: configService.get('GOONG_API_KEY'),
        },
      }),
    }),
  ],
  providers: [GeoLibService],
  exports: [GeoLibService],
})
export class GeoLibModule {}
