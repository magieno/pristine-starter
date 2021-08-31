import {injectable} from "tsyringe";
import {DogRepository} from "../repositories/dog.repository";
import {DogCreationOrUpdateOptionsMapper} from "../options-mappers/dog.creation-or-update-options-mapper";
import {DogCreationOrUpdateOptions} from "../options/dog.creation-or-update-options";
import {DogModel} from "../models/dog.model";

@injectable()
export class DogProcessor {
    constructor(
        private readonly dogRepository: DogRepository,
        private readonly dogCreationOrUpdateOptionsMapper: DogCreationOrUpdateOptionsMapper,
    ) {
    }

    async create(dogCreationOrUpdateOptions: DogCreationOrUpdateOptions): Promise<DogModel>{
        const dog = await this.dogCreationOrUpdateOptionsMapper.map(dogCreationOrUpdateOptions);
        return this.dogRepository.create(dog);
    }

    async update(dog: DogModel, dogCreationOrUpdateOptions: DogCreationOrUpdateOptions): Promise<DogModel>{
        dog = await this.dogCreationOrUpdateOptionsMapper.map(dogCreationOrUpdateOptions, dog);
        return this.dogRepository.update(dog);
    }
}
