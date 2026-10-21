const C='erte-komek-v31';
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.json','icon.svg','icon-192.png','icon-512.png','apple-touch-icon.png']))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;
const html=req.mode==='navigate'||req.url.endsWith('.html')||req.url.endsWith('/');
const net=()=>fetch(req).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(req,cp));return res;});
e.respondWith(html?net().catch(()=>caches.match(req).then(r=>r||caches.match('index.html'))):caches.match(req).then(r=>r||net()));});
// notifications: the page writes ek-schedule.json (next 21 days) into the 'ek-data' cache
async function notifyToday(){try{const c=await caches.open('ek-data');const r=await c.match('ek-schedule.json');if(!r)return;const s=await r.json();if(!s.on)return;
const d=new Date(),today=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const last=await c.match('ek-last.txt');if(last&&(await last.text())===today)return;const m=(s.days||[]).find(x=>x.date===today);if(!m)return;
await self.registration.showNotification(m.title,{body:m.body,icon:'icon-192.png',badge:'icon-192.png',tag:m.tag,data:{url:'./'}});await c.put('ek-last.txt',new Response(today));}catch(e){}}
self.addEventListener('periodicsync',e=>{if(e.tag==='ek-daily')e.waitUntil(notifyToday());});
self.addEventListener('push',e=>{let d={};try{d=e.data.json();}catch(_){d={title:'QUŞAQ',body:e.data&&e.data.text()};}e.waitUntil(self.registration.showNotification(d.title||'QUŞAQ',{body:d.body||'',icon:'icon-192.png',badge:'icon-192.png',data:{url:d.url||'./'}}));});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{for(const w of ws){if('focus' in w)return w.focus();}return clients.openWindow((e.notification.data&&e.notification.data.url)||'./');}));});
