import {IsNotEmpty, IsString, MinLength} from 'class-validator';
import {ConfirmPasswordDto} from "../confirmPassword";

class ForgotPasswordDto {

    @IsNotEmpty()
    @IsString()
    public email!: string;

    @IsNotEmpty()
    @IsString()
    public otp!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    public newPassword!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @ConfirmPasswordDto({message: 'Mật khẩu mới và mật khẩu xác nhận không giống nhau'})
    public confirmPassword!: string;

}

export default ForgotPasswordDto;
