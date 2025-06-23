import { Prop, Schema } from '@nestjs/mongoose';
import { Location } from './location';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum DriverStatus {
  OFFLINE = 'offline',
  ONLINE = 'online',
  ON_TRIP = 'on_trip',
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
})
export class Driver {
  @ApiPropertyOptional()
  id?: string;

  @Prop()
  @ApiPropertyOptional()
  name?: string;

  @Prop()
  @ApiPropertyOptional()
  phone?: string;

  @Prop({
    default: DriverStatus.OFFLINE,
  })
  @ApiPropertyOptional({
    enum: DriverStatus,
  })
  status?: DriverStatus;

  @Prop({ index: '2dsphere' })
  @ApiPropertyOptional()
  latestLocation?: Location;

  @Prop()
  @ApiPropertyOptional()
  latestUpdate?: Date;
}
