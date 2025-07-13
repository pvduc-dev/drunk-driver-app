import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiPropertyOptional()
  isActive?: boolean;
}
