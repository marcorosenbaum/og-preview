import getOgDataForSpa from "./get-og-data-for-spa";
import puppeteer from "puppeteer";

jest.mock("puppeteer", () => ({
  launch: jest.fn().mockImplementation(() => ({
    newPage: jest.fn().mockImplementation(() => ({
      goto: jest.fn(),
      waitForNavigation: jest.fn(),
      $eval: jest.fn().mockImplementation((selector, callback) => {
        if (selector === "head") {
          return callback({
            querySelector: (query: string) => {
              if (query === "meta[property='og:title']") {
                return { getAttribute: () => "Example Title" };
              }
              if (query === "meta[property='og:description']") {
                return { getAttribute: () => "Example Description" };
              }
              if (query === "meta[property='og:image']") {
                return { getAttribute: () => "https://example.com/image.jpg" };
              }
              return null;
            },
          });
        }
        return null;
      }),
      close: jest.fn(),
    })),
    close: jest.fn(),
  })),
}));

describe("getOgDataForSpa", () => {
  it("should fetch Open Graph data from a given URL", async () => {
    const url = "https://example.com";
    const data = await getOgDataForSpa(url);

    expect(data).toEqual({
      url: "https://example.com",
      ogData: {
        title: "Example Title",
        description: "Example Description",
        image: "https://example.com/image.jpg",
      },
    });
  });

  it("should return null if an error occurs", async () => {
    (puppeteer.launch as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Network error");
    });

    const url = "https://example.com";
    const data = await getOgDataForSpa(url);

    expect(data).toBeNull();
  });
});
