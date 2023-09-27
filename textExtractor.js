import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Replace this with the URL of the website you want to scrape
  const url = 'https://cs2-0.vercel.app/';

  await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('p'); // Wait for the presence of <p> elements

  // Extract text from specific elements using page.evaluate
  const extractedText = await page.evaluate(() => {
    const paragraphs = Array.from(document.querySelectorAll('p'));

    const filteredText = paragraphs.map(p => {
      // Exclude text content of links within the paragraph
      const links = Array.from(p.querySelectorAll('a'));
      links.forEach(link => {
        link.textContent = ''; // Set link text content to an empty string
      });

      // Join the text content of the paragraph
      return p.textContent;
    });

    console.log(filteredText); // Log the filtered text content
    return filteredText.join('\n');
  });

  console.log(extractedText);

  await browser.close();
})();
