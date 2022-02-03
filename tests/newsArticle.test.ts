import { lambdaWrapper } from 'serverless-jest-plugin'
import 'reflect-metadata'
import './env/test-env'
import * as createNewsArticleHandler from './../src/functions/NewsArticle/create/handler'
import * as getNewsArticleHandler from './../src/functions/NewsArticle/get/handler'
import * as updateNewsArticleHandler from './../src/functions/NewsArticle/update/handler'
import * as allNewsArticleHandler from './../src/functions/NewsArticle/all/handler'
import NewsArticle, { ArticleRelevance } from '../src/models/NewsArticle'
import NewsArticleService from '../src/services/NewsArticleService'
import { DiContainer } from '../src/core/DiContainer'

const newsArticleService = DiContainer.resolve(NewsArticleService)

const wrappedCreateNewsArticle = lambdaWrapper.wrap(createNewsArticleHandler, { handler: 'main' })
const wrappedGetArticle = lambdaWrapper.wrap(getNewsArticleHandler, { handler: 'main' })
const wrappedUpdateNewsArticle = lambdaWrapper.wrap(updateNewsArticleHandler, { handler: 'main' })
const wrappedAllNewsArticle = lambdaWrapper.wrap(allNewsArticleHandler, { handler: 'main' })

describe('happy create and fetch news article', () => {
  const newsTitle = 'Man on the moon!'
  const newsText = 'Astronauts land on plain, collects rocks, ...'
  let createdNewsArticle = null

  beforeAll(async () => {
    // create news article
    const creationResponse = await wrappedCreateNewsArticle.run({
      body: {
        title: newsTitle,
        text: newsText,
      },
    })
    expect(creationResponse.statusCode).toBe(200)
    createdNewsArticle = JSON.parse(creationResponse.body)

    expect(createdNewsArticle.title).toBe(newsTitle)
    expect(createdNewsArticle.text).toBe(newsText)
    expect(createdNewsArticle.relevance).toBeTruthy()
    expect(new Date().getTime() - new Date(createdNewsArticle.creationDate).getTime())
      .toBeLessThan(2000 /* 2s */)
  })

  it('happy get news article', async () => {
    const getNewsResponse = await wrappedGetArticle.run({
      pathParameters: {
        newsArticleId: createdNewsArticle.id,
      },
    })
    expect(getNewsResponse.statusCode).toBe(200)
    const {
      title, text, creationDate, relevance,
    } = JSON.parse(getNewsResponse.body)
    expect(title).toBe(newsTitle)
    expect(text).toBe(newsText)
    expect(relevance).toBeTruthy()
    expect(creationDate).toBe(createdNewsArticle.creationDate)
  })

  it('happy get all news articles', async () => {
    const getAllResponse = await wrappedAllNewsArticle.run()
    expect(getAllResponse.statusCode).toBe(200)
    const getAllResult: NewsArticle[] = JSON.parse(getAllResponse.body)

    const {
      title, text, creationDate, relevance,
    } = getAllResult.find(newsArticle => newsArticle.id === createdNewsArticle.id)
    expect(title).toBe(newsTitle)
    expect(text).toBe(newsText)
    expect(relevance).toBeTruthy()
    expect(creationDate).toBe(createdNewsArticle.creationDate)
  })
})

it('fail of news article creation because of missing title', async () => {
  const creationResponse = await wrappedCreateNewsArticle.run({
    body: {
      text: 'Astronauts land on plain, collects rocks...',
    },
  })
  expect(creationResponse.statusCode).toBe(400)
  expect(creationResponse.body).toBe('title is required for News Article creation')
})

it('returns 404 error code on missing article', async () => {
  const getNewsResponse = await wrappedGetArticle.run({
    pathParameters: {
      newsArticleId: 'does-not-exist',
    },
  })
  expect(getNewsResponse.statusCode).toBe(404)
})

it('happy news text relevance calculation', async () => {
  const moreExplanationMarks = 'Hello... !!!!!!!!!'
  const moreCommas = 'Hello... ,,,,,,,,,'
  const moreFullStops = 'Hello........... ,,,!!!'

  const THIRTY_SECONDS_MS = 30 * 1000
  const THREE_MINUTES_MS = 3 * 60 * 1000
  const now = new Date().toISOString()
  const withinLastMinute = new Date(new Date().getTime() - THIRTY_SECONDS_MS).toISOString()
  const withinLastFiveMinutes = new Date(new Date().getTime() - THREE_MINUTES_MS).toISOString()

  // more explanation marks
  {
    const newsArticle = new NewsArticle('abc', 'title', moreExplanationMarks, now)
    expect(newsArticle.relevance).toBe(ArticleRelevance.HOT)
  }
  {
    const newsArticle = new NewsArticle('abc', 'title', moreExplanationMarks, withinLastMinute)
    expect(newsArticle.relevance).toBe(ArticleRelevance.HOT)
  }
  {
    const newsArticle = new NewsArticle('abc', 'title', moreExplanationMarks, withinLastFiveMinutes)
    expect(newsArticle.relevance).toBe(ArticleRelevance.STANDARD)
  }

  // more commas
  {
    const newsArticle = new NewsArticle('abc', 'title', moreCommas, withinLastMinute)
    expect(newsArticle.relevance).toBe(ArticleRelevance.BORING)
  }
  {
    const newsArticle = new NewsArticle('abc', 'title', moreCommas, withinLastMinute)
    expect(newsArticle.relevance).toBe(ArticleRelevance.BORING)
  }
  {
    const newsArticle = new NewsArticle('abc', 'title', moreCommas, withinLastFiveMinutes)
    expect(newsArticle.relevance).toBe(ArticleRelevance.BORING)
  }

  // more full stops
  {
    const newsArticle = new NewsArticle('abc', 'title', moreFullStops, withinLastMinute)
    expect(newsArticle.relevance).toBe(ArticleRelevance.STANDARD)
  }
  {
    const newsArticle = new NewsArticle('abc', 'title', moreFullStops, withinLastMinute)
    expect(newsArticle.relevance).toBe(ArticleRelevance.STANDARD)
  }
  {
    const newsArticle = new NewsArticle('abc', 'title', moreFullStops, withinLastFiveMinutes)
    expect(newsArticle.relevance).toBe(ArticleRelevance.STANDARD)
  }
})


describe('happy create and update news article', () => {
  let createdNewsArticle = null

  beforeAll(async () => {
    createdNewsArticle = await newsArticleService.create('Russia puts man in space', 'Congrats by Kenedy, ...')
  })

  it('happy update news article', async () => {
    const updatedTitle = 'updated title'
    const updatedText = 'updated text ,,,,,,,,, ...'
    {
      const updateNewsResponse = await wrappedUpdateNewsArticle.run({
        pathParameters: {
          newsArticleId: createdNewsArticle.id,
        },
        body: {
          title: updatedTitle,
          text: updatedText,
        },
      })
      expect(updateNewsResponse.statusCode).toBe(200)
      const {
        title, text, creationDate, relevance,
      } = JSON.parse(updateNewsResponse.body)
      expect(title).toBe(updatedTitle)
      expect(text).toBe(updatedText)
      expect(relevance).toBe(ArticleRelevance.BORING)
      expect(creationDate).toBe(createdNewsArticle.creationDate)
    }

    {
      const {
        title, text, creationDate, relevance,
      } = await newsArticleService.get(createdNewsArticle.id)
      expect(title).toBe(updatedTitle)
      expect(text).toBe(updatedText)
      expect(relevance).toBe(ArticleRelevance.BORING)
      expect(creationDate).toBe(createdNewsArticle.creationDate)
    }
  })

  it('news article update requires a title', async () => {
    const updateNewsResponse = await wrappedUpdateNewsArticle.run({
      pathParameters: {
        newsArticleId: createdNewsArticle.id,
      },
      body: {
        text: 'updated text',
      },
    })
    expect(updateNewsResponse.statusCode).toBe(400)
  })

  it('non existing news article update returns 404', async () => {
    const updateNewsResponse = await wrappedUpdateNewsArticle.run({
      pathParameters: {
        newsArticleId: 'does-not-exist',
      },
      body: {
        title: 'updated title',
        text: 'updated text',
      },
    })
    expect(updateNewsResponse.statusCode).toBe(404)
  })
})

