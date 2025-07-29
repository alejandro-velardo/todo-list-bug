import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { JwtModule } from '@nestjs/jwt';


@Module({
    imports: [
        TypeOrmModule.forFeature([Task]),
        JwtModule
    ],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}
