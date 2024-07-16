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
import * as cheerio from "cheerio";
const identifySpa = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios.get(url);
        const $ = cheerio.load(response.data);
        const spaRootElements = ["#app", "#root"];
        for (const selector of spaRootElements) {
            if ($(selector).length > 0) {
                return true;
            }
        }
        const scripts = $("script");
        const spaFrameworks = ["React", "Angular", "Vue"];
        for (let i = 0; i < scripts.length; i++) {
            const src = $(scripts[i]).attr("src");
            if (src) {
                if (spaFrameworks.some((framework) => src.includes(framework))) {
                    return true;
                }
            }
            else {
                const inlineScript = $(scripts[i]).html();
                if (inlineScript) {
                    if (spaFrameworks.some((framework) => inlineScript.includes(framework))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    catch (error) {
        console.error("Error checking if the application is an SPA:", error);
        return false;
    }
});
export default identifySpa;
