// notifications.service.ts
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailerService } from '../mailer/mailer.service';

@Controller()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(private readonly mailer: MailerService) { }

    @EventPattern('user_created')
    async handleUserCreated(@Payload() userEmail: string) {
        this.logger.log(`📩 Sending email to new user`)
        await this.mailer.sendUserCreatedEmail(userEmail);
    }
}
