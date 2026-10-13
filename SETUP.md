# Quick Start Guide

## Step 1: Create a GitHub Repository

1. Go to GitHub → **New Repository**
2. Name it: `job-finder-automation`
3. Choose **Public** (free GitHub Actions)
4. Initialize with no README (we have one)
5. Click **Create repository**

## Step 2: Push Code to GitHub

```bash
# From the job-finder-automation directory
git init
git add .
git commit -m "Initial job scraper setup"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/job-finder-automation.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## Step 3: Test Locally (Optional but Recommended)

Before relying on GitHub Actions, test it locally:

```bash
npm install
npm run scrape
```

Check `jobs/jobs.json` for results.

## Step 4: Verify GitHub Actions

1. Go to your repo → **Actions** tab
2. Look for **Daily Job Scraper** workflow
3. Click it → **Run workflow** → **Run workflow** (manual test)
4. Watch the logs—should complete in 2–5 minutes

## Step 5: Set Schedule

The workflow runs daily at **9 AM UTC** (2:30 PM IST).

To run at a different time, edit `.github/workflows/daily-scrape.yml`:

```yaml
schedule:
  - cron: '30 14 * * *'  # For 2:30 PM IST → use '30 9 * * *' in UTC
```

Use this converter: https://crontab.guru/

## Step 6: Monitor Results

Results are committed to `jobs/jobs.json` whenever new jobs are found.

- Check the repo's **commit history** to see when scrapers ran
- Click on a commit to see which jobs were added
- Watch for `🆕 New Jobs` in commit messages

---

## Optional: Customize Keywords

Edit `src/index.js` to change what you're searching for:

```javascript
const KEYWORDS = [
  'Senior',
  'Full Stack',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Backend',
  'Frontend',
  'Engineer',
];

const LOCATIONS = ['Bengaluru', 'Bangalore', 'India', 'Remote'];
```

Push your changes:

```bash
git add src/index.js
git commit -m "Update keywords and locations"
git push
```

---

## Troubleshooting

**Q: Why is my workflow not running?**  
A: Check **Settings** → **Actions** → **General**. Ensure "Allow all actions and reusable workflows" is enabled.

**Q: How do I run it manually?**  
A: Go **Actions** → **Daily Job Scraper** → **Run workflow** → **Run workflow** button.

**Q: What if a site changes its structure?**  
A: Update the CSS selectors in the corresponding scraper file (e.g., `src/scrapers/flipkart.js`). Reach out if you need help debugging selectors.

**Q: Can I add more companies?**  
A: Yes! Create a new file in `src/scrapers/` following the pattern of existing ones, then import it in `src/index.js`.

---

## Next Steps

1. ✅ Push to GitHub
2. ✅ Test GitHub Actions workflow
3. ✅ Watch for first run's `jobs/jobs.json` commit
4. 📧 (Optional) Set up email/Slack notifications on commits
5. 📊 (Optional) Build a dashboard to visualize `jobs.json`

---

**Happy job hunting! 🎯**
