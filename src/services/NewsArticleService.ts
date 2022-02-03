import { randomUUID } from 'crypto'
import { inject, injectable } from 'tsyringe'
import { IDatabase } from '../database/IDatabase'
import NewsArticle, { NewsArticlePersistence } from '../models/NewsArticle'
import PublicError from '../libs/PublicError'
import NewsArticleMapper from '../mappers/NewsArticleMapper'

@injectable()
export default class NewsArticleService {

  async get(id: string): Promise<NewsArticle> {
    return NewsArticleMapper.fromPersistence(await this.database.get(id))
  }

  async all(): Promise<NewsArticle[]> {
    const newsArticlesRaw = await this.database.all()
    return newsArticlesRaw.map(newsArticleRaw => NewsArticleMapper.fromPersistence(newsArticleRaw))
  }

  async update(id: string, newsArticleUpdate: { title: string, text?: string }):
      Promise<NewsArticle> {
    if (!newsArticleUpdate.title) {
      throw new PublicError('title is required for News Article update', 400)
    }

    const databaseUpdate = {
      ...NewsArticle.calculateTextMetaInfo(newsArticleUpdate.text),
      ...newsArticleUpdate,
    }

    const updatedItem = await this.database.update(id, databaseUpdate)
    return NewsArticleMapper.fromPersistence(updatedItem)
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
    await this.database.set(newNewsArticle.id, NewsArticleMapper.toPersistence(newNewsArticle))

    return newNewsArticle
  }

  constructor(@inject('Database') private database: IDatabase<NewsArticlePersistence>) {
    this.database = database
  }
}
