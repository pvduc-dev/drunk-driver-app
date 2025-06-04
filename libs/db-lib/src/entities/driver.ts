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
  fullName?: string;

  @Prop()
  @ApiPropertyOptional()
  phone?: string;

  @Prop()
  @ApiPropertyOptional()
  location?: Location;

  @Prop({ default: false })
  @ApiPropertyOptional()
  isAvailable?: boolean;
}
