import { UserDetails } from "@/context/types.d";
import { ChangeStreamDocument, Filter, MongoClient, ObjectId } from "mongodb";
import { useEffect } from "react";
import { CollectionName, DatabaseName, QueryPost } from "./types";

let CONNECTION = process.env["MONGO_URI"] ?? "mongodb://localhost:27017";

export async function connectToDatabase() {
  try {
    let client = new MongoClient(CONNECTION);
    await client.connect();
    return client;
  } catch (e) {
    console.error(e);
    throw new Error((e as Error).message);
  }
}

export const getData = async (
  dbName: DatabaseName,
  colName: CollectionName,
  query?: Filter<Document | {}>,
  option?: { deleteAfterGet: boolean }
) => {
  try {
    const client = await connectToDatabase();
    const database = client.db(dbName);
    const collection = database.collection(colName);
    const res = await collection.find(query ?? {}).toArray();
    if (option?.deleteAfterGet && res.length) {
      await collection.deleteOne({ _id: res[0]._id });
    }
    client.close();
    return res;
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};

export const addData = async (
  dbName: DatabaseName,
  colName: CollectionName,
  payload: any
) => {
  try {
    const client = await connectToDatabase();
    const database = client.db(dbName);
    const collection = database.collection(colName);
    const _id = new ObjectId();
    payload._id = _id;
    payload.id = _id.toString();
    const res = await collection.insertOne(payload);
    client.close();
    return res;
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};

export const deleteData = async (
  dbName: DatabaseName,
  colName: CollectionName,
  query: Filter<{ _id: ObjectId }>
) => {
  try {
    const client = await connectToDatabase();
    const database = client.db(dbName);
    const collection = database.collection(colName);
    const res = await collection.deleteOne(query, undefined);
    client.close();
    return res;
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};

export const updateData = async (
  dbName: DatabaseName,
  colName: CollectionName,
  query: Filter<{ _id: ObjectId }>,
  data: Record<string, any>
) => {
  try {
    const client = await connectToDatabase();
    const database = client.db(dbName);
    const collection = database.collection(colName);
    const res = await collection.updateOne(
      query,
      { $set: data },
      { upsert: true }
    );
    client.close();
    return res;
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};

// export const deleteData = async (queryPost: QueryPost) => {
//   try {
//     const client = await connectToDatabase();
//     const database = client.db(queryPost.mongoDetails.databaseName);
//     const collection = database.collection(
//       queryPost.mongoDetails.collectionName
//     );
//     if (queryPost.query["_id"]) {
//       queryPost.query["_id"] = new ObjectId(queryPost.query["_id"] as string);
//     }
//     const res = await collection.deleteOne(queryPost.query);
//     client.close();
//     return res;
//   } catch (e) {
//     console.error(e);
//     throw new Error(e as string).message;
//   }
// };

export const generateId = (items: any[]) =>
  items.map((child) => ({
    ...child,
    _id: child._id.toString(),
    id: child._id.toString(),
  }));

export const updateUser = async (userDetails: UserDetails) => {
  try {
    const dbName: DatabaseName = "accounts";
    const colName: CollectionName = "user";
    const client = await connectToDatabase();
    const database = client.db(dbName);
    const collection = database.collection(colName);
    userDetails["_id"] = new ObjectId(userDetails["_id"]);
    const res = await collection.replaceOne(
      { uid: userDetails.uid },
      userDetails
    );
    client.close();
    return res;
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};

/**
 * This function adds two numbers together.
 * @param timer Timer in seconds.
 * @param dbName Database name.
 * @param colName Collection name.
 * @returns Insert Result.
 */
export const addDataWithExpiration = async (
  dbName: DatabaseName,
  colName: CollectionName,
  payload: Record<string, unknown>,
  timer?: number
) => {
  try {
    const client = await connectToDatabase();
    const database = client.db(dbName);
    const collection = database.collection(colName);
    const dateNow = new Date();
    await collection.createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: timer ?? 3600 }
    );
    const insertedResult = await collection.insertOne({
      ...payload,
      createdAt: dateNow,
      expireAfterSeconds: timer ?? 3600,
    });
    client.close();
    return { insertedResult, dateNow };
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};

export const watchUser = async (
  onChange: (changeStream: ChangeStreamDocument) => void
) => {
  try {
    const dbName: DatabaseName = "accounts";
    const client = await connectToDatabase();
    const database = client.db(dbName);
    const changeStream = database.watch();
    changeStream.on("change", (change) => {
      onChange(change);
    });
  } catch (e) {
    console.log("watch user failed");
    console.error(e);
  }
};

export const watchThesisAbstract = async (
  onChange: (changeStream: ChangeStreamDocument) => void
) => {
  try {
    const dbName: DatabaseName = "thesis-abstract";
    const client = await connectToDatabase();
    const database = client.db(dbName);
    const changeStream = database.watch();
    changeStream.on("change", (change) => {
      onChange(change);
    });
  } catch (e) {
    console.log("watch thesis items failed");
    console.error(e);
  }
};

export const isAuthenticated = async (uid: string) => {
  try {
    const user = await getData("accounts", "user", { uid: uid });
    return user;
  } catch (e) {
    console.error(e);
    throw new Error((e as Error).message);
  }
};
