import {IsEmail} from 'class-validator';
import {AccountHasVerifiedDto} from "./accountHasVerified.dto";
import {EmailDoesNotExistDto} from "../../emailDoesNotExist .dto";

class RequestVerifiedAccountDto {

    @IsEmail()
    @EmailDoesNotExistDto({message: 'Email chưa được đăng ký tài khoản trên hệ thống'})
    @AccountHasVerifiedDto({message: 'Tài khoản của bạn đã được xác minh. Xin mời đăng nhập'})
    public email!: string;

}

export default RequestVerifiedAccountDto;
