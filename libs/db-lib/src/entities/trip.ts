import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Address } from './address';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Path } from './path';

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

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer', required: false })
  @ApiPropertyOptional()
  customerId?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Driver', required: false })
  @ApiPropertyOptional()
  driverId?: string;

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
