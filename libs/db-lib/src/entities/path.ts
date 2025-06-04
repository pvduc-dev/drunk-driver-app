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
    type: [Number],
    example: [[105.80943374510747, 21.0137625240001]],
  })
  coordinates?: [number, number][];
}
