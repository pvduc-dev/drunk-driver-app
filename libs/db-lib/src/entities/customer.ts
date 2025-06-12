import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address } from './address';
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
export class Customer {
  @ApiPropertyOptional({
    type: String,
    description: 'The ID of the customer',
    example: '666666666666666666666666',
  })
  id?: string;

  @Prop()
  @ApiPropertyOptional()
  fullName?: string;

  @Prop()
  @ApiPropertyOptional()
  phone?: string;

  @Prop(raw([SchemaFactory.createForClass(Address)]))
  @ApiPropertyOptional({
    type: [Address],
    description: 'The addresses of the customer',
  })
  addresses?: Address[];
}
