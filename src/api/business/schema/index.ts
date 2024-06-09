import { z } from "@hono/zod-openapi";

export const BusinessSchema = z
  .object({
    id: z.number({ coerce: true }).int().positive().optional(),
    businessUniqId: z.string().min(1),
    alias: z.string().min(1),
    name: z.string().min(1),
    imageUrl: z.string().url(),
    isClosed: z.boolean(),
    url: z.string().url(),
    reviewCount: z.number({ coerce: true }).int().nonnegative(),
    rating: z.number({ coerce: true }).min(0).max(5),
    latitude: z.number({ coerce: true }).min(-90).max(90),
    longitude: z.number({ coerce: true }).min(-180).max(180),
    price: z.string(),
    phone: z.string(),
    displayPhone: z.string(),
    distance: z.number({ coerce: true }).nonnegative(),
    address1: z.string().min(1),
    address2: z.string().optional(),
    address3: z.string().optional(),
    city: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
    state: z.string().min(1),
    displayAddress: z.array(z.string()),
  })
  .openapi("Business");

export const FiltersSchema = BusinessSchema.partial().extend({
  minRating: z.number({ coerce: true }).min(0).max(5).optional(),
  maxRating: z.number({ coerce: true }).min(0).max(5).optional(),
  minReviewCount: z.number({ coerce: true }).int().nonnegative().optional(),
  maxReviewCount: z.number({ coerce: true }).int().nonnegative().optional(),
});

export const GetBusinessSchema = z
  .object({
    page: z.number({ coerce: true }).nonnegative(),
    limit: z.number({ coerce: true }).nonnegative(),
    filters: z
      .string()
      .refine(
        (value) => {
          try {
            const parsed = JSON.parse(decodeURIComponent(value));
            FiltersSchema.parse(parsed);
            return true;
          } catch {
            return false;
          }
        },
        { message: "Invalid filters format" }
      )
      .optional(),
  })
  .openapi("Get Business");

export const FindBusinessSchema = z
  .object({
    id: z.number({ coerce: true }).min(1).int(),
  })
  .openapi("Find Business");

export const PostBusinessSchema = BusinessSchema.omit({ id: true })
  .extend({
    businessUniqId: z.string().min(1).openapi({
      example: "Uv7361sBHfKi7Y_mi-pIMw",
    }),
    alias: z.string().min(1).openapi({
      example: "the-kitchen-galliate",
    }),
    name: z.string().min(1).openapi({
      example: "The Kitchen",
    }),
    imageUrl: z.string().url().openapi({
      example:
        "https://s3-media3.fl.yelpcdn.com/bphoto/92_h-G5ArBBa1TEdAxchuA/o.jpg",
    }),
    isClosed: z.boolean().openapi({
      example: false,
    }),
    url: z.string().url().openapi({
      example:
        "https://www.yelp.com/biz/the-kitchen-galliate?adjust_creative=DSj6I8qbyHf-Zm2fGExuug&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=DSj6I8qbyHf-Zm2fGExuug",
    }),
    reviewCount: z.number({ coerce: true }).int().nonnegative().openapi({
      example: 2,
    }),
    rating: z.number({ coerce: true }).min(0).max(5).openapi({
      example: 5,
    }),
    latitude: z.number({ coerce: true }).min(-90).max(90).openapi({
      example: 45.4703791154553,
    }),
    longitude: z.number({ coerce: true }).min(-180).max(180).openapi({
      example: 8.69060564786196,
    }),
    price: z.string().openapi({
      example: "€€",
    }),
    phone: z.string().openapi({
      example: "+390321865491",
    }),
    displayPhone: z.string().openapi({
      example: "+39 0321 865491",
    }),
    distance: z.number({ coerce: true }).nonnegative().openapi({
      example: 5685.20440166748,
    }),
    address1: z.string().min(1).openapi({
      example: "Via Monte Nero 73",
    }),
    address2: z.string().optional().openapi({
      example: "",
    }),
    address3: z.string().optional().openapi({
      example: "",
    }),
    city: z.string().min(1).openapi({
      example: "Galliate",
    }),
    zipCode: z.string().min(1).openapi({
      example: "28066",
    }),
    country: z.string().min(1).openapi({
      example: "IT",
    }),
    state: z.string().min(1).openapi({
      example: "NO",
    }),
    displayAddress: z.array(z.string()).openapi({
      example: ["Via Monte Nero 73", "28066 Galliate", "Italy"],
    }),
  })
  .openapi("Post Business");

export const PutBusinessSchema = BusinessSchema.partial()
  .extend({
    id: z.number({ coerce: true }).int().optional(),
  })
  .openapi("Put Business");

export const DeleteBusinessSchema = z
  .object({
    id: z.number({ coerce: true }).min(1).int(),
  })
  .openapi("Delete Business");
