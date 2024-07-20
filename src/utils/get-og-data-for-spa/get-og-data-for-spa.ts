import puppeteer from "puppeteer";

const getOgDataForSpa = async (url: string) => {
  try {
    const browser = await puppeteer.launch();
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

      return { title, description, image };
    });

    await browser.close();
    return { url, ogData };
  } catch (e: any) {
    console.log("__ERROR_", e.message);
    return null;
  }
};

export default getOgDataForSpa;
