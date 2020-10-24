#!/usr/bin/env sh

echo "Running Migration"
npm run migrate

echo "Running Server"
node index.js
