import { ApiProperty } from '@nestjs/swagger';

export class PushNotificationDto {
  @ApiProperty({
    description: 'The token of the device to send the notification to',
    example:
      'ceJF4sQqQAqt97BuAQ4HR2:APA91bHQwG39vYTYw-sdDYiIEyvVAl4qRjrJ9mwcYdOKWAOiAzQLquZP6v_7ZPyqdnyc6OPI1MPHUpZWUoabjhMtCZSLBhBRlys0PL8dG1Lrz58k8MoRnKU',
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
    example: { event: 'trip', tripId: '123' },
  })
  data: Record<string, any>;
}
