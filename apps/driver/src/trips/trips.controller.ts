import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseArrayPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { Auth, User } from '@lib/auth-lib';
import { Trip } from '@lib/db-lib';

@Controller('trips')
@Auth()
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  async getTrips(
    @User('id') driverId: string,
    @Query('status', new ParseArrayPipe({ optional: true })) status: string[],
  ): Promise<Trip[]> {
    return await this.tripsService.getTrips(driverId, status);
  }

  @Get('current')
  async getCurrentTrip(@User('id') driverId: string): Promise<Trip> {
    return await this.tripsService.getCurrentTrip(driverId);
  }

  @Get(':id')
  async getTrip(@Param('id') id: string): Promise<Trip> {
    return await this.tripsService.getTrip(id);
  }

  @Post(':id/accept')
  @HttpCode(HttpStatus.NO_CONTENT)
  async acceptTrip(
    @Param('id') id: string,
    @User('id') driverId: string,
  ): Promise<void> {
    await this.tripsService.acceptTrip(id, driverId);
  }

  @Post(':id/arrive')
  @HttpCode(HttpStatus.NO_CONTENT)
  async arriveTrip(@Param('id') id: string): Promise<void> {
    await this.tripsService.arriveTrip(id);
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  async rejectTrip(@Param('id') id: string): Promise<void> {
    await this.tripsService.rejectTrip(id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelTrip(@Param('id') id: string): Promise<void> {
    await this.tripsService.cancelByDriver(id);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async completeTrip(@Param('id') id: string): Promise<void> {
    await this.tripsService.completeTrip(id);
  }

  @Post(':id/start')
  @HttpCode(HttpStatus.NO_CONTENT)
  async startTrip(@Param('id') id: string): Promise<void> {
    await this.tripsService.startTrip(id);
  }
}
