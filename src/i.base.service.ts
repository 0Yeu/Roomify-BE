import { DeepPartial } from 'typeorm';
import { GetMany } from './models/base/getMany.dto';

export interface IBaseService<T> {
  index(): Promise<T[]>

  uploadImage(path : string, folder: string): Promise<string>

  delele(id : number): Promise<void>

  restore(id:number): Promise<void>

  createBulkData(dto: DeepPartial<T>[]): Promise<T[]>

  getManyData(dto: GetMany, relation?: string[], findOption?: {}): Promise<any>
}
