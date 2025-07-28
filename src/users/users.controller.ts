import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/create')
    async create(@Body() body: CreateUserDto) {
        console.log(body)
        return this.usersService.create(body);
    }
}
