import { Document, MongoClient } from "mongodb";
import { v4 as uuid } from "uuid";
import Mongodb from "../src/mongo-client";

const uri =
    "mongodb://dev:dev@localhost:27017";
const collection = "movies";
const database = "mongo-node";
const client = new Mongodb(new MongoClient(uri), database);

export interface IMDB {
    rating: number;
    votes: number;
    id: number;
}

export interface Movie {
    _id: string;
    title: string;
    year: number;
    released: Date;
    plot: string;
    type: "movie" | "series";
    imdb: IMDB;
}


const mockMovie = (): Movie => ({
    _id: uuid(),
    imdb: {
        id: 1,
        rating: 10,
        votes: 100
    },
    released: new Date(),
    title: "any",
    plot: "any",
    type: "movie",
    year: 100
})


beforeEach(async () => {
    await client.connect();
})

afterEach(async () => {
    await client.deleteMany(collection, {})
    await client.close();
})

it("should add a movie", async () => {
    const movie = mockMovie();
    const { _id } = movie;
    const { insertedId } = await client.insertOne(collection, movie);
    const result = await client.findOne<Movie>(collection, { _id });
    expect(insertedId).toBe(_id);
    expect(result).toEqual(movie);
})

it("should add movies", async () => {
    const count = 10;
    const movies = Array(count).fill(null).map(_ => mockMovie());
    const { insertedCount } = await client.insertMany(collection, movies);
    const result = client.find<Movie>(collection, {});
    const resultAll = await result.toArray();
    expect(insertedCount).toBe(count);
    expect(movies).toEqual(resultAll)

})

it("should return a movie", async () => {
    const movie = mockMovie();
    const { _id } = movie;
    await client.insertOne(collection, movie);
    const result = await client.findOne<Movie>(collection, { _id });
    expect(result).toEqual(movie);
})

it("should return movies", async () => {
    const count = 10;
    const movies = Array(count).fill(null).map(_ => mockMovie());
    await client.insertMany(collection, movies);
    const result = await (client.find<Movie>(collection, {})).toArray();
    expect(result).toEqual(movies)
})

it("should a updated movie", async () => {
    const movie = mockMovie();
    const { _id } = movie;
    await client.insertOne(collection, movie);
    const params: Movie = {
        _id,
        imdb: {
            id: 999,
            rating: 999,
            votes: 999
        },
        released: new Date(),
        title: "any_updated",
        plot: "any_updated",
        type: "series",
        year: 1999
    }
    await client.updateOne<Movie>(collection, { _id }, { $set: params });
    const result = await client.findOne<Movie>(collection, { _id });
    expect(result).toEqual(params)
})

it("should update movies", async () => {
    const count = 10;
    const movies = Array(count).fill(null).map(_ => mockMovie());
    await client.insertMany(collection, movies);
    const params = {
        imdb: {
            id: 999,
            rating: 999,
            votes: 999
        },
        released: new Date(),
        title: "any_updated",
        plot: "any_updated",
        type: "series",
        year: 1999
    }
    const moviesUpdtate = movies.map(({ _id }) => ({ _id, ...params }));
    await client.updateMany<Movie>(collection, {}, { $set: params });
    const result = await (client.find<Movie>(collection, {})).toArray();
    expect(result).toEqual(moviesUpdtate)
})

it("should delete a movie", async () => {
    const movie = mockMovie();
    const { _id } = movie;
    await client.insertOne(collection, movie);
    const { deletedCount } = await client.deleteOne<Movie>(collection, { _id });
    const result = await client.findOne(collection, { _id });
    const notFoundMovie = null;
    expect(deletedCount).toBe(1);
    expect(result).toBe(notFoundMovie);
})

it.only("should delete movies", async () => {
    const count = 10;
    const movies = Array(count).fill(null).map(_ => mockMovie());
    await client.insertMany(collection, movies);
    const { deletedCount } = await client.deleteMany<Movie>(collection, {});
    const result = await (client.find(collection, {})).toArray();
    const notFoundMovies: any = [];
    expect(deletedCount).toBe(count);
    expect(result).toStrictEqual(notFoundMovies);
})

