import { ApiPropertyOptional } from '@nestjs/swagger';

export class RequestOtpRequestDto {
  @ApiPropertyOptional()
  phone: string;
}

export class RequestOtpResponseDto {
  @ApiPropertyOptional()
  phone: string;
}
