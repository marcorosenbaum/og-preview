var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from "puppeteer";
const pages = [];
const getUrlsAndOgDataForSpa = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const alreadyExistingPage = pages.some((page) => page.url === url);
    if (alreadyExistingPage) {
        return pages;
    }
    try {
        const browser = yield puppeteer.launch();
        const page = yield browser.newPage();
        yield page.goto(url);
        yield page.waitForNavigation();
        const ogData = yield page.$eval("head", (head) => {
            var _a, _b, _c;
            const title = ((_a = head
                .querySelector("meta[property='og:title']")) === null || _a === void 0 ? void 0 : _a.getAttribute("content")) || "";
            const description = ((_b = head
                .querySelector("meta[property='og:description']")) === null || _b === void 0 ? void 0 : _b.getAttribute("content")) || "";
            const image = ((_c = head
                .querySelector("meta[property='og:image']")) === null || _c === void 0 ? void 0 : _c.getAttribute("content")) || "";
            return {
                title,
                description,
                image,
            };
        });
        pages.push({ url, ogData });
        // refactor to filter urls properly and normalize them
        const links = yield page.evaluate((url) => {
            return Array.from(document.querySelectorAll("a"))
                .map((anchor) => {
                let href = anchor.getAttribute("href");
                if (href && !href.startsWith("http") && !href.startsWith("//")) {
                    href = new URL(href, url).href;
                }
                return href;
            })
                .filter((href) => href !== null &&
                href !== undefined &&
                href !== "" &&
                !href.endsWith("/") &&
                href.includes("localhost"));
        }, url);
        for (const link of links) {
            yield getUrlsAndOgDataForSpa(link);
        }
        yield browser.close();
        return pages;
    }
    catch (e) {
        console.log("__ERROR_", e.message);
        return null;
    }
});
export default getUrlsAndOgDataForSpa;
