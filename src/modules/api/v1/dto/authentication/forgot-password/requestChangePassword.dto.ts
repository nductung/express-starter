import {IsEmail, IsNotEmpty} from 'class-validator';
import {EmailDoesNotExistDto} from "../../emailDoesNotExist .dto";

class RequestChangePasswordDto {

    @IsNotEmpty()
    @IsEmail()
    @EmailDoesNotExistDto({message: 'Email chưa được đăng ký tài khoản trên hệ thống'})
    public email!: string;

}

export default RequestChangePasswordDto;
