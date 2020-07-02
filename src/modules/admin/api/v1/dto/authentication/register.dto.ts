import {IsEmail, IsString, MinLength} from 'class-validator';

class RegisterDto {

    @IsString()
    public firstName: string;

    @IsString()
    public lastName: string;

    @IsString()
    @MinLength(3, {message: 'username tối thiểu 3 ký tự'})
    public username: string;

    @IsEmail()
    public email: string;

    @IsString()
    @MinLength(6, {message: 'password tối thiểu 6 ký tự'})
    public password: string;

}

export default RegisterDto;
