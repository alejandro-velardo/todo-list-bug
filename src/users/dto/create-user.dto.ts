import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Full name is required' })
  fullname: string;

  @MinLength(16, { message: 'Password must be at least 16 characters long' })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/(?=.*[@$!%*?&])/, {
    message: 'Password must contain at least one special character (@$!%*?&)',
  })
  pass: string;
}
