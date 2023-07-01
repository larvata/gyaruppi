# Go Live Notification

Go Live Notification is a chrome extension let you got notified when the streamers go live.


[Install from Chrome Web Store](https://chrome.google.com/webstore/detail/gyaruppi/ghnfiadioahomhmocmhgjhpmhcmcggjg?hl=en-US) 

Supported Sites:

- bilibili
- douyu
- openrec
- showroom
- ~~twitcasting~~
- zhanqi


## Development

```
npm install
npm run watch
```


## Publish

```
# update the version in package.json

# build production version
npm run build

# prepare the package for publish
./pack
```


## How to Add Adapter

1. `src/common/constants.js`: update new provider key
2. `src/common/providers.js`: add new provider data
3. create content script: `src/site_addons/${provider_name}_injector.js`
4. create backend script: `src/adapter/${provider_name}.js`
5. add styles to `src/Popup.jsx`

## Credit

The icon has been designed using resources from [Flaticon.com](https://www.flaticon.com/)
