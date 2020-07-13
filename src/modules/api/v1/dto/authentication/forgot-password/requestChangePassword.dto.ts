import {IsEmail, IsNotEmpty} from 'class-validator';
import {EmailDoesNotExistDto} from "../../emailDoesNotExist .dto";

class RequestChangePasswordDto {

    @EmailDoesNotExistDto({message: 'Email chưa được đăng ký tài khoản trên hệ thống'})
    @IsEmail()
    @IsNotEmpty()
    public email!: string;

}

export default RequestChangePasswordDto;
