import schema from './schema'
import { handlerPath } from '../../../libs/handler-resolver'
import { NEWS_ARTICLE_PATH } from '../config'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'PUT',
        path: `${NEWS_ARTICLE_PATH}/{newsArticleId}`,
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
}
