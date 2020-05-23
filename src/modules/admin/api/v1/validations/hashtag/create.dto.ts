import {IsString} from 'class-validator';

class HashtagDto {

    @IsString()
    public name: string;

}

export default HashtagDto;
