import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { User } from '../src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';

async function isHashed(pass: string): Promise<boolean> {
  // Simple heuristic: bcrypt hashes start with $2
  return pass.startsWith('$2');
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersRepo: Repository<User> = app.get(getRepositoryToken(User));

  const users = await usersRepo.find();

  for (const user of users) {
    if (await isHashed(user.pass)) {
      console.log(`User ${user.email} already hashed, skipping...`);
      continue;
    }

    const hashed = await bcrypt.hash(user.pass, 10);
    user.pass = hashed;
    await usersRepo.save(user);

    console.log(`User ${user.email} password hashed.`);
  }

  await app.close();
  console.log('✅ Finished hashing passwords.');
}

bootstrap().catch((err) => {
  console.error('❌ Error while hashing passwords:', err);
});
