import { AnyBulkWriteOperation, BulkWriteResult, Collection, Db, DeleteResult, Document, Filter, FindCursor, FindOptions, InsertManyResult, InsertOneResult, MongoClient, UpdateFilter, UpdateResult, WithId } from "mongodb";

export default class Mongodb {
    database!: Db;

    constructor(private readonly client: MongoClient, private readonly databaseName: string) {
        this.database = this.client.db(this.databaseName);
    }


    close = async (): Promise<void> => {
        await this.client.close();
    }

    connect = async (): Promise<void> => {
        await this.client.connect();
    }

    collection<T extends Document>(name: string): Collection<T> {
        return this.database.collection<T>(name);
    }

    insertOne = async (collectionName: string, doc: Document): Promise<InsertOneResult<Document>> => {
        const collection = this.database.collection(collectionName);
        const result = await collection.insertOne(doc);
        return result;
    }

    insertMany = async (collectionName: string, docs: Document[]): Promise<InsertManyResult<Document>> => {
        const collection = this.database.collection(collectionName);
        const result = await collection.insertMany(docs);
        return result;
    }

    bulkWrite = async (collectionName: string, data: AnyBulkWriteOperation<Document>[]): Promise<BulkWriteResult> => {
        const collection = this.database.collection(collectionName);
        const result = await collection.bulkWrite(data);
        return result;
    }

    findOne = async <T>(collectionName: string, filter: Filter<T>, options?: FindOptions): Promise<T | null> => {
        const collection = this.database.collection(collectionName);
        const result = await collection.findOne<T>(filter, options);
        return result;
    }

    find = <T>(collectionName: string, filter: Filter<T>, options?: FindOptions): FindCursor<WithId<Document>> => {
        const collection = this.database.collection(collectionName);
        const result = collection.find(filter, options);
        return result;
    }

    updateOne = async <T>(collectionName: string, filter: Filter<T>, update: UpdateFilter<T>): Promise<UpdateResult> => {
        const collection = this.database.collection(collectionName);
        const result = await collection.updateOne(filter, update);
        return result;
    }

    updateMany = async <T>(collectionName: string, filter: Filter<T>, update: UpdateFilter<Document>): Promise<UpdateResult | Document> => {
        const collection = this.database.collection(collectionName);
        const result = await collection.updateMany(filter, update);
        return result;
    }

    deleteOne = async <T>(collectionName: string, filter: Filter<T>): Promise<DeleteResult> => {
        const collection = this.database.collection(collectionName);
        const result = await collection.deleteOne(filter);
        return result;
    }

    deleteMany = async <T>(collectionName: string, filter: Filter<T>): Promise<DeleteResult> => {
        const collection = this.database.collection(collectionName);
        const result = await collection.deleteMany(filter);
        return result;
    }
}