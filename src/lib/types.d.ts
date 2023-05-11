import { UserDetails } from "@/context/types.d"
import NextAuth, { DefaultSession } from "next-auth"

export type CollectionName = "thesis-items"|"user"|"admin"|"profiles"|"pdf-files"|"pending"|"deleted-thesis"|"activity-log"

export type DatabaseName = "thesis-abstract"|"accounts"

export type MongoDetails = {
    databaseName:DatabaseName,
    collectionName:CollectionName
}

export type AddPost = {
  dbName:DatabaseName;
  colName:CollectionName;
  payload:any;
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

export type ActivitylogReason = | "added a thesis" | "removed a thesis"| "restored a thesis" | "invited an admin" | "accepted the invite" | "removed an admin" | "removed an invite"

export type _Socket =Promise< {
  subscribe: (name: string, callback: (changeStream: any) => Promise<void> | void) => void;
  unsubscribe: () => void;
}>

import type { Server as HTTPServer } from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket as NetSocket } from 'net'
import type { Server as IOServer } from 'socket.io'

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

export type SocketOnEvent =
  | "acknowledged"
  | "change/account-update"
  | "change/thesis-update"
  | "change/activitylog-update";

export type SocketEmitEvent =
  | "account-update"
  | "thesis-update"
  | "activitylog-update";

  interface ServerToClientEvents {
    'change/thesis-update':() => void
    'change/account-update':() => void
    'change/activitylog-update':() => void
    'acknowledged':() => void
  }

  interface ClientToServerEvents {
    'thesis-update':() => void
    'account-update':() => void
    'activitylog-update':() => void
  }
  
  interface ClientToServerEvents {
    hello: () => void;
  }

  declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
      user: {
        /** The user's postal address. */
        address: string
      } & DefaultSession["user"]
      customClaims:{role:string}
      customToken:string
    }
  }