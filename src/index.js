import HTMLFetchingService from "./services/htmlFetchingService.js";

async function run() {
  const url = "https://www.lockheedmartinjobs.com/search-jobs";
  const fetcher = new HTMLFetchingService();

  try {
    // Fetch HTML content
    const html = await fetcher.fetchHTML(url);
    console.log("HTML content fetched successfully. Printing:");
    console.log(html);
  } catch (error) {
    console.error(error.message);
  }
}

run();
