import schema from './schema'
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '../../../libs/api-gateway'
import { middyfy } from '../../../libs/lambda'
import NewsArticleService from '../../../services/NewsArticleService'
import { DiContainer } from '../../../core/DiContainer'
import NewsArticleMapper from '../../../mappers/NewsArticleMapper'

const newsArticleService = DiContainer.resolve(NewsArticleService)

const createNewsArticleHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema>
  = async (event) => {
    const { title, text } = event.body

    const createdArticle = await newsArticleService.create(title, text)

    return formatJSONResponse(NewsArticleMapper.toPublic(createdArticle))
  }

export const main = middyfy(createNewsArticleHandler)
