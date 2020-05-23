import {IsString} from 'class-validator';

class ChangePasswordDtoDto {

    @IsString()
    // tslint:disable-next-line:variable-name
    public current_password: string;

    @IsString()
    // tslint:disable-next-line:variable-name
    public new_password: string;

    @IsString()
    // tslint:disable-next-line:variable-name
    public confirm_password: string;

}

export default ChangePasswordDtoDto;
