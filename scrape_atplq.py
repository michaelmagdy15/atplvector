import os
import time
import json
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        # Launch browser in visible mode so you can interact with it
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to https://atplquestions.com/ ...")
        page.goto("https://atplquestions.com/")

        print("\n" + "="*60)
        print("ACTION REQUIRED:")
        print("1. Please interact with the browser window to solve the Cloudflare challenge.")
        print("2. Log in with your Google Account.")
        print("3. Navigate to a page that lists the questions or a specific subject you want to scrape.")
        print("="*60 + "\n")

        # Wait for user to confirm they are ready
        input("Press ENTER in this terminal once you are logged in and on the target page...")

        print("Capturing page content...")
        
        # Get the page title and content
        title = page.title()
        content = page.content()
        
        # Try to identify potential question links or data structures
        # This is a broad dump to help us understand the internal structure
        
        output_data = {
            "title": title,
            "url": page.url,
            "html": content,
            # specific extraction logic will be added once we see the authenticated structure
        }
        
        filename = "atplq_dump.json"
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
            
        print(f"Successfully saved page data to {filename}")
        print("I can now analyze this file to build the full scraper.")
        
        # Keep browser open for a moment
        time.sleep(2)
        browser.close()

if __name__ == "__main__":
    try:
        run()
    except Exception as e:
        print(f"Error occurred: {e}")
        print("Make sure you have playwright installed: pip install playwright")
        print("And browsers installed: playwright install")
