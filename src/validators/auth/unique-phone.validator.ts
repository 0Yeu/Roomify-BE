import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../app/user/user.service';

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class UniquePhoneValidator implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.value} is taken, please try another`;
  }

  async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {
    const result = await this.userService.findOneByPhone(value);
    return !result;
  }
}
