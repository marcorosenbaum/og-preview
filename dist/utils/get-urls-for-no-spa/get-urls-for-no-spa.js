var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { load } from "cheerio";
import axios from "axios";
import url from "url";
function getUrlsForNoSpa(baseUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const visitedUrls = new Set();
        const urlsToVisit = [baseUrl];
        while (urlsToVisit.length > 0) {
            const currentUrl = urlsToVisit.pop();
            if (visitedUrls.has(currentUrl)) {
                continue;
            }
            visitedUrls.add(currentUrl);
            try {
                const response = yield axios.get(currentUrl);
                const $ = load(response.data);
                const links = $("a[href]");
                links.each((index, element) => {
                    const href = $(element).attr("href");
                    const fullUrl = url.resolve(currentUrl, href);
                    if (fullUrl.startsWith(baseUrl) &&
                        !visitedUrls.has(fullUrl) &&
                        !urlsToVisit.includes(fullUrl)) {
                        urlsToVisit.push(fullUrl);
                    }
                });
            }
            catch (error) {
                console.error(`Failed to crawl ${currentUrl}: ${error.message}`);
            }
        }
        return Array.from(visitedUrls);
    });
}
export default getUrlsForNoSpa;
