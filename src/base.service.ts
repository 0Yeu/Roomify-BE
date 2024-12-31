import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseEntity, DeepPartial, IsNull, Not, Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { unlinkSync } from 'fs';
import { CrudRequest } from '@nestjsx/crud';
import { IBaseService } from './i.base.service';
import { uploads } from './plugins/cloudinary.plugin';
import { GetMany } from './models/base/getMany.dto';

@Injectable()
export abstract class BaseService<T extends BaseEntity, R extends Repository<T>>
  extends TypeOrmCrudService<T>
  implements IBaseService<T> {
  constructor(protected repository: R) {
    super(repository);
  }

  index(): Promise<T[]> {
    return this.repository.find();
  }

  get(condition?: any, relations?: string[]): Promise<T> {
    return this.repository.findOne({ where: condition, relations });
  }

  async uploadImage(path: string, folder: string): Promise<string> {
    const image = await uploads(path, folder);
    unlinkSync(path);
    return image;
  }

  async delele(id: number) {
    const checkData = await this.repository.findOne(id);
    if (!checkData) throw new NotFoundException();
    await this.repository.delete(id);
  }

  async deleteOne(req: CrudRequest): Promise<any> {
    const { returnDeleted } = req.options.routes.deleteOneBase;
    const found = await this.getOneOrFail(req, returnDeleted);
    const data: any = found;
    await this.repository.softRemove(data);
    return {
      statusCode: 200
    };
  }

  async restore(id: number): Promise<any> {
    const checkData = await this.repository.findOne({ where: { id }, withDeleted: true });
    if (!checkData) throw new NotFoundException();
    await this.repository.restore(id);
    return {
      statusCode: 200
    };
  }

  async createBulkData(dto: DeepPartial<T>[]): Promise<T[]> {
    if (dto.length === 0) throw new BadRequestException('Nothing to change. Data is empty !!!');
    const result = await this.repository.save(dto, { chunk: 50 });
    return result;
  }

  async getDataWasDeleted(query: GetMany, relation?: []) {
    const data = await this.getManyData(query, relation, { deletedAt: Not(IsNull()) }, true, {
      withDeleted: true
    });
    return data;
  }

  async getManyData(
    metadata: GetMany,
    relation?: string[],
    findOption?: any,
    isReturn = true,
    option?: any
  ): Promise<any> {
    let { limit, page, offset } = metadata;
    if (limit === undefined) limit = 15;
    if (offset === undefined) offset = 0;
    if (page === undefined && offset === undefined) {
      offset = 0;
      page = 1;
    } else if (offset === undefined) {
      offset = limit * (page - 1);
    } else {
      page = Math.trunc(offset / limit) + 1;
    }
    let result;
    if (isReturn === false) {
      result = await this.repository.findAndCount({
        where: findOption,
        relations: relation,
        skip: offset,
        take: limit,
        ...option
      });
      return { result, limit, offset, page };
    }
    result = await this.repository.findAndCount({
      where: findOption,
      relations: relation,
      skip: offset,
      take: limit,
      ...option
    });
    const data = result[0];
    const count = data.length;
    const total = result[1];
    const pageCount = Math.ceil(total / limit);
    return {
      count,
      total,
      page,
      pageCount,
      data
    };
  }
}
