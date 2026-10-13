function filterAndDeduplicate(jobs, previousJobs, keywords, locations) {
  // Create a set of previous job links for deduplication
  const previousLinks = new Set(previousJobs.map((job) => job.link));

  // Filter jobs
  const filtered = jobs.filter((job) => {
    // Check if location matches
    const locationMatch = locations.some((loc) =>
      (job.location || '').toLowerCase().includes(loc.toLowerCase())
    );

    // Check if any keyword matches in title or description
    const keywordMatch = keywords.some(
      (keyword) =>
        (job.title || '').toLowerCase().includes(keyword.toLowerCase()) ||
        (job.description || '').toLowerCase().includes(keyword.toLowerCase())
    );

    return locationMatch && keywordMatch;
  });

  // Identify new jobs
  const newJobs = filtered.filter((job) => !previousLinks.has(job.link));

  // Merge with previous jobs (keep new ones at top, preserve old ones)
  const mergedJobs = [
    ...newJobs,
    ...filtered.filter((job) =>
      previousJobs.find((pj) => pj.link === job.link)
    ),
  ];

  return {
    jobs: mergedJobs,
    newJobs: newJobs,
  };
}

module.exports = {
  filterAndDeduplicate,
};
