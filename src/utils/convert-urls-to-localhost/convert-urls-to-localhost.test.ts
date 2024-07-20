import convertUrlsToLocalhost from "./convert-urls-to-localhost";

describe("convertUrlsToLocalhost", () => {
  it("should convert URLs to localhost", () => {
    const urls = [
      "https://example.com",
      "https://example.com/page1",
      "https://example.com/page2",
    ];
    const port = 3000;

    const result = convertUrlsToLocalhost(urls, port);

    expect(result).toEqual([
      "http://localhost:3000/",
      "http://localhost:3000/page1",
      "http://localhost:3000/page2",
    ]);
  });
});
