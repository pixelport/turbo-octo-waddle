import schema from './schema'
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '../../../libs/api-gateway'
import { middyfy } from '../../../libs/lambda'
import NewsArticleService from '../../../services/NewsArticleService'
import { DiContainer } from '../../../core/DiContainer'

const newsArticleService = DiContainer.resolve(NewsArticleService)

const getNewsArticleHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { newsArticleId } = event.pathParameters

  const article = await newsArticleService.get(newsArticleId)
  if (!article) {
    return formatJSONResponse({}, 404)
  }

  return formatJSONResponse(article)
}

export const main = middyfy(getNewsArticleHandler)
