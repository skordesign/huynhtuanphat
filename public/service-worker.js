// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var dataCacheName = 'Music-v1';
var cacheName = 'Music-final-1';
var filesToCache = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/angular.js',
  '/js/angular.app.js',
  '/css/animation.css',
  '/css/app.css',
  '/css/bootstrap.css',
  '/js/bootstrap.js',
  '/assets/Circle-progress.svg',
  '/assets/Favorites-ffffff.svg',
  '/assets/Feedback-ffffff.svg',
  '/assets/icon.png',
  '/assets/icon.svg',
  '/assets/icon-000000.svg',
  '/assets/icon-ffffff.svg',
  '/assets/Menu02-6b6b6b.svg',
  '/assets/Menu02-ffffff.svg',
  '/assets/Menu-6b6b6b.svg',
  '/assets/Menu-ffffff.svg',
  '/assets/Next-000000.svg',
  '/assets/Next-ffffff.svg',
  '/assets/Pause-6b6b6b.svg',
  '/assets/Pause-ffffff.svg',
  '/assets/Play-6b6b6b.svg',
  '/assets/Play-ffffff.svg',
  '/assets/Previous-000000.svg',
  '/assets/Previous-ffffff.svg',
  '/assets/Repeat-000000.svg',
  '/assets/Repeat-ffffff.svg',
  '/assets/Search-6b6b6b.svg',
  '/assets/Settings-6b6b6b.svg',
  '/assets/Settings-ffffff.svg',
  '/assets/Shuffle-000000.svg',
  '/assets/Shuffle-ffffff.svg'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
  if (e.request.url.indexOf(dataUrl) > -1) {
    /*
     * When the request URL contains dataUrl, the app is asking for fresh
     * weather data. In this case, the service worker always goes to the
     * network and then caches the response. This is called the "Cache then
     * network" strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
     */
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    /*
     * The app is asking for app shell files. In this scenario the app uses the
     * "Cache, falling back to the network" offline strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
     */
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
