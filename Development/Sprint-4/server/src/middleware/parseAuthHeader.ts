import { Context } from "hono";
import jwt from "jsonwebtoken";

// this middleware parses the authorization headers and decodes the token
export const parseAuthHeader = async (
	c: Context,
	next: () => Promise<void>
) => {
	console.log('Url', c.req.url);
	console.log(c.req.raw.headers);
	const authHeader = c.req.raw.headers.get("authorization");
	console.log('Here', authHeader);
	if (!authHeader) {
		console.log("No auth header found");
		c.set("Authorization", "Guest");
		return await next();

	}

	console.log("this", authHeader)

	const token = authHeader.split(" ")[1];
	console.log('Token', token);
	if (!token) {
		console.log(c.req.url);
		console.log("No token found");
		if (c.req.url.includes('/login') || c.req.url.includes('/init')) {
			c.set("Authorization", "Guest");
		return await next();
		}
		// return c.json({ 'message': 'Unauthorized', error: true },404);
	}

	try {
		const decoded = jwt.verify(token, process.env.USER_AUTH_KEY || "user_key");

		c.set("user",decoded)

		console.log("decoded", decoded);

		return await next();
	} catch (error) {
		console.log(error, 'Here');
		return c.json({ 'message': 'Unauthorized', error: true },404);
	}
};
