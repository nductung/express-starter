import {IsEmpty} from 'class-validator';

class VerifiedAccountWithParametersDto {

    @IsEmpty()
    public username!: string;

    @IsEmpty()
    public otp!: string;

}

export default VerifiedAccountWithParametersDto;
