import { Customer, Trip } from '@lib/db-lib';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { Auth, User } from '@lib/auth-lib';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @Auth()
  async createTrip(
    @Body() trip: Trip,
    @User('id') userId: string,
  ): Promise<Trip> {
    return this.tripsService.createTrip({
      ...trip,
      customer: userId as Customer,
    });
  }

  @Get()
  @ApiOkResponse({ type: Trip, isArray: true })
  async getTrips(@User('id') userId: string): Promise<Trip[]> {
    return this.tripsService.getTrips(userId);
  }

  @Get('current')
  @ApiOkResponse({ type: Trip })
  @Auth()
  async getCurrentTrip(@User('id') userId: string): Promise<Trip> {
    return this.tripsService.getCurrentTrip(userId);
  }

  @Get(':id')
  @Auth()
  async getTrip(@Param('id') id: string): Promise<Trip> {
    return this.tripsService.getTrip(id);
  }

  @Put(':id')
  @Auth()
  async updateTrip(@Param('id') id: string, @Body() trip: Trip): Promise<Trip> {
    return this.tripsService.updateTrip(id, trip);
  }

  @Delete(':id')
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelTrip(@Param('id') id: string): Promise<void> {
    await this.tripsService.cancelTrip(id);
  }
}
