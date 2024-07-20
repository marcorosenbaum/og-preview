import axios from "axios";
import getOgDataForNoSpa from "./get-og-data-for-no-spa";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getUrlsForNoSpa", () => {
  it("should return a list of URLs and their og-data", async () => {
    const url = "https://example.com";
    const html = `
      <html>
        <head>
          <meta property="og:title" content="Example Title">
          <meta property="og:description" content="Example Description">
          <meta property="og:image" content="http://example.com/image.jpg">
        </head>
      </html>
    `;
    mockedAxios.get.mockResolvedValue({ data: html });

    const result = await getOgDataForNoSpa(url);

    expect(result).toEqual({
      url: "https://example.com",
      ogData: {
        title: "Example Title",
        description: "Example Description",
        image: "http://example.com/image.jpg",
      },
    });
  });

  it("should return null if an error occurs", async () => {
    const url = "https://example.com";
    mockedAxios.get.mockRejectedValue(new Error("Failed to fetch"));

    const result = await getOgDataForNoSpa(url);

    expect(result).toBeNull();
  });

  it("should return null if no og-data is found", async () => {
    const url = "https://example.com";
    const html = `
        <html>
            <head>
            <title>Example Title</title>
            <meta name="description" content="Example Description">
            </head>
        </html>
        `;
    mockedAxios.get.mockResolvedValue({ data: html });

    const result = await getOgDataForNoSpa(url);

    expect(result).toEqual({
      url,
      ogData: {
        title: null,
        description: null,
        image: null,
      },
    });
  });
});
