# Get pdftk
FROM node:18.15-buster-slim AS pdftk
RUN apk add --no-cache pdftk

# FROM --platform=linux/amd64 node:18-alpine AS deps
# RUN apk update && \
#     apk add --no-cache libc6-compat tesseract-ocr ghostscript

# WORKDIR /app
# COPY package.json package-lock.json* ./
# RUN npm ci

# FROM --platform=linux/amd64 node:18-alpine AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# RUN npm run build

# # Creating a new stage. This stage will run the project
# FROM --platform=linux/amd64 node:18-alpine AS runner
# # Setting the current working directory as /app
# WORKDIR /app
# # This will improve the performance of the application
# ENV NODE_ENV production
# # Creating a new user group
# RUN addgroup --system --gid 1001 group1
# # Creating a new user
# RUN adduser --system --uid 1001 user1
# # Copying the public folder from builder stage to current stage 
# COPY --from=builder /app/public ./public
# # Copying the traced files from builder stage to current stage
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# # Switching the current user to a non root user
# USER user1
# # Setting the PORT environment variable
# ENV PORT 3000
# # Specifying the listening port
# EXPOSE $PORT
# # Specifying the command that needs to get executed when the container is running
# CMD ["node", "server.js"]


# ---------------------------------------------------
# FROM node:18.15-buster-slim

# RUN apt-get update && \
#     apt-get install -y build-essential g++ libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev tesseract-ocr ghostscript pdftk

# WORKDIR /app

# COPY package.json .

# RUN npm install

# COPY . .

# WORKDIR /app/node_modules/pdf-extract

# RUN mkdir -p /usr/share/tesseract-ocr/tessdata/configs && \
#     cp ./share/eng.traineddata /usr/share/tesseract-ocr/tessdata/eng.traineddata && \
#     cp ./share/configs/alphanumeric /usr/share/tesseract-ocr/tessdata/configs/alphanumeric

# WORKDIR /app

# RUN npm run build

# EXPOSE 3000

# CMD [ "npm", "run", "start" ]

