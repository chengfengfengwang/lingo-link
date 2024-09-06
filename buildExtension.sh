#!/bin/bash
currentPath=$(pwd);
chromeDistPath="${currentPath}/dist/chrome";
edgeDistPath="${currentPath}/dist/edge";
firefoxDistPath="${currentPath}/dist/firefox";

npm run build:chrome;
cd $chromeDistPath;
rm -rf ./.vite;
zip -r ../../chrome.zip .;

npm run build:edge;
cd $edgeDistPath;
rm -rf ./.vite;
zip -r ../../edge.zip .;

npm run build:firefox;
cd $firefoxDistPath;
rm -rf ./.vite;
zip -r ../../firefox.zip .;
