import { Body, Controller, HttpCode, Put } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { Driver, Location } from '@lib/db-lib';
import { Auth, User } from '@lib/auth-lib';
import { UpdateStatusDto } from '../auth/dto/update-status.dto';
import { DriverDto } from '../auth/dto/driver.dto';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Auth()
  @Put('location')
  @HttpCode(204)
  async updateDriverLocation(
    @Body() location: Location,
    @User('id') driverId: string,
  ): Promise<void> {
    await this.driversService.updateDriverLocation(driverId, location);
    return;
  }

  @Auth()
  @Put('status')
  async updateDriverStatus(
    @Body() updateStatusDto: UpdateStatusDto,
    @User('id') driverId: string,
  ): Promise<Driver> {
    const { isAvailable } = updateStatusDto;
    const driver = await this.driversService.updateDriverStatus(
      driverId,
      isAvailable,
    );
    return {
      id: driver.id,
      phone: driver.phone,
      fullName: driver.fullName,
      location: driver.location,
      isAvailable: driver.isAvailable,
    };
  }
}
