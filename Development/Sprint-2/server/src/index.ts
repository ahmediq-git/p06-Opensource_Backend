import { Context, Hono } from "hono";
import record_crud from "@routers/record-crud";
import collection_crud from "@routers/collection-crud";
import admin_ui from "@routers/admin-ui"; 
import mail from "@routers/mail";
import auth from "@routers/auth";
import files from "@routers/files"
import { cors } from "hono/cors";
import { logConsoleDev, logConsoleProd } from "./middleware/log-console";
import { Initialize } from "./core/init";
import { Server, Socket } from "socket.io";

(async () => {
  await Initialize(); //initialize all the system defined parameters and collections
})(); //IIFE

export const app = new Hono().basePath("/api");

app.use("*", cors({
  origin: '*',
  allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT', 'PATCH'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}));

process.env.DEV ? app.use("*", logConsoleDev): app.use("*", logConsoleProd)

app.get("/", async (c: Context) => {
  return c.text("Hello world");
});

app.route("/record", record_crud);
app.route("/collections", collection_crud);
app.route("/admin_ui", admin_ui);
app.route("/mail", mail);
app.route("/auth", auth);
app.route("/files", files)

const io = new Server({cors: {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
}});

let subscriptions: any = {};

io.on("connection", (socket) => {
  console.log(`socket connected: ${socket.id}`);

  socket.on("subscribe", (msg) => {
    if (!subscriptions[msg]) {
      subscriptions[msg] = [];
    }
    subscriptions[msg].push(socket);
    io.emit("subscribed", msg);
  });

  socket.on("unsubscribe", (msg) => {
    if (subscriptions[msg]) {
      let index = subscriptions[msg].indexOf(`${socket}`);
      subscriptions[msg].splice(index, 1);
      io.emit("unsubscribed", msg);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`socket disconnected: ${socket.id} for ${reason}`);
    for (const collection in subscriptions) {
      subscriptions[collection] = subscriptions[collection].filter((subbed: Socket) => subbed !== socket);
    }
  });
});

io.listen(3691);

export default {
  port: 3690,
  fetch: app.fetch,
  io,
  subscriptions,
};
