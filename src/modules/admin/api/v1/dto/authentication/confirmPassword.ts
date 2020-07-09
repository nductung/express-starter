import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint({async: true})
export class ConfirmPasswordConstraint implements ValidatorConstraintInterface {
    public validate(confirmPassword: string, args: ValidationArguments) {
        return (args.object as any).newPassword === confirmPassword;
    }
}

export function ConfirmPasswordDto(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: ConfirmPasswordConstraint
        });
    };
}
