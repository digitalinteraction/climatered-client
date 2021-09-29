#!/usr/bin/env sh

docker run -it --rm \
  -p 8080:80 \
  -v `pwd`/hack/nginx.conf:/etc/nginx/conf.d/default.conf \
  -v `pwd`/dist:/usr/share/nginx/html \
  nginx:1-alpine
