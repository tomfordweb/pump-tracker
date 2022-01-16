FROM node:lts-buster as builder

ARG env=local
ARG REACT_APP_CI_BUILD=production
ENV REACT_APP_CI_BUILD=$REACT_APP_CI_BUILD
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

RUN npm install serve react-scripts -g
COPY ./package* ./ 
RUN npm install

COPY ./ ./

RUN npm run build






