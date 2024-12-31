import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/base.service';
import { Destination } from '@src/entities/destinations.entity';
import { IResponseFormat } from '@src/models/base/response.interface';
import { TreeRepository } from 'typeorm';
import { DestinationRepository } from './destination.repository';

@Injectable()
export class DestinationService extends BaseService<Destination, DestinationRepository> {
  constructor(protected repository: DestinationRepository,
    @InjectRepository(Destination)
    private readonly treeRepository: TreeRepository<Destination>) {
    super(repository);
  }

  async findAncestorsTree(data: number): Promise<Destination> {
    const destination = this.repository.create();
    destination.id = data;
    const result = await this.treeRepository.findAncestorsTree(destination);
    return result;
  }

  async findTreeAndSelfWithId(id: number): Promise<any> {
    const destination = this.repository.create();
    destination.id = id;
    const result = await this.treeRepository.findAncestorsTree(destination);
    const self = await this.repository.findOne({ where: { id } });
    return { ...self, parent: result?.parent };
    // return { ...result, ...self };
  }

  async getCity(): Promise<IResponseFormat<Destination>> {
    const data = await this.repository.find({ where: { parentId: null } });
    return { data };
  }

  async getDistrict(cityId: number): Promise<IResponseFormat<Destination>> {
    const city = await this.repository.find({ where: { parentId: null } });
    let temp = 0;
    for (let i = 0; i < city.length; i += 1) {
      if (city[i].id === cityId) temp = 1;
    }
    if (temp === 0) throw new BadRequestException('Please input id of city');
    const data = await this.repository.find({ where: { parentId: cityId }, select: ['id', 'name'] });
    return { data };
  }

  async getSubDistrict(districtId): Promise<IResponseFormat<Destination>> {
    if (districtId > 40 || districtId < 4) throw new BadRequestException('Please input id of district');
    const data = await this.repository.find({ where: { parentId: districtId }, select: ['id', 'name'] });
    return { data };
  }
}
