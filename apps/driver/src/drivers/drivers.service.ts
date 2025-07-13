import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Driver, Location } from '@lib/db-lib';

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

  async updateLocation(driverId: string, currentLocation?: Location) {
    return this.driverModel.findByIdAndUpdate(
      driverId,
      { currentLocation, currentLocationUpdatedAt: new Date() },
      { new: true },
    );
  }

  async getNearest(location: Location): Promise<Driver | null> {
    return this.driverModel.findOne({
      latestLocation: {
        $near: {
          $geometry: location,
          // $maxDistance: 70000,
        },
      },
      isActive: true,
      currentLocationUpdatedAt: { $gt: new Date(Date.now() - 1000 * 6 * 5) },
    });
  }

  async updateStatus(driverId: string, isActive: boolean) {
    const driver = await this.driverModel.findByIdAndUpdate(
      driverId,
      { isActive },
      { new: true },
    );
    if (!driver) {
      throw new NotFoundException('Không tìm thấy tài xế');
    }
    return driver;
  }
}
