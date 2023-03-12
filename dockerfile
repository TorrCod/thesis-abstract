FROM node:18-alpine

RUN apk add --no-cache libc6-compat build-base g++ cairo-dev jpeg-dev pango-dev musl-dev giflib-dev tesseract-ocr poppler-utils ghostscript

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

WORKDIR /app/node_modules/pdf-extract

RUN cp "./share/eng.traineddata" "/usr/share/tesseract-ocr/tessdata/eng.traineddata"
RUN cp "./share/eng.traineddata" "/usr/share/tesseract-ocr/tessdata/eng.traineddata"

WORKDIR /app

RUN npm run build

EXPOSE 3000

CMD [ "npm","run","start" ]