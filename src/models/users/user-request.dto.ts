import { Request } from 'express';
import { User } from '@src/entities/user.entity';

export interface UserRequestDto extends Request {
  user: User
}
