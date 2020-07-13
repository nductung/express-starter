import {IsMongoId, IsNotEmpty} from 'class-validator';

class IDDto {

    @IsNotEmpty()
    @IsMongoId()
    public id!: string;
}

export default IDDto;
