import {IsString, IsUrl} from 'class-validator';

class PostDto {

    @IsUrl()
    public image: string;

    @IsString()
    public caption: string;

    public gender: number;

    public hashtags: any[];

    public categories: any[];
}

export default PostDto;
