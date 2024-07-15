#!/usr/bin/env node
import express from "express";
import getRoutesAndOgData from "../utils/get-routes-and-og-data.js";
import generatePreview from "../utils/generate-preview.js";
import open from "open";
import portfinder from "portfinder";
import axios from "axios";
import xml2js from "xml2js";
import { Command } from "commander";

import getOgDataForNoSpa from "../utils/get-og-data-for-no-spa.js";

const startServer = async (portOfProject: number) => {
  const previewPort = await portfinder.getPortPromise({ port: 3000 });

  const app = express();

  app.get("/", async (req, res) => {
    try {
      console.log("Generating preview...");

      let urls: string[] = null;
      let data = [];
      const isSpa = false;
      // const sitemap = false;

      const sitemap = await axios.get(
        `http://localhost:${portOfProject}/sitemap.xml`
      );

      if (sitemap && !isSpa) {
        const parser = new xml2js.Parser();
        const sitemapData = await parser.parseStringPromise(sitemap.data);
        urls = sitemapData.urlset.url.map((url: any) => url.loc[0]);
        console.log("Sitemap found! + urls = " + urls);
        // not working below, newData is object promise
        const newData = [];
        newData.push(
          urls.map(async (url) => {
            await getOgDataForNoSpa(url);
          })
        );

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
      console.log(
        `Preview of og-data successfully generated! View at http://localhost:${previewPort}`
      );
    } catch (e: any) {
      console.error("__ERROR_", e.message);
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
  .action(async (cmd) => {
    if (cmd.port === undefined) {
      console.error(
        "You must provide a port number! EXAMPLE: If the project that you want to generate an og-preview for is running on port:3000, then execute -> og-preview start -p 3000"
      );
      process.exit(1);
    }
    const portOfProject = parseInt(cmd.port, 10);
    startServer(portOfProject);
  });

program.parse(process.argv);
