import { Context, Hono } from "hono";
import { setCookie } from "hono/cookie";
import createAdmin from "@src/utils/auth/admin/createAdmin";
import { getCollection } from "@src/utils/getCollection";
import checkAdminExists from "@src/utils/auth/admin/checkAdminExists";
import getSettings from "@src/utils/misc/getSettings";
import checkLoginValid from "@src/utils/auth/admin/checkLoginValid";
import deleteAdmin from "@src/utils/auth/admin/deleteAdmin";
import getAdmins from "@src/utils/auth/admin/getAdmins";
import {
	createRecord,
	deleteRecord,
	readRecord,
} from "@src/controllers/record-crud";
import { fetchRules } from "@src/utils/rules/fetchRules";
import sign from "@src/utils/auth/sign";
import Database from "@src/database/database_handler";
import { OAuth2Client } from "google-auth-library";
import { html } from "hono/html";
import { constructRulesMemoryObject } from "@src/utils/rules/constructRulesMemoryObject";

const auth = new Hono();

auth.post("/admin/create", async (c: Context) => {
	try {
		const { email, password } = await c.req.json();

		if (!email || !password) throw new Error("Invalid email or password");

		const admin = await createAdmin(email, password);

		if (!admin) throw new Error("Failed to create admin");

		const payload = {
			email,
			role: 'admin',
			authenticated: true,
		}

		const token = await sign(payload, process.env.USER_AUTH_KEY || "user_key");

		// setCookie(c, "admin", JSON.stringify(email), {
		// 	httpOnly: true,
		// 	secure: true,
		// 	sameSite: "Strict",
		// 	maxAge: 60 * 60 * 24 * 7,
		// });
		return c.json({ error: null, data: token });
	} catch (error:any) {
		console.log(error);
		return c.json({ error: error.message, data: null },401);
	}
	return c.text("Create admin");
});

auth.get("/admin", async (c: Context) => {
	try {
		// check if an admin exists
		const admin: boolean = await checkAdminExists();
		return c.json({ error: null, data: admin });
	} catch (error:any) {
		return c.json({ error: error.message, data: null },401);
	}
	return c.text("Get admin");
});

auth.get("/admins", async (c: Context) => {
	try {
		// check if an admin exists
		const admins: boolean = await getAdmins();
		return c.json({ error: null, data: admins });
	} catch (error:any) {
		return c.json({ error: error.message, data: null },401);
	}
	return c.text("Get all admins");
});

auth.delete("/admin/delete", async (c: Context) => {
	try {
		const { email } = await c.req.json();

		if (!email) throw new Error("Invalid email");

		const deleted = await deleteAdmin(email);

		if (!deleted) throw new Error("Failed to delete admin");

		return c.json({ error: null, data: deleted });
	} catch (error:any) { 
		return c.json({ error: error.message, data: null },401);
	}
	return c.text("Delete admin");
});

auth.post("/admin/login", async (c: Context) => {
	try {
		const { email, password } = await c.req.json();

		if (!email || !password) throw new Error("Invalid email or password");

		// check if an admin exists
		const loginValid: boolean | string = await checkLoginValid(email, password);

		if (loginValid) {
			let payload = {
				email,
				role: 'admin',
				authenticated: true
			}
			const token = await sign(payload, process.env.USER_AUTH_KEY || "user_key");
			// setCookie(c, "admin", JSON.stringify(email), {
			// 	httpOnly: true,
			// 	secure: true,
			// 	sameSite: "Strict",
			// 	maxAge: 60 * 60 * 24 * 7,
			// });

			return c.json({ error: null, data: token });

		}

		return c.json({ error: null, data: loginValid });
	} catch (error:any) {
		return c.json({ error: error.message, data: null },401);
	}
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
	} catch (error) { }
	return c.text("Admin logout");
});

auth.post("/user/create", async (c: Context) => {
	try {
		const details = await c.req.json();

		const { email, password, user_metadata } = details;

		if (!email || !password) throw new Error("Invalid email or password");

		const user = await readRecord({ email }, "users");

		if (user.length !== 0) throw new Error("User already exists");

		const record: any = await createRecord(
			{
				...details,
				password: await Bun.password.hash(password),
			},
			"users"
		);
	
		delete details.password;

		if (record?.password) {
			delete record.password;
		}

		const token = await sign(record, process.env.USER_AUTH_KEY || "user_key");

		const rule_specification = await fetchRules()
		
		
		const rule: any = await createRecord(
			{
				email:email,
				permission: constructRulesMemoryObject(user_metadata, rule_specification.userRules, rule_specification.defaultRuleObject)
			},
			'user_rules'
		)

		return c.json({
			error: null,
			data: {
				token,
				user: record,
			},
		});

	} catch (error: any) {

		return c.json({ error: error.message, data: null }, 401);
	}
});

auth.post("/user/delete", async (c: Context) => {
	try {
		const { id } = await c.req.json();

		if (!id) throw new Error("Invalid id");

		const user = await readRecord({_id: id}, "users")
		const user_email: string = user[0]?.email
	
		// delete the user
		const deleted = await deleteRecord({ _id: id }, { multi: false }, "users");

		if (!deleted) throw new Error("Failed to delete user");

		const rules_deleted = await deleteRecord({email: user_email}, { multi: false }, "user_rules")

		if (!rules_deleted) throw new Error("Failed to delete user rules")

		return c.json({ error: null, data: deleted });

	} catch (error:any) {

		return c.json({ error: error.message, data: null },401);
	}
});

auth.post("/user/login", async (c: Context) => {
	try {
		 
		// console.log(c.get("Authorization"));
		const body = await c.req.json();

		const { email, password } = body;

		if (!email || !password) {
			return c.json({ error: "Invalid email or password", data: null });
		}

		// check if an admin exists
		const user = await readRecord({ email }, "users");

		if (user?.length === 0) {
			return c.json({ error: "User does not exist", data: null });
		}
		const loginValid: boolean = await Bun.password.verify(
			password,
			user[0]?.password
		);
		// console.log("is login valid",loginValid);

		if (!loginValid) {
			return c.json({ error: "Invalid login", data: null },401);
		}

		if (user[0]?.password) {
			delete user[0].password;
		}

		// sign the token
		const token = await sign(user[0], process.env.USER_AUTH_KEY || "user_key");
		console.log('TOKEN', token);
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
	} catch (error:any) {
		console.log("this ",error);
		return c.json({ error: error.message, data: null },401);
	}
});

auth.get("/oauth_redirect", async (c: Context) => {
  try {
    const { code } = c.req.query();
	const oauth = await getSettings("oauth");
	const application = await getSettings("application");
	console.log("app",application?.url )
    const oauth2Client = new OAuth2Client({
      clientId: oauth?.client_id,
      clientSecret: oauth?.client_secret,
      redirectUri: application.url+"/api/auth/oauth_redirect"
    });

    let token = (await oauth2Client.getToken(code)).tokens.id_token;
    if (token != null) {
      const user_data = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      const user = await readRecord({ email: user_data.email }, "users");
	  if (user.length !== 0) {
        const jwt = await sign(
          user[0],
          process.env.USER_AUTH_KEY || "user_key"
        );
        return c.redirect(`http://localhost:5173?jwt=${jwt}&user_id=${user[0]._id}`, 301);
      }
	  console.log("user1", user);
      console.log("user2", user[0]);
	  //strip / from url if present
	  const url = application?.url.replace(/\/$/, "");

      let details = {
        email: user_data.email,
        name: user_data.given_name,
        providers: ["google"],
		user_metadata: {}
      };
      const record:any = await createRecord(
        {
          ...details,
        },
        "users"
      );
	  const user_id = record._id
      const jwt = await sign(record, process.env.USER_AUTH_KEY || "user_key");
      return c.redirect(`http://localhost:5173?jwt=${jwt}&user_id=${user_id}`, 301);
    }
    return c.json({
      error: true,
      data: null,
    });
  } catch (error:any) {
	return c.json({ error: error.message, data: null },401);
  }
});

auth.get("/redirect_test", async (c: Context) => {
  return c.redirect("http://localhost:5173/", 301);
});

auth.get("/google_oauth", async (c: Context) => {
  try {
	const oauth = await getSettings("oauth");
	const application = await getSettings("application");
	console.log("app 2",application?.url )
    const oauth2Client = new OAuth2Client({
      clientId: oauth?.client_id,
      clientSecret: oauth?.client_secret,
      redirectUri: application.url+"/api/auth/oauth_redirect"
    });
    const authorizeUrl = oauth2Client.generateAuthUrl({
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });
    return c.json({
      data: authorizeUrl,
      error: null,
    });
  } catch (error:any) {
	return c.json({ error: error.message, data: null },401);
  }
});



auth.get('/redirect_test', async (c: Context) => {
	return c.redirect('http://localhost:5173/', 301)
})

// TODO
auth.post("/user/reset-password", async (c: Context) => {
	try {
	} catch (error) { }
	return c.text("Reset user password");
});

// TODO
auth.post("/user/forgot-password", async (c: Context) => {
	try {
	} catch (error) { }
	return c.text("Forgot user password");
});

// TODO
auth.post("/user/verify", async (c: Context) => {
	try {
	} catch (error) { }
	return c.text("Verify user");
});

// TODO
auth.post("/user/verify-email", async (c: Context) => {
	try {
	} catch (error) { }
	return c.text("Verify user email");
});

export default auth;
