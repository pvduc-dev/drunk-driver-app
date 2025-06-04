import { Module } from '@nestjs/common';
import { NotifyLibService } from './notify-lib.service';
import { DbLibModule } from '@lib/db-lib';
import { ConfigService } from '@nestjs/config';
import { FirebaseModule } from 'nestjs-firebase';

/**
 * This module is used to send notifications to users
 * It uses Firebase Cloud Messaging to send notifications
 * It also uses the device token to send notifications to the user
 * The device token is stored in the db-lib
 * The device token is used to send notifications to the user
 * The device token is updated when the user logs in or registers
 * The device token is updated when the user logs out
 */
@Module({
  imports: [
    DbLibModule,
    FirebaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        googleApplicationCredential: {
          projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
          clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
          privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY'),
        },
      }),
    }),
  ],
  providers: [NotifyLibService],
  exports: [NotifyLibService],
})
export class NotifyLibModule {}
