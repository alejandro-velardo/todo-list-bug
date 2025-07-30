import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function startMicroservicesWithTimeout(app: any, logger: Logger, timeoutMs = 5000) {
    return Promise.race([
        app.startAllMicroservices(),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Microservice start timed out')), timeoutMs)
        ),
    ]).catch(err => {
        logger.warn(`Warning: RabbitMQ microservice failed to start or timed out: ${err.message}`);
        logger.warn(`Continuing without it`)
    })
}

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3000;

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://localhost:5672'],
            queue: 'notifications_queue',
            queueOptions: {
                durable: false,
            },
        },
    });

    await startMicroservicesWithTimeout(app, logger, 3000);



    logger.log(`Application is running on port ${process.env.PORT || 3000}`);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
