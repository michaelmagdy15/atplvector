import json
import asyncio
from pathlib import Path

from playwright.async_api import async_playwright

# Path to store the extracted syllabus
OUTPUT_PATH = Path(__file__).parent.parent / "data" / "syllabus_extracted.json"

async def scrape_subject(page, subject_url: str):
    await page.goto(subject_url)
    # Wait for the page to load
    await page.wait_for_load_state("networkidle")
    # Click the "Expand All" button to reveal all learning objectives
    # The button may have text "Expand All" or an aria-label – adjust selector if needed
    try:
        expand_btn = page.locator("button:has-text('Expand All')")
        if await expand_btn.count() > 0:
            await expand_btn.first.click()
            await page.wait_for_timeout(500)  # give UI a moment to expand
    except Exception:
        pass

    # Extract the hierarchy of learning objectives (LOs)
    # The LO items are typically rendered as list items with a data-id attribute.
    # We'll collect them recursively based on the DOM structure.
    lo_elements = await page.locator("[data-lo-id]").element_handles()
    los = []
    for el in lo_elements:
        lo_id = await el.get_attribute("data-lo-id")
        lo_text = await el.inner_text()
        # Determine parent hierarchy via closest ancestor with a LO id
        parent = await el.evaluate("el => {
            let parent = el.parentElement;
            while (parent && !parent.dataset.loId) {
                parent = parent.parentElement;
            }
            return parent ? parent.dataset.loId : null;
        }")
        los.append({"id": lo_id, "text": lo_text.strip(), "parent_id": parent})
    return los

async def main():
    async with async_playwright() as p:
        # Launch a headed browser so the user can log in manually if required
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        # Navigate to the dashboard – the user can log in manually if the site requires authentication
        await page.goto("https://pilotprogress.com/dashboard/")
        print("Please log in to PilotProgress if prompted, then close the login popup and press Enter in the console.")
        input("Press Enter after you have logged in and the dashboard is visible...")

        # Grab all subject cards from the dashboard
        subject_links = await page.locator("a[href^='/subject/']").all()
        subjects = []
        for link in subject_links:
            href = await link.get_attribute("href")
            title = await link.inner_text()
            subjects.append({"title": title.strip(), "url": f"https://pilotprogress.com{href}"})

        all_los = {}
        for sub in subjects:
            print(f"Scraping subject: {sub['title']}")
            los = await scrape_subject(page, sub["url"])
            all_los[sub["title"]] = los

        # Write the extracted data to JSON
        OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(all_los, f, ensure_ascii=False, indent=2)
        print(f"Extraction complete. Data saved to {OUTPUT_PATH}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
