import { Prop, Schema } from '@nestjs/mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';

@Schema({ _id: false })
export class Location {
  @Prop({ enum: ['Point'], default: 'Point' })
  @ApiPropertyOptional({
    type: String,
    example: 'Point',
  })
  type?: string;

  @Prop()
  @ApiPropertyOptional({
    type: [Number],
    example: [105.798267363, 21.0137625240001],
  })
  coordinates?: number[];
}
