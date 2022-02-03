import 'reflect-metadata'
import { container } from 'tsyringe'
import { IDatabase } from '../database/IDatabase'
import { NewsArticlePersistence } from '../models/NewsArticle'
import DynamoDb from '../database/DynamoDb'

const localDynamoDb = new DynamoDb<NewsArticlePersistence>(process.env.NEWS_ARTICLE_TABLE)
container.register<IDatabase<NewsArticlePersistence>>('Database', { useValue: localDynamoDb })

export const DiContainer = container
