import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailerService {
    private readonly logger = new Logger(MailerService.name);
    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;


    constructor(private configService: ConfigService) {
        const mailer_pass = this.configService.get<number>('MAILER_PASS');
        const mailer_user = this.configService.get<string>('MAILER_USER');

        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: mailer_user,
                pass: mailer_pass,
            },
        } as SMTPTransport.Options);
    }

    async sendUserCreatedEmail(email: string) {
        const mailOptions = {
            from: '"Mi App" <no-reply@miapp.com>',
            to: email,
            subject: 'Bienvenido a Mi App',
            text: 'Gracias por registrarte en Mi App!',
            html: '<b>Gracias por registrarte en Mi App!</b> hola laura soy el ales haciendo pruebas',
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent to new user ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${email}`, error);
        }
    }
}
