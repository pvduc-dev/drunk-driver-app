import { ApiProperty } from '@nestjs/swagger';

export class PushNotificationDto {
  @ApiProperty({
    description: 'The token of the device to send the notification to',
    example:
      'cM8Gs3mXSoeH0R18f5xlH1:APA91bHQnavpVn4RcPi_d5pDzkGQsIBuxnPqQdiRP1quTcdcSTDq-UbexzlRgyQiWZ7pgmJcTDaE7O7N_AAJ8gtPBqn1yJY7vMfCA9pypHEOCj8udzVw1uE',
  })
  token: string;
  @ApiProperty({
    description: 'The title of the notification',
    example: 'Hello',
  })
  title: string;
  @ApiProperty({
    description: 'The body of the notification',
    example: 'Hello',
  })
  body: string;
  @ApiProperty({
    description: 'The data of the notification',
    example: { type: 'trip', tripId: '123' },
  })
  data: Record<string, any>;
}
