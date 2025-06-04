import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsLibService {
  constructor(
    private twilioService: TwilioService,
    private configService: ConfigService,
  ) {}

  async send(phone: string, content: string): Promise<void> {
    // await this.twilioService.client.messages.create({
    //   body: content,
    //   from: this.configService.get('TWILIO_PHONE_NUMBER'),
    //   to: phone.replace(/^0/, '+84'),
    // });
  }
}
