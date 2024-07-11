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
import getRoutesAndOgData from "../utils/get-routes-and-og-data.js";
import generatePreview from "../utils/generate-preview.js";
import open from "open";
import { Command } from "commander";
const startServer = (port) => {
    const previewPort = 3001;
    const app = express();
    app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield getRoutesAndOgData(port);
            const preview = generatePreview([data]);
            res.send(preview);
        }
        catch (e) {
            console.log("__ERROR_", e.message);
        }
    }));
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
    .option("-p, --port <port>", "Port to run the server on", "3000")
    .action((cmd) => {
    const port = parseInt(cmd.port, 10);
    startServer(port);
});
program.parse(process.argv);
