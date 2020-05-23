import {IsString} from 'class-validator';

class CategoryDto {

    @IsString()
    public name: string;

}

export default CategoryDto;
