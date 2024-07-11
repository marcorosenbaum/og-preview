import express from "express";
import getRoutesAndOgData from "../utils/get-routes-and-og-data.js";
import generatePreview from "../utils/generate-preview.js";
import open from "open";
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
startServer();
export { startServer };
