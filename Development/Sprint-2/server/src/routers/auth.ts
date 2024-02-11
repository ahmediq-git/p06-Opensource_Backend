import { Context, Hono } from "hono";
import { setCookie} from 'hono/cookie'

const auth = new Hono();

auth.post("/admin/create", async (c: Context) => {
	try {
		const { username, password } = await c.req.json();

		const admin = await createAdmin(username, password);

		if (!admin) throw new Error("Failed to create admin");

		return setCookie
	} catch (error) {
		console.log(error);

		return c.json({ error, data: null });
	}
	return c.text("Create admin");
});

auth.post("/admin/delete", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Delete admin");
});

auth.post("/admin/login", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Admin login");
});

auth.post("/admin/logout", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Admin logout");
});

auth.post("/user/create", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Create user");
});

auth.post("/user/delete", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Delete user");
});

auth.post("/user/login", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("User login");
});

auth.post("/user/logout", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("User logout");
});

auth.post("/user/update", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Update user");
});

auth.post("/user/reset-password", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Reset user password");
});

auth.post("/user/forgot-password", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Forgot user password");
});

auth.post("/user/verify", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Verify user");
});

auth.post("/user/verify-email", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Verify user email");
});

auth.get("/user/:id", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Get user");
});

auth.get("/admin/:id", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Get admin");
});

auth.get("/admins", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Get all admins");
});

auth.get("/users", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Get all users");
});

export default auth;
