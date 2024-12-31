import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { FavoriteProperty } from '@src/entities/favorite_property.entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { createQueryBuilder } from 'typeorm';

export interface Response<T> {
  result: T;
}

@Injectable()
export class LoggingInterceptor<T> implements NestInterceptor<T, Response<T>> {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Response<T>>> {
    const req = context.switchToHttp().getRequest();
    const { user } = req;
    if (user) {
      const query = await createQueryBuilder()
        .select('favorite_property')
        .from(FavoriteProperty, 'favorite_property')
        .where('favorite_property.userId= :userId', { userId: user.id })
        .getMany();
      const hashTable = {};
      for (let i = 0; i < query.length; i += 1) {
        hashTable[query[i].propertyId] = 1;
      }
      return next.handle().pipe(
        map(data => {
          const transferData = data;
          if (data) {
            if (data.data) {
              transferData.result = transferData.data;
              transferData.data = undefined;
            }
          }
          if (Array.isArray(transferData.result)) {
            transferData.result.forEach((element: any) => {
              if (hashTable[element.id] === 1) {
                element.isFavorited = true;
              } else element.isFavorited = false;
            });
          } else if (hashTable[transferData.id] === 1) {
            transferData.isFavorited = true;
          } else transferData.isFavorited = false;
          return transferData;
        })
      );
    }
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
