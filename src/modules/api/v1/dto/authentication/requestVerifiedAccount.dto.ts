import {IsEmail} from 'class-validator';
import {VerifiedAccountAlreadyExistsDto} from "./verifiedAccountAlreadyExists.dto";
import {EmailDoesNotExistDto} from "./emailDoesNotExist .dto";

class RequestVerifiedAccountDto {

    @IsEmail()
    @EmailDoesNotExistDto({message: 'Email chưa được đăng ký tài khoản trên hệ thống'})
    @VerifiedAccountAlreadyExistsDto({message: 'Tài khoản của bạn đã được xác thực. Xin mời đăng nhập'})
    public email!: string;

}

export default RequestVerifiedAccountDto;
