import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

class RegisterDto {

    @IsNotEmpty()
    @IsString()
    public username: string;

    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @IsString()
    // tslint:disable-next-line:variable-name
    public first_name: string;

    @IsNotEmpty()
    @IsString()
    // tslint:disable-next-line:variable-name
    public last_name: string;

    @IsNotEmpty()
    @IsString()
    public password: string;

}

export default RegisterDto;
