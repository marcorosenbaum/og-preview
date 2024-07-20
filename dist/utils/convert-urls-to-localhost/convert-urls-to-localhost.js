const convertUrlsToLocalhost = (urls, port) => {
    return urls
        .map((url) => {
        try {
            const parsedUrl = new URL(url);
            return `http://localhost:${port}${parsedUrl.pathname}`;
        }
        catch (e) {
            console.error(`Invalid URL: ${url}`);
            return "";
        }
    })
        .filter((url) => url !== "");
};
export default convertUrlsToLocalhost;
