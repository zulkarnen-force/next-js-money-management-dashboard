# ----------------------------------------
# 1. Base dependencies stage
# ----------------------------------------
FROM node:23.10-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# ----------------------------------------
# 2. Development stage
# ----------------------------------------
FROM node:23.10-alpine AS development
WORKDIR /app

ENV NODE_ENV=development

COPY . .

# Optional: install dev tools like curl, vim, etc.
# RUN apk add --no-cache curl

EXPOSE 3000
CMD ["npm", "run", "dev"]

# ----------------------------------------
# 3. Build stage
# ----------------------------------------
FROM node:23.10-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ----------------------------------------
# 4. Production stage
# ----------------------------------------
FROM node:23.10-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
