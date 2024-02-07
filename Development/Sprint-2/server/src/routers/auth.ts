import { Context, Hono } from "hono";

const auth = new Hono();

auth.get("/", async (c: Context) => {
	try {
		
	} catch (error) {
		
	}
	return c.text("Get all auth");
});

auth.post("/new", async (c: Context) => {
	return c.text("New collection");
});

export default auth;
