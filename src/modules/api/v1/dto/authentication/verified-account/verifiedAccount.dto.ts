import {IsString} from 'class-validator';

class VerifiedAccountDto {

    @IsString()
    public username!: string;

    @IsString()
    public otp!: string;

}

export default VerifiedAccountDto;
