import puppeteer from "puppeteer-core";
import { Page } from "../interfaces";

const getOgDataForSpa = async (url: string) => {
  console.log("*getOgDataForSpa using puppeteer *");

  try {
    // What if the user is using a different browser?
    const browser = await puppeteer.launch({ channel: "chrome" });
    const page = await browser.newPage();
    await page.goto(url);
    // await page.waitForSelector("head");
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
