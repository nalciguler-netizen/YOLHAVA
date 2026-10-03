// YolHava service worker v2
// - Uygulama dosyaları: önce ağ, yoksa önbellek (güncellemeler hemen gelsin)
// - Harita parçaları/yazı tipleri: önbellekte varsa oradan (çevrimdışı paketler), yoksa ağdan
const V='yolhava-v2';
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./gizlilik.html','./kosullar.html',
 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js',
 'https://cdn.jsdelivr.net/npm/maplibre-gl@4/dist/maplibre-gl.css',
 'https://cdn.jsdelivr.net/npm/maplibre-gl@4/dist/maplibre-gl.js',
 'https://cdn.jsdelivr.net/npm/@maplibre/maplibre-gl-leaflet@0/leaflet-maplibre-gl.js'];
const KEEP=[V,'yh-tiles','yh-offline'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>!KEEP.includes(x)).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const netFirst=req=>fetch(req).then(r=>{if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(req,c))}return r}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html')));
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.host==='tiles.openfreemap.org'){
    const stat=/\.(pbf|png|json)$/.test(u.pathname)&&(/\/\d+\/\d+\/\d+\.pbf$/.test(u.pathname)||u.pathname.includes('/fonts/')||u.pathname.includes('/sprites/'));
    if(stat){e.respondWith(caches.match(req).then(hit=>hit||fetch(req)));return}
    e.respondWith(fetch(req).catch(()=>caches.match(req).then(r=>r||Response.error())));return;
  }
  if(u.origin===location.origin){
    if(u.pathname.includes('/offline/')){e.respondWith(caches.match(req).then(r=>r||new Response('null',{status:404})));return}
    e.respondWith(netFirst(req));return;
  }
  if(u.host==='cdnjs.cloudflare.com'||u.host==='cdn.jsdelivr.net'||u.host==='fonts.googleapis.com'||u.host.endsWith('gstatic.com')){e.respondWith(netFirst(req));return}
  // API istekleri (hava, rota, trafik): doğrudan ağ
});
