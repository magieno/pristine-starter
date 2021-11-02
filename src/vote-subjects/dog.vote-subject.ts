import {DogCreationOrUpdateOptions} from "../options/dog.creation-or-update-options";
import {DogModel} from "../models/dog.model";

export class DogVoteSubject {

    constructor(
        public readonly ownerId?: string,
        public readonly options?: DogCreationOrUpdateOptions,
        public readonly model?: DogModel,
    ) { }
}
