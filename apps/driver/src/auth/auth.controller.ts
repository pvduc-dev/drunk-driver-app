import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RequestOtpRequestDto,
  RequestOtpResponseDto,
} from './dto/request-otp.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { LoginRequestDto } from './dto/login.dto';
import { Auth, User } from '@lib/auth-lib';
import { UpdateDeviceTokenRequestDto } from 'apps/customer/src/auth/dto/update-device-token.dto';
import { NotifyLibService } from '@lib/notify-lib';
import { LoginResponseDto } from './dto/login.dto';
import { Driver } from '@lib/db-lib';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly notifyLibService: NotifyLibService,
  ) {}

  @Post('otp')
  @ApiOkResponse({
    type: RequestOtpResponseDto,
  })
  async requestOtp(
    @Body() requestOtpRequestDto: RequestOtpRequestDto,
  ): Promise<RequestOtpResponseDto> {
    return await this.authService.generateOtp(requestOtpRequestDto.phone);
  }

  @Post('login')
  async login(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(
      loginRequestDto.phone,
      loginRequestDto.otpCode,
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Auth()
  async logout(@User('id') userId: string): Promise<void> {
    await this.authService.logout(userId);
    return;
  }

  @Put('device-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Auth()
  async upsertDeviceToken(
    @Body() updateDeviceTokenRequestDto: UpdateDeviceTokenRequestDto,
    @User('id') userId: string,
  ): Promise<any> {
    await this.notifyLibService.updateToken(
      userId,
      updateDeviceTokenRequestDto.token,
    );
    return;
  }

  @Get('me')
  @Auth()
  async getMe(@User('id') userId: string): Promise<Driver> {
    return await this.authService.getMe(userId);
  }
}
