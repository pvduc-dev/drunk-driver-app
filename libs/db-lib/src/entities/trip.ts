import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Address } from './address';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Path } from './path';
import { Customer } from './customer';
import { Driver } from './driver';

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

  @Prop({ default: 'pending' })
  @ApiPropertyOptional()
  status?: string;

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
}
