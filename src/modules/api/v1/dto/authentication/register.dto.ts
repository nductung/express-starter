import {IsEmail, IsString} from 'class-validator';

class RegisterDto {

    @IsString()
    public firstName: string;

    @IsString()
    public lastName: string;

    @IsString()
    public username: string;

    @IsEmail()
    public email: string;

    @IsString()
    public password: string;

}

export default RegisterDto;
