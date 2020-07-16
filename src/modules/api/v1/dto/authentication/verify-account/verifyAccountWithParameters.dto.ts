import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

class VerifyAccountWithParametersDto {

    @IsEmail()
    @IsNotEmpty()
    public email!: string;

    @IsString()
    @IsNotEmpty()
    public otp!: string;

}

export default VerifyAccountWithParametersDto;
