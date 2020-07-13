import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';

class RegisterDto {

    @IsString()
    @IsNotEmpty()
    public firstName: string;

    @IsString()
    @IsNotEmpty()
    public lastName: string;

    @MinLength(5)
    @IsString()
    @IsNotEmpty()
    public username: string;

    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    public password: string;

}

export default RegisterDto;
