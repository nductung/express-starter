import {IsNotEmpty, IsString} from 'class-validator';

class VerifiedAccountDto {

    @IsString()
    @IsNotEmpty()
    public email!: string;

    @IsString()
    @IsNotEmpty()
    public otp!: string;

}

export default VerifiedAccountDto;
