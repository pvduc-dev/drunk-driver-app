import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Driver, DriverStatus, Location } from '@lib/db-lib';

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

  async updateLocation(driverId: string, location?: Location) {
    return this.driverModel.findByIdAndUpdate(
      driverId,
      { latestLocation: location, latestUpdate: new Date() },
      { new: true },
    );
  }

  async getNearest(location: Location): Promise<Driver | null> {
    return this.driverModel.findOne({
      latestLocation: {
        $near: location,
      },
      status: DriverStatus.ONLINE,
      latestUpdate: { $gt: new Date(Date.now() - 1000 * 60 * 5) },
    });
  }

  async updateStatus(
    driverId: string,
    status: DriverStatus,
    latestLocation?: Location,
  ) {
    const driver = await this.driverModel.findByIdAndUpdate(
      driverId,
      { status, latestLocation, latestUpdate: new Date() },
      { new: true },
    );
    if (!driver) {
      throw new NotFoundException('Không tìm thấy tài xế');
    }
    return driver;
  }
}
