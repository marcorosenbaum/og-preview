import cheerio from "cheerio";
import axios from "axios";
import url from "url";

async function getUrls(baseUrl: string): Promise<string[]> {
  const visitedUrls = new Set<string>();
  const urlsToVisit = [baseUrl];

  while (urlsToVisit.length > 0) {
    const currentUrl = urlsToVisit.pop();
    if (visitedUrls.has(currentUrl)) {
      continue;
    }

    visitedUrls.add(currentUrl);
    console.log(`Crawling: ${currentUrl}`);

    try {
      const response = await axios.get(currentUrl);
      const $ = cheerio.load(response.data);

      const links = $("a[href]");
      links.each((index, element) => {
        const href = $(element).attr("href");
        const fullUrl = url.resolve(currentUrl, href);

        if (
          fullUrl.startsWith(baseUrl) &&
          !visitedUrls.has(fullUrl) &&
          !urlsToVisit.includes(fullUrl)
        ) {
          urlsToVisit.push(fullUrl);
        }
      });
    } catch (error) {
      console.error(`Failed to crawl ${currentUrl}: ${error.message}`);
    }
  }

  return Array.from(visitedUrls);
}

export default getUrls;
