import {IsNotEmpty, IsString} from 'class-validator';

class VerifyAccountDto {

    @IsString()
    @IsNotEmpty()
    public email!: string;

    @IsString()
    @IsNotEmpty()
    public otp!: string;

}

export default VerifyAccountDto;
