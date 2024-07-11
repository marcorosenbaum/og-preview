const generatePreview = (ogData) => {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta property="og:title" content="${ogData.title}" />
                <meta property="og:description" content="${ogData.description}" />
            </head>
            <body>
                <h1>${ogData.title}</h1>
                <p>${ogData.description}</p>
            </body>
        </html>
    `;
};
export default generatePreview;
