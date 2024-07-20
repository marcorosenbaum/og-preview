import generatePreview from "./generate-preview";
import { Page } from "../../interfaces";

describe("generatePreview", () => {
  it("should generate HTML preview for given pages", () => {
    const pages: Page[] = [
      {
        url: "https://example.com",
        ogData: {
          title: "Example Title",
          description: "Example Description",
          image: "https://example.com/image.jpg",
        },
      },
      {
        url: "https://example2.com",
        ogData: {
          title: "Example Title 2",
          description: "Example Description 2",
          image: "",
        },
      },
    ];

    const result = generatePreview(pages);

    expect(result).toContain("<title>OG-Preview</title>");
    expect(result).toContain(
      '<meta name="description" content="Example Description">'
    );
    expect(result).toContain(
      '<meta property="og:image" content="https://example.com/image.jpg">'
    );
    expect(result).toMatch(
      /<a[^>]*href=["']?https:\/\/example.com["']?[^>]*>https:\/\/example.com<\/a>/
    );
    expect(result).toMatch(
      /<img[^>]*src="https:\/\/example.com\/image.jpg"[^>]*alt="OG preview"[^>]*>/
    );
    expect(result).toMatch(/<h3[^>]*>Example Title<\/h3>/);

    expect(result).toMatch(
      /<a[^>]*href=["']?https:\/\/example2.com["']?[^>]*>https:\/\/example2.com<\/a>/
    );
    expect(result).toMatch(
      /<div[^>]*style='color: red;[^>]*'>no open graph image found<\/div>/
    );
    expect(result).toMatch(/<h3[^>]*>Example Title 2<\/h3>/);
  });

  it("should handle pages with missing OG data", () => {
    const pages: Page[] = [
      {
        url: "https://example.com",
        ogData: {
          title: "",
          description: "",
          image: "",
        },
      },
    ];

    const result = generatePreview(pages);

    expect(result).toContain("<title>OG-Preview</title>");
    expect(result).toContain('<meta name="description" content="">');
    expect(result).toContain('<meta property="og:image" content="">');
    expect(result).toMatch(
      /<a[^>]*href=["']?https:\/\/example.com["']?[^>]*>https:\/\/example.com<\/a>/
    );
    expect(result).toMatch(
      /<div[^>]*style='color: red;[^>]*'>no open graph image found<\/div>/
    );
    expect(result).toMatch(
      /<h3[^>]*style="[^"]*color: red;[^"]*">no open graph title found<\/h3>/
    );
  });
});
