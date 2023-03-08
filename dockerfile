FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat build-base g++ cairo-dev jpeg-dev pango-dev musl-dev giflib-dev tesseract-ocr
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

# Set user and group IDs to match the user who owns the application files
ARG UID=1000
ARG GID=1000
RUN addgroup -g 1001 nextjs && adduser -D -u 1001 -G nextjs nextjs


ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder --chown=nextjs:nextjs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]