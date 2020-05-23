import {IsArray} from 'class-validator';

class CommentDto {

    @IsArray()
    public comments: any[];

    @IsArray()
    // tslint:disable-next-line:variable-name
    public group_id: string;

    public gender: number;

    public attitude: string;

}

export default CommentDto;
