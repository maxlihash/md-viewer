#!/usr/bin/env bash
# Replace placeholders (domain + contact email) with real values across all files.
# Usage:
#   ./set-domain.sh https://your-domain.com [contact@your-domain.com]
# If the email is omitted, defaults to hello@<your-domain>.
set -euo pipefail

if [ $# -lt 1 ] || [ $# -gt 2 ]; then
  echo "Usage: $0 https://your-domain.com [contact@your-domain.com]"
  exit 1
fi

DOMAIN="${1%/}"                       # strip trailing slash
HOST="${DOMAIN#https://}"; HOST="${HOST#http://}"   # bare host for default email
EMAIL="${2:-hello@${HOST}}"
DIR="$(cd "$(dirname "$0")" && pwd)"

files=$(grep -rl -e "https://example.com" -e "hello@example.com" "$DIR" \
  --include="*.html" --include="*.xml" --include="*.txt" 2>/dev/null || true)

if [ -z "$files" ]; then
  echo "No placeholders found (already replaced?)"
  exit 0
fi

echo "$files" | while read -r f; do
  sed -i '' \
    -e "s#https://example.com#${DOMAIN}#g" \
    -e "s#hello@example.com#${EMAIL}#g" \
    "$f"
  echo "updated: $f"
done

echo "Done."
echo "  domain -> ${DOMAIN}"
echo "  email  -> ${EMAIL}"
echo "Next: deploy to Cloudflare Pages, submit sitemap to Google + Bing."
