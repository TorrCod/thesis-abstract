import { UserDetails } from "@/context/types.d";
import { MongoClient, ObjectId } from "mongodb";
import { CollectionName, DatabaseName } from "./types";

const DB_CONNECTION =
  "mongodb+srv://torrcod:cSnQY7wi4ztWG7rJ@cluster0.yfqhgfs.mongodb.net/?retryWrites=true&w=majority";

export async function connectToDatabase() {
  const client = new MongoClient(DB_CONNECTION);
  await client.connect();
  return client;
}

export const getData = async (
  dbName: DatabaseName,
  colName: CollectionName,
  option?: Record<string, any>
) => {
  try {
    const client = await connectToDatabase();
    const database = client.db(dbName);
    const collection = database.collection(colName);
    const res = await collection.find(option?.option).toArray();
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
    const res = await collection.insertOne(payload);
    return res;
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};

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
    return res;
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};
