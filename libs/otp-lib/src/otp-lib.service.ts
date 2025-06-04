import { Injectable } from '@nestjs/common';
// import { randomInt } from 'crypto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from '@lib/db-lib';
import { add } from 'date-fns';
import { SmsLibService } from '@lib/sms-lib';
import { ConfigService } from '@nestjs/config';

/**
 * This service is used to generate, verify, and validate OTPs
 * It uses the OTP model to store the OTPs
 * It uses the OTP code to verify the OTP
 * It uses the OTP secret to validate the OTP
 * It uses the OTP expiration time to verify the OTP
 */
@Injectable()
export class OtpLibService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel('Otp') private readonly otpModel: Model<Otp>,
    private readonly smsLibService: SmsLibService,
  ) {}

  /**
   * Generate a new OTP for a given phone number
   * @param phone - The phone number for which the OTP should be generated
   * @returns The OTP code, secret, phone number, and expiration time
   */
  public async generate(phone: string) {
    // const otpCode = randomInt(100000, 999999).toString();
    const otpCode = '123456';
    const expiresAt = add(new Date(), { minutes: 5 });

    await this.smsLibService.send(
      phone,
      `Mã OTP để xác thực tài khoản DUKL của bạn là: ${otpCode}`,
    );

    return this.otpModel.create({
      code: otpCode,
      phone: phone,
      expiresAt: expiresAt,
    });
  }

  /**
   * Verify an OTP for a given phone number
   * @param phone - The phone number associated with the OTP code
   * @param otpCode - The one-time password code to be verified
   * @returns The updated OTP document if found and updated, or null if no matching document exists
   */
  public async verify(phone: string, otpCode: string) {
    return this.otpModel.findOneAndDelete({
      phone: phone,
      code: otpCode,
    });
  }

  /**
   * Validate an OTP for a given phone number
   * @param phone - The phone number associated with the OTP code
   * @param otpSecret - The OTP secret associated with the phone number
   * @returns The OTP document if found and validated, or null if validation fails
   */
  public async validate(phone: string, otpCode: string) {
    return this.otpModel.findOne({
      phone: phone,
      code: otpCode,
      expiresAt: { $gt: new Date() },
    });
  }
}
