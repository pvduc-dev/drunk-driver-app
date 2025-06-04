import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TripsService } from './trips.service';
import { Auth, User } from '@lib/auth-lib';
import { Trip } from '@lib/db-lib';

@Controller('trips')
@Auth()
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  async getTrips(@Query('status') status: string): Promise<Trip[]> {
    return await this.tripsService.getTrips(status);
  }

  @Get(':id')
  async getTrip(@Param('id') id: string): Promise<Trip> {
    return await this.tripsService.getTrip(id);
  }

  @Post(':id/accept')
  async acceptTrip(
    @Param('id') id: string,
    @User('id') driverId: string,
  ): Promise<Trip> {
    return await this.tripsService.acceptTrip(id, driverId);
  }

  @Post(':id/arrive')
  async arriveTrip(@Param('id') id: string): Promise<Trip> {
    return await this.tripsService.arriveTrip(id);
  }

  @Post(':id/reject')
  async rejectTrip(@Param('id') id: string): Promise<Trip> {
    return await this.tripsService.rejectTrip(id);
  }

  @Post(':id/cancel')
  async cancelTrip(@Param('id') id: string): Promise<Trip> {
    return await this.tripsService.cancelByDriver(id);
  }

  @Post(':id/complete')
  async completeTrip(@Param('id') id: string): Promise<Trip> {
    return await this.tripsService.completeTrip(id);
  }
}
