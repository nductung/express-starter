import {IsEmail, IsNotEmpty} from 'class-validator';
import {AccountHasVerifyDto} from "./accountHasVerify.dto";
import {EmailDoesNotExistDto} from "../../emailDoesNotExist .dto";

class RequestVerifyAccountDto {

    @AccountHasVerifyDto({message: 'Tài khoản của bạn đã được xác minh. Xin mời đăng nhập'})
    @EmailDoesNotExistDto({message: 'Email chưa được đăng ký tài khoản trên hệ thống'})
    @IsEmail()
    @IsNotEmpty()
    public email!: string;

}

export default RequestVerifyAccountDto;
