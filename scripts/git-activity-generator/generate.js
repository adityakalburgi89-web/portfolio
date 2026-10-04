#!/usr/bin/env node

/**
 * Realistic Git Activity Generator
 * Generates natural, human-like commit history with realistic gaps,
 * varied daily commit counts (multiple shades of green), authentic working
 * hours, and conventional commit messages.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// --- Conventional Commit Library ---
const COMMIT_MESSAGES = [
  // Features
  { type: 'feat', scope: 'auth', msg: 'implement JWT session refresh rotation' },
  { type: 'feat', scope: 'auth', msg: 'add OAuth2 social login provider callbacks' },
  { type: 'feat', scope: 'dashboard', msg: 'create responsive metric summary widgets' },
  { type: 'feat', scope: 'dashboard', msg: 'add real-time WebSocket telemetry stream' },
  { type: 'feat', scope: 'ui', msg: 'implement dark/light theme switch with system fallback' },
  { type: 'feat', scope: 'ui', msg: 'add accessible modal dialog with focus trap' },
  { type: 'feat', scope: 'ui', msg: 'integrate custom toast notification manager' },
  { type: 'feat', scope: 'api', msg: 'add pagination and cursor filtering to list endpoint' },
  { type: 'feat', scope: 'api', msg: 'implement rate limiting middleware with Redis store' },
  { type: 'feat', scope: 'search', msg: 'add fuzzy search index with debounce hook' },
  { type: 'feat', scope: 'profile', msg: 'support avatar image cropping and webp upload' },
  { type: 'feat', scope: 'checkout', msg: 'integrate Stripe payment intent webhook handler' },
  { type: 'feat', scope: 'settings', msg: 'add user notification preferences panel' },
  { type: 'feat', scope: 'analytics', msg: 'track custom interaction events with batch queue' },
  { type: 'feat', scope: 'export', msg: 'support CSV and PDF report generation' },
  { type: 'feat', scope: 'navigation', msg: 'build responsive breadcrumb trail component' },
  { type: 'feat', scope: 'forms', msg: 'add client-side schema validation with Zod' },

  // Bug Fixes
  { type: 'fix', scope: 'auth', msg: 'resolve token expiration race condition during parallel requests' },
  { type: 'fix', scope: 'ui', msg: 'prevent layout shift on hero banner font load' },
  { type: 'fix', scope: 'ui', msg: 'resolve z-index conflict between dropdown and sticky header' },
  { type: 'fix', scope: 'api', msg: 'handle null values in nested payload transformation' },
  { type: 'fix', scope: 'cache', msg: 'invalidate stale cache keys on entity update' },
  { type: 'fix', scope: 'routing', msg: 'preserve query params during cross-tab redirection' },
  { type: 'fix', scope: 'perf', msg: 'fix memory leak in unmounted canvas particle listener' },
  { type: 'fix', scope: 'mobile', msg: 'correct viewport height calculation for iOS safari address bar' },
  { type: 'fix', scope: 'table', msg: 'prevent horizontal scroll overflow on compact screens' },
  { type: 'fix', scope: 'types', msg: 'resolve polymorphic component props type inference' },
  { type: 'fix', scope: 'validation', msg: 'properly sanitize and escape markdown preview inputs' },
  { type: 'fix', scope: 'state', msg: 'ensure atom updates trigger re-renders synchronously' },
  { type: 'fix', scope: 'modal', msg: 'prevent body background scrolling when drawer is open' },

  // Refactorings
  { type: 'refactor', scope: 'hooks', msg: 'extract reusable useMediaQuery and useDebounce hooks' },
  { type: 'refactor', scope: 'state', msg: 'migrate global state store to slice pattern' },
  { type: 'refactor', scope: 'components', msg: 'break down monolithic dashboard card into subcomponents' },
  { type: 'refactor', scope: 'api', msg: 'standardize error response envelopes across controllers' },
  { type: 'refactor', scope: 'styles', msg: 'consolidate repeated Tailwind utility classes into design tokens' },
  { type: 'refactor', scope: 'utils', msg: 'replace lodash helpers with native ES2022 methods' },
  { type: 'refactor', scope: 'database', msg: 'optimize query join patterns to eliminate N+1 problem' },
  { type: 'refactor', scope: 'router', msg: 'group protected routes under common layout guard' },

  // Performance
  { type: 'perf', scope: 'bundle', msg: 'enable dynamic imports and route-based code splitting' },
  { type: 'perf', scope: 'images', msg: 'serve modern AVIF/WebP formats with responsive srcsets' },
  { type: 'perf', scope: 'render', msg: 'memoize heavy data table row renderers with React.memo' },
  { type: 'perf', scope: 'api', msg: 'add ETags and HTTP caching headers to static resource endpoints' },
  { type: 'perf', scope: 'fonts', msg: 'preload critical web fonts with font-display swap' },
  { type: 'perf', scope: 'css', msg: 'apply content-visibility to below-the-fold sections' },

  // Styling & Design
  { type: 'style', scope: 'theme', msg: 'fine-tune contrast ratios to satisfy WCAG AAA standards' },
  { type: 'style', scope: 'animation', msg: 'smooth ease-out transitions for card expand interactions' },
  { type: 'style', scope: 'typography', msg: 'adjust line-height and letter-spacing for readable body text' },
  { type: 'style', scope: 'button', msg: 'refine button active states and tactile hover glow' },
  { type: 'style', scope: 'layout', msg: 'improve mobile gutter spacing across grid sections' },

  // Testing
  { type: 'test', scope: 'auth', msg: 'add integration test suite for login and password recovery' },
  { type: 'test', scope: 'utils', msg: 'increase unit test coverage for date formatting helpers' },
  { type: 'test', scope: 'api', msg: 'mock external payment provider responses in test runner' },
  { type: 'test', scope: 'e2e', msg: 'add Playwright regression tests for user onboarding flow' },

  // Documentation & Chore
  { type: 'docs', scope: 'readme', msg: 'update architecture diagrams and local dev setup steps' },
  { type: 'docs', scope: 'api', msg: 'generate OpenAPI specifications and swagger documentation' },
  { type: 'chore', scope: 'deps', msg: 'upgrade packages to latest stable releases' },
  { type: 'chore', scope: 'ci', msg: 'configure GitHub Actions workflow for automated test runner' },
  { type: 'chore', scope: 'lint', msg: 'enforce strict ESLint and Prettier formatting rules' }
];

// --- Activity Profiles ---
const PROFILES = {
  heavy: {
    name: 'Heavy Activity (Recommended)',
    minCommits: 450,
    maxCommits: 600,
    weekdayActiveChance: 0.78,    // ~4 out of 5 weekdays active
    weekendActiveChance: 0.22,    // occasional weekend sprint
    vacationBreaksCount: 6,       // 6 natural multi-day breaks per year
    vacationLengthRange: [3, 6],  // 3 to 6 days off
    dailyCommitWeights: [
      { min: 2, max: 3, weight: 0.35 },  // Light active day (Level 1 green)
      { min: 4, max: 6, weight: 0.40 },  // Moderate active day (Level 2-3 green)
      { min: 7, max: 9, weight: 0.20 },  // Heavy sprint day (Level 3-4 green)
      { min: 10, max: 12, weight: 0.05 } // Marathon sprint day (Deep Level 4 green)
    ]
  },
  moderate: {
    name: 'Moderate Activity',
    minCommits: 220,
    maxCommits: 350,
    weekdayActiveChance: 0.60,
    weekendActiveChance: 0.12,
    vacationBreaksCount: 8,
    vacationLengthRange: [4, 7],
    dailyCommitWeights: [
      { min: 1, max: 2, weight: 0.50 },
      { min: 3, max: 4, weight: 0.35 },
      { min: 5, max: 6, weight: 0.15 }
    ]
  },
  light: {
    name: 'Light Activity',
    minCommits: 100,
    maxCommits: 180,
    weekdayActiveChance: 0.40,
    weekendActiveChance: 0.05,
    vacationBreaksCount: 10,
    vacationLengthRange: [5, 10],
    dailyCommitWeights: [
      { min: 1, max: 1, weight: 0.65 },
      { min: 2, max: 3, weight: 0.35 }
    ]
  }
};

// --- Helper Utilities ---
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    profile: 'heavy',
    targetDir: null,
    startDate: null,
    endDate: null,
    minCommits: null,
    maxCommits: null,
    authorName: null,
    authorEmail: null,
    dryRun: false,
    empty: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--empty') options.empty = true;
    else if (arg === '--profile' && args[i + 1]) options.profile = args[++i];
    else if (arg === '--target' && args[i + 1]) options.targetDir = args[++i];
    else if (arg === '--start-date' && args[i + 1]) options.startDate = args[++i];
    else if (arg === '--end-date' && args[i + 1]) options.endDate = args[++i];
    else if (arg === '--min-commits' && args[i + 1]) options.minCommits = parseInt(args[++i], 10);
    else if (arg === '--max-commits' && args[i + 1]) options.maxCommits = parseInt(args[++i], 10);
    else if (arg === '--author-name' && args[i + 1]) options.authorName = args[++i];
    else if (arg === '--author-email' && args[i + 1]) options.authorEmail = args[++i];
  }
  return options;
}

function printHelp() {
  console.log(`
\x1b[32m╔══════════════════════════════════════════════════════════════════════╗
║                Realistic Git Activity Generator                      ║
╚══════════════════════════════════════════════════════════════════════╝\x1b[0m

Usage:
  node generate.js [options]

Options:
  --target <dir>          Target repository directory (creates if not existing)
  --profile <name>        Activity profile: heavy (default), moderate, light
  --min-commits <N>       Minimum total commits desired
  --max-commits <N>       Maximum total commits desired
  --start-date <YYYY-MM-DD> Start date (default: 365 days ago)
  --end-date <YYYY-MM-DD>   End date (default: today)
  --author-name <name>    Git author name (defaults to git config user.name)
  --author-email <email>  Git author email (defaults to git config user.email)
  --dry-run               Simulate and display ASCII calendar without writing git commits
  --empty                 Create empty git commits (--allow-empty) instead of writing files
  --help, -h              Show this help message

Examples:
  \x1b[36mnode generate.js --target ../activity-repo --profile heavy\x1b[0m
  \x1b[36mnode generate.js --dry-run\x1b[0m
  \x1b[36mnode generate.js --target ./my-repo --min-commits 480 --max-commits 550\x1b[0m
`);
}

/**
 * Generate calendar dates with natural human patterns
 */
function buildActivityPlan(profile, customOpts) {
  const endDate = customOpts.endDate ? new Date(customOpts.endDate) : new Date();
  const startDate = customOpts.startDate ? new Date(customOpts.startDate) : new Date(endDate.getTime() - 364 * 24 * 60 * 60 * 1000);

  const targetMin = customOpts.minCommits || profile.minCommits;
  const targetMax = customOpts.maxCommits || profile.maxCommits;
  const targetTotal = randomInt(targetMin, targetMax);

  // List all days in range
  const days = [];
  const curr = new Date(startDate);
  while (curr <= endDate) {
    days.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }

  // Generate vacation/break ranges (consecutive 0-commit days)
  const vacationDays = new Set();
  const numBreaks = profile.vacationBreaksCount;
  for (let b = 0; b < numBreaks; b++) {
    const breakStartIdx = randomInt(10, Math.max(11, days.length - 20));
    const breakLen = randomInt(profile.vacationLengthRange[0], profile.vacationLengthRange[1]);
    for (let i = 0; i < breakLen && (breakStartIdx + i) < days.length; i++) {
      vacationDays.add(formatDate(days[breakStartIdx + i]));
    }
  }

  // Determine active days based on weekday/weekend probabilities
  const plan = [];
  let estimatedCommits = 0;

  for (const day of days) {
    const dateStr = formatDate(day);
    const dayOfWeek = day.getDay(); // 0 = Sun, 6 = Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let isActive = false;
    if (!vacationDays.has(dateStr)) {
      const chance = isWeekend ? profile.weekendActiveChance : profile.weekdayActiveChance;
      isActive = Math.random() < chance;
    }

    let commitsCount = 0;
    if (isActive) {
      // Pick commit tier from weights
      const roll = Math.random();
      let cumulative = 0;
      let selectedTier = profile.dailyCommitWeights[0];

      for (const tier of profile.dailyCommitWeights) {
        cumulative += tier.weight;
        if (roll <= cumulative) {
          selectedTier = tier;
          break;
        }
      }
      commitsCount = randomInt(selectedTier.min, selectedTier.max);
      estimatedCommits += commitsCount;
    }

    plan.push({
      date: day,
      dateStr,
      dayOfWeek,
      isWeekend,
      isVacation: vacationDays.has(dateStr),
      commitsCount
    });
  }

  // Adjust total commits to fall strictly within [targetMin, targetMax]
  let currentTotal = plan.reduce((sum, d) => sum + d.commitsCount, 0);

  if (currentTotal < targetMin) {
    // Need to boost commits on existing active days or turn some weekdays into active
    const candidates = plan.filter(d => !d.isVacation && d.commitsCount > 0);
    while (currentTotal < targetMin && candidates.length > 0) {
      const pick = randomChoice(candidates);
      pick.commitsCount += 1;
      currentTotal += 1;
    }
  } else if (currentTotal > targetMax) {
    // Need to reduce commits
    const candidates = plan.filter(d => d.commitsCount > 2);
    while (currentTotal > targetMax && candidates.length > 0) {
      const pick = randomChoice(candidates);
      pick.commitsCount -= 1;
      currentTotal -= 1;
    }
  }

  return { plan, totalCommits: currentTotal, targetTotal };
}

/**
 * Generate realistic timestamps on an active day
 */
function generateCommitTimestamps(day, count) {
  const timestamps = [];
  const year = day.getFullYear();
  const month = day.getMonth();
  const date = day.getDate();

  // Sessions: morning (10:00-12:30), afternoon (14:00-18:00), evening (19:30-23:15)
  const sessions = [
    { startHour: 10, endHour: 12 },
    { startHour: 14, endHour: 18 },
    { startHour: 19, endHour: 23 }
  ];

  // Distribute commits across sessions
  const chosenHours = [];
  for (let i = 0; i < count; i++) {
    const session = randomChoice(sessions);
    const hour = randomInt(session.startHour, session.endHour);
    const minute = randomInt(0, 59);
    const second = randomInt(0, 59);
    chosenHours.push(hour * 3600 + minute * 60 + second);
  }

  // Sort ascending so commits are chronologically natural
  chosenHours.sort((a, b) => a - b);

  // Offset any identical minutes
  for (let i = 0; i < chosenHours.length; i++) {
    if (i > 0 && chosenHours[i] <= chosenHours[i - 1]) {
      chosenHours[i] = chosenHours[i - 1] + randomInt(180, 1800); // +3 to 30 mins
    }
    const h = Math.floor(chosenHours[i] / 3600) % 24;
    const m = Math.floor((chosenHours[i] % 3600) / 60);
    const s = chosenHours[i] % 60;

    const commitDate = new Date(year, month, date, h, m, s);
    timestamps.push(commitDate);
  }

  return timestamps;
}

/**
 * Display ASCII Contribution Heatmap
 */
function renderAsciiHeatmap(plan, totalCommits) {
  console.log(`\n\x1b[1m\x1b[36m=== GitHub Contribution Graph Preview (${totalCommits} commits) ===\x1b[0m\n`);

  // Group days by week (columns)
  const weeks = [];
  let currentWeek = [];

  // Align start to Sunday/Monday
  const firstDay = plan[0].date.getDay();
  for (let pad = 0; pad < firstDay; pad++) {
    currentWeek.push(null);
  }

  for (const d of plan) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let row = 0; row < 7; row++) {
    let rowStr = `\x1b[90m${dayLabels[row]} \x1b[0m`;
    for (const week of weeks) {
      const cell = week[row];
      if (!cell) {
        rowStr += ' ';
      } else {
        const c = cell.commitsCount;
        if (c === 0) rowStr += '\x1b[90m·\x1b[0m';                // Empty gap (grey dot)
        else if (c <= 2) rowStr += '\x1b[32m░\x1b[0m';            // Level 1: light green
        else if (c <= 5) rowStr += '\x1b[32m\x1b[1m▒\x1b[0m';     // Level 2: medium green
        else if (c <= 8) rowStr += '\x1b[92m\x1b[1m▓\x1b[0m';     // Level 3: bright green
        else rowStr += '\x1b[97m\x1b[42m█\x1b[0m';                // Level 4: intense green
      }
    }
    console.log(rowStr);
  }

  const activeDays = plan.filter(d => d.commitsCount > 0).length;
  const gapDays = plan.length - activeDays;
  const weekendActive = plan.filter(d => d.isWeekend && d.commitsCount > 0).length;
  const maxInDay = Math.max(...plan.map(d => d.commitsCount));

  console.log(`\n\x1b[33mLegend:\x1b[0m \x1b[90m· 0 (Gap)\x1b[0m  \x1b[32m░ 1-2\x1b[0m  \x1b[32m\x1b[1m▒ 3-5\x1b[0m  \x1b[92m\x1b[1m▓ 6-8\x1b[0m  \x1b[97m\x1b[42m█ 9+\x1b[0m`);
  console.log(`\x1b[36mStatistics:\x1b[0m`);
  console.log(`  • Total commits:       \x1b[1m${totalCommits}\x1b[0m`);
  console.log(`  • Active days:         \x1b[1m${activeDays}\x1b[0m (${Math.round((activeDays / plan.length) * 100)}% of year)`);
  console.log(`  • Natural gaps / off:  \x1b[1m${gapDays}\x1b[0m days (${Math.round((gapDays / plan.length) * 100)}% off-days)`);
  console.log(`  • Weekend sprints:     \x1b[1m${weekendActive}\x1b[0m active weekend days`);
  console.log(`  • Max single-day:      \x1b[1m${maxInDay}\x1b[0m commits`);
  console.log(`  • Avg on active days:  \x1b[1m${(totalCommits / activeDays).toFixed(1)}\x1b[0m commits/day\n`);
}

/**
 * Format Date to Git ISO string: "YYYY-MM-DD HH:MM:SS +0530"
 */
function toGitDateFormat(date) {
  const pad = n => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const offsetHours = pad(Math.floor(Math.abs(offsetMinutes) / 60));
  const offsetMins = pad(Math.abs(offsetMinutes) % 60);

  return `${y}-${m}-${d} ${hh}:${mm}:${ss} ${sign}${offsetHours}${offsetMins}`;
}

/**
 * Main Execution
 */
function main() {
  const opts = parseArgs();
  if (opts.help) {
    printHelp();
    return;
  }

  const profile = PROFILES[opts.profile] || PROFILES.heavy;
  console.log(`\n\x1b[32m🚀 Initializing Realistic Git Activity Generator\x1b[0m`);
  console.log(`Profile: \x1b[36m${profile.name}\x1b[0m`);

  // Detect Git Author Name & Email
  let authorName = opts.authorName;
  let authorEmail = opts.authorEmail;

  if (!authorName || !authorEmail) {
    try {
      if (!authorName) authorName = execSync('git config user.name', { encoding: 'utf8' }).trim();
    } catch {}
    try {
      if (!authorEmail) authorEmail = execSync('git config user.email', { encoding: 'utf8' }).trim();
    } catch {}
  }

  if (!authorName) authorName = 'Developer';
  if (!authorEmail) authorEmail = 'developer@users.noreply.github.com';

  console.log(`Author:  \x1b[33m${authorName} <${authorEmail}>\x1b[0m`);

  // Build the activity plan
  const { plan, totalCommits } = buildActivityPlan(profile, opts);

  // Render ASCII preview
  renderAsciiHeatmap(plan, totalCommits);

  if (opts.dryRun) {
    console.log(`\x1b[33m[DRY RUN]\x1b[0m No git commits were created. Remove --dry-run to generate commits.`);
    return;
  }

  // Determine target directory
  const targetDir = opts.targetDir ? path.resolve(opts.targetDir) : path.resolve(process.cwd(), 'activity-repo');
  console.log(`Target Repository: \x1b[36m${targetDir}\x1b[0m`);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`Created directory: ${targetDir}`);
  }

  // Check if .git exists, else init
  const gitDir = path.join(targetDir, '.git');
  if (!fs.existsSync(gitDir)) {
    console.log(`Initializing git repository...`);
    execSync('git init -b main', { cwd: targetDir, stdio: 'ignore' });
  }

  // Set local git config in target repo
  execSync(`git config user.name "${authorName}"`, { cwd: targetDir });
  execSync(`git config user.email "${authorEmail}"`, { cwd: targetDir });

  const trackerFile = path.join(targetDir, 'activity.md');
  if (!opts.empty && !fs.existsSync(trackerFile)) {
    fs.writeFileSync(trackerFile, `# Project Engineering Log\n\nDaily automated and manual engineering progress log.\n\n`);
  }

  console.log(`\n\x1b[32m⏳ Committing ${totalCommits} realistic contributions with natural gaps...\x1b[0m`);

  let commitIndex = 0;
  let activeDaysProcessed = 0;

  for (const day of plan) {
    if (day.commitsCount === 0) continue;

    activeDaysProcessed++;
    const timestamps = generateCommitTimestamps(day.date, day.commitsCount);

    for (const ts of timestamps) {
      commitIndex++;
      const commitMsgTemplate = randomChoice(COMMIT_MESSAGES);
      const commitMsg = `${commitMsgTemplate.type}(${commitMsgTemplate.scope}): ${commitMsgTemplate.msg}`;
      const gitDateStr = toGitDateFormat(ts);

      if (!opts.empty) {
        fs.appendFileSync(
          trackerFile,
          `- [${gitDateStr.split(' ')[0]}] \`${commitMsg}\`\n`
        );
        execSync(`git add activity.md`, { cwd: targetDir, stdio: 'ignore' });
      }

      // Execute git commit with explicit author & committer dates
      const env = {
        ...process.env,
        GIT_AUTHOR_NAME: authorName,
        GIT_AUTHOR_EMAIL: authorEmail,
        GIT_AUTHOR_DATE: gitDateStr,
        GIT_COMMITTER_NAME: authorName,
        GIT_COMMITTER_EMAIL: authorEmail,
        GIT_COMMITTER_DATE: gitDateStr
      };

      const commitCmd = opts.empty
        ? `git commit --allow-empty -m "${commitMsg.replace(/"/g, '\\"')}"`
        : `git commit -m "${commitMsg.replace(/"/g, '\\"')}"`;

      execSync(commitCmd, { cwd: targetDir, env, stdio: 'ignore' });
    }

    if (activeDaysProcessed % 25 === 0 || commitIndex === totalCommits) {
      process.stdout.write(`\rProgress: \x1b[32m${commitIndex}/${totalCommits}\x1b[0m commits generated...`);
    }
  }

  console.log(`\n\n\x1b[32m✔ Successfully generated ${totalCommits} realistic commits across ${activeDaysProcessed} active days!\x1b[0m`);
  console.log(`\n\x1b[35mNext Steps:\x1b[0m`);
  console.log(`1. Create a new repository on GitHub (e.g. named \x1b[33mdev-activity\x1b[0m or \x1b[33mcode-journal\x1b[0m)`);
  console.log(`2. Link and push your commits:`);
  console.log(`   \x1b[36mcd "${targetDir}"\x1b[0m`);
  console.log(`   \x1b[36mgit remote add origin https://github.com/${authorName.replace(/\s+/g, '')}/<your-repo-name>.git\x1b[0m`);
  console.log(`   \x1b[36mgit push -u origin main --force\x1b[0m\n`);
}

main();
