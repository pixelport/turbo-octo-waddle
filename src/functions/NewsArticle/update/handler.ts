import schema from './schema'
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '../../../libs/api-gateway'
import { middyfy } from '../../../libs/lambda'
import NewsArticleService from '../../../services/NewsArticleService'
import { DiContainer } from '../../../core/DiContainer'
import NewsArticleMapper from '../../../mappers/NewsArticleMapper'

const newsArticleService = DiContainer.resolve(NewsArticleService)

const updateNewsArticleHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema>
 = async (event) => {
   const { newsArticleId } = event.pathParameters
   const { title, text } = event.body

   const article = await newsArticleService.update(newsArticleId, { title, text })

   return formatJSONResponse(NewsArticleMapper.toPublic(article))
 }

export const main = middyfy(updateNewsArticleHandler)
