import { Context, Hono } from "hono";
import { setCookie } from "hono/cookie";
import createAdmin from "@src/utils/auth/admin/createAdmin";
import { getCollection } from "@src/utils/getCollection";
import checkAdminExists from "@src/utils/auth/admin/checkAdminExists";
import checkLoginValid from "@src/utils/auth/admin/checkLoginValid";
import deleteAdmin from "@src/utils/auth/admin/deleteAdmin";
import getAdmins from "@src/utils/auth/admin/getAdmins";
import {
	createRecord,
	deleteRecord,
	readRecord,
} from "@src/controllers/record-crud";
import sign from "@src/utils/auth/sign";

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

auth.get("/admins", async (c: Context) => {
	try {
		// check if an admin exists
		const admins: boolean = await getAdmins();
		console.log(admins);

		return c.json({ error: null, data: admins });
	} catch (error) {}
	return c.text("Get all admins");
});

auth.delete("/admin/delete", async (c: Context) => {
	try {
		const { email } = await c.req.json();

		if (!email) throw new Error("Invalid email");

		const deleted = await deleteAdmin(email);

		if (!deleted) throw new Error("Failed to delete admin");

		return c.json({ error: null, data: deleted });
	} catch (error) {}
	return c.text("Delete admin");
});

auth.post("/admin/login", async (c: Context) => {
	try {
		const { email, password } = await c.req.json();

		if (!email || !password) throw new Error("Invalid email or password");

		// check if an admin exists
		const loginValid: boolean | string = await checkLoginValid(email, password);

		if (loginValid) {
			setCookie(c, "admin", JSON.stringify(email), {
				httpOnly: true,
				secure: true,
				sameSite: "Strict",
				maxAge: 60 * 60 * 24 * 7,
			});
		}

		return c.json({ error: null, data: loginValid });
	} catch (error) {}
	return c.text("Admin login");
});

auth.post("/admin/logout", async (c: Context) => {
	try {
		// remove the cookie1
		setCookie(c, "admin", "", {
			httpOnly: true,
			secure: true,
			sameSite: "Strict",
			maxAge: 0,
		});
		return c.json({ error: null, data: "Admin logged out" });
	} catch (error) {}
	return c.text("Admin logout");
});

auth.post("/user/create", async (c: Context) => {
	try {
		const details = await c.req.json();

		const { email, password } = details;

		if (!email || !password) throw new Error("Invalid email or password");

		// create collection like normal
		const record = await createRecord(
			{
				...details,
				password: await Bun.password.hash(password),
			},
			"users"
		);

		// remove password from details
		delete details.password;

		if (record?.password) {
			delete record.password;
		}

		return c.json({
			error: null,
			data: record,
		});
	} catch (error) {
		console.log(error);
		return c.json({ error, data: null });
	}
	return c.text("Create user");
});

auth.post("/user/delete", async (c: Context) => {
	try {
		const { id } = await c.req.json();

		if (!id) throw new Error("Invalid id");

		// delete the user
		const deleted = await deleteRecord({ _id: id }, { multi: false }, "users");

		if (!deleted) throw new Error("Failed to delete user");

		return c.json({ error: null, data: deleted });
	} catch (error) {}
	return c.text("Delete user");
});

auth.post("/user/login", async (c: Context) => {
	try {
		const body = await c.req.json();

		const { email, password } = body;

		if (!email || !password) {
			return c.json({ error: "Invalid email or password", data: null });
		}

		console.log(email, password);

		// check if an admin exists
		const user = await readRecord({ email }, "users");
		console.log(user);

		if (user?.length === 0) {
			return c.json({ error: "User does not exist", data: null });
		}

		const loginValid: boolean = await Bun.password.verify(
			password,
			user[0]?.password
		);
		console.log(loginValid);

		if (!loginValid) {
			return c.json({ error: "Invalid login", data: null });
		}

		// sign the token
		const token = await sign(user[0], process.env.USER_AUTH_KEY || "user_key");

		return c.json({
			error: null,
			data: {
				token,
				user: {
					...user[0],
					password: undefined,
				},
			},
		});
	} catch (error) {
		console.log(error);
		return c.json({ error, data: null });
	}
});

// TODO
auth.post("/user/reset-password", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Reset user password");
});

// TODO
auth.post("/user/forgot-password", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Forgot user password");
});

// TODO
auth.post("/user/verify", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Verify user");
});

// TODO
auth.post("/user/verify-email", async (c: Context) => {
	try {
	} catch (error) {}
	return c.text("Verify user email");
});

export default auth;
