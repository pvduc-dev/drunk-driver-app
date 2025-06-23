import { DriverStatus, Location } from '@lib/db-lib';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiPropertyOptional({
    enum: DriverStatus,
  })
  status: DriverStatus;

  @ApiPropertyOptional()
  latestLocation?: Location;
}
