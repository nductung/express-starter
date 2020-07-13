import {IsEmpty} from 'class-validator';

class VerifiedAccountWithParametersDto {

    @IsEmpty()
    public email!: string;

    @IsEmpty()
    public otp!: string;

}

export default VerifiedAccountWithParametersDto;
