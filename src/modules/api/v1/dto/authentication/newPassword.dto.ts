import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint({async: true})
export class NewPasswordConstraint implements ValidatorConstraintInterface {
    public validate(newPassword: string, args: ValidationArguments) {
        return (args.object as any).currentPassword !== (args.object as any).newPassword;
    }
}

export function NewPasswordDto(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: NewPasswordConstraint
        });
    };
}
