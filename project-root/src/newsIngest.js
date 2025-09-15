import Parser from "rss-parser";

export async function ingestArticles(rssUrl = "https://timesofindia.indiatimes.com/rssfeedstopstories.cms") {
  const parser = new Parser();
  const feed = await parser.parseURL(rssUrl);
  // Use article titles + snippets
  const articles = feed.items.slice(0, 50).map(item => ({
    id: item.guid || item.link,
    text: item.title + (item.contentSnippet ? " " + item.contentSnippet : ""),
  }));
  return articles;
}
