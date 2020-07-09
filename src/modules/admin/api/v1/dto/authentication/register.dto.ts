import {IsEmail, IsString, MinLength} from 'class-validator';

class RegisterDto {

    @IsString()
    public firstName: string;

    @IsString()
    public lastName: string;

    @IsString()
    @MinLength(5, {message: 'username phải có tối thiểu 5 ký tự'})
    public username: string;

    @IsEmail()
    public email: string;

    @IsString()
    @MinLength(8, {message: 'Mật khẩu phải có tối thiểu 8 ký tự'})
    public password: string;

}

export default RegisterDto;
