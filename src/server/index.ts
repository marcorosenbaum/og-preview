#!/usr/bin/env node
import express from "express";
import getRoutesAndOgData from "../utils/get-routes-and-og-data.js";
import generatePreview from "../utils/generate-preview.js";
import open from "open";

import { Command } from "commander";

const startServer = (port: number) => {
  const previewPort = 3003;

  const app = express();

  app.get("/", async (req, res) => {
    try {
      console.log("Generating preview...");
      const data = await getRoutesAndOgData(`http://localhost:${port}`);
      const preview = generatePreview(data || []);
      res.send(preview);
      console.log(
        `Preview of og-data successfully generated! View at http://localhost:${previewPort}`
      );
    } catch (e: any) {
      console.log("__ERROR_", e.message);
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
  .option("-p, --port <port>", "Port to run the server on", "3000")
  .action((cmd) => {
    const port = parseInt(cmd.port, 10);
    startServer(port);
  });

program.parse(process.argv);
