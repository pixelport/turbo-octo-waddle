import schema from './schema'
import { handlerPath } from '../../../libs/handlerResolver'
import { NEWS_ARTICLE_PATH } from '../config'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'GET',
        path: `${NEWS_ARTICLE_PATH}/all`,
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
}
