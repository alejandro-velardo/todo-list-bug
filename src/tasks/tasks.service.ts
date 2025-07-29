import { Injectable, ForbiddenException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { UpdateTaskDto } from './dto/update-task.dto'
@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) { }

    private validateDueDate(dueDate?: string) {
        if (!dueDate) return;
        const date = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
            throw new BadRequestException('dueDate cannot be before today');
        }
    }

    async listTasks(userId: string) {
        return await this.tasksRepository.find({ where: { owner: { id: userId } } });
    }

    async getTask(id: string, userId: string) {
        const task = await this.tasksRepository.findOne({
            where: { id }
        });

        if (!task) {
            this.logger.log(`Task with task id: ${id} not found`)
            throw new NotFoundException(`Task with task id: ${id} not found`);
        }

        if (task.ownerId !== userId) {
            this.logger.log(`You do not have permission to see task with task id ${id}`)
            throw new ForbiddenException(`You do not have permission to see task with task id ${id}`);
        }
        return task;
    }

    async editTask(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
        const task = await this.tasksRepository.findOne({
            where: { id }
        });

        if (!task) {
            this.logger.log(`Task with task id: ${id} not found`)
            throw new NotFoundException(`Task with task id: ${id} not found`);
        }

        if (task.ownerId !== userId) {
            this.logger.log(`You do not have permission to edit task with task id ${id}`)
            throw new ForbiddenException(`You do not have permission to edit task with task id ${id}`);
        }

        if (updateTaskDto.dueDate) {
            this.validateDueDate(updateTaskDto.dueDate)
        }

        Object.assign(task, updateTaskDto);

        await this.tasksRepository.save(task);

        this.logger.log(`Task edited successfully ${task}`)
        return task;
    }
}
