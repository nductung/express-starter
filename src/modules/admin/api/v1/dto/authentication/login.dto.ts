import {IsEmail, IsString} from 'class-validator';

class LoginDto {

    @IsEmail()
    public email: string;

    @IsString()
    public password: string;

}

export default LoginDto;
