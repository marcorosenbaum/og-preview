#!/usr/bin/env node
import express from "express";
import getRoutesAndOgData from "../utils/get-routes-and-og-data.js";
import generatePreview from "../utils/generate-preview.js";
import open from "open";
import { Command } from "commander";
const startServer = () => {
    const previewPort = 3000;
    const app = express();
    app.get("/", (req, res) => {
        const data = getRoutesAndOgData();
        const preview = generatePreview(data);
        res.send(preview);
    });
    app.listen(previewPort, () => {
        console.log(`Preview of og-data is available at http://localhost:${previewPort}`);
        open(`http://localhost:${previewPort}`);
    });
};
const program = new Command();
program
    .version("1.0.0")
    .command("start")
    .description("Start the OG preview server")
    .action(() => {
    startServer();
});
program.parse(process.argv);
