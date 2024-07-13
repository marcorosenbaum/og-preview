import puppeteer from "puppeteer-core";

interface Page {
  url: string;
  ogData: OgData;
}

interface OgData {
  title: string;
  description: string;
  image: string;
}

const pages: Page[] = [];
const getRoutesAndOgData = async (url: string): Promise<Page[] | null> => {
  const alreadyExistingPage = pages.some((page) => page.url === url);
  if (alreadyExistingPage) {
    return pages;
  }
  try {
    const browser = await puppeteer.launch({ channel: "chrome" });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForNavigation();

    const ogData = await page.$eval("head", (head) => {
      const title =
        head
          .querySelector("meta[property='og:title']")
          ?.getAttribute("content") || "";
      const description =
        head
          .querySelector("meta[property='og:description']")
          ?.getAttribute("content") || "";
      const image =
        head
          .querySelector("meta[property='og:image']")
          ?.getAttribute("content") || "";
      return {
        title,
        description,
        image,
      };
    });
    pages.push({ url, ogData });

    // refactor to filter urls properly and normalize them
    const links = await page.evaluate((url) => {
      return Array.from(document.querySelectorAll("a"))
        .map((anchor) => {
          let href = anchor.getAttribute("href");
          if (href && !href.startsWith("http") && !href.startsWith("//")) {
            href = new URL(href, url).href;
          }
          return href;
        })
        .filter(
          (href) =>
            href !== null &&
            href !== undefined &&
            href !== "" &&
            !href.endsWith("/")
        );
    }, url);

    for (const link of links) {
      await getRoutesAndOgData(link);
    }

    await browser.close();

    return pages;
  } catch (e: any) {
    console.log("__ERROR_", e.message);
    return null;
  }
};

export default getRoutesAndOgData;
