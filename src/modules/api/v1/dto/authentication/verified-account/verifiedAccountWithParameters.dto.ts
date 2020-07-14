import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

class VerifiedAccountWithParametersDto {

    @IsEmail()
    @IsNotEmpty()
    public email!: string;

    @IsString()
    @IsNotEmpty()
    public otp!: string;

}

export default VerifiedAccountWithParametersDto;
