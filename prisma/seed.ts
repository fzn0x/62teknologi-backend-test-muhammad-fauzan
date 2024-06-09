import { env } from "@lib/config/env";

import prisma from "@lib/db";

const fetchOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${env.YELP_TOKEN}`,
  },
};

import sdk from "@api/yelp-developers";
// @ts-ignore-next - no types found
const sdkDefault = sdk.default;

// Get all locations based on https://www.yelp.com/locations
// To respect limits only few locations selected.
const locations = [
  "New York",
  "Buenos Aires",
  "香港",
  "Glasgow",
  "Santa Rosa",
  "London",
  "Ann Arbor",
  "大阪市",
  "Antwerpen",
  "Oslo",
  "Manila",
  "Chicago",
  "Berlin",
  "Paris",
  "São Paulo",
];

async function main() {
  try {
    sdkDefault.auth(`Bearer ${env.YELP_TOKEN}`);
    for (let location of locations) {
      const businessSearch = await sdkDefault.v3_business_search({
        location: location,
        sort_by: "best_match",
        limit: 50,
      });

      const insertables = (businessSearch?.data?.businesses || []).map(
        (business: any) => ({
          businessUniqId: business.id || crypto.randomUUID(), // need to be unique, uuid has higher tolerance for unique field
          alias: business.alias || crypto.randomUUID(), // need to be unique, uuid has higher tolerance for unique field
          name: business.name || "",
          imageUrl: business.image_url || "",
          isClosed: Boolean(business.is_closed),
          url: business.url || "",
          reviewCount: business.review_count || 0,
          rating: business.rating || 0,
          latitude: business?.coordinates?.latitude || 0,
          longitude: business?.coordinates?.longitude || 0,
          price: business.price || "",
          phone: business.phone || "",
          displayPhone: business.display_phone || "",
          distance: business.distance || 0,
          address1: business?.location?.address1 || "",
          address2: business?.location?.address2 || "",
          address3: business?.location?.address3 || "",
          city: business?.location?.city || "",
          zipCode: business?.location?.zip_code || "",
          country: business?.location?.country || "",
          state: business?.location?.state || "",
          displayAddress: business?.location?.display_address || [],
        })
      );

      await prisma.business.createMany({
        data: insertables,
        skipDuplicates: true,
      });

      for (let i in insertables) {
        try {
          // v3_business_reviews not supported by the SDK
          // const reviewSearch = await sdkDefault.v3_business_reviews({
          //   location: insertables?.[i]?.city,
          //   sort_by: "yelp_sort",
          //   limit: 50,
          // });

          try {
            const response = await fetch(
              `https://api.yelp.com/v3/businesses/${insertables?.[i]?.businessUniqId}/reviews?limit=20&sort_by=yelp_sort`,
              fetchOptions
            );

            const reviewSearch = await response.json();

            const insertablesReview = (reviewSearch?.reviews || []).map(
              (data: any) => ({
                url: data?.url || "",
                text: data?.text || "",
                rating: data?.rating || 0,
                timeCreated: data?.timeCreated || new Date(0),
                userId: data?.user?.id || 0,
                userProfileUrl: data?.user?.profile_url || "",
                userImageUrl: data?.user?.image_url || "",
                userName: data?.user?.name || "",
                businessUniqId: insertables?.[i]?.businessUniqId,
              })
            );

            if (insertablesReview.length) {
              await prisma.review.createMany({
                data: insertablesReview,
                skipDuplicates: true,
              });
            }
          } catch (err) {
            console.log(err);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  } catch (err) {
    throw err;
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
