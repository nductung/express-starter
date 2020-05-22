import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

class LoginDto {

    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @IsString()
    public password: string;

}

export default LoginDto;
