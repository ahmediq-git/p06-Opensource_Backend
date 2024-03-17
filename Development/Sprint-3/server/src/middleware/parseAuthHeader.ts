import { Context } from "hono";
import jwt from "jsonwebtoken";

// this middleware parses the authorization headers and decodes the token
export const parseAuthHeader = async (
	c: Context,
	next: () => Promise<void>
) => {
	const authHeader = c.req.raw.headers.get("Authorization");

	if (!authHeader) {
		console.log("No auth header found");
		return await next();

	}

	const token = authHeader.split(" ")[1];

	if (!token) {
		console.log("No token found");
		return await next();
	}

	try {
		const decoded = jwt.verify(token, process.env.USER_AUTH_KEY || "user_key");

		c.req.user = decoded;

		return await next();
	} catch (error) {
		console.log(error);
	}

	await next();
};
