#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import generatePreview from "../utils/generate-preview.js";
import open from "open";
import portfinder from "portfinder";
import axios from "axios";
import xml2js from "xml2js";
import { Command } from "commander";
import getOgDataForNoSpa from "../utils/get-og-data-for-no-spa.js";
const startServer = (portOfProject) => __awaiter(void 0, void 0, void 0, function* () {
    const previewPort = yield portfinder.getPortPromise({ port: 3000 });
    const app = express();
    app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("Generating preview...");
            let urls = null;
            let data = [];
            const isSpa = false;
            // const sitemap = false;
            const sitemap = yield axios.get(`http://localhost:${portOfProject}/sitemap.xml`);
            if (sitemap && !isSpa) {
                const parser = new xml2js.Parser();
                const sitemapData = yield parser.parseStringPromise(sitemap.data);
                urls = sitemapData.urlset.url.map((url) => url.loc[0]);
                console.log("Sitemap found! + urls = " + urls);
                // not working below
                const newData = [];
                newData.push(urls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
                    yield getOgDataForNoSpa(url);
                })));
                console.log("new data" + newData);
            }
            // if (!sitemap && isSpa) {
            //   data = await getRoutesAndOgData(`http://localhost:${portOfProject}`);
            // }
            // if (!sitemap && !isSpa) {
            //   data = [
            //     await getOgDataForNoSpa(`http://localhost:${portOfProject}/products`),
            //   ];
            // }
            const preview = generatePreview(data || []);
            res.send(preview);
            console.log(`Preview of og-data successfully generated! View at http://localhost:${previewPort}`);
        }
        catch (e) {
            console.error("__ERROR_", e.message);
        }
    }));
    app.listen(previewPort, () => {
        open(`http://localhost:${previewPort}`);
    });
});
const program = new Command();
program
    .version("1.0.0")
    .command("start")
    .description("Start the OG preview server")
    .option("-p, --port <port>", "Port to run the server on")
    .action((cmd) => __awaiter(void 0, void 0, void 0, function* () {
    if (cmd.port === undefined) {
        console.error("You must provide a port number! EXAMPLE: If the project that you want to generate an og-preview for is running on port:3000, then execute -> og-preview start -p 3000");
        process.exit(1);
    }
    const portOfProject = parseInt(cmd.port, 10);
    startServer(portOfProject);
}));
program.parse(process.argv);
