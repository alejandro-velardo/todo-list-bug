import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { UpdateTaskDto } from './dto/update-task.dto'
@Injectable()
export class TasksService {
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
            throw new BadRequestException('La fecha de vencimiento no puede ser anterior a hoy');
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
            throw new NotFoundException('Task not found');
        }

        if (task.ownerId !== userId) {
            throw new ForbiddenException("You do not have permissions to see this task")
        }
        return task;
    }

    async editTask(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
        const task = await this.tasksRepository.findOne({
            where: { id }
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        if (task.ownerId !== userId) {
            throw new ForbiddenException('You do not have permission to edit this task');
        }

        if (updateTaskDto.dueDate) {
            this.validateDueDate(updateTaskDto.dueDate)
        }

        Object.assign(task, updateTaskDto);

        await this.tasksRepository.save(task);
        
        return task;
    }
}
