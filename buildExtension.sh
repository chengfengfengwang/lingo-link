#!/bin/bash

cd dist;
rm -rf ./.vite;
cd ..;
zip -r dist.zip dist/;
