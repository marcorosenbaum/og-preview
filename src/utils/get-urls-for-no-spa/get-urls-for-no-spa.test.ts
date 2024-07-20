import axios from "axios";

import getUrlsForNoSpa from "./get-urls-for-no-spa";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getUrlsForNoSpa", () => {
  it("should return a list of URLs", async () => {
    const baseUrl = "https://example.com";
    const html = `
            <html>
                <body>
                    <a href="/page1">Page 1</a>
                    <a href="/page2">Page 2</a>
                </body>
            </html>
        `;
    mockedAxios.get.mockResolvedValue({ data: html });

    const result = await getUrlsForNoSpa(baseUrl);

    expect(result).toEqual(
      expect.arrayContaining([
        "https://example.com",
        "https://example.com/page1",
        "https://example.com/page2",
      ])
    );

    expect(mockedAxios.get).toHaveBeenCalledTimes(3);
  });

  it("should return only the baseUrl if an error occurs", async () => {
    const baseUrl = "https://example.com";
    mockedAxios.get.mockRejectedValue(new Error("Failed to fetch"));

    const result = await getUrlsForNoSpa(baseUrl);

    expect(result).toEqual(["https://example.com"]);
  });
});
