import {IsOptional, IsString} from 'class-validator';

class ChangeInformationDto {

    @IsOptional()
    @IsString()
    public firstName: string;

    @IsOptional()
    @IsString()
    public lastName: string;

    @IsOptional()
    @IsString()
    public picture: string;

}

export default ChangeInformationDto;
