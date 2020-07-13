import {IsNotEmpty, IsString} from 'class-validator';

class LoginDto {

    @IsNotEmpty()
    @IsString()
    public username: string;

    @IsNotEmpty()
    @IsString()
    public password: string;

}

export default LoginDto;
