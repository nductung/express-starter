import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';
import {ConfirmPasswordDto} from "../confirmPassword";

class ForgotPasswordDto {

    @IsEmail()
    @IsNotEmpty()
    public email!: string;

    @IsString()
    @IsNotEmpty()
    public otp!: string;

    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    public password!: string;

    @ConfirmPasswordDto({message: 'Mật khẩu mới và mật khẩu xác nhận không giống nhau'})
    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    public confirmPassword!: string;

}

export default ForgotPasswordDto;
