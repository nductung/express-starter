import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

class LoginDto {

    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsString()
    @IsNotEmpty()
    public password: string;

}

export default LoginDto;
