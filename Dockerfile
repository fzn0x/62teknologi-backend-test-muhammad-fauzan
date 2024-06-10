# syntax=docker/dockerfile:1
FROM oven/bun:1 as base
WORKDIR /usr/src/app
ENV NODE_ENV="production"

COPY .env.production.local /usr/src/app
COPY . /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
RUN cd /usr/src/app/.api/apis/yelp-developers && bun link && cd ../../../
COPY package.json /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
RUN bunx prisma generate

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/ .

# run the app
EXPOSE 3001/tcp
CMD [ "bun", "run", "prod" ]