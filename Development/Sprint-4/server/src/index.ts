import { Context, Hono } from "hono";
import { ServerWebSocket, serve } from "bun";
import record_crud from "@routers/record-crud";
import collection_crud from "@routers/collection-crud";
import admin_ui from "@routers/admin-ui"; 
import mail from "@routers/mail";
import auth from "@routers/auth";
import files from "@routers/files"
import { cors } from "hono/cors";
import { logConsoleDev, logConsoleProd } from "./middleware/log-console";
import { Initialize } from "./core/init";
import { Socket } from "socket.io";
import functions from "./routers/functions";
import stress from "./routers/stress_test";
import schema from "./routers/schema";
import index from "./routers/indexing";
import {io, broadcastRecord} from "./realtime/init";
import { EventEmitter } from "node:events";


import { parseAuthHeader } from "./middleware/parseAuthHeader";

(async () => {
  await Initialize(); //initialize all the system defined parameters and collections
})(); //IIFE

export const app = new Hono().basePath("/api");

app.use("*", cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT', 'PATCH'],
  exposeHeaders: ['*'],
  maxAge: 600,
  credentials: false
}));

process.env.DEV ? app.use("*", logConsoleDev): app.use("*", logConsoleProd)

app.use("*", parseAuthHeader);

app.get("/", async (c: Context) => {
  
  return c.text("Hello world");
});

app.route("/record", record_crud);
app.route("/collections", collection_crud);
app.route("/admin_ui", admin_ui);
app.route("/mail", mail);
app.route("/auth", auth);
app.route("/files", files);
app.route("/functions", functions);
app.route("/stress", stress);
app.route("/schema", schema);
app.route("/index", index);


io.listen(3691);

type Subscription = {
  socket: Socket;
  collection: string;
  query: any;
}

type Subscriptions = {
  [collection: string]: Subscription[];
};

const subscriptions: Subscriptions = {};

export const sse = new EventEmitter();

sse.on('broadcastRecord', (data) => {
  const {collection_name, record} = data;
  broadcastRecord(collection_name, record);
});

export default {
  port: process.env.PORT || 3690,
  fetch: app.fetch,
  subscriptions
};
