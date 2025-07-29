import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications/notifications.service';
import { MailerService } from './mailer/mailer.service';

@Module({
  controllers: [NotificationsService], 
  providers: [MailerService],
})
export class NotificationsModule {}
