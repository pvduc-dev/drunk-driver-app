import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  GenerateOtpRequestDto,
  GenerateOtpResponseDto,
} from './dto/generate-otp-request.dto';
import {
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
} from './dto/verify-otp-request.dto';
import { ConfigService } from '@nestjs/config';
import { OtpLibService } from '@lib/otp-lib';

@Controller('otps')
export class OtpsController {
  constructor(
    private readonly otpLibService: OtpLibService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: GenerateOtpResponseDto,
  })
  public async generate(
    @Body() generateOtpRequestDto: GenerateOtpRequestDto,
  ): Promise<any> {
    const otp = await this.otpLibService.generate(generateOtpRequestDto.phone);
    return {
      verificationId: otp.id,
      expirationTime: otp.expirationTime,
    };
  }

  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'OTP code is valid',
    type: VerifyOtpResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'OTP code is invalid',
  })
  public async verify(
    @Body() verifyOtpRequestDto: VerifyOtpRequestDto,
  ): Promise<VerifyOtpResponseDto> {
    const otp = await this.otpLibService.verify(
      verifyOtpRequestDto.phone,
      verifyOtpRequestDto.otpCode,
      verifyOtpRequestDto.verificationId,
    );
    if (!otp) {
      throw new BadRequestException(['OTP code is invalid']);
    }
    return {
      secret: otp.secret ?? '',
      phone: otp.phone ?? '',
    };
  }
}
