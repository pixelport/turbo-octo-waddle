import 'reflect-metadata'
import { container } from 'tsyringe'
import { IDatabase } from '../database/IDatabase'
import NewsArticle from '../models/NewsArticle'
import InMemoryDb from '../database/InMemoryDb'

// Please note: because serverless-offline will break tsyringe usage between
// different handlers, using globals is required for the in MemoryDatabase

// @ts-ignore
global.inMemoryDb = global.inMemoryDb || new InMemoryDb<NewsArticle>()

// @ts-ignore
container.register<IDatabase<NewsArticle>>('Database', { useValue: global.inMemoryDb })

export const DiContainer = container
