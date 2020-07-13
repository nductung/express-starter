import {IsString} from 'class-validator';

class VerifiedAccountDto {

    @IsString()
    public otp!: string;

}

export default VerifiedAccountDto;
