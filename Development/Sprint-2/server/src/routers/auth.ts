import { Context, Hono } from "hono";
import { setCookie } from "hono/cookie";
import createAdmin from "@src/utils/auth/admin/createAdmin";
import { getCollection } from "@src/utils/getCollection";
import checkAdminExists from "@src/utils/auth/admin/checkAdminExists";
import checkLoginValid from "@src/utils/auth/admin/checkLoginValid";

const auth = new Hono();

auth.post("/admin/create", async (c: Context) => {
	try {
		const { email, password } = await c.req.json();

		if (!email || !password) throw new Error("Invalid email or password");

		const admin = await createAdmin(email, password);

		if (!admin) throw new Error("Failed to create admin");

		setCookie(c, "admin", JSON.stringify(email), {
			httpOnly: true,
			secure: true,
			sameSite: "Strict",
			maxAge: 60 * 60 * 24 * 7,
		});
		return c.json({ error: null, data: admin });
	} catch (error) {
		console.log(error);

		return c.json({ error, data: null });
	}
	return c.text("Create admin");
});

auth.get("/admin", async (c: Context) => {
	try {
		// check if an admin exists
		const admin: boolean = await checkAdminExists();

		return c.json({ error: null, data: admin });
	} catch (error) {}
	return c.text("Get admin");
});

auth.post("/admin/delete", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Delete admin");
});

auth.post("/admin/login", async (c: Context) => {
	try {
		const { email, password } = await c.req.json();

		if (!email || !password) throw new Error("Invalid email or password");

		// check if an admin exists
		const loginValid: boolean | string = await checkLoginValid(email, password);

		console.log(loginValid);

		return c.json({ error: null, data: loginValid });
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
