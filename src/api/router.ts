import { Hono } from "hono";

import businessRouter from "./business/routes/router";

const router = new Hono({ strict: true });

router.route("/business", businessRouter);

export default router;
