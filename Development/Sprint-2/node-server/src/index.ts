import { Context, Hono } from "hono";
import record_crud from "@routers/record-crud";
import collection_crud from "@routers/collection-crud";
import admin_ui from "@routers/admin-ui"; 
import mail from "@routers/mail";
// import auth from "@routers/auth";
import { cors } from "hono/cors";
import { logConsole } from "./middleware/log-console";
import { Initialize } from "./core/init";
import { serve } from "@hono/node-server";


(async () => {
	await Initialize(); //initialize all the system defined parameters and collections
  console.log(`Server started on port 3690`)
})(); //IIFE

const app = new Hono().basePath("/api");

app.use("*", logConsole);
app.use("*", cors());

app.get("/", async (c: Context) => {
	return c.text("Hello World");
});

app.route("/record", record_crud);
app.route("/collections", collection_crud);
app.route("/admin_ui", admin_ui);
app.route("/mail", mail);
// app.route("/auth", auth);


// sendEmail("<EMAIL>", "Hello", "Hello World");

serve({
	port: 3690,
	fetch: app.fetch,
});