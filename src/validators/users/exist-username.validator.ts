import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { User } from '@src/entities/user.entity';

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class ExistedUsernameValidator implements ValidatorConstraintInterface {

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.value} is taken, please try another`;
  }

  async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {
    const result = await getConnection().createQueryBuilder().select('user').from(User, 'user').where('user.username= :name', { name: value }).getOne();
    return !result;
  }
}
