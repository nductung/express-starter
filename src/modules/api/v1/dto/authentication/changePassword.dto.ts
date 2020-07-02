import {IsString, MinLength} from "class-validator";

class ChangePasswordDto {

    @IsString()
    public currentPassword: string;

    @IsString()
    @MinLength(6, {message: 'password tối thiểu 6 ký tự'})
    public newPassword: string;

    @IsString()
    @MinLength(6, {message: 'password tối thiểu 6 ký tự'})
    public confirmPassword: string;

}

export default ChangePasswordDto
