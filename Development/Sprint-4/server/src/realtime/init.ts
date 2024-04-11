import { Server, Socket } from "socket.io";
import app from "@src/index";
import sift from "sift";

type Subscription = {
  socket: Socket;
  collection: string;
  query: any;
};

export const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    credentials: false,
    allowedHeaders: ["*"],
    exposedHeaders: ["*"]
  },
  // transports: ['websocket']
});
io.use((socket, next) => {
  socket.request.headers["access-control-allow-origin"] = "*";
  // socket.request.headers('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  // socket.request.headers('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}
);

io.on("connection", (socket) => {

  socket.on("subscribe", (data) => {
    const { collection, query } = data;
    subscribe(socket, collection, query);
  });

  socket.on("unsubscribe", (data) => {
    const { collection } = data;
    unsubscribe(socket, collection);
  });

  socket.on("disconnect", (reason) => {
    for (const collection in app.subscriptions) {
      unsubscribe(socket, collection);
    }
  });
});

function subscribe(socket: Socket, collection: string, query: any): void {
  // Initialize the app.subscriptions array for the collection if it doesn't exist
  if (!app.subscriptions[collection]) {
    app.subscriptions[collection] = [];
  }


  const subscription: Subscription = {
    socket,
    collection,
    query,
  };


  app.subscriptions[collection].push(subscription);


  socket.emit("subscribed", { collection, query });
}

function unsubscribe(socket: Socket, collection: string): void {
  // Check if there are app.subscriptions for the collection
  if (app.subscriptions[collection]) {
    app.subscriptions[collection] = app.subscriptions[collection].filter(
      (sub) => sub.socket !== socket
    );

    // delete the key if no subscriber of collection
    if (app.subscriptions[collection].length === 0) {
      delete app.subscriptions[collection];
    }
  }
  socket.emit("unsubscribed", { collection });
}

export function broadcastRecord(collection: string, record: any): void {

  // todo: remove the client from app.subscriptions if the connection is broken
  try {
    if (app.subscriptions[collection]) {
      // Send the record to all subscribers
      //socket event name is the collection name so on sdk the call back of the collection is executed
      app.subscriptions[collection].forEach((sub) => {
        if (Object.keys(sub.query).length !== 0 ) {
            const test = sift(sub.query);
            if (!test(record)) {
                return;
            }
        }

        sub.socket.emit(`${collection}`, {
          collection,
          record,
        });
        return;
      });
    }
  } catch (err) {
    console.log(err);
  }
}
