import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@src/base.service';
import { Roommate } from '@src/entities/roommate.entity';
import { GetMany } from '@src/models/base/getMany.dto';
import { IResponseFormat } from '@src/models/base/response.interface';
import { CreateRoomateDto } from '@src/models/roommate/create.dto';
import { RoommateRepository } from './roommate.repository';

@Injectable()
export class RoommateService extends BaseService<Roommate, RoommateRepository> {
  constructor(protected readonly repository: RoommateRepository) {
    super(repository);
  }

  async create(userId: number, body: CreateRoomateDto): Promise<IResponseFormat<Roommate>> {
    const data = await this.repository.save({ ...body, userId });
    return { data };
  }

  async update(
    userId: number,
    body: CreateRoomateDto,
    id: number
  ): Promise<IResponseFormat<Roommate>> {
    const query = await this.repository.findOne(id);
    if (!query) throw new NotFoundException('Roomate not found !!!');
    if (query.userId !== userId) throw new ForbiddenException("This post isn't your own !!!");
    if (body.description) query.description = body.description;
    if (body.price) query.price = body.price;
    if (body.destinationId) query.destinationId = body.destinationId;
    const data = await this.repository.save(query);
    return { data };
  }

  async getMyRoommate(userId: number, query: GetMany): Promise<any> {
    const temp = await this.getManyData(query, [], { userId });
    return temp;
  }
}
