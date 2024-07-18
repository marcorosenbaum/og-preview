#!/usr/bin/env node
import express from "express";
import open from "open";
import portfinder from "portfinder";
import axios from "axios";
import xml2js from "xml2js";
import { Command } from "commander";

import getUrlsForNoSpa from "../utils/get-urls-for-no-spa.js";
import getOgDataForNoSpa from "../utils/get-og-data-for-no-spa.js";
import getOgDataForSpa from "../utils/get-og-data-for-spa.js";
import getUrlsAndOgDataForSpa from "../utils/get-urls-and-og-data-for-spa.js";
import generatePreview from "../utils/generate-preview.js";

const startServer = async (portOfProject: number, spa: boolean) => {
  const previewPort = await portfinder.getPortPromise({ port: 3000 });

  const app = express();
  app.get("/", async (req, res) => {
    try {
      console.log("Start generating preview...");

      let urls: string[] = null;
      let data = [];
      const isSpa = spa;

      const setData = async () => {
        // refactor to promise.allSettled()
        data = await Promise.all(
          urls.map(async (url: string) => {
            return await getOgDataForNoSpa(url);
          })
        );
      };

      function convertUrlsToLocalhost(urls: string[], port: number): string[] {
        return urls
          .map((url) => {
            try {
              const parsedUrl = new URL(url);
              return `http://localhost:${port}${parsedUrl.pathname}`;
            } catch (e) {
              console.error(`Invalid URL: ${url}`);
              return "";
            }
          })
          .filter((url) => url !== ""); // Filter out any invalid URLs that resulted in an empty string
      }

      try {
        const sitemap = await axios.get(
          `http://localhost:${portOfProject}/sitemap.xml`
        );
        const parser = new xml2js.Parser();
        const sitemapData = await parser.parseStringPromise(sitemap.data);
        const urlsFromSitemap = sitemapData.urlset.url.map(
          (url: any) => url.loc[0]
        );
        urls = convertUrlsToLocalhost(urlsFromSitemap, portOfProject);
      } catch (e) {
        console.log("No sitemap found, generating urls from the website");
      }

      if (urls && !isSpa) {
        await setData();
      } else if (!urls && !isSpa) {
        urls = await getUrlsForNoSpa(`http://localhost:${portOfProject}`);
        await setData();
      } else if (urls && isSpa) {
        data = await Promise.all(
          urls.map(async (url: string) => {
            return await getOgDataForSpa(url);
          })
        );
      } else if (!urls && isSpa) {
        data = await getUrlsAndOgDataForSpa(
          `http://localhost:${portOfProject}`
        );
      }

      const preview = generatePreview(data || []);
      res.send(preview);
      console.log(
        `Preview of og-data successfully generated! View at http://localhost:${previewPort}`
      );
    } catch (e: any) {
      console.error("_ERROR_", e.message);
    }
  });

  app.listen(previewPort, () => {
    open(`http://localhost:${previewPort}`);
  });
};

const program = new Command();
program
  .version("1.0.0")
  .command("start")
  .description("Start the OG preview server")
  .option("-p, --port <port>", "Port to run the server on")
  .option("--spa", "Flag to indicate if the project is a SPA")
  .option("--nospa", "Flag to indicate if the project is not a SPA")
  .action(async (cmd) => {
    if (cmd.port === undefined) {
      console.error(
        "You must provide a port number! EXAMPLE: If the project that you want to generate an og-preview for is running on port:3000, then execute -> og-preview start -p 3000"
      );
      process.exit(1);
    }
    const portOfProject = parseInt(cmd.port, 10);
    let spa = null;
    try {
      if (cmd.spa && cmd.nospa) {
        throw new Error("You can't use both flags at the same time");
      } else if (!cmd.spa && !cmd.nospa) {
        throw new Error(
          "You must provide a flag to indicate if the project is a SPA or not. Provide --spa if the project is a SPA or --nospa if the project is not a SPA"
        );
      } else if (cmd.spa) {
        spa = true;
      } else if (cmd.nospa) {
        spa = false;
      }
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
    startServer(portOfProject, spa);
  });

program.parse(process.argv);
