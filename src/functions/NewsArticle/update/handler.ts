import schema from './schema'
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '../../../libs/apiGateway'
import { middyfy } from '../../../libs/lambda'
import NewsArticleService from '../../../services/NewsArticleService'
import { DiContainer } from '../../../core/DiContainer'

const newsArticleService = DiContainer.resolve(NewsArticleService)

const updateNewsArticleHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema>
 = async (event) => {
   const { newsArticleId } = event.pathParameters
   const { title, text } = event.body

   const article = await newsArticleService.update(newsArticleId, { title, text })

   return formatJSONResponse(article)
 }

export const main = middyfy(updateNewsArticleHandler)
