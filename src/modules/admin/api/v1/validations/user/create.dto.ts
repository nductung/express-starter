import {IsArray, IsString} from 'class-validator';

class UserDto {

    @IsString()
    public username: string;

    @IsString()
    public password: string;

    public gender: number;

    @IsArray()
    // tslint:disable-next-line:variable-name
    public post_type: any[];

    public proxy: object;
}

export default UserDto;
