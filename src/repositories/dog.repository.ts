import {injectable} from "tsyringe";
import {DynamodbClient} from "@pristine-ts/aws";
import {DogModel} from "../models/dog.model";

@injectable()
export class DogRepository {
    constructor(private readonly dynamodbClient: DynamodbClient) {}

    public create(dog: DogModel): Promise<DogModel> {
        dog.createdAt = new Date();
        dog.updatedAt = new Date();
        return this.dynamodbClient.create(dog);
    }

    public async update(dog: DogModel): Promise<DogModel> {
        dog.updatedAt = new Date();
        dog = await this.dynamodbClient.update(dog);
        return dog
    }

    public get(dogId: string): Promise<DogModel> {
        return this.dynamodbClient.get(DogModel, {id: dogId});
    }

    public delete(dogId: string): Promise<void> {
        return this.dynamodbClient.delete(DogModel, {id: dogId});
    }

    public list(): Promise<DogModel[]> {
        return this.dynamodbClient.list(DogModel);
    }

    public async findByRace(race: string): Promise<DogModel[]>{
        return this.dynamodbClient.findBySecondaryIndex(DogModel, {race}, 'raceIndex');
    }

    public async findByOwner(ownerId: string): Promise<DogModel[]>{
        return this.dynamodbClient.findBySecondaryIndex(DogModel, {ownerId}, 'ownerIdIndex');
    }
}
