import { ApiPropertyOptional } from '@nestjs/swagger';
import { Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Path {
  @ApiPropertyOptional({
    type: String,
    example: 'LineString',
  })
  type?: string;

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
  })
  coordinates: number[][];
}
