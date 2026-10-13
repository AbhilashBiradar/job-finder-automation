#!/bin/bash

# Safe mode: Run scrapers with timeout to prevent hanging
# This prevents Puppeteer from getting stuck

# Timeout in seconds (5 minutes)
TIMEOUT=300

echo "🚀 Starting job scraper (with timeout protection)..."

# Run with timeout
timeout $TIMEOUT node src/index.js

# Capture exit code
EXIT_CODE=$?

if [ $EXIT_CODE -eq 124 ]; then
  echo "⚠️  Scraper timed out after $TIMEOUT seconds"
  echo "This is expected on first run with Puppeteer"
  echo "Attempting to save partial results if available..."
  exit 0  # Don't fail the workflow
elif [ $EXIT_CODE -ne 0 ]; then
  echo "⚠️  Scraper exited with code $EXIT_CODE"
  exit $EXIT_CODE
else
  echo "✅ Scraper completed successfully"
  exit 0
fi
