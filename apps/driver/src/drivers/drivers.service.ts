import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, Driver, Location } from '@lib/db-lib';

@Injectable()
export class DriversService {
  constructor(
    @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
  ) {}

  async getDriver(driverId: string) {
    const driver = await this.driverModel.findById(driverId);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }
    return driver;
  }

  async getNearbyDrivers(address: Address) {
    const drivers = await this.driverModel.find({
      location: {
        $near: {
          $geometry: address,
        },
      },
    });
    return drivers;
  }

  async updateDriverLocation(driverId: string, location: Location) {
    const driver = await this.driverModel.findByIdAndUpdate(
      driverId,
      {
        location,
      },
      { new: true },
    );
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }
    return driver;
  }

  async updateDriverStatus(driverId: string, isAvailable: boolean) {
    const driver = await this.driverModel.findByIdAndUpdate(
      driverId,
      { isAvailable },
      { new: true },
    );
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }
    return driver;
  }
}
