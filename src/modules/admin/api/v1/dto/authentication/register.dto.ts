import {IsEmail, IsString, MinLength} from 'class-validator';

class RegisterDto {

    @IsString()
    public firstName: string;

    @IsString()
    public lastName: string;

    @IsString()
    @MinLength(5)
    public username: string;

    @IsEmail()
    public email: string;

    @IsString()
    @MinLength(8)
    public password: string;

}

export default RegisterDto;
