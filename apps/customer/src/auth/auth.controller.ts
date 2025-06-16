import {
  Body,
  Controller,
  Get,
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
import { Auth, User } from '@lib/auth-lib';
import { RequestOtpRequestDto, RequestOtpResponseDto } from './dto/request-otp';
import { Customer } from '@lib/db-lib';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly notifyLibService: NotifyLibService,
  ) {}

  @Post('request-otp')
  async requestOtp(
    @Body() requestOtpRequestDto: RequestOtpRequestDto,
  ): Promise<RequestOtpResponseDto> {
    await this.authService.requestOtp(requestOtpRequestDto.phone);
    return {
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
    return this.authService.login(loginRequestDto);
  }

  @Post('register')
  @ApiOkResponse({
    type: RegisterResponseDto,
  })
  async register(
    @Body() registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerRequestDto);
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
  @ApiOkResponse({ type: Customer })
  @Auth()
  async getMe(@User('id') userId: string): Promise<Customer> {
    console.log(userId);
    return this.authService.getCustomerById(userId);
  }

  @Post('logout')
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  async logout(@User('id') userId: string): Promise<any> {
    return;
  }
}
