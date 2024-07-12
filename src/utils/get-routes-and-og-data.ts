import puppeteer from "puppeteer-core";

interface OgData {
  title: string;
  description: string;
  image: string;
}

const getRoutesAndOgData = async (port: number): Promise<OgData | null> => {
  try {
    const browser = await puppeteer.launch({ channel: "chrome" });
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}`);
    await page.waitForSelector("meta[property='og:title']");

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
    await browser.close();
    return ogData;
  } catch (e: any) {
    console.log("__ERROR_", e.message);
    return null;
  }
};

export default getRoutesAndOgData;
