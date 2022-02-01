# Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

## Installation instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npm run dev` to start a local dev server at port 8080


### Known issues
The request validation doesn't work when run locally, but it is working fine when deployed. This is a [known issue](https://github.com/dherault/serverless-offline/issues/894) within in the serverless-offline package.
If this would be a real project, I would try to switch to [localstack](https://localstack.cloud/). Maybe they do have a better AWS API Gateway emulation.

### Testing
- Run `npm run test` to run all tests

### Local CURL usage

Create News Article:
```
curl --location --request POST 'http://localhost:8080/dev/news-articles' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Man on the moon!",
    "text": "Astronauts land on plain, collects rocks, ..."
}'
```

Get News Article:
```
curl --location --request GET 'http://localhost:8080/dev/news-articles/b5771375-f9f8-4935-98c2-97ec913ff836'
```

Update News Article:
```
curl --location --request PUT 'http://localhost:8080/dev/news-articles/b5771375-f9f8-4935-98c2-97ec913ff836' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Russia puts man in space",
    "text": "Congrats by Kenedy, ..."
}'
```

Get All Articles:
```
curl --location --request GET 'http://localhost:8080/dev/news-articles/all'
```
