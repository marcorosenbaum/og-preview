var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from "puppeteer-core";
const getRoutesAndOgData = (port) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const browser = yield puppeteer.launch({ channel: "chrome" });
        const page = yield browser.newPage();
        yield page.goto(`http://localhost:${port}`);
        // image is not being displayed properly
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
        yield browser.close();
        return ogData;
    }
    catch (e) {
        console.log("__ERROR_", e.message);
        return null;
    }
});
export default getRoutesAndOgData;
