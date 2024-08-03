// Import the service and puppeteer
import HTMLFetchingService from "../src/services/htmlFetchingService.js";
import puppeteer from "puppeteer";

// Mock the entire puppeteer module
jest.mock("puppeteer");

describe("HTMLFetchingService", () => {
  let service;
  let mockBrowser;
  let mockPage;

  // Set up mocks before each test
  beforeEach(() => {
    // Create a new instance of the service
    service = new HTMLFetchingService();

    // Create mock page object with necessary methods
    mockPage = {
      goto: jest.fn(),
      content: jest.fn(),
    };

    // Create mock browser object with necessary methods
    mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    };

    // Mock puppeteer.launch to return our mock browser
    puppeteer.launch.mockResolvedValue(mockBrowser);
  });

  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test successful HTML fetching
  test("fetchHTML should return content when successful", async () => {
    const url = "https://example.com";
    const expectedContent = "<html><body>Test Content</body></html>";
    mockPage.content.mockResolvedValue(expectedContent);

    const result = await service.fetchHTML(url);

    // Assert the returned content matches expected
    expect(result).toBe(expectedContent);
    // Verify puppeteer was launched with correct options
    expect(puppeteer.launch).toHaveBeenCalledWith({ headless: true });
    // Verify a new page was created
    expect(mockBrowser.newPage).toHaveBeenCalled();
    // Verify the page navigated to the correct URL with correct options
    expect(mockPage.goto).toHaveBeenCalledWith(url, {
      waitUntil: "networkidle2",
    });
    // Verify content was retrieved
    expect(mockPage.content).toHaveBeenCalled();
    // Verify browser was closed
    expect(mockBrowser.close).toHaveBeenCalled();
  });

  // Test error handling when page navigation fails
  test("fetchHTML should throw an error when page.goto fails", async () => {
    const url = "https://example.com";
    const errorMessage = "Navigation failed";
    mockPage.goto.mockRejectedValue(new Error(errorMessage));

    // Assert that the method throws with the correct error message
    await expect(service.fetchHTML(url)).rejects.toThrow(
      `Failed to fetch HTML: ${errorMessage}`
    );
    // Verify browser was closed even when an error occurred
    expect(mockBrowser.close).toHaveBeenCalled();
  });

  // Test error handling when content extraction fails
  test("fetchHTML should throw an error when page.content fails", async () => {
    const url = "https://example.com";
    const errorMessage = "Content extraction failed";
    mockPage.content.mockRejectedValue(new Error(errorMessage));

    // Assert that the method throws with the correct error message
    await expect(service.fetchHTML(url)).rejects.toThrow(
      `Failed to fetch HTML: ${errorMessage}`
    );
    // Verify browser was closed even when an error occurred
    expect(mockBrowser.close).toHaveBeenCalled();
  });

  // Test that browser is closed even if an error occurs early in the process
  test("fetchHTML should close the browser even if an error occurs", async () => {
    const url = "https://example.com";
    mockBrowser.newPage.mockRejectedValue(new Error("Browser error"));

    // Assert that the method throws with the correct error message
    await expect(service.fetchHTML(url)).rejects.toThrow(
      "Failed to fetch HTML: Browser error"
    );
    // Verify browser was closed even when an error occurred
    expect(mockBrowser.close).toHaveBeenCalled();
  });
});
