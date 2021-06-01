import * as Koa from "koa";
import * as koaBody from "koa-body";
import * as websockify from "koa-websocket";

import { localhostMiddleware } from "./Localhostfilter";
import { createEndpoints, createWebsocketEndpoint } from "./Routes";
import { BackendService } from "./services/BackendService";
import { ConnectionTracker } from "./services/ConnectionTracker";
import { DocumentAuthorizer } from "./services/DocumentAuthorizer";
import { ShareService } from "./services/ShareService";

// services
const sessionTracker = new ConnectionTracker();
const backendService = new BackendService();
const documentAuthorizer = new DocumentAuthorizer(backendService);
const shareService = new ShareService(
  documentAuthorizer,
  sessionTracker,
  backendService
);
sessionTracker.setShareService(shareService);

const services = {
  shareService,
};

// server

const koa = websockify(new Koa());
const router = createEndpoints(services);
const websocketRouter = createWebsocketEndpoint(services);

koa
  .use(localhostMiddleware)
  .use(koaBody())
  .use(router.routes())
  .use(router.allowedMethods());

koa.ws.use(websocketRouter.routes());

koa.listen(7001);
