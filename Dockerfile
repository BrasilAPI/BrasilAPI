FROM node:14.15-alpine as build

WORKDIR /tmp
COPY . /tmp

RUN npm -g install npm
RUN npm install
RUN npm run build
RUN ls -lh 
RUN ls -lha npm-1-a60de6fb
