
export default class NewsArticle {
    id: string;
    title: string;
    text?: string;
    creationDate?: string;

    constructor(id: string, title: string, text?: string, creationDate?: string) {
      this.id = id
      this.title = title
      this.text = text
      this.creationDate = creationDate
    }
}
