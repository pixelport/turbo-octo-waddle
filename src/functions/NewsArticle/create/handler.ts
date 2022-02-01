import schema from './schema'
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '../../../libs/apiGateway'
import { middyfy } from '../../../libs/lambda'
import NewsArticleService from '../../../services/NewsArticleService'
import { DiContainer } from '../../../core/DiContainer'

const newsArticleService = DiContainer.resolve(NewsArticleService)

const createNewsArticleHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema>
  = async (event) => {
    const { title, text } = event.body

    const createdArticle = await newsArticleService.create(title, text)

    return formatJSONResponse(createdArticle)
  }

export const main = middyfy(createNewsArticleHandler)
