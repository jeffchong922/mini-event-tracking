import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class DtoValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const obj = plainToClass(metatype, value);

    const errors = await validate(obj);
    if (errors.length > 0) {
      const errorMessage = this.getClassValidatorFirstErrorMessage(errors);
      throw new BadRequestException(errorMessage);
    }

    return value;
  }

  toValidate(metatype: Type): boolean {
    const types: Type[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  getClassValidatorFirstErrorMessage(errors: ValidationError[]): string {
    const errorConstraints = errors[0].constraints;
    const errorConstraintsKey = Object.keys(errorConstraints)[0];
    const errorMessage = errorConstraints[errorConstraintsKey];
    return errorMessage;
  }
}
