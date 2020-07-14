import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import userModel from "../../../../models/user.model";

@ValidatorConstraint({async: true})
export class EmailDoesNotExistConstraint implements ValidatorConstraintInterface {
    public async validate(email: string, args: ValidationArguments) {
        return !!(await userModel.findOne({email}));
    }
}

export function EmailDoesNotExistDto(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: EmailDoesNotExistConstraint
        });
    };
}
