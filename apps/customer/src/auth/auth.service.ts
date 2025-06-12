import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
    const { phone, otpCode } = loginRequestDto;
    const otp = await this.otpLibService.validate(phone, otpCode);
    if (!otp) {
      throw new UnauthorizedException('Mã OTP không hợp lệ');
    }
    const user = await this.userModel.findOne({ phone });
    return {
      token: user ? this.generateToken(user.id as string) : undefined,
      user: user ?? undefined,
    };
  }

  async register(
    registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const { phone, otpCode, fullName, address } = registerRequestDto;
    const otp = await this.otpLibService.validate(phone, otpCode);
    if (!otp) {
      throw new UnauthorizedException('Mã OTP không hợp lệ');
    }
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
    return {
      token: this.generateToken(user.id as string),
      user,
    };
  }

  generateToken(sub: string): string {
    return this.authLibService.generateAccessToken({
      sub: sub,
    });
  }

  async getCustomerById(id: string): Promise<Customer> {
    const customer = await this.userModel.findById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }
}
