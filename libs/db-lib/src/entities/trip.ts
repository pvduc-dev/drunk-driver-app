import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Address } from './address';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Path } from './path';
import { Customer } from './customer';
import { Driver } from './driver';

export enum TripStatus {
  PENDING = 'PENDING',
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  ARRIVING = 'ARRIVING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED_BY_CUSTOMER = 'CANCELLED_BY_CUSTOMER',
  CANCELLED_BY_DRIVER = 'CANCELLED_BY_DRIVER',
  CANCELLED_BY_SYSTEM = 'CANCELLED_BY_SYSTEM',
  NO_SHOW = 'NO_SHOW',
  FAILED = 'FAILED',
}

@Schema({
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
    },
  },
  toObject: {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
    },
  },
  timestamps: true,
})
export class Trip {
  @ApiPropertyOptional()
  id?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Customer',
    required: false,
    index: true,
  })
  @ApiPropertyOptional()
  customer?: Customer;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Driver',
    required: false,
    index: true,
  })
  @ApiPropertyOptional()
  driver?: Driver;

  @Prop({ type: SchemaFactory.createForClass(Address) })
  @ApiPropertyOptional()
  pickup: Address;

  @Prop({ type: SchemaFactory.createForClass(Address) })
  @ApiPropertyOptional()
  dropoff: Address;

  @Prop()
  @ApiPropertyOptional({
    type: Date,
    example: new Date(),
  })
  startedAt?: Date;

  @Prop()
  @ApiPropertyOptional({
    type: Date,
    example: new Date(),
  })
  completedAt?: Date;

  @Prop({ default: TripStatus.PENDING, index: true })
  @ApiPropertyOptional({
    enum: TripStatus,
  })
  status?: TripStatus;

  @Prop()
  @ApiPropertyOptional()
  note?: string;

  @Prop()
  @ApiPropertyOptional()
  price?: number;

  @Prop()
  @ApiPropertyOptional()
  distance?: number;

  @Prop(raw(SchemaFactory.createForClass(Path)))
  @ApiPropertyOptional()
  path?: Path;

  createdAt?: Date;

  updatedAt?: Date;
}
