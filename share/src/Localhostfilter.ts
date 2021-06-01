import { Context } from "koa";

export class FilteringException extends Error {};

export function localhostFilter(ctx: Context) {
    const { ip } = ctx.request;
    const allowedIps = ["::ffff:127.0.0.1", "::1"];

    if (allowedIps.includes(ip)) return;

    throw new FilteringException();
} 

export const localhostMiddleware = async (ctx: Context, next: () => Promise<any>) => {
    try {
        return await next();
    } catch (exception) {
        if (exception instanceof FilteringException) {
            ctx.body = "";
            ctx.status = 401;
        } else {
            throw exception;
        }
    }
};