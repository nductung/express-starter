import {IsEmail, IsNotEmpty} from 'class-validator';
import {AccountHasVerifiedDto} from "./accountHasVerified.dto";
import {EmailDoesNotExistDto} from "../../emailDoesNotExist .dto";

class RequestVerifiedAccountDto {

    @AccountHasVerifiedDto({message: 'Tài khoản của bạn đã được xác minh. Xin mời đăng nhập'})
    @EmailDoesNotExistDto({message: 'Email chưa được đăng ký tài khoản trên hệ thống'})
    @IsEmail()
    @IsNotEmpty()
    public email!: string;

}

export default RequestVerifiedAccountDto;
