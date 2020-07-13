import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';

class RegisterDto {

    @IsNotEmpty()
    @IsString()
    public firstName: string;

    @IsNotEmpty()
    @IsString()
    public lastName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    public username: string;

    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    public password: string;

}

export default RegisterDto;
