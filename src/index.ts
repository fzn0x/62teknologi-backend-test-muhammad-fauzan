Object.defineProperty(BigInt.prototype, "toJSON", {
  get() {
    "use strict";
    return () => String(this);
  },
});

import { showRoutes } from "hono/dev";

import { Hono } from "hono";
import { etag } from "hono/etag";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { trimTrailingSlash } from "hono/trailing-slash";
import { rateLimiter } from "hono-rate-limiter";
import { serveStatic } from "hono/bun";

import sanitize from "@lib/utils/sanitize";

import router from "./api/router";

const app = new Hono({ strict: true });

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => crypto.randomUUID(),
});

app.use(limiter);

app.use(trimTrailingSlash());

app.use(
  "*",
  secureHeaders({
    xFrameOptions: false,
    xXssProtection: false,
    crossOriginResourcePolicy: false,
  })
);
app.use(prettyJSON());
app.use(
  csrf({
    origin: () => true,
  })
);
app.use(logger());

app.use("/*", etag());
app.use("*", cors());

app.use("/static/*", serveStatic({ root: "./" }));

app.use(async (c, next) => {
  try {
    if (c?.req?.raw?.headers?.get("content-type")?.includes("form")) {
      return;
    }
    const json = await c.req.json();

    for (let key in json) {
      if (json.hasOwnProperty(key)) {
        if (typeof json[key] === "string") {
          json[key] = sanitize.parse(json[key]);
        }
      }
    }

    c.req.bodyCache.json = json;
    return;
  } catch (_err) {
  } finally {
    await next();
  }
});

app.route("/api", router);

export default {
  fetch: app.fetch,
  port: 3001,
};

showRoutes(app);
