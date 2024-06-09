# Around Me!

Find businesses around your location.

## Recommended Versions

```sh
$ docker -v
Docker version 20.10.20, build 9fdeb9c

$ node -v
v18.20.2

$ bun -v
1.1.8

$ yarn -v
1.22.19
```

## Development

To install dependencies:

```bash
bun install # or `yarn`
```

To run:

```bash
bun run dev # or `yarn dev`

# or for production
bun run prod
```

## Production

```sh
# Build dockerfile
docker build  -f ./Dockerfile . -t developerfauzan/aroundme:latest
docker push developerfauzan/aroundme:latest

# Copy .env.example as .env.production.local and setup production environment
# Make sure .gitignore has .env.production.local before push to any version control system
cp .env.example .env.production.local

# Build docker compose file to run all
docker compose up -d

# Backup Database
docker exec -u postgres <container_name_or_id> pg_dump -Fc aroundme > db.dump
```

## Updating schema

Avoid losing data in production

> :warning: **If you are using production environment**: Avoid losing data in production, use `prisma migrate deploy` instead.

```sh
prisma migrate dev --create-only

#  Edit the autogenerated migration file (you will need to write some SQL yourself to avoid losing data)

# Development
prisma migrate dev

# Production
prisma migrate deploy

# or with Docker
# build dockerfile
docker build  -f ./Dockerfile . -t developerfauzan/aroundme:latest
docker push developerfauzan/aroundme:latest

# Seeding
# find container id
docker ps
# seed
docker exec -it 3b560e5e30e2 bun run seed
```