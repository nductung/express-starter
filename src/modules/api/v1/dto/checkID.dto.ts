import {IsMongoId} from 'class-validator';

class IDDto {
    @IsMongoId()
    public id!: string;
}

export default IDDto;
