# Job Finder Automation 🤖

Automated job scraper for tech companies in India: **Amazon**, **Schneider Electric**, **Flipkart**, **Uber**, **PhonePe**, **Salesforce**, **Adobe**, and **SAP Fioneer**.

Runs daily via GitHub Actions and commits results to your repo. Filters for keywords like "Senior", "JavaScript", "TypeScript", "Node.js", "React", "Full Stack", etc.

---

## Features

✅ **8 Company Scrapers** — Amazon, Schneider, Flipkart, Uber, PhonePe, Salesforce, Adobe, SAP Fioneer  
✅ **Automated Scheduling** — Daily cron job via GitHub Actions (9 AM UTC / 2:30 PM IST)  
✅ **Smart Filtering** — Keyword & location-based filtering  
✅ **Deduplication** — Tracks previously found jobs, highlights new ones  
✅ **Low Cost** — Uses free GitHub Actions tier (2,000 min/month)  
✅ **Manual Override** — Run scraper anytime with `workflow_dispatch`

---

## Setup

### 1. Clone and Initialize

```bash
git clone https://github.com/your-username/job-finder-automation
cd job-finder-automation
npm install
```

### 2. Test Locally

```bash
npm run scrape
```

Results will be saved to `jobs/jobs.json`.

### 3. Push to GitHub

```bash
git add .
git commit -m "Initial job scraper setup"
git push origin main
```

### 4. GitHub Actions Automation

The workflow file `.github/workflows/daily-scrape.yml` runs daily at 9 AM UTC.

**Optional: Manual trigger**
- Go to **Actions** tab → **Daily Job Scraper** → **Run workflow** → **Run workflow**

---

## File Structure

```
job-finder-automation/
├── src/
│   ├── index.js                 # Main orchestrator
│   ├── filters.js               # Dedup & keyword filtering
│   └── scrapers/
│       ├── workday.js           # Shared Workday scraper
│       ├── amazon.js
│       ├── schneider.js
│       ├── flipkart.js
│       ├── uber.js
│       ├── phonepe.js
│       ├── salesforce.js
│       ├── adobe.js
│       └── sap-fioneer.js
├── jobs/
│   └── jobs.json                # Output file (git-tracked)
├── .github/workflows/
│   └── daily-scrape.yml         # GitHub Actions cron config
├── package.json
└── README.md
```

---

## Output Format

`jobs/jobs.json`:

```json
{
  "scrapedAt": "2026-10-13T09:00:00.000Z",
  "totalJobs": 150,
  "filteredJobs": 42,
  "newJobs": 5,
  "jobs": [
    {
      "title": "Senior Full Stack Engineer",
      "company": "Salesforce",
      "link": "https://salesforce.wd1.myworkdayjobs.com/...",
      "location": "Bengaluru, India",
      "postedDate": "2 days ago",
      "description": "...",
      "scrapedAt": "2026-10-13T09:00:00.000Z"
    }
    // ... more jobs
  ]
}
```

---

## Customization

### Change Keywords

Edit `src/index.js`:

```javascript
const KEYWORDS = [
  'Senior',
  'Full Stack',
  'JavaScript',
  'TypeScript',
  // Add your own keywords here
];
```

### Change Locations

```javascript
const LOCATIONS = ['Bengaluru', 'Bangalore', 'India', 'Remote'];
```

### Change Schedule

Edit `.github/workflows/daily-scrape.yml`:

```yaml
schedule:
  - cron: '0 9 * * *'  # 9 AM UTC daily
  # For 2x daily: also add '0 17 * * *' (5 PM UTC)
```

Cron format: `minute hour day month day-of-week`

---

## Troubleshooting

### Workflow not running?
- Check **Actions** tab → **Daily Job Scraper** for logs
- Verify GitHub Actions is enabled: **Settings** → **Actions** → **General** → "Allow all actions and reusable workflows"

### Jobs not scraping?
- Run manually to debug: **Actions** → **Run workflow**
- Check the logs for error messages
- Verify URLs are still correct (companies may change careers page paths)

### Need to adjust selectors?
- Each scraper file has CSS/XPath selectors
- If a site redesigns, update the selectors in the corresponding scraper (e.g., `src/scrapers/flipkart.js`)

---

## How Filtering Works

1. **Total scraped** — All jobs from all 8 companies
2. **After keywords** — Must contain at least one keyword (case-insensitive)
3. **After location** — Must mention Bengaluru/Bangalore/India/Remote
4. **Deduplication** — Remove duplicates against previous runs
5. **New jobs** — Marked separately for quick identification

---

## GitHub Actions Costs

| Frequency | Time/Month | Cost |
|-----------|-----------|------|
| Once daily | ~1–2 min × 30 = 30 min | ✅ Free (2,000 min included) |
| 2–3× daily | ~90 min | ✅ Free |
| Hourly | ~720 min | ✅ Free |

All within free tier for public repos.

---

## Next Steps

1. Update keywords and locations to match your search criteria
2. Add scrapers for additional companies (template in `src/scrapers/`)
3. Set up notifications (e.g., Slack webhook, email) for new jobs
4. Monitor commits to `jobs/jobs.json` for new postings

---

## License

MIT

---

## Author

Created by Abhilash Biradar | Job Search Automation
