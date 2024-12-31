import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isValidate', async: true })
@Injectable()
export class ImageArrayValidator implements ValidatorConstraintInterface {

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Parameter must be URL, please try another';
  }

  async validate(value: string[], validationArguments?: ValidationArguments): Promise<boolean> {
    for(let i = 0; i < value.length; i += 1) {
      if(value[i].match(/\.(jpeg|jpg|gif|png)$/) === null) return false;
    }
    return true;
  }

}
