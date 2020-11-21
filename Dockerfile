FROM node:14.15-alpine
LABEL image=builder

RUN apk add make
USER ${USER}

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

CMD npm run start
