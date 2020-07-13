import {IsString} from 'class-validator';

class VerifiedAccountDto {

    @IsString()
    public email!: string;

    @IsString()
    public otp!: string;

}

export default VerifiedAccountDto;
