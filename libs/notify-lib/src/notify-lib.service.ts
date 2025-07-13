import { DeviceToken } from '@lib/db-lib/index';
import { Injectable, Logger } from '@nestjs/common';
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
  private logger = new Logger(NotifyLibService.name);
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
    this.logger.debug('Push notification', userId);
    const token = await this.getTokens(userId);
    if (!token) {
      this.logger.debug('No token found', userId);
      return;
    }
    this.logger.debug('Token found', token);
    try {
      await this.firebase.messaging.send({
        token: token,
        data: data,
        apns: {
          payload: {
            aps: {
              sound: {
                name: 'default',
                volume: 1.0,
                critical: true,
              },
              alert: {
                title: title,
                body: body,
              },
            },
          },
          headers: {
            'apns-priority': '10',
            'apns-push-type': 'alert',
          },
        },
        android: {
          priority: 'high',
          notification: {
            title: title,
            body: body,
            sound: 'default',
            priority: 'high',
            visibility: 'public',
            channelId: 'default',
          },
        },
      });
    } catch (error) {
      this.logger.error('Error pushing notification', error);
    }
  }

  public async pushToDeviceToken(
    token: string,
    title: string,
    body: string,
    data: Record<string, any>,
  ) {
    // await this.firebase.messaging.send({
    //   token: token,
    //   data: data,
    //   apns: {
    //     payload: {
    //       aps: {
    //         sound: {
    //           name: 'default',
    //           volume: 1.0,
    //           critical: true,
    //         },
    //         alert: {
    //           title: title,
    //           body: body,
    //         },
    //       },
    //     },
    //     headers: {
    //       'apns-priority': '10',
    //       'apns-push-type': 'alert',
    //     },
    //   },
    //   android: {
    //     priority: 'high',
    //     notification: {
    //       title: title,
    //       body: body,
    //       sound: 'default',
    //       priority: 'high',
    //       visibility: 'public',
    //       channelId: 'default',
    //     },
    //   },
    // });
    try {
      this.logger.debug('Pushing notification to device token', token);
      return this.firebase.messaging.send({
        token: token,
        data: data,
        notification: {
          title: title,
          body: body,
        },
      });
    } catch (error) {
      this.logger.error('Error pushing notification', error);
    }
  }

  async pushTripEvent({
    tripId,
    event,
    userId,
    title,
    body,
  }: {
    tripId: string;
    event: string;
    userId: string;
    title: string;
    body: string;
  }) {
    const token = await this.getTokens(userId);
    if (!token) {
      return;
    }
    const data = {
      tripId: tripId,
      event: event,
    };
    await this.firebase.messaging.send({
      token: token,
      data: data,
      apns: {
        payload: {
          aps: {
            sound: {
              name: 'default',
              volume: 1.0,
              critical: true,
            },
            alert: {
              title: title,
              body: body,
            },
          },
        },
        headers: {
          'apns-priority': '10',
          'apns-push-type': 'alert',
        },
      },
      android: {
        priority: 'high',
        notification: {
          title: title,
          body: body,
          sound: 'default',
          priority: 'high',
          visibility: 'public',
          channelId: 'default',
        },
      },
    });
  }
}
