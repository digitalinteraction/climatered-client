#!/usr/bin/env sh

if [ -f ".env.static.local" ]
then
  # Source the .env
  # should be formatted `export KEY=value` to work with "source"
  source .env.static.local
fi

docker build \
  --build-arg AUTH_TOKEN=$AUTH_TOKEN \
  --build-arg API_URL=$API_URL \
  --build-arg CDN_REMOTE=$CDN_REMOTE \
  -f static.Dockerfile \
  -t ghcr.io/digitalinteraction/climate-red-static:$VERSION \
  .

docker push ghcr.io/digitalinteraction/climate-red-static:$VERSION
