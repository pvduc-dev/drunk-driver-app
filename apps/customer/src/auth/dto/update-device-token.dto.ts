import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeviceTokenRequestDto {
  @ApiProperty({
    description: 'The device token',
    example: '123',
  })
  token: string;
}
