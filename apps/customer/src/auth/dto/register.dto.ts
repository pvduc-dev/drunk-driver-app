import { AddressDto } from '@lib/geo-lib';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterRequestDto {
  fullName: string;

  phone: string;

  otpSecret: string;

  @ApiPropertyOptional({ type: () => AddressDto })
  address: AddressDto;
}

export class RegisterResponseDto {
  accessToken: string;

  refreshToken: string;
}
