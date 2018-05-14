#!/usr/bin/env bash

npm run build:build

cp -v dist/flatpickr*.js /c/code/dmoz/script/flatpickr/
cp -v dist/themes/xc.css /c/code/dmoz/css/flatpickr/

cat dist/plugins/selectTime/selectTime.js dist/plugins/closeButton.js dist/plugins/confirmDate/confirmDate.js dist/plugins/rangePlugin.js dist/plugins/scrollPlugin.js > /c/code/dmoz/script/flatpickr/plugins.js


