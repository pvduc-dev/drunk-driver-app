import { Body, Controller, Post } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { PushNotificationDto } from './dto/push-notification.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Post('push')
  @ApiOkResponse({
    type: PushNotificationDto,
  })
  async pushNotification(
    @Body()
    body: PushNotificationDto,
  ) {
    return this.notifyService.pushNotification(
      body.token,
      body.title,
      body.body,
      body.data,
    );
  }
}
