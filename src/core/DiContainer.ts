import 'reflect-metadata'
import { container } from 'tsyringe'
import { IDatabase } from '../database/IDatabase'
import NewsArticle from '../models/NewsArticle'
import DynamoDb from '../database/DynamoDb'

const localDynamoDb = new DynamoDb<NewsArticle>(process.env.NEWS_ARTICLE_TABLE)
container.register<IDatabase<NewsArticle>>('Database', { useValue: localDynamoDb })

export const DiContainer = container
