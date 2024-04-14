import { Context, Hono } from "hono";
import { ServerWebSocket, serve } from "bun";
import record_crud from "@routers/record-crud";
import collection_crud from "@routers/collection-crud";
import admin_ui from "@routers/admin-ui"; 
import mail from "@routers/mail";
import auth from "@routers/auth";
import files from "@routers/files"
import rules from "@routers/rules";
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
import { serveStatic } from 'hono/bun'
import { parseAuthHeader } from "./middleware/parseAuthHeader";
import { checkApiPermissions } from "./middleware/checkRequestPermissions";
  
(async () => {
  await Initialize(); //initialize all the system defined parameters and collections
  console.log("\x1b[34m    ___________   ____  ___   _____ ______");
  console.log("   / ____/__  /  / __ )/   | / ___// ____/");
  console.log("  / __/    / /  / __  / /| | \__ \/ __/   ");
  console.log(" / /___   / /__/ /_/ / ___ |___/ / /___   ");
  console.log("/_____/  /____/_____/_/  |_/____/_____/   ");
  console.log("                                          ");
  console.log('\x1b[37mThe admin UI is available at:', "\x1b[4mhttp://localhost:3690/api/index.html");
  console.log('\x1b[0m');
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

app.get('/*', serveStatic({
  root: 'dist',
  rewriteRequestPath(path) {
    if (path.endsWith('.js') || path.endsWith('.css')) {
      path = path.replace("/api/", "/").replace("/api/", "/");
    } else {
      path = path.replace("/api", "/");
    }
    return path;
  },
}))


process.env.DEV ? app.use("*", logConsoleDev): app.use("*", logConsoleProd)

app.use("*", parseAuthHeader);
app.use("*", checkApiPermissions);

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
app.route("/rules", rules);


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
