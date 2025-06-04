import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { Admin } from './entities/admin';
import { DeviceToken } from './entities/device-token';
import { Otp } from './entities/otp';
import { Customer } from './entities/customer';
import { Driver } from './entities/driver';
import { Trip } from './entities/trip';
import { DbLibService } from './db-lib.service';
import { Address } from './entities/address';
import { Location } from './entities/location';
import { Config } from './entities/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Admin.name,
        schema: SchemaFactory.createForClass(Admin),
      },
      {
        name: DeviceToken.name,
        schema: SchemaFactory.createForClass(DeviceToken),
      },
      {
        name: Otp.name,
        schema: SchemaFactory.createForClass(Otp),
      },
      {
        name: Customer.name,
        schema: SchemaFactory.createForClass(Customer),
      },
      {
        name: Driver.name,
        schema: SchemaFactory.createForClass(Driver),
      },
      {
        name: Trip.name,
        schema: SchemaFactory.createForClass(Trip),
      },
      {
        name: Address.name,
        schema: SchemaFactory.createForClass(Address),
      },
      {
        name: Location.name,
        schema: SchemaFactory.createForClass(Location),
      },
      {
        name: Config.name,
        schema: SchemaFactory.createForClass(Config),
      },
    ]),
  ],
  providers: [DbLibService],
  exports: [MongooseModule],
})
export class DbLibModule {}
