import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class LoginUserDto {
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({message: 'Field email must not be empty'})
    email: string;
    
    @IsNotEmpty({message: 'Field password must not be empty'})
    pass: string;
}