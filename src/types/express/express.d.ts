// src/types/express.d.ts
import { User } from '../entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: Partial<User> & { id: string };
    }
  }
}
