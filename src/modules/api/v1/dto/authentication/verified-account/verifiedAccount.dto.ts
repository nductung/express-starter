import {IsNotEmpty, IsString} from 'class-validator';

class VerifiedAccountDto {

    @IsNotEmpty()
    @IsString()
    public email!: string;

    @IsNotEmpty()
    @IsString()
    public otp!: string;

}

export default VerifiedAccountDto;
