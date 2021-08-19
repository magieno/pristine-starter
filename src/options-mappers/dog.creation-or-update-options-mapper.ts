import {injectable} from "tsyringe";
import {DogCreationOrUpdateOptions} from "../options/dog.creation-or-update-options";
import {DogModel} from "../models/dog.model";
import {OptionsMapperInterface} from "@pristine-ts/core";

@injectable()
export class DogCreationOrUpdateOptionsMapper implements OptionsMapperInterface<DogCreationOrUpdateOptions, DogModel> {

    public async map(dogCreationOrUpdateOptions: DogCreationOrUpdateOptions, onObject?: DogModel): Promise<DogModel> {
        const dogModel: DogModel = onObject ?? new DogModel();

        dogModel.name = dogCreationOrUpdateOptions.name ?? dogModel.name;
        dogModel.race = dogCreationOrUpdateOptions.race ?? dogModel.race;

        return dogModel;
    }

    reverseMap(model?: DogModel, onOptions?: DogCreationOrUpdateOptions): Promise<DogCreationOrUpdateOptions> {
        return Promise.resolve(new DogCreationOrUpdateOptions());
    }
}
