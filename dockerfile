FROM node:18.15-buster-slim

RUN apt-get update && \
    apt-get install -y build-essential g++ libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev tesseract-ocr ghostscript pdftk

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

WORKDIR /app/node_modules/pdf-extract

RUN mkdir -p /usr/share/tesseract-ocr/tessdata/configs && \
    cp ./share/eng.traineddata /usr/share/tesseract-ocr/tessdata/eng.traineddata && \
    cp ./share/configs/alphanumeric /usr/share/tesseract-ocr/tessdata/configs/alphanumeric

WORKDIR /app

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]

