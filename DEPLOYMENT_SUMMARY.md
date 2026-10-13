# 🎯 Job Finder Automation — Deployment Summary

## ✅ Status: LIVE AND DEPLOYED

Your automated job scraper is now running on **AbhilashBiradar/job-finder-automation**.

---

## 📍 Repository Details

| Field | Value |
|-------|-------|
| **URL** | https://github.com/AbhilashBiradar/job-finder-automation |
| **Account** | AbhilashBiradar |
| **Visibility** | Public |
| **Status** | ✅ Active |

---

## 🎯 What It Does

Automatically scrapes job postings from **8 companies** and filters for:
- **Keywords**: Senior, Full Stack, JavaScript, TypeScript, Node.js, React, Backend, Frontend, Engineer
- **Locations**: Bengaluru, Bangalore, India, Remote
- **Frequency**: **Twice daily** — 6:00 AM IST & 4:00 PM IST

---

## 📦 Companies Covered

```
1. Amazon
2. Schneider Electric
3. Flipkart
4. Uber
5. PhonePe
6. Salesforce
7. Adobe
8. SAP Fioneer
```

---

## ⏰ Schedule (Updated for Your Request)

| Time | UTC | IST | Run |
|------|-----|-----|-----|
| 12:30 AM UTC | 12:30 AM | 6:00 AM | Run 1 |
| 10:30 AM UTC | 10:30 AM | 4:00 PM | Run 2 |

**Cron Jobs Used**:
- `30 0 * * *` → 6 AM IST
- `30 10 * * *` → 4 PM IST

---

## 🚀 How It Works

1. **GitHub Actions** triggers at 6 AM & 4 PM IST
2. **Node.js scraper** runs and fetches jobs from 8 career sites
3. **Puppeteer** handles JavaScript-rendered sites (Workday)
4. **Cheerio** parses static HTML sites
5. **Smart filter** applies keywords + location matching
6. **Deduplication** detects NEW jobs vs. previously found
7. **Auto-commit** pushes results to `jobs/jobs.json`
8. **You get notified** via GitHub email (optional)

---

## 📊 Output Format

**File**: `jobs/jobs.json`

**Example**:
```json
{
  "scrapedAt": "2026-10-13T12:30:00Z",
  "totalJobs": 250,
  "filteredJobs": 48,
  "newJobs": 5,
  "jobs": [
    {
      "title": "Senior Full Stack Engineer",
      "company": "Salesforce",
      "link": "https://salesforce.wd1.myworkdayjobs.com/...",
      "location": "Bengaluru, India",
      "description": "Build scalable Node.js and React apps",
      "scrapedAt": "2026-10-13T12:30:00Z"
    },
    // ... more jobs
  ]
}
```

---

## 🔗 Quick Links

- **Repository**: https://github.com/AbhilashBiradar/job-finder-automation
- **Actions Tab**: https://github.com/AbhilashBiradar/job-finder-automation/actions
- **Jobs File**: https://github.com/AbhilashBiradar/job-finder-automation/blob/master/jobs/jobs.json
- **README**: https://github.com/AbhilashBiradar/job-finder-automation/blob/master/README.md

---

## 📅 First Runs

| Time | When |
|------|------|
| **Run 1** | Tomorrow 6:00 AM IST |
| **Run 2** | Tomorrow 4:00 PM IST |

Then automatically **every day, twice daily**.

---

## 🔧 How to Monitor

### View Results
1. Go to https://github.com/AbhilashBiradar/job-finder-automation
2. Click **jobs/jobs.json** to view all jobs
3. Check **commits** to see when updates happened

### Watch Workflow Runs
1. Go to **Actions** tab
2. Click **Daily Job Scraper**
3. See each run's status, duration, and logs

### Get Notifications
- GitHub emails you when new commits are pushed
- Check **Settings** → **Notifications** to configure

---

## 🎨 Customization (Anytime)

### Change Keywords
Edit `src/index.js` line 17:
```javascript
const KEYWORDS = [
  'Senior',
  'Full Stack',
  'JavaScript',
  // Add/remove keywords here
];
```

### Change Schedule
Edit `.github/workflows/daily-scrape.yml` line 5-6:
```yaml
schedule:
  - cron: '30 0 * * *'  # Change this time
  - cron: '30 10 * * *'  # And this one
```
Use https://crontab.guru/ to convert times.

### Add More Companies
1. Create `src/scrapers/newcompany.js`
2. Import in `src/index.js`
3. Add to scrapers array
4. Push to GitHub

---

## 💡 Pro Tips

✅ **Star the repo** for quick access later  
✅ **Watch the repo** to get email notifications  
✅ **Clone locally** to work on changes: `git clone https://github.com/AbhilashBiradar/job-finder-automation`  
✅ **Trigger manually** in Actions tab to test anytime  
✅ **Check logs** if a run fails to debug issues  

---

## 🆘 Troubleshooting

**Q: Why isn't it running?**  
A: Check Actions tab. If disabled, go to Settings → Actions → Enable.

**Q: How do I run it manually?**  
A: Actions tab → Daily Job Scraper → Run workflow button.

**Q: What if a site changes?**  
A: Update the scraper in `src/scrapers/companyname.js`. Or open an issue.

**Q: How many times can it run per day?**  
A: Unlimited (free tier: 2,000 min/month). Twice daily uses ~60 min/month.

---

## ✨ What's Included

```
job-finder-automation/
├── src/
│   ├── index.js                    (Orchestrator)
│   ├── filters.js                  (Filter logic)
│   └── scrapers/
│       ├── amazon.js, schneider.js, flipkart.js, etc.  (8 scrapers)
├── .github/workflows/
│   └── daily-scrape.yml            (GitHub Actions config)
├── jobs/
│   └── jobs.json                   (Output file)
├── package.json
├── package-lock.json
├── README.md
├── SETUP.md
├── DEPLOYMENT_COMPLETE.md
└── TEST_RESULTS.md
```

---

## 🎊 You're All Set!

Your job scraper is **live**, **automated**, and **ready to find you opportunities**.

- ✅ Runs twice daily automatically
- ✅ Filters for your target keywords
- ✅ Deduplicates new jobs
- ✅ Costs nothing (free GitHub Actions)
- ✅ Fully customizable

**Next step**: Check back tomorrow morning to see the first run's results!

---

**Questions?** Check the README.md in the repo or review the SETUP.md for detailed instructions.

**Happy job hunting! 🚀**
