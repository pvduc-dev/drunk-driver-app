import { Prop, Schema } from '@nestjs/mongoose';
import { Location } from './location';
import { ApiPropertyOptional } from '@nestjs/swagger';

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

  @Prop({ default: false })
  @ApiPropertyOptional()
  isActive?: boolean;

  @Prop({ index: '2dsphere' })
  @ApiPropertyOptional()
  currentLocation?: Location;

  @Prop()
  @ApiPropertyOptional()
  currentLocationUpdatedAt?: Date;

  @Prop()
  @ApiPropertyOptional()
  currentTripId?: string;
}
