import {
    IsBoolean,
    IsDateString,
    IsOptional,
    IsString,
    Length,
  } from 'class-validator';
  
  export class UpdateTaskDto {
    @IsOptional()
    @IsString({ message: 'Title must be a string' })
    @Length(1, 255, { message: 'Title must be between 1 and 255 characters' })
    title?: string;
  
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    @Length(1, 1000, { message: 'Description must be between 1 and 1000 characters' })
    description?: string;
  
    @IsOptional()
    @IsBoolean({ message: 'Done must be a boolean' })
    done?: boolean;
  
    @IsOptional()
    @IsDateString({}, { message: 'Due date must be a valid ISO date string: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss' })
    dueDate?: string;
  }
  