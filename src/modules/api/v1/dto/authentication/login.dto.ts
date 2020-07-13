import {IsNotEmpty, IsString} from 'class-validator';

class LoginDto {

    @IsString()
    @IsNotEmpty()
    public username: string;

    @IsString()
    @IsNotEmpty()
    public password: string;

}

export default LoginDto;
