#!/bin/sh
node src/seed.js 2>&1 | tee /tmp/seed-output.txt
echo "Exit code: $?"
cat /tmp/seed-output.txt
