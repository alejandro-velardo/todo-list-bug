import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private readonly logger = new Logger(MailerService.name);
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'u3097801912@gmail.com',
                pass: 'papr oolz ecsi ygbk',
            },
        });
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
