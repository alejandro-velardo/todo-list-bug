import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    async listTasks(userId: string) {
        return this.tasksRepository.find({ where: { owner: { id: userId } } });
    }

    async getTask(id: string, userId: string) {
        const task = await this.tasksRepository.findOne({
            where: { id },
            relations: ['owner'],
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        if (task.owner.id !== userId){
            throw new ForbiddenException("You do not have permissions to see this task")
        }
        return task;
    }

    async editTask(id: string, body: object, userId: string) {
        const task = await this.tasksRepository.findOne({
            where: { id },
            relations: ['owner']
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        if (task.owner.id !== userId) {
            throw new ForbiddenException('You do not have permission to edit this task');
        }

        await this.tasksRepository.update(id, body);

        const editedTask = await this.getTask(id, userId);

        return editedTask;
    }
}
