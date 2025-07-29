import type { Request } from 'express';
import { UseGuards, Body, Controller, Get, Param, Put, Post, Req, UnauthorizedException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../auth/auth.guard'
import { UpdateTaskDto } from './dto/update-task.dto';
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    
    @Get('')
    @UseGuards(AuthGuard)
    async listTasks(@Req() req: Request) {
        const userId = req.user?.id
        console.dir(req.user, {depth: null})
        return this.tasksService.listTasks(userId);
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    async getTask(@Param('id') id: string, @Req() req: Request) {
        const userId = req.user?.id

        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }
        
        return this.tasksService.getTask(id, userId);
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    async editTask(@Param('id') id:string, @Body() updateTaskDto: UpdateTaskDto, @Req() req: Request) {
        
        const userId = req.user?.id;

        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.tasksService.editTask(id, updateTaskDto, userId);
    }
}
