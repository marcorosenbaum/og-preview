const generatePreview = (ogData) => {
    console.log("OG_DATA:", ogData);
    return ogData
        .map((data) => `
                            <html>
                                            <head>
                                                            <title>${data.title}</title>
                                                            <meta name="description" content="${data.description}">
                                                            <meta property="og:image" content="${data.image}">
                                            </head>
                                            <body>
                                                            <h1>${data.title}</h1>
                                                            <p>${data.description}</p>
                                                            <img src="${data.image}" alt="OG Image" style="max-width: 300px;">
                                            </body>
                            </html>
            `)
        .join("");
};
export default generatePreview;
