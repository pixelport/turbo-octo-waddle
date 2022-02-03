import { randomUUID } from 'crypto'
import { inject, injectable } from 'tsyringe'
import { IDatabase } from '../database/IDatabase'
import NewsArticle from '../models/NewsArticle'
import PublicError from '../libs/PublicError'

/**
 * Please note: Because serverless-offline
 */
@injectable()
export default class NewsArticleService {

  async get(id: string): Promise<NewsArticle> {
    return this.database.get(id)
  }

  async all(): Promise<NewsArticle[]> {
    return this.database.all()
  }

  async update(id: string, newsArticleUpdate: { title: string, text?: string }) {
    if (!newsArticleUpdate.title) {
      throw new PublicError('title is required for News Article update', 400)
    }
    return this.database.update(id, newsArticleUpdate as NewsArticle)
  }

  async create(title: string, text: string): Promise<NewsArticle> {
    if (!title) {
      throw new PublicError('title is required for News Article creation', 400)
    }

    const newNewsArticle = new NewsArticle(
      randomUUID(),
      title,
      text,
      new Date().toISOString(),
    )
    await this.database.set(newNewsArticle.id, newNewsArticle)

    return newNewsArticle
  }

  constructor(@inject('Database') private database: IDatabase<NewsArticle>) {
    this.database = database
  }
}
