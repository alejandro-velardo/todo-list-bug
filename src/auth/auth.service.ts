import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(loginUserDto: LoginUserDto): Promise<any> {
        const{ email, pass } = loginUserDto;
        const user = await this.usersService.findOne(email);

        if (!user) {
            this.logger.log(`User with email ${email} not found`);
            throw new UnauthorizedException();
        }

        console.log("hola")
        const passwordMatches = await bcrypt.compare(pass, user.pass);

        if (!passwordMatches) {
            this.logger.log(`Invalid password for user with email ${email}`);
            throw new UnauthorizedException();
        }

        const payload = { id: user.id, email: user.email };

        this.logger.log(`User ${email} is authenticated.`);
        return {
            access_token: await this.jwtService.signAsync(payload, {
                expiresIn: '1h',
            })
        };
    }
}
