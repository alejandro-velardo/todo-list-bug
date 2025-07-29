import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs'; // importa bcryptjs

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async create(createUserDto: CreateUserDto) {
        const {email, pass, fullname} = createUserDto;
    
        const existingUser = await this.usersRepository.findOneBy({ email });

        if (existingUser) {
            this.logger.log(`Email: ${email} is already registered.`)
            throw new ConflictException('Email is already registered');
        }
        
        const user = new User();
        user.email = email;
        user.fullname = fullname;
        
        // Por seguridad, no guardamos la password en la base de datos en texto plano
        user.pass = await this.hashPassword(pass);

        await this.usersRepository.save(user);
        this.logger.log(`User registered successufly: ${createUserDto}`)

        return user;
    }

    async findOne(email: string) {
        const user = await this.usersRepository.findOneBy({
            email,
        });

        if (!user) {
            this.logger.log(`User with email: ${email} not found.`)
            throw new NotFoundException(`User with ${email} not found.`)
        }

        return user;
    }
}
