import { UserDetails } from "@/context/types.d"

export type CollectionName = "thesis-items"|"user"|"admin"|"profiles"|"pdf-files"

export type DatabaseName = "thesis-abstract"|"accounts"

export type MongoDetails = {
    databaseName:DatabaseName,
    collectionName:CollectionName
}

export type QueryPost = {
    mongoDetails: MongoDetails;
    data: any;
    query: Record<string, unknown>;
}