import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('TasksService', () => {
    let service: TasksService;
    let tasksRepository: Repository<Task>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: getRepositoryToken(Task),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
        tasksRepository = module.get<Repository<Task>>(
            getRepositoryToken(Task),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('listTasks', () => {
        it('should return an array of tasks for the given user', async () => {
            const tasks = [
                { id: '1', title: 'Task 1', owner: { id: '1' } },
                { id: '2', title: 'Task 2', owner: { id: '1' } },
            ];

            jest.spyOn(tasksRepository, 'find').mockResolvedValue(tasks as any);

            const result = await service.listTasks('1');
            expect(result).toEqual(tasks);
        });

        it('should return an empty array if no tasks are found for the given user', async () => {
            const tasks = [];

            jest.spyOn(tasksRepository, 'find').mockResolvedValue(tasks as any);

            const result = await service.listTasks('1');
            expect(result).toEqual(tasks);
        });
    });

    describe('getTask', () => {
        it('should return forbidden if user id not found', async () => {
            const task = {
                id: '1',
                title: 'Task 1',
                ownerId: '1',
            };

            jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(task as any);

            await expect(
                service.getTask('1', '2'),
            ).rejects.toThrow(ForbiddenException);
        });

        it('should return not found if task id not found', async () => {
            const task = {
                id: '1',
                title: 'Task 1',
                ownerId: '1',
            };

            jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(task as any);

            await expect(
                service.getTask('2', '2'),
            ).rejects.toThrow(ForbiddenException);
        });
    })

    describe('editTask', () => {
        it('should return forbidden if user id not found', async () => {
            jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(undefined);

            await expect(
                service.editTask('1', { title: 'New title' }, 'user-1')
            ).rejects.toThrow(NotFoundException);
        });

        it('should return not found if task id not found', async () => {
            const task = { id: '1', ownerId: 'another-user' };

            jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(task as any);

            await expect(
                service.editTask('1', { title: 'New title' }, 'user-1')
            ).rejects.toThrow(ForbiddenException);
        });

        it('should return bad request if date format is not valid', async () => {
            const existingTask = {
                id: '1',
                title: 'Old title',
                description: 'Old description',
                ownerId: 'user-1',
            };

            const invalidDto = {
                title: 'New title',
                dueDate: 'invalid-date', // el método validateDueDate debe fallar con esto
            };

            jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(existingTask as any);
            // Simula que la validación lanza un error
            jest.spyOn(service as any, 'validateDueDate').mockImplementation(() => {
                throw new BadRequestException('Invalid due date');
            });

            await expect(service.editTask('1', invalidDto, 'user-1')).rejects.toThrow(BadRequestException);
        })
    })
});
