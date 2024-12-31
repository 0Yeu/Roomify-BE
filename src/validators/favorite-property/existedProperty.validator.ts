import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { Property } from '@src/entities/property.entity';

@ValidatorConstraint({ name: 'isValidate', async: true })
@Injectable()
export class ExistedPropertyValidator implements ValidatorConstraintInterface {

  async validate(value: number, validationArguments?: ValidationArguments): Promise<boolean> {
    const result = await getConnection().createQueryBuilder().select('property').from(Property, 'property').where('property.id= :id', { id: value }).getOne();
    if(result) return true;
    throw new NotFoundException('Property not found !!!');
  }
}
