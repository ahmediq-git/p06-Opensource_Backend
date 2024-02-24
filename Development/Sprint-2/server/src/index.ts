import { Context, Hono } from "hono";
import record_crud from "@routers/record-crud";
import collection_crud from "@routers/collection-crud";
import auth from "@routers/auth";
import files from "@routers/files"
import { cors } from "hono/cors";
import { logConsole } from "./middleware/log-console";
import { Initialize } from "./core/init";
import { serveStatic } from "hono/bun"

(async () => {
	await Initialize(); //initialize all the system defined parameters and collections
})(); //IIFE

const app = new Hono().basePath("/api");

app.use("*", logConsole);
app.use("*", cors());
app.get("/", async (c: Context) => {
	return c.text("Hello world");
});
app.use(
	"/static/*",
	serveStatic({
	  path: "../files",
	  onNotFound: (path, c) => {
		console.log(`${path} is not found, you access ${c.req.path}`);
	  },
	})
  );
app.route("/record", record_crud);
app.route("/collections", collection_crud);
app.route("/auth", auth);
app.route("/files", files)



export default {
	port: 3690,
	fetch: app.fetch,
};
