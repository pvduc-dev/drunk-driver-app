/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OtpLibService } from '@lib/otp-lib';
import { AuthLibService } from '@lib/auth-lib';
import { RegisterRequestDto, RegisterResponseDto } from './dto/register.dto';
import { Customer } from '@lib/db-lib';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly otpLibService: OtpLibService,
    @InjectModel(Customer.name) private readonly userModel: Model<Customer>,
    private readonly authLibService: AuthLibService,
  ) {}

  async requestOtp(phone: string): Promise<any> {
    await this.otpLibService.generate(phone);
    return {
      phone,
    };
  }

  async login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    const { phone, otpSecret } = loginRequestDto;
    const otp = await this.otpLibService.validate(phone, otpSecret);
    if (!otp) {
      throw new UnauthorizedException('OTP is invalid');
    }
    const user = await this.userModel.findOne({ phone });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.addresses?.length === 0) {
      throw new UnauthorizedException('User has no addresses');
    }
    const accessToken = this.authLibService.generateAccessToken({
      userId: user._id,
    });
    const refreshToken = this.authLibService.generateRefreshToken({
      userId: user._id,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async register(
    registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const { phone, otpSecret, fullName, address } = registerRequestDto;
    // const otp = await this.otpLibService.validate(phone, otpSecret);
    // if (!otp) {
    //   throw new UnauthorizedException('OTP is invalid');
    // }
    const user = await this.userModel.findOneAndUpdate(
      { phone },
      {
        fullName,
        addresses: [
          {
            description: address.description,
            name: address.name,
            location: {
              type: 'Point',
              coordinates: address.coordinates,
            },
          },
        ],
      },
      { new: true, upsert: true },
    );
    const accessToken = this.authLibService.generateAccessToken({
      userId: user._id,
    });
    const refreshToken = this.authLibService.generateRefreshToken({
      userId: user._id,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
