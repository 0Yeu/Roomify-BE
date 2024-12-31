import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizeCrudInterceptor<T, R> implements NestInterceptor<T, R> {
  // eslint-disable-next-line class-methods-use-this
  public intercept(context: ExecutionContext, next: CallHandler): Observable<R> {
    const req = context.switchToHttp().getRequest();

    if (req.method === 'POST') {
      // Works for createOneBase route.
      req.body.userId = req.user.id;
    } else {
      console.log('req.user.id', req.user.id);
      // Works for getManyBase, getOneBase, updateOneBase, replaceOneBase, deleteOneBase routes.
      req.query.filter = `userId||eq||${req.user.id}`;
    }

    return next.handle();
  }
}
