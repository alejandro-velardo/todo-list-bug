import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { MailerService } from '../mailer/mailer.service'; // importa MailerService

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        MailerService, 
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
