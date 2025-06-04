import { Module } from '@nestjs/common';
import { NotifyLibModule } from '@lib/notify-lib';
import { DbLibModule } from '@lib/db-lib';
import { NotifyService } from './notify.service';
import { NotifyController } from './notify.controller';

@Module({
  imports: [NotifyLibModule, DbLibModule],
  controllers: [NotifyController],
  providers: [NotifyService],
})
export class NotifyModule {}
