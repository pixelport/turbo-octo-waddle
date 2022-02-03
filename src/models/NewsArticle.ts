import { countCharacters } from '../libs/stringHelper'

export enum ArticleRelevance {
    STANDARD = 'STANDARD',
    HOT = 'HOT',
    BORING = 'BORING'
}

const ONE_MINUTE_IN_SECONDS = 60
const FIVE_MINUTES_IN_SECONDS = 60 * 5

export interface NewsArticlePersistence {
    id: string;
    title: string;
    text?: string;
    creationDate?: string;
    amountExplanationMarks?: number;
    amountCommas?: number;
    amountFullStops?: number;
}

export default class NewsArticle implements NewsArticlePersistence {
 id: string;
 title: string;
 text?: string;
 creationDate?: string;
 amountExplanationMarks?: number;
 amountCommas?: number;
 amountFullStops?: number;

 static calculateTextMetaInfo(text?: string) {
   return {
     amountExplanationMarks: countCharacters('!', text || ''),
     amountCommas: countCharacters(',', text || ''),
     amountFullStops: countCharacters('.', text || ''),
   }
 }

 get relevance(): ArticleRelevance {
   const secondsSinceCreation = (new Date().getTime()
          - new Date(this.creationDate).getTime()) / 1000
   if (this.amountExplanationMarks > this.amountFullStops
          && secondsSinceCreation < ONE_MINUTE_IN_SECONDS) {
     return ArticleRelevance.HOT
   } else if (this.amountCommas > this.amountFullStops
          && secondsSinceCreation < FIVE_MINUTES_IN_SECONDS) {
     return ArticleRelevance.BORING
   }

   return ArticleRelevance.STANDARD
 }

 toData() {
   return {
     ...this,
     relevance: this.relevance,
   }
 }

 toJSON() {
   return this.toData()
 }

 constructor(id: string, title: string, text?: string, creationDate?: string) {
   this.id = id
   this.title = title
   this.text = text
   this.creationDate = creationDate
   const { amountFullStops, amountCommas, amountExplanationMarks }
          = NewsArticle.calculateTextMetaInfo(text)
   this.amountFullStops = amountFullStops
   this.amountCommas = amountCommas
   this.amountExplanationMarks = amountExplanationMarks
 }
}
