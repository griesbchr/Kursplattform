#!/bin/bash

echo "Pulling updates for all Apps Script projects..."

# Loop through every subdirectory in the current folder
for dir in ./*/; do
  # Check if the directory contains a .clasp.json file
  if [ -f "${dir}.clasp.json" ]; then
    echo ""
    echo "--- Pulling changes for ${dir} ---"
    # Enter the directory, run clasp pull, and then go back up
    (cd "$dir" && clasp pull)
  fi
done

echo ""
echo "✅ All projects have been updated."