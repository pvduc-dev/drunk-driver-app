import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TripsModule } from './trips/trips.module';
import { GeoModule } from './geo/geo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        user: configService.get<string>('MONGODB_USER'),
        pass: configService.get<string>('MONGODB_PASSWORD'),
        dbName: configService.get<string>('MONGODB_DB_NAME'),
        autoIndex: true,
        authSource: 'admin',
        retryWrites: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TripsModule,
    GeoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
