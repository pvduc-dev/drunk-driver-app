import { Customer, Driver } from '@lib/db-lib';
import { AddressDto } from '@lib/geo-lib';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterRequestDto {
  fullName: string;

  phone: string;

  otpCode: string;

  @ApiPropertyOptional({ type: () => AddressDto })
  address: AddressDto;
}

export class RegisterResponseDto {
  @ApiPropertyOptional({ type: String })
  token?: string;

  @ApiPropertyOptional({ type: () => Customer })
  user?: Customer;
}
