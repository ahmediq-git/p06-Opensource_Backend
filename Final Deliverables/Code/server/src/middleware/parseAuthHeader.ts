import { Context } from "hono";
import jwt from "jsonwebtoken";

// this middleware parses the authorization headers and decodes the token
export const parseAuthHeader = async (
	c: Context,
	next: () => Promise<void>
) => {
	const authHeader = c.req.raw.headers.get("authorization");

	if (!authHeader) {
		c.set("Authorization", "Guest");
		return await next();

	}
	
	const token = authHeader.split(" ")[1];
	if (!token) {
		if (c.req.url.includes('/login') || c.req.url.includes('/init')) {
			c.set("Authorization", "Guest");
		return await next();
		}
		return await next();
		// return c.json({ 'message': 'Unauthorized', error: true },404);
	}

	try {
		const decoded = jwt.verify(token, process.env.USER_AUTH_KEY || "user_key");
		
		c.set("user",decoded)
		c.set("Authorization", "User")

		return await next();
	} catch (error) {
		console.log(error);
		// return c.json({ 'message': 'Unauthorized', error: true },404);
		return await next();
	}
};
