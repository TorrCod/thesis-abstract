import { ThesisItems } from "@/context/types.d";
import { Collection, Db, MongoClient } from "mongodb";

const DB_CONNECTION =
  "mongodb+srv://torrcod:cSnQY7wi4ztWG7rJ@cluster0.yfqhgfs.mongodb.net/?retryWrites=true&w=majority";
// const DB_NAME = "thesis-abstract";
// const DB_COLLECTION_NAME = "thesis-items";

export async function connectToDatabase() {
  const client = new MongoClient(DB_CONNECTION);
  // const thesisItems: { data?: ThesisItems[] } = {};
  await client.connect();

  // const db = client.db(DB_NAME);

  // const db_collection: Collection = db.collection(DB_COLLECTION_NAME);

  // thesisItems.data = db_collection as unknown as ThesisItems[];

  // console.log(
  //   `Successfully connected to database: ${db.databaseName} and collection: ${db_collection.collectionName}`
  // );

  return client;
}
