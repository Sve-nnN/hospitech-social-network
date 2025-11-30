FROM node:20-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development


# Instala pnpm globalmente
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package*.json ./
RUN pnpm install
COPY . .
EXPOSE 5173
CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0"]

# --- Etapa de producción ---
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package*.json ./
RUN pnpm install --prod
COPY . .
RUN pnpm run build
EXPOSE 5173
CMD ["pnpm", "run", "preview", "--", "--host", "0.0.0.0"]