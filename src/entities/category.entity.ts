import { Entity, Column, TreeChildren, TreeParent, Tree, Unique, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEmpty, IsNotEmpty } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Property } from './property.entity';
import { BaseEntity } from './base.entity';

const { CREATE, UPDATE } = CrudValidationGroups;
@Entity('categories')
@Unique(['slug'])
export class Category extends BaseEntity {

  @ApiProperty({ example: 'Category1' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  name: string;

  // @ApiProperty({ example: 'Category-12345'})
  @IsOptional({ groups: [UPDATE] })
  @Column()
  slug: string;

  @OneToMany(() => Property, (property: Property) => property.category)
  properties: Property[];

  // @BeforeInsert()
  // generateSlug() {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` :today.getMonth() + 1;
  //   const date = today.getDate() < 10 ? `0${today.getDate()}`: today.getDate();
  //   const hours = today.getHours() < 10 ? `0${today.getHours()}`: today.getHours();
  //   const minutes = today.getMinutes() < 10 ? `0${today.getMinutes()}`: today.getMinutes();
  //   const seconds = today.getSeconds() < 10 ? `0${today.getSeconds()}`: today.getSeconds();
  //   const time = `${year}${month}${date}${hours}${minutes}${seconds}`;
  //   this.slug = slug(this.name ,{lower: true}) + '-' + time;
  // }

}
