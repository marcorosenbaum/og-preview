const generatePreview = (pages) => {
    console.log("Pages: ", pages);
    return pages
        .map((page) => `
        <html>
          <head>
            <title>${page.ogData.title}</title>
            <meta name="description" content="${page.ogData.description}">
            <meta property="og:image" content="${page.ogData.image}">
          </head>
          <body style="max-width: 80%; text-align: center; margin: 0 auto;">
            <p>${page.url}</p>
            <div style="display: flex; gap: 2rem; border: 1px solid; border-radius: 0.75rem; background-color: #D1D5DB; padding: 1rem;">
              ${page.ogData.image
        ? `<img style="max-height: 10rem; border-radius: 0.75rem;" src="${page.ogData.image}" alt="OG preview" />`
        : ""}
              
              <div style="text-align: center; width: 100%;">
                ${page.ogData.title
        ? `<h3 style="font-size: 1.25rem; font-weight: bold; margin: 1rem;">${page.ogData.title}</h3>`
        : ""}
                ${page.ogData.description
        ? `<p>${page.ogData.description}</p>`
        : ""}
              </div>
            </div>
          </body>
        </html>
      `)
        .join("");
};
export default generatePreview;
