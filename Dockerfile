FROM node:18.16-bullseye-slim
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends dumb-init
ENV NODE_ENV production
WORKDIR /usr/src/url-shortify
COPY --chown=node:node src src
COPY --chown=node:node migrations migrations
COPY --chown=node:node .postgratorrc.json .postgratorrc.json
COPY --chown=node:node package.json package.json
COPY --chown=node:node package-lock.json package-lock.json
COPY --chown=node:node README.md README.md
RUN npm ci --only=production
USER node
CMD ["dumb-init", "node", "src/server.js"]
