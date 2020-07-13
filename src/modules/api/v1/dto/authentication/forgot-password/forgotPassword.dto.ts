import {IsString, MinLength} from 'class-validator';
import {ConfirmPasswordDto} from "../confirmPassword";

class ForgotPasswordDto {

    @IsString()
    public email!: string;

    @IsString()
    public otp!: string;

    @IsString()
    @MinLength(8, {message: 'Mật khẩu phải có tối thiểu 8 ký tự'})
    public newPassword!: string;

    @IsString()
    @MinLength(8, {message: 'Mật khẩu xác nhận phải có tối thiểu 8 ký tự'})
    @ConfirmPasswordDto({message: 'Mật khẩu mới và mật khẩu xác nhận không giống nhau'})
    public confirmPassword!: string;

}

export default ForgotPasswordDto;
