import { Body, Controller, HttpCode, Put } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { Driver, Location } from '@lib/db-lib';
import { Auth, User } from '@lib/auth-lib';
import { UpdateStatusDto } from '../auth/dto/update-status.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Controller('drivers')
export class DriversController {
  constructor(
    private readonly driversService: DriversService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Auth()
  @Put('location')
  @HttpCode(204)
  async updateDriverLocation(
    @Body() location: Location,
    @User('id') driverId: string,
  ): Promise<void> {
    await this.driversService.updateLocation(driverId, location);
    return;
  }

  @Auth()
  @Put('status')
  async updateDriverStatus(
    @Body() updateStatusDto: UpdateStatusDto,
    @User('id') driverId: string,
  ): Promise<Driver> {
    const driver = await this.driversService.updateStatus(
      driverId,
      updateStatusDto.status,
      updateStatusDto.latestLocation,
    );
    return driver;
  }
}
