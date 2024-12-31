import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  result: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    // const req = context.switchToHttp().getRequest();
    // let user;
    // if (req.user) user = req.user;
    return next.handle().pipe(
      map(data => {
        
        const transferData = data;
        if (data) {
          if (data.data) {
            transferData.result = transferData.data;
            transferData.data = undefined;
          }
        }
        return transferData;
      })
    );
  }
}
