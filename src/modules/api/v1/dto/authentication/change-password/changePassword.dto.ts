import {IsNotEmpty, IsString, MinLength} from "class-validator";
import {NewPasswordDto} from "./newPassword.dto";
import {ConfirmPasswordDto} from "../confirmPassword";

class ChangePasswordDto {

    @IsString()
    @IsNotEmpty()
    public currentPassword!: string;

    @NewPasswordDto({message: 'Mật khẩu mới phải khác với mật khẩu hiện tại'})
    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    public newPassword!: string;

    @ConfirmPasswordDto({message: 'Mật khẩu mới và mật khẩu xác nhận không giống nhau'})
    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    public confirmPassword!: string;

}

export default ChangePasswordDto
