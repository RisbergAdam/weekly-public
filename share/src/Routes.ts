import * as Router from "koa-router";

import { Services } from "./Types";
import { localhostFilter } from "./Localhostfilter";
import { Context } from "koa";

export function createEndpoints(services: Services) {
  const router = new Router();

  router.get("/hello", (ctx) => {
    ctx.body = "hello";
  });

  router.get("/users-online", (ctx) => {
    localhostFilter(ctx);
  });

  router.post("/create-workspace", (ctx) => {
    localhostFilter(ctx);
  });

  return router;
}

export function createWebsocketEndpoint(services: Services) {
  const router = new Router();

  router.all("/connect", async (ctx: Context) => {
    const { shareService } = services;
    shareService.accept(ctx.websocket, ctx.query.accessToken);
  });

  return router;
}
