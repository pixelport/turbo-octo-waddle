import schema from './schema'
import { handlerPath } from '../../../libs/handlerResolver'
import { NEWS_ARTICLE_PATH } from '../config'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'POST',
        path: `${NEWS_ARTICLE_PATH}`,
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
}
