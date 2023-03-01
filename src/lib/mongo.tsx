import { MongoClient } from "mongodb";
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
  colName: CollectionName
) => {
  try {
    const client = await connectToDatabase();
    const database = client.db(dbName);
    const collection = database.collection(colName);
    const res = await collection.find().toArray();

    const itemsList = res.map((child) => ({
      ...child,
      _id: child._id.toString(),
      id: child._id.toString(),
    }));

    return itemsList;
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};
