FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# --- Development Stage ---
# Used for local development with docker-compose
FROM base AS dev
ENV NODE_ENV=development
COPY package*.json ./
RUN pnpm install
COPY . .
EXPOSE 5173
CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0"]

# --- Build Stage ---
# Used to build the application for production
FROM base AS builder
ENV NODE_ENV=production
COPY package*.json ./
# Install all dependencies (including devDependencies) to run the build
RUN pnpm install --prod=false
COPY . .
RUN pnpm run build

# --- Production Stage ---
# Final image for Render deployment
FROM base AS runner
ENV NODE_ENV=production
COPY package*.json ./
RUN pnpm install --prod
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "build"]