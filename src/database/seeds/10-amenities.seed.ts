import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import amenities_data from '../data-scraping/amenities.json';
import { Amenity } from '../../entities/amenity.entity';

export default class CreateAmenities implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {

    await connection
      .createQueryBuilder()
      .insert()
      .into(Amenity)
      .values(amenities_data)
      .execute();

  }
}
