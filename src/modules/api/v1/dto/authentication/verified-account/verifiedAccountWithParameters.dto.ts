import {IsEmpty, IsNotEmpty} from 'class-validator';

class VerifiedAccountWithParametersDto {

    @IsNotEmpty()
    @IsEmpty()
    public email!: string;

    @IsNotEmpty()
    @IsEmpty()
    public otp!: string;

}

export default VerifiedAccountWithParametersDto;
