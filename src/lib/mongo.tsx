import { ThesisItems } from "@/context/types.d";
import { Collection, Db, MongoClient } from "mongodb";

const DB_CONNECTION =
  "mongodb+srv://torrcod:cSnQY7wi4ztWG7rJ@cluster0.yfqhgfs.mongodb.net/?retryWrites=true&w=majority";

export async function connectToDatabase() {
  const client = new MongoClient(DB_CONNECTION);
  await client.connect();
  return client;
}
