interface Page {
  url: string;
  ogData: OgData;
}

interface OgData {
  title: string;
  description: string;
  image: string;
}
const generatePreview = (pages: Page[]) => {
  console.log(pages);
  return pages
    .map(
      (page) => `
        <html>
          <head>
            <title>OG-Preview</title>
            <meta name="description" content="${page.ogData.description}">
            <meta property="og:image" content="${page.ogData.image}">
          </head>
          <body style="font-family: sans-serif; max-width: 650px; background-color: #afe5ff; margin: 0 auto;">
            <a style="display: inline-block; padding-top: 2rem; padding-bottom: 0.5rem;" href=${
              page.url
            }>${page.url}</a>
            <div style="height: 200px; display: flex; gap: 2rem; border-radius: 0.75rem; background-color: #fff; padding: 1rem;">
              ${
                page.ogData.image
                  ? `<img style="object-fit: cover; width: 200px; border-radius: 0.75rem;" src="${page.ogData.image}" alt="OG preview" />`
                  : "<div style='color: red; display:flex; justify-content: center; align-items:center;  min-width: 200px;'>no open graph image found</div>"
              }
              
              <div style="padding: 1rem; width: 100%;">
                ${
                  page.ogData.title
                    ? `<h3 style="font-size: 1.25rem; font-weight: bold; margin: 1rem 0;">${page.ogData.title}</h3>`
                    : `<h3 style="font-size: 1.25rem; color: red; font-weight: bold; margin: 1rem 0;">no open graph title found</h3>`
                }
                ${
                  page.ogData.description
                    ? `<p>${page.ogData.description}</p>`
                    : "<p style='color: red;'>no open graph description found</p>"
                }
              </div>
            </div>
          </body>
        </html>
      `
    )
    .join("");
};

export default generatePreview;
