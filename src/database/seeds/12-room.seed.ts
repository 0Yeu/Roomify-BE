import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import Faker from 'faker';
import properties from '../data-scraping/property.json';
import rooms from '../data-scraping/rooms.json';
import amenities_data from '../data-scraping/amenities.json';
import { Room } from '../../entities/room.entity';

export default class CreateRooms implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    let temp;
    let amenities = [];
    for (let i = 0; i < rooms.length; i += 1) {
      temp = rooms[i];
      temp.price *= 20000;
      temp.property = { id: i + 1 };
      temp.slug = Faker.lorem.slug();
      temp.area = 100.97;
      temp.description = Faker.lorem.sentences(5);
      for (let j = 0; j < 6; j += 1) {
        amenities.push(Faker.random.number({ min: 1, max: amenities_data.length }));
      }
      temp.amenities = amenities;
      amenities = [];
      await connection
        .createQueryBuilder()
        .insert()
        .into(Room)
        .values(temp)
        .execute();
    }
    let roomsId, amenitiesId, array;
    for (let i = 0; i < properties.length; i += 1) {
      roomsId = i + 1;
      array = [];
      for (let j = 0; j < 6; j += 1) {
       do {
        amenitiesId = Faker.random.number({ min: 1, max: amenities_data.length });
       }while(array.includes(amenitiesId));
        await connection
          .createQueryBuilder()
          .insert()
          .into('room_amenity')
          .values({roomsId, amenitiesId})
          .execute();

        array.push(amenitiesId);
      }

    }
  }
}
