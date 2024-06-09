import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import prisma, { Prisma } from "@lib/db";

import {
  GetBusinessSchema,
  FindBusinessSchema,
  PutBusinessSchema,
  PostBusinessSchema,
  DeleteBusinessSchema,
} from "../schema";

const businessRouter = new Hono({ strict: true });

businessRouter.get(
  "/search",
  zValidator("query", GetBusinessSchema),
  async (c) => {
    try {
      const isValid = c.req.valid("query");
      const { page = 1, limit = 10, filters: validFilters } = isValid;

      const filters = JSON.parse(
        decodeURIComponent(validFilters || "") || "{}"
      );

      const prismaFilters: Prisma.BusinessWhereInput = {};

      if (filters?.name)
        prismaFilters.name = { contains: filters?.name, mode: "insensitive" };
      if (
        filters?.minRating !== undefined ||
        filters?.maxRating !== undefined
      ) {
        prismaFilters.rating = {};
        if (filters?.minRating !== undefined)
          prismaFilters.rating.gte = filters?.minRating;
        if (filters?.maxRating !== undefined)
          prismaFilters.rating.lte = filters?.maxRating;
      }
      if (
        filters?.minReviewCount !== undefined ||
        filters?.maxReviewCount !== undefined
      ) {
        prismaFilters.reviewCount = {};
        if (filters?.minReviewCount !== undefined)
          prismaFilters.reviewCount.gte = filters?.minReviewCount;
        if (filters?.maxReviewCount !== undefined)
          prismaFilters.reviewCount.lte = filters?.maxReviewCount;
      }

      const db = await prisma.business.findMany({
        where: prismaFilters,
        orderBy: {
          id: "desc",
        },
        skip: page > 0 ? (page - 1) * limit : 0,
        take: limit,
        include: {
          reviews: true,
        },
      });

      const count = await prisma.business.count({ where: prismaFilters });

      return c.json(
        {
          status: "200",
          message: "Data retrieved",
          data: db,
          meta: {
            pagination: {
              dataCount: count,
              totalPage: Math.ceil(count / limit),
              currentPage: page,
              limit: limit,
            },
          },
        },
        200
      );
    } catch (error) {
      console.log(error);
      return c.json(
        {
          status: 500,
          message: "HTTP 500 Internal Server Error ",
        },
        500
      );
    }
  }
);

businessRouter.get(
  "/:id",
  zValidator("param", FindBusinessSchema),
  async (c) => {
    try {
      const param = await c.req.param("id");
      const db = await prisma.business.findFirst({
        where: {
          id: Number(param),
        },
        include: {
          reviews: true,
        },
      });

      return c.json(
        {
          status: "200",
          message: "Data retrieved",
          data: db,
        },
        200
      );
    } catch (error) {
      console.log(error);
      return c.json(
        {
          status: 500,
          message: "HTTP 500 Internal Server Error ",
        },
        500
      );
    }
  }
);

businessRouter.post("/", zValidator("json", PostBusinessSchema), async (c) => {
  try {
    const json = await c.req.json();

    const inserted = await prisma.business.create({
      data: json,
    });

    return c.json(
      {
        status: "200",
        message: "Data posted",
        data: inserted,
      },
      200
    );
  } catch (error) {
    console.log(error);
    return c.json(
      {
        status: 500,
        message: "HTTP 500 Internal Server Error ",
      },
      500
    );
  }
});

businessRouter.put(
  "/:id",
  zValidator("param", FindBusinessSchema),
  zValidator("json", PutBusinessSchema),
  async (c) => {
    try {
      const param = await c.req.param("id");
      const json = await c.req.json();

      const updated = await prisma.business.update({
        data: json,
        where: {
          id: Number(param),
        },
        include: {
          reviews: true,
        },
      });

      return c.json(
        {
          status: "200",
          message: "Data updated",
          data: updated,
        },
        200
      );
    } catch (error) {
      console.log(error);
      return c.json(
        {
          status: 500,
          message: "HTTP 500 Internal Server Error ",
        },
        500
      );
    }
  }
);

businessRouter.delete(
  "/:id",
  zValidator("param", DeleteBusinessSchema),
  async (c) => {
    try {
      const param = await c.req.param("id");

      const deleted = await prisma.business.delete({
        where: {
          id: Number(param),
        },
        include: {
          reviews: true,
        },
      });

      return c.json(
        {
          status: "200",
          message: "Data deleted",
          data: deleted,
        },
        200
      );
    } catch (error) {
      console.log(error);
      return c.json(
        {
          status: 500,
          message: "HTTP 500 Internal Server Error ",
        },
        500
      );
    }
  }
);

export default businessRouter;
