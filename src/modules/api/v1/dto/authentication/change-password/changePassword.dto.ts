import {IsNotEmpty, IsString, MinLength} from "class-validator";
import {NewPasswordDto} from "./newPassword.dto";
import {ConfirmPasswordDto} from "../confirmPassword";

class ChangePasswordDto {

    @IsNotEmpty()
    @IsString()
    public currentPassword!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @NewPasswordDto({message: 'Mật khẩu mới phải khác với mật khẩu hiện tại'})
    public newPassword!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @ConfirmPasswordDto({message: 'Mật khẩu mới và mật khẩu xác nhận không giống nhau'})
    public confirmPassword!: string;

}

export default ChangePasswordDto
