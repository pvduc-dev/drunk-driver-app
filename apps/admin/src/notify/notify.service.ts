import { Injectable } from '@nestjs/common';
import { NotifyLibService } from '@lib/notify-lib';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceToken } from '@lib/db-lib';
import { Model } from 'mongoose';
@Injectable()
export class NotifyService {
  constructor(
    private readonly notifyLibService: NotifyLibService,
    @InjectModel(DeviceToken.name)
    private readonly deviceTokenModel: Model<DeviceToken>,
  ) {}

  public pushNotification(
    token: string,
    title: string,
    body: string,
    data: Record<string, any>,
  ) {
    return this.notifyLibService.pushToDeviceToken(token, title, body, data);
  }
}
