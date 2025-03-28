import {
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from "class-validator";

export function IsMatch(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isMatch",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
      },
    });
  };
}

export class LoginDto {
  @IsNotEmpty()
  password!: string;
  @IsEmail()
  email!: string;
}

export class RegisterDto {
  @IsNotEmpty()
  password!: string;
  @IsEmail()
  email!: string | undefined;
  @IsMatch("password", { message: "Does not match" })
  matchPassword!: string;
  @IsNotEmpty()
  @IsBoolean()
  agreementToWebsitePolicy!: boolean | undefined;
}

export type LogoutDto = {
  user: { decoded: { userId: string }; authHeader: string };
};
