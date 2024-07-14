var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import cheerio from "cheerio";
const getOgDataForNoSpa = (url) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("* using axios and cheerio *");
    try {
        const response = yield axios.get(url);
        const $ = cheerio.load(response.data);
        const ogData = {
            title: $("meta[property='og:title']").attr("content") || null,
            description: $("meta[property='og:description']").attr("content") || null,
            image: $("meta[property='og:image']").attr("content") || null,
        };
        return { url, ogData };
    }
    catch (error) {
        console.error("Error fetching OpenGraph data:", error);
        return null;
    }
});
export default getOgDataForNoSpa;
