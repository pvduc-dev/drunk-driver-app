import { Driver } from '@lib/db-lib';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Location } from '@lib/db-lib';

export class DriverDto implements Driver {
  @ApiPropertyOptional()
  id: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  fullName?: string;

  @ApiPropertyOptional()
  location?: Location;

  @ApiPropertyOptional()
  status?: string;
}
