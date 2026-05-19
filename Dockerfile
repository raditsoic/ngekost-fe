FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS build
COPY --from=install /usr/src/app/node_modules node_modules
COPY . .
RUN bun run build

FROM oven/bun:1 AS release
COPY --from=build /usr/src/app/dist dist

USER bun
EXPOSE 3000/tcp
CMD ["sh", "-c", "bunx serve dist -l 3000 -s"]
