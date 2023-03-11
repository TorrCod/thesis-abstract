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

export interface GeneratedTextRes {
    data: {
      err: any;
      fields: {
        uid: string;
        text: {
          hash: string;
          text_pages: string[];
          single_page_pdf_file_paths: string[];
        };
        pdf_path: string;
      };
    };
    files: {
      file: {
        size: number;
        filepath: string;
        newFilename: string;
        mimetype: string;
        mtime: string;
        originalFilename: string;
      };
    };
  }