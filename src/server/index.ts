#!/usr/bin/env node
import express from "express";
import getRoutesAndOgData from "../utils/get-routes-and-og-data.js";
import generatePreview from "../utils/generate-preview.js";
import open from "open";
import portfinder from "portfinder";

import { Command } from "commander";

const startServer = async (portOfProject: number) => {
  const previewPort = await portfinder.getPortPromise({ port: 3000 });

  const app = express();

  app.get("/", async (req, res) => {
    try {
      console.log("Generating preview...");
      const data = await getRoutesAndOgData(
        `http://localhost:${portOfProject}`
      );
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
  .option("-p, --port <port>", "Port to run the server on")
  .action(async (cmd) => {
    if (cmd.port === undefined) {
      console.error(
        "You must provide a port number! EXAMPLE: If the project that you want to generate an og-preview for is running on port:3000, then execute -> og-preview start -p 3000"
      );
      process.exit(1);
    }
    const portOfProject = parseInt(cmd.port, 10);

    // const mainPort = await portfinder.getPortPromise({ port: 3000 });
    // if (mainPort !== portOfProject) {
    //   console.log(
    //     `Port ${portOfProject} is in use, switching to port ${mainPort}.`
    //   );
    // }
    startServer(portOfProject);
  });

program.parse(process.argv);
