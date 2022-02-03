import { plainToClass } from 'class-transformer'
import NewsArticle, { NewsArticlePersistence } from '../models/NewsArticle'

export default class NewsArticleMapper {

  static toPersistence(newsArticle: NewsArticle): NewsArticlePersistence {
    const { relevance, ...toPersistence } = newsArticle
    return toPersistence
  }

  static toPublic(newsArticle: NewsArticle) {
    const enhancedArticle = newsArticle.toData()
    const {
      amountExplanationMarks, amountCommas, amountFullStops, ...toPublic
    } = enhancedArticle
    return toPublic
  }

  static fromPersistence(newsArticlePersistence: NewsArticlePersistence): NewsArticle {
    return plainToClass(NewsArticle, newsArticlePersistence)
  }

}
