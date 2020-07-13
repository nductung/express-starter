import {IsMongoId, IsNotEmpty} from 'class-validator';

class IDDto {

    @IsMongoId()
    @IsNotEmpty()
    public id!: string;

}

export default IDDto;
