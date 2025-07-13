import { Customer, Trip } from '@lib/db-lib';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseArrayPipe,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { Auth, User } from '@lib/auth-lib';

@Controller('trips')
@Auth()
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
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
  @ApiQuery({ name: 'status', type: [String], required: false })
  async getTrips(
    @User('id') userId: string,
    @Query('status', new ParseArrayPipe({ optional: true })) status: string[],
  ): Promise<Trip[]> {
    return this.tripsService.getTrips(userId, status);
  }

  @Get('current')
  @ApiOkResponse({ type: Trip })
  async getCurrentTrip(@User('id') userId: string): Promise<Trip> {
    return this.tripsService.getCurrentTrip(userId);
  }

  @Get(':id')
  async getTrip(@Param('id') id: string): Promise<Trip> {
    return this.tripsService.getTrip(id);
  }

  @Put(':id')
  async updateTrip(@Param('id') id: string, @Body() trip: Trip): Promise<Trip> {
    return this.tripsService.updateTrip(id, trip);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelTrip(@Param('id') id: string): Promise<void> {
    await this.tripsService.cancelTrip(id);
  }
}
