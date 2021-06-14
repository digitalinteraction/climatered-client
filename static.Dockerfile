FROM node:14-alpine as builder
WORKDIR /app
COPY ["package*.json", "/app/"]
ENV NODE_ENV development
RUN npm ci
COPY [ ".", "/app/" ]

ARG AUTH_TOKEN
ARG API_URL
ARG CDN_REMOTE
ENV NODE_ENV production

RUN node bin/bundle-static-site.js $AUTH_TOKEN $API_URL $CDN_REMOTE \
  && npm run build

# Swaps to nginx and copies the compiled html ready to be serverd
# Uses a configurable nginx which can pass envionment variables to JavaScript
FROM robbj/configurable-nginx:1.0.1
ARG BUILD_NAME
ENV CONFIG_KEYS API_URL,CDN_URL,GA_TOKEN,BUILD_NAME,IS_STATIC
ENV BUILD_NAME $BUILD_NAME
ENV IS_STATIC true
COPY --from=builder /app/dist /usr/share/nginx/html
