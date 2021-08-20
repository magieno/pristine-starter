import {IsOptional, IsString} from "class-validator";

export class DogCreationOrUpdateOptions {
    @IsOptional()
    @IsString()
    name?: string;
    @IsOptional()
    @IsString()
    race?: string;
}
