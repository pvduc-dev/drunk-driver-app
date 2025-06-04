import { DeviceToken } from '@lib/db-lib/index';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectFirebaseAdmin, FirebaseAdmin } from 'nestjs-firebase';

/**
 * This service is used to send notifications to users
 * It uses Firebase Cloud Messaging to send notifications
 * It also uses the device token to send notifications to the user
 * The device token is stored in the db-lib
 * The device token is used to send notifications to the user
 * The device token is updated when the user logs in or registers
 * The device token is updated when the user logs out
 */
@Injectable()
export class NotifyLibService {
  constructor(
    @InjectModel(DeviceToken.name)
    private readonly deviceTokenModel: Model<DeviceToken>,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  /**
   * Get the device tokens for a user
   * @param userId
   * @returns
   */
  public async getTokens(userId: string): Promise<string | undefined> {
    const deviceToken = await this.deviceTokenModel.findOne({ userId });
    return deviceToken?.token;
  }

  /**
   * Update the device token for a user
   * @param userId
   * @param token
   * @returns
   */
  public async updateToken(userId: string, token: string) {
    const deviceToken = await this.deviceTokenModel.findOneAndUpdate(
      { userId: userId },
      { $set: { token: token, userId: userId } },
      { new: true, upsert: true },
    );
    return deviceToken;
  }

  /**
   * Push a notification to a user
   * @param customerId
   * @param title
   * @param body
   * @param data
   */
  public async push({
    userId,
    title,
    body,
    data,
  }: {
    userId: string;
    title: string;
    body: string;
    data: Record<string, any>;
  }) {
    const token = await this.getTokens(userId);
    if (!token) {
      return;
    }
    await this.firebase.messaging.send({
      token: token,
      notification: {
        title: title,
        body: body,
      },
      data: data,
    });
  }

  public pushToDeviceToken(
    token: string,
    title: string,
    body: string,
    data: Record<string, any>,
  ) {
    return this.firebase.messaging.send({
      token: token,
      notification: {
        title: title,
        body: body,
      },
      data: data,
    });
  }
}
