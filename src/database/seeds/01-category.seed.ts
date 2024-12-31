import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CategoryConstant } from '../../constant/category.constant';

export default class CreateCategories implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {

    CategoryConstant.forEach(async (category) => {
      await factory(Category)({ payload: category }).create();
    });

  }
}
