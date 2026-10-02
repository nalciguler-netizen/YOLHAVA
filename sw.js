// YolHava service worker: uygulama kabuğunu önbelleğe alır.
// Geliştirme sırasında güncellemeler hemen görünsün diye "önce ağ" kullanır.
const V='yolhava-v1';
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  const shell=u.origin===location.origin||u.host==='cdnjs.cloudflare.com'||u.host.endsWith('gstatic.com')||u.host==='fonts.googleapis.com';
  if(!shell)return; // API ve harita karoları doğrudan ağdan
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
