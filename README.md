# url-shortify

URL shortener.

## Usage

## Development

```shell
# prepare environment
cp sample.env .env

# start supporting containers
docker compose up -d

# install dependencies
npm install

# apply SQL migrations
npm run migrations

# start web server
npm run start:dev

# run unit tests
npm run test:unit

# install pre-commit hooks
pre-commit install --hook-type commit-msg --hook-type pre-push
```
