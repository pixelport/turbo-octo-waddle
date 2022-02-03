import schema from './schema'
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '../../../libs/api-gateway'
import { middyfy } from '../../../libs/lambda'
import NewsArticleService from '../../../services/NewsArticleService'
import { DiContainer } from '../../../core/DiContainer'
import NewsArticleMapper from '../../../mappers/NewsArticleMapper'

const newsArticleService = DiContainer.resolve(NewsArticleService)

const getNewsArticleHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const allArticles = await newsArticleService.all()

  return formatJSONResponse(allArticles.map(article => NewsArticleMapper.toPublic(article)))
}

export const main = middyfy(getNewsArticleHandler)
