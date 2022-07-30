#!/bin/bash

VER=`cat package.json| jq -r '.version'`

CHROME_PKG=ctx_gyaruppi_${VER}_chrome_unsigned.zip
ZIP_FILE_PATH=../${CHROME_PKG}

RELEASE_PATH="publish"
mkdir $RELEASE_PATH 2>/dev/null


if [[ -f $RELEASE_PATH/$CHROME_PKG ]]; then
  rm $RELEASE_PATH/$CHROME_PKG
fi


# chrome manifest v3
npm run build
(cd dist && \
  zip -r ../$RELEASE_PATH/$CHROME_PKG * \
    -x "*.DS_Store" \
    -x "__MACOSX" \
    -x "*.map" \
    -x "manifests/*")
