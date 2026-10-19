const C='erte-komek-v7';
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.json','icon.svg','icon-192.png','icon-512.png','apple-touch-icon.png']))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;
const html=req.mode==='navigate'||req.url.endsWith('.html')||req.url.endsWith('/');
const net=()=>fetch(req).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(req,cp));return res;});
e.respondWith(html?net().catch(()=>caches.match(req).then(r=>r||caches.match('index.html'))):caches.match(req).then(r=>r||net()));});
