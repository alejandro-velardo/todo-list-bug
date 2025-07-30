import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  
  @Entity('tasks')
  export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 255 })
    title: string;
  
    @Column({ length: 1000 })
    description: string;
  
    @Column({ default: false })
    done: boolean;
  
    @Column({ type: 'date' })
    dueDate: Date;
  
    @ManyToOne(() => User, (user) => user.tasks, { eager: false })
    @JoinColumn({ name: 'ownerId' })
    owner: User;
  
    @Column()
    ownerId: string; 
  }
  
