import {IsString} from 'class-validator';

class ProxyDto {

    @IsString()
    public address: string;

    public country: string;
}

export default ProxyDto;
