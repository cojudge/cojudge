#!/bin/sh
# Daily digest: fetches repo stats + tech news, sends email via Resend
# Usage: RESEND_API_KEY=re_xxx ./scripts/daily-digest.sh

set -e

REPO="cojudge/cojudge"
RECIPIENT="${RECIPIENT:-knyl2013@gmail.com}"
SENDER="${SENDER:-onboarding@resend.dev}"

STATS=$(curl -s "https://api.github.com/repos/$REPO")
STARS=$(echo "$STATS" | grep -o '"stargazers_count": [0-9]*' | cut -d' ' -f2)
FORKS=$(echo "$STATS" | grep -o '"forks_count": [0-9]*' | cut -d' ' -f2)
ISSUES=$(echo "$STATS" | grep -o '"open_issues_count": [0-9]*' | cut -d' ' -f2)

COMMITS=$(curl -s "https://api.github.com/repos/$REPO/commits?per_page=5")
COMMIT_LOG=$(echo "$COMMITS" | grep -o '"message": "[^"]*"' | head -5 | sed 's/"message": "/  /' | sed 's/"$//')

HN_TOP=$(curl -s "https://hacker-news.firebaseio.com/v0/topstories.json" | cut -d',' -f1-10 | tr -d '[]')
HN_ITEMS=""
for ID in $(echo "$HN_TOP" | tr ',' ' '); do
  TITLE=$(curl -s "https://hacker-news.firebaseio.com/v0/item/$ID.json" 2>/dev/null | grep -o '"title":"[^"]*"' | cut -d'"' -f4)
  [ -n "$TITLE" ] && HN_ITEMS="${HN_ITEMS}  - ${TITLE}
"
done

NEXT_TASK="你可以同我講：『今日繼續幫cojudge做嘢』，我就會繼續跟進。"

python3 << PYEOF
import json, os, subprocess, datetime

recipient = "$RECIPIENT"
sender = "$SENDER"
stars = "$STARS"
forks = "$FORKS"
issues = "$ISSUES"
commits = """$COMMIT_LOG"""
hn = """$HN_ITEMS"""
next_task = "$NEXT_TASK"
today = datetime.date.today().isoformat()

html = f"""<h2>🐱 Cojudge Daily Digest</h2>

<h3>📊 Today's Stats</h3>
<ul>
  <li>⭐ Stars: <strong>{stars}</strong></li>
  <li>🍴 Forks: <strong>{forks}</strong></li>
  <li>❗ Open Issues: <strong>{issues}</strong></li>
</ul>

<h3>🔄 Recent Commits</h3>
<pre>{commits if commits.strip() else '  (no recent commits)'}</pre>

<h3>📰 Tech News (Hacker News Top)</h3>
<pre>{hn if hn.strip() else '  (unable to fetch)'}</pre>

<h3>📋 聽日做咩</h3>
<p>{next_task}</p>
"""

payload = json.dumps({
    "from": sender,
    "to": recipient,
    "subject": f"🐱 Cojudge Daily Digest — {today}",
    "html": html
})

api_key = os.environ.get("RESEND_API_KEY", "")
cmd = ["curl", "-s", "-X", "POST", "https://api.resend.com/emails",
       "-H", f"Authorization: Bearer {api_key}",
       "-H", "Content-Type: application/json",
       "-d", payload]
subprocess.run(cmd)
PYEOF
