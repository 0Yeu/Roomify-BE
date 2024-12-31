import { ValidatorConstraintInterface, ValidatorConstraint, ValidationArguments } from 'class-validator';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '@src/entities/roles.entity';
@ValidatorConstraint({ name: 'isValidate', async: true })
@Injectable()
export class CheckRoleOfUser implements ValidatorConstraintInterface {

  validate(value: number, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    if(value !== undefined && (value === 3 || value === 1)) throw new ForbiddenException('Can not add role OWNER and ADMIN');
    return true;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments.value} is not found`;
  }
}
