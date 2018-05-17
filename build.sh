#!/usr/bin/env bash

npm run build:build

cp -v dist/flatpickr.js flatpickr.min.js /c/code/dmoz/script/flatpickr/
cp -v dist/plugins.js dist/plugins.min.js /c/code/dmoz/script/flatpickr/
cp -v dist/themes/xc.css /c/code/dmoz/css/flatpickr/

