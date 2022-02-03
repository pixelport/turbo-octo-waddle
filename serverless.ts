/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript'
import 'reflect-metadata'
import './src/core/DiContainer'
import createNewsArticleHandler from './src/functions/NewsArticle/create'
import getNewsArticleHandler from './src/functions/NewsArticle/get'
import updateNewsArticleHandler from './src/functions/NewsArticle/update'
import allNewsArticleHandler from './src/functions/NewsArticle/all'

const serverlessConfiguration: AWS = {
  service: 'aws-serverless-api',
  frameworkVersion: '3',
  plugins: ['serverless-dynamodb-local', 'serverless-esbuild', 'serverless-jest-plugin', 'serverless-offline'],
  provider: {
    name: 'aws',
    stage: 'dev',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      NEWS_ARTICLE_TABLE: '${self:custom.newsArticlesTable}',
    },
  },
  // import the function via paths
  functions: {
    createNewsArticleHandler,
    getNewsArticleHandler,
    updateNewsArticleHandler,
    allNewsArticleHandler,
  },
  package: { individually: false },
  resources: {
    Resources: {
      NewsArticlesTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
          TableName: '${self:provider.environment.NEWS_ARTICLE_TABLE}',
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
          ],
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: '5',
            WriteCapacityUnits: '5',
          },
        },
      },
    },
  },
  custom: {
    newsArticlesTable: 'news-articles-${opt:stage, self:provider.stage}',
    'serverless-offline': {
      httpPort: 8080,
    },
    dynamodb: {
      stages: ['dev'],
      start: {
        seed: true,
        migrate: true,
        inMemory: true,
        port: 4021,
      },
      seed: {
        domain: {
          sources: [
            {
              table: '${self:custom.newsArticlesTable}',
              sources: ['./seed/news-articles.json'],
            },
          ],
        },
      },
      esbuild: {
        bundle: true,
        minify: false,
        sourcemap: true,
        exclude: ['aws-sdk'],
        target: 'node14',
        define: { 'require.resolve': undefined },
        platform: 'node',
        concurrency: 10,
      },
    },
  },
}

module.exports = serverlessConfiguration
