import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import Faker from 'faker';
import { Destination } from '../../entities/destinations.entity';
import properties from '../data-scraping/property.json';
import rooms from '../data-scraping/rooms.json';
import { Property } from '../../entities/property.entity';
import { Policy } from '../../entities/policy.entity';

export default class CreateProperties implements Seeder {
  private latDaNang = 16.0544068;

  private longDaNang = 108.2021667;

  private latHaNoi = 21.027763;

  private longHaNoi = 105.83416;

  private latHCM = 10.823099;

  private longHCM = 106.629662;

  public async run(factory: Factory, connection: Connection): Promise<any> {
    const destination = await connection
      .getRepository(Destination)
      .createQueryBuilder('destination')
      .where('destination.name = :name', { name: 'Hòa Phát' })
      .getOne();
    let { id } = destination;
    let temp = 'Hòa Phát';
    let propertyData;
    let policy;
    let t;
    for (let i = 0; i < properties.length; i += 1) {
      if (temp !== properties[i].destination.name) {
        id += 1;
        temp = properties[i].destination.name;
      }
      propertyData = properties[i];
      propertyData.destination.id = id;
      propertyData.address = '123 Nguyễn Lương Bằng';
      propertyData.category = { id: Faker.random.number({ min: 1, max: 4 }) };
      propertyData.owner = { id: 3 };
      rooms.push(propertyData.rooms);
      propertyData.averagePrice = properties[i].rooms.price * 20000;
      propertyData.rooms = undefined;
      propertyData.description = Faker.lorem.sentences(4);
      propertyData.averageArea = 100.97;
      while(true) {
        t = Faker.random.number({ min: 0, max: 1, precision: 0.0000001 });
        if(t < 0.005 && t > 0.001) break;
      }
      if (id < 86) {
        if (id % 2 === 0) {
          this.latHaNoi -= t;
        } else {
          this.longHaNoi -= t;
        }
        propertyData.latitude = this.latDaNang;
        propertyData.longitude = this.longDaNang;
      } else if (id < 252) {
        if (id % 2 === 0) {
          this.latHaNoi += t;
        } else {
          this.longHaNoi += t;
        }
        propertyData.latitude = this.latHaNoi;
        propertyData.longitude = this.longHaNoi;
      } else {
        if (id % 2 === 0) {
          this.latHCM -= t;
        } else {
          this.longHCM -= t;
        }
        propertyData.latitude = this.latHCM;
        propertyData.longitude = this.longHCM;
      }

      policy = await connection
        .createQueryBuilder()
        .insert()
        .into(Policy)
        .values({
          electricity: Faker.random.number({ min: 1000, max: 20000 }),
          water: Faker.random.number({ min: 1000, max: 20000 }),
          parking: Faker.random.number({ min: 1000, max: 10000 }),
          internet: Faker.random.number({ min: 100000, max: 500000 })
        })
        .execute();

      propertyData.policy = { id: policy.raw[0].id };

      await connection
        .createQueryBuilder()
        .insert()
        .into(Property)
        .values(propertyData)
        .execute();
    }
  }
}
