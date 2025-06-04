import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Location } from './location';
import { ApiPropertyOptional } from '@nestjs/swagger';

@Schema({ _id: false })
export class Address {
  @Prop()
  @ApiPropertyOptional()
  description?: string;

  @Prop()
  @ApiPropertyOptional()
  name?: string;

  @Prop({ type: SchemaFactory.createForClass(Location) })
  @ApiPropertyOptional()
  location?: Location;
}
