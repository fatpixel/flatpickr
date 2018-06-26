#!/usr/bin/env bash

npm run build:build

cat src/moment.min.js >> dist/tmp
cat dist/flatpickr.js >> dist/tmp
mv -v dist/tmp dist/flatpickr.js

cat src/moment.min.js >> dist/tmp
cat dist/flatpickr.min.js >> dist/tmp
mv -v dist/tmp dist/flatpickr.min.js

cp -v dist/flatpickr.js dist/flatpickr.min.js /c/code/dmoz/script/flatpickr/
cp -v dist/plugins.js dist/plugins.min.js /c/code/dmoz/script/flatpickr/
cp -v dist/themes/xc.css /c/code/dmoz/css/flatpickr/

