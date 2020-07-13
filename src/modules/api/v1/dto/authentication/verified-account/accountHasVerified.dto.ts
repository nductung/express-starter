import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import userModel from "../../../../../../models/user.model";

@ValidatorConstraint({async: true})
export class AccountHasVerifiedConstraint implements ValidatorConstraintInterface {
    public async validate(email: string, args: ValidationArguments) {
        if (email) {
            const user = await userModel.findOne({email});
            return !(user && user.confirmed);
        }
        return true
    }
}

export function AccountHasVerifiedDto(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: AccountHasVerifiedConstraint
        });
    };
}
