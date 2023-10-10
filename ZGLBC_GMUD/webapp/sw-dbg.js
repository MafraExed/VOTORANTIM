/*eslint-disable no-console, no-alert */
console.log("Hello from sw.js");

/*
var urlsToCache = [
    '/',
    '/dist/resources/sap-ui-custom.js',
    '/dist/resources/sap/m/library-preload.json',
    '/dist/resources/sap/ui/core/themes/sap_hcb/library.css',
    '/dist/resources/sap/m/themes/sap_hcb/library.css',
    '/dist/resources/sap/ui/core/themes/base/fonts/SAP-icons.ttf',
    '/dist/resources/sap/ui/thirdparty/unorm.js', //needed for safari
    '/dist/resources/sap/ui/thirdparty/unormdata.js' //needed for safari
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open("TESTECACHENAME")
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});
*/

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js");

if (workbox) {
  console.log("Yay! Workbox is loaded 🎉");
} else {
	console.log("Boo! Workbox didn't load 😬");
}

// index.html and JavaScript files
workbox.routing.registerRoute(
  new RegExp('(index\.html|.*\.js|.*\.png|.*\.jpg|.*\.gif|.*\.css)'),
  // Fetch from the network, but fall back to cache
  workbox.strategies.cacheFirst()
);
 
// CSS, fonts, i18n
workbox.routing.registerRoute(
  /(.*\.css|.*\.properties|.*\.woff2)/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: "charm-cache4"
  })
);