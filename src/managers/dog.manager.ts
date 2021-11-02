import {injectable} from "tsyringe";
import {DogRepository} from "../repositories/dog.repository";
import {DogModel} from "../models/dog.model";
import {DogCreationOrUpdateOptions} from "../options/dog.creation-or-update-options";
import {DogProcessor} from "../processors/dog.processor";

@injectable()
export class DogManager {
    constructor(private readonly dogRepository: DogRepository,
                private readonly dogProcessor: DogProcessor,
    ) {
    }

    list(): Promise<DogModel[]>{
        return this.dogRepository.list();
    }

    get(id: string): Promise<DogModel>{
        return this.dogRepository.get(id);
    }

    listForRace(race: string): Promise<DogModel[]>{
        return this.dogRepository.findByRace(race);
    }

    create(ownerId: string, dogCreationOrUpdateOptions: DogCreationOrUpdateOptions): Promise<DogModel>{
        return this.dogProcessor.create(ownerId, dogCreationOrUpdateOptions);
    }

    update(customer: DogModel, dogCreationOrUpdateOptions: DogCreationOrUpdateOptions): Promise<DogModel>{
        return this.dogProcessor.update(customer, dogCreationOrUpdateOptions);
    }
}
