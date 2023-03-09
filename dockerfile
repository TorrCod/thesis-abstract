# FROM node:18-alpine AS deps
# RUN apk add --no-cache libc6-compat build-base g++ cairo-dev jpeg-dev pango-dev musl-dev giflib-dev tesseract-ocr
# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm install --production

# FROM node:18-alpine AS builder
# WORKDIR /app

# ENV NEXT_TELEMETRY_DISABLED 1

# RUN npm run build

# FROM node:18-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

# COPY --from=builder --chown=nextjs:nextjs /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

# USER nextjs

# EXPOSE 3000

# ENV PORT 3000

# CMD ["npm", "start"]

FROM node:18-alpine

RUN apk add --no-cache libc6-compat build-base g++ cairo-dev jpeg-dev pango-dev musl-dev giflib-dev tesseract-ocr

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm","run","start" ]