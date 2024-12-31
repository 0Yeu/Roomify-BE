import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Destination } from '../../entities/destinations.entity';
import destination_data from '../data-scraping/destination.json';

export default class CreateDestinations implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {

    const ThanhPho = [
      {
        name: 'Đà Nẵng'
      },
      {
        name: 'Hà Nội'
      },
      {
        name: 'TP. Hồ Chí Minh'
      }
    ];
    const Quan = [];
    const Phuong = [];

    destination_data.forEach(data => {
      if (data.ThanhPho === ThanhPho[0].name) {
        if (Quan.length > 0 && Quan[Quan.length - 1].name !== data.Quan) {
          Quan.push({
            name: data.Quan,
            parent: ThanhPho[0]
          });
        }
        if(Quan.length === 0) {
          Quan.push({
            name: data.Quan,
            parent: ThanhPho[0]
          });
        }
        Phuong.push({
          name: data.Phuong,
          parent: Quan[Quan.length - 1]
        });
      }
      if (data.ThanhPho === ThanhPho[1].name) {
        if (Quan.length > 0 && Quan[Quan.length - 1].name !== data.Quan) {
          Quan.push({
            name: data.Quan,
            parent: ThanhPho[1]
          });
        }
        if(Quan.length === 0) {
          Quan.push({
            name: data.Quan,
            parent: ThanhPho[1]
          });
        }
        Phuong.push({
          name: data.Phuong,
          parent: Quan[Quan.length - 1]
        });
      }
      if (data.ThanhPho === ThanhPho[2].name) {
        if (Quan.length > 0 && Quan[Quan.length - 1].name !== data.Quan) {
          Quan.push({
            name: data.Quan,
            parent: ThanhPho[2]
          });
        }
        if(Quan.length === 0) {
          Quan.push({
            name: data.Quan,
            parent: ThanhPho[2]
          });
        }
        Phuong.push({
          name: data.Phuong,
          parent: Quan[Quan.length - 1]
        });
      }
    });
    await connection
      .createQueryBuilder()
      .insert()
      .into(Destination)
      .values(ThanhPho)
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Destination)
      .values(Quan)
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Destination)
      .values(Phuong)
      .execute();
  }
}
