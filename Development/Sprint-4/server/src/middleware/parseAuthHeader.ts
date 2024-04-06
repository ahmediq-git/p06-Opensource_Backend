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
		return await next();

	}

	const token = authHeader.split(" ")[1];
	console.log('Token', token);
	if (!token) {
		console.log(c.req.url);
		console.log("No token found");
		if (c.req.url.includes('/login') || c.req.url.includes('/init')) {
			return await next();
		}
		return c.json({ 'message': 'Unauthorized', error: true });
	}

	try {
		const decoded = jwt.verify(token, process.env.USER_AUTH_KEY || "user_key");
		console.log('Decoded', decoded);
		c.req.user = decoded;

		return await next();
	} catch (error) {
		console.log(error, 'Here');
		return c.json({ 'message': 'Unauthorized', error: true });
	}
};
