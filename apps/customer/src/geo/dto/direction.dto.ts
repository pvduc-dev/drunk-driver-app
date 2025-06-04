import { Location, Path } from '@lib/db-lib';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DirectionRequestDto {
  @ApiPropertyOptional({
    type: Location,
    description: 'From location',
  })
  from: Location;

  @ApiPropertyOptional({
    type: Location,
    description: 'To location',
  })
  to: Location;
}

export class DirectionResponseDto {
  @ApiPropertyOptional({
    type: Path,
    description: 'Path',
  })
  path: Path;

  @ApiPropertyOptional({
    type: Number,
    description: 'Distance',
  })
  distance: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Price',
  })
  price: number;
}
