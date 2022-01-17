FROM node:lts-buster as builder

ARG env=local
ARG api_url=

ENV NEXT_PUBLIC_API_URL=$api_url
ARG REACT_APP_CI_BUILD=production
ENV REACT_APP_CI_BUILD=$REACT_APP_CI_BUILD

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY ./package* ./ 
RUN npm install

COPY ./ ./

# RUN npm run build

