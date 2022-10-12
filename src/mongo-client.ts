import { AnyBulkWriteOperation, BulkWriteResult, Collection, Db, DeleteResult, Document, Filter, FindCursor, FindOptions, InsertManyResult, InsertOneResult, MongoClient, OptionalUnlessRequiredId, Timestamp, UpdateFilter, UpdateResult, WithId } from "mongodb";
import LoggerClient from "./logger-client";

export default class Mongodb {
    database!: Db;

    constructor(private readonly client: MongoClient, private readonly databaseName: string, private readonly logger: LoggerClient) {
        this.database = this.client.db(this.databaseName);
    }

    close = async (): Promise<void> => {
        this.logger.time("close mongodb server");
        this.logger.debug("Closing the client to the mongodb server")
        await this.client.close();
        this.logger.debug("Closed successfully to mongodb server")
        this.logger.timeEnd("close mongodb server");
    }

    connect = async (): Promise<void> => {
        this.logger.time("connect mongodb server");
        this.logger.debug("Connecting the client to the mongodb server")
        await this.client.connect();
        this.logger.debug("Connected successfully to mongodb server")
        this.logger.timeEnd("connect mongodb server");

    }

    collection<T extends Document>(name: string): Collection<T> {
        return this.database.collection<T>(name);
    }

    insertOne = async <T>(collectionName: string, doc: OptionalUnlessRequiredId<T>): Promise<InsertOneResult<Document>> => {
        this.logger.time("insert document");
        const collection = this.database.collection(collectionName);
        const result = await collection.insertOne(doc);
        this.logger.debug(`A document was inserted with the _id: ${result.insertedId}`, { collection: collectionName, ...doc });
        this.logger.timeEnd("insert document");
        return result;
    }

    insertMany = async (collectionName: string, docs: Document[]): Promise<InsertManyResult<Document>> => {
        this.logger.time("insert many documents");
        const collection = this.database.collection(collectionName);
        const result = await collection.insertMany(docs);
        this.logger.debug(`${result.insertedCount} documents were inserted`, { collection: collectionName, ...docs });
        this.logger.timeEnd("insert many documents");
        return result;
    }

    bulkWrite = async (collectionName: string, data: AnyBulkWriteOperation<Document>[]): Promise<BulkWriteResult> => {
        this.logger.time("bulk write documents");
        const collection = this.database.collection(collectionName);
        const result = await collection.bulkWrite(data);
        this.logger.debug(`${result.insertedCount} documents were inserted`, { collection: collectionName, ...data });
        this.logger.timeEnd("bulk write documents");
        return result;
    }

    findOne = async <T>(collectionName: string, filter: Filter<T>, options?: FindOptions): Promise<T | null> => {
        this.logger.time("find a document");
        const collection = this.database.collection(collectionName);
        this.logger.debug(`find a document`, { collection: collectionName, query: filter });
        const result = await collection.findOne<T>(filter, options);
        this.logger.timeEnd("find a document");
        return result;
    }

    find = <T>(collectionName: string, filter: Filter<T>, options?: FindOptions): FindCursor<WithId<Document>> => {
        this.logger.time("find documents");
        const collection = this.database.collection(collectionName);
        this.logger.debug(`find a document`, { collection: collectionName, query: filter });
        const result = collection.find(filter, options);
        this.logger.timeEnd("find documents");
        return result;
    }

    updateOne = async <T>(collectionName: string, filter: Filter<T>, update: UpdateFilter<T>): Promise<UpdateResult> => {
        this.logger.time("update a document");
        const collection = this.database.collection(collectionName);
        const result = await collection.updateOne(filter, update);
        this.logger.debug(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`, { collection: collectionName, query: filter, update: update })
        this.logger.timeEnd("update a document");
        return result;
    }

    updateMany = async <T>(collectionName: string, filter: Filter<T>, update: UpdateFilter<Document>): Promise<UpdateResult | Document> => {
        this.logger.time("update documents");
        const collection = this.database.collection(collectionName);
        const result = await collection.updateMany(filter, update);
        this.logger.debug(`Updated ${result.modifiedCount} documents`, { collection: collectionName, query: filter, update: update })
        this.logger.timeEnd("update documents");
        return result;
    }

    deleteOne = async <T>(collectionName: string, filter: Filter<T>): Promise<DeleteResult> => {
        this.logger.time("delete a document");
        const collection = this.database.collection(collectionName);
        const result = await collection.deleteOne(filter);
        if (result.deletedCount === 1) {
            this.logger.debug("Successfully deleted one document.", { collection: collectionName, query: filter });
        } else {
            this.logger.debug("No documents matched the query. Deleted 0 documents.", { collection: collectionName, query: filter });
        }
        this.logger.timeEnd("delete a document");
        return result;
    }

    deleteMany = async <T>(collectionName: string, filter: Filter<T>): Promise<DeleteResult> => {
        this.logger.time("delete documents");
        const collection = this.database.collection(collectionName);
        const result = await collection.deleteMany(filter);
        this.logger.debug("Deleted " + result.deletedCount + " documents", { collection: collectionName, query: filter });
        this.logger.timeEnd("delete documents");
        return result;
    }
}