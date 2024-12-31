import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { DestinationService } from '@src/app/destination/destination.service';

@ValidatorConstraint({ name: 'isValidate', async: true })
@Injectable()
export class ExistedDestinationValidator implements ValidatorConstraintInterface {
  constructor(private destinationService: DestinationService) {
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.value} do not exist, please try another`;
  }

  async validate(value: number, validationArguments?: ValidationArguments): Promise<boolean> {
    const result = await this.destinationService.findAncestorsTree(value);
    if(!result) return false;
    if(!result.parent || !result.parent.parent) throw new ForbiddenException('Destination must be PHUONG, please try another');
    return true;
  }
}
