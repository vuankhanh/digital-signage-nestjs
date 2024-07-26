import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsAtLeastOneOptional(propertyNames: string[], validationOptions?: ValidationOptions) {
  return function (target: Function) {
    registerDecorator({
      name: 'IsAtLeastOneOptional',
      target: target,
      propertyName: '',
      constraints: [propertyNames],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedProperties] = args.constraints;
          const object = args.object as any;
          return relatedProperties.some((prop: string) => object[prop] !== null && object[prop] !== undefined);
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedProperties] = args.constraints;
          return `At least one of ${relatedProperties.join(', ')} is required`;
        },
      },
    });
  };
}