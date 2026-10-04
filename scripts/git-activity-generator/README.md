# 🌿 Realistic Git Activity Generator

A zero-dependency CLI tool that generates natural, human-like GitHub contribution activity. It eliminates the "robotic solid green wall" by introducing natural developer patterns: gaps, off-days, weekend rest, vacation pauses, and multi-tier commit density (all 4 shades of GitHub green).

---

## 📊 Comparison: Generic vs. Realistic

| Feature | Robotic / Generic Bot (Before) | Realistic Generator (After) |
| :--- | :--- | :--- |
| **Gaps & Breaks** | 0 gaps (Every single day has 1 commit) | **~50% off-days** (natural weekends & breaks) |
| **Commit Density** | Flat 1 commit/day (monochromatic green) | **Varied 2 to 10+ commits/day** (All 4 green shades) |
| **Weekend Work** | Committed every Saturday & Sunday | **Occasional weekend sprints (~20%)** |
| **Timestamps** | Identical fixed times | **Natural work sessions** (Morning, Afternoon, Night) |
| **Commit Messages** | "Commit 1", "Commit 2" or repeated dummy text | **150+ conventional commits** (`feat`, `fix`, `refactor`, `perf`, `style`) |

---

## 🚀 Quick Start

### 1. Preview Heatmap (Dry Run)
Preview your randomized contribution calendar directly in your terminal without modifying any files:

```bash
node scripts/git-activity-generator/generate.js --dry-run
```

### 2. Generate Commits into a New Repository
To generate realistic history into a standalone repository (recommended):

```bash
node scripts/git-activity-generator/generate.js --target ../activity-showcase
```

### 3. Push to GitHub
Create a new repository on your GitHub account (e.g., `developer-activity` or `code-journal`), then push:

```bash
cd ../activity-showcase
git remote add origin https://github.com/adityakalburgi89-web/<repo-name>.git
git branch -M main
git push -u origin main
```

Within a few minutes, GitHub will update your contribution graph with the new, realistic pattern!

---

## ⚙️ CLI Options & Customization

| Flag | Description | Default |
| :--- | :--- | :--- |
| `--dry-run` | Display terminal ASCII heatmap without committing | `false` |
| `--target <dir>` | Directory of the repository to generate into | `./activity-repo` |
| `--profile <name>` | Activity preset: `heavy`, `moderate`, `light` | `heavy` |
| `--min-commits <N>` | Target minimum commits | `450` |
| `--max-commits <N>` | Target maximum commits | `600` |
| `--start-date <YYYY-MM-DD>` | Custom start date | 365 days ago |
| `--end-date <YYYY-MM-DD>` | Custom end date | Today |
| `--author-name <name>` | Git author name | Auto-detected from git config |
| `--author-email <email>` | Git author email | Auto-detected from git config |
| `--empty` | Use `--allow-empty` commits instead of modifying `activity.md` | `false` |

---

## 🎯 Activity Profiles

1. **`heavy`** (Default):
   - ~450–600 commits per year
   - 4–5 active weekdays/week, ~20% weekend activity
   - 2–10+ commits per active day (yields vibrant multi-shade green cells)
   - 6 natural vacation / break periods (3–6 days off)

2. **`moderate`**:
   - ~220–350 commits per year
   - 3–4 active days/week, ~12% weekend activity
   - 1–6 commits per active day

3. **`light`**:
   - ~100–180 commits per year
   - 2–3 active days/week, rare weekends
   - 1–3 commits per active day
