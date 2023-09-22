const axios = require('axios');
const fs = require('fs');
const path = require('path');
const download = require('download');
const cheerio = require('cheerio');  // For HTML parsing.

const WP_API_ENDPOINT = 'https://wihomewinemakers.com/wp-json/wp/v2/pages/21';

async function fetchImagesFromPage() {
    try {
        const response = await axios.get(WP_API_ENDPOINT);
        const pageData = response.data;

        const $ = cheerio.load(pageData.content.rendered);

        // Loop through each div with an ID that contains "tabs_desc".
        $('div[id*="tabs_desc"]').each(async (index, divElement) => {
            const tabId = $(divElement).attr('id');
             let folder = `folder_${tabId.split('_').pop()}`;

    // Ensure folder exists.
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }

    // Loop through each image inside this div
    $(divElement).find('img').each(async (imgIndex, imgElement) => {
        const parentAnchor = $(imgElement).parent('a');
        let imageUrl;
        if (parentAnchor.length && parentAnchor.attr('href')) {
            imageUrl = parentAnchor.attr('href');
        } else {
            imageUrl = $(imgElement).attr('src');
        }

        const imageName = path.basename(imageUrl);

        // Download and save image to the folder.
        const imageBuffer = await download(imageUrl);
        fs.writeFileSync(path.join(folder, imageName), imageBuffer);
    });
});
    } catch (error) {
        console.error('Failed to fetch images:', error.message);
    }
}

fetchImagesFromPage();
