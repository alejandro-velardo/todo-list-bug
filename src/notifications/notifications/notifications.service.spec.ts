import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { MailerService } from '../mailer/mailer.service';
import { ConfigService } from '@nestjs/config';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        MailerService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'MAILER_USER') return 'testuser@gmail.com';
              if (key === 'MAILER_PASS') return 'testpass';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
