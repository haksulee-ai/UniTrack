const CACHE="unitrack-pwa-v1";
const ASSETS=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
 const u=new URL(e.request.url);
 if(u.origin===self.location.origin)e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
