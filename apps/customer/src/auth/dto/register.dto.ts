import { Customer, Address } from '@lib/db-lib';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterRequestDto {
  fullName: string;

  phone: string;

  otpCode: string;

  @ApiPropertyOptional({ type: () => Address })
  address: Address;
}

export class RegisterResponseDto {
  @ApiPropertyOptional({ type: String })
  token?: string;

  @ApiPropertyOptional({ type: () => Customer })
  user?: Customer;
}
