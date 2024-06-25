#!/bin/bash
npm run build:chrome;
cd dist;
rm -rf ./.vite;
cd ..;
zip -r chromeDist.zip dist/;

npm run build:edge;
cd dist;
rm -rf ./.vite;
cd ..;
zip -r edgeDist.zip dist/;