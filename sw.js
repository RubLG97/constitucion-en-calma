const CACHE="cec-v5";
const BASE=["./","index.html","estilo.css","fuentes.css","manifest.webmanifest","icono-192.png",
"fuentes/atkinson-hyperlegible-latin-400-normal.woff2","fuentes/atkinson-hyperlegible-latin-700-normal.woff2",
"fuentes/bricolage-grotesque-latin-500-normal.woff2","fuentes/bricolage-grotesque-latin-700-normal.woff2"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Primero la red, para que siempre llegue la última versión; sin conexión, lo guardado.
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const copia=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copia));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))));
});
