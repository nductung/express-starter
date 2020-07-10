import {IsString, MinLength} from "class-validator";
import {NewPasswordDto} from "./newPassword.dto";
import {ConfirmPasswordDto} from "./confirmPassword";

class ChangePasswordDto {

    @IsString()
    public currentPassword!: string;

    @IsString()
    @MinLength(8, {message: 'Mật khẩu phải có tối thiểu 8 ký tự'})
    @NewPasswordDto({message: 'Mật khẩu mới phải khác với mật khẩu hiện tại'})
    public newPassword!: string;

    @IsString()
    @MinLength(8, {message: 'Mật khẩu xác nhận phải có tối thiểu 8 ký tự'})
    @ConfirmPasswordDto({message: 'Mật khẩu mới và mật khẩu xác nhận không giống nhau'})
    public confirmPassword!: string;

}

export default ChangePasswordDto
