import {checkPermissions} from "../utils/rules/checkPermissions"
import {Hono, Context} from "hono";

export const checkApiPermissions= async (c: Context, next: () => Promise<void>) => {

}