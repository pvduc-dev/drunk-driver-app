import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { RegisterRequestDto, RegisterResponseDto } from './dto/register.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { NotifyLibService } from '@lib/notify-lib';
import { UpdateDeviceTokenRequestDto } from './dto/update-device-token.dto';
import { User } from '@lib/auth-lib';
import { RequestOtpRequestDto } from './dto/request-otp';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly notifyLibService: NotifyLibService,
  ) {}

  @Post('request-otp')
  async requestOtp(
    @Body() requestOtpRequestDto: RequestOtpRequestDto,
  ): Promise<any> {
    await this.authService.requestOtp(requestOtpRequestDto.phone);
    return {
      otp: '123456',
      phone: requestOtpRequestDto.phone,
    };
  }

  @Post('login')
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  async login(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    const { accessToken, refreshToken } =
      await this.authService.login(loginRequestDto);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('register')
  @ApiOkResponse({
    type: RegisterResponseDto,
  })
  async register(
    @Body() registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const { accessToken, refreshToken } =
      await this.authService.register(registerRequestDto);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Put('device-token')
  @HttpCode(HttpStatus.NO_CONTENT)
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
}
