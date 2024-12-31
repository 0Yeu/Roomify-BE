import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class TokenIDValidator implements ValidatorConstraintInterface {
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.value} is invalid, please try again`;
  }

  async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {
    try {
      const result = await admin.auth().verifyIdToken(value);
      console.log('TOKEN RESULT ------>', result);

      return !result;
    } catch (error) {
      console.log('ERROR_TOKEN_VALIDATE', error);
      return false;
    }
  }
}
