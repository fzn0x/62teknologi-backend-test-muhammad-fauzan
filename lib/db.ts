import * as pg from "pg";
// @ts-expect-error
const { Pool } = pg.default;

import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";
import { env } from "./config/env";

const connectionString = `${env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prismaClient = new PrismaClient({
  adapter,
});

export { Prisma };
export default prismaClient;
