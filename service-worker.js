// AMLI West - Floor Truss Connections - service worker (UPDATE 23 test build)
// Two caches so an UPDATE never has to download the big images again:
//  1) SHELL (CACHE_VERSION, renamed every UPDATE, ~1 MB): the screens (index.html), manifest, icons, trusses.json.
//     Network-first when there is signal (always the newest screens); cached copy with no signal or a slow network.
//  2) IMAGES (IMG_CACHE, renamed ONLY when an image file changes): the plans and sheets. Cache-first. Images already on the
//     phone are copied from the older caches on upgrade (no download); missing ones are fetched in the background and
//     resume on the next open if the signal drops.
const CACHE_VERSION = 'nf-floortruss-v2-40';
const IMG_CACHE = 'nf-floortruss-img-1';
const CACHE_PREFIX = 'nf-floortruss-';  // only caches with this prefix belong to this app
const SEC_CACHE = 'nfft-trusses-sec';       // truss sections saved on demand (page script manages it)
const SHELL_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-512.png",
  "./icon-192.png",
  "./icon-180.png",
  "./icon-167.png",
  "./icon-152.png",
  "./header-mark.png",
  "./header-logo.png",
  "trusses/data/trusses.json"
];
const IMG_URLS = [
  "img/c5_d010_hq.webp",
  "img/c5_d011_hq.webp",
  "img/c5_d012_hq.webp",
  "img/c5_d013_hq.webp",
  "img/c5_d014_hq.webp",
  "img/c5_d015_hq.webp",
  "img/c5_d016_hq.webp",
  "img/c5_d017_hq.webp",
  "img/c5_d018_hq.webp",
  "img/c5_d019_hq.webp",
  "img/c5_d020_hq.webp",
  "img/c5_d021_hq.webp",
  "img/c5_d022_hq.webp",
  "img/c5_d023_hq.webp",
  "img/c5_d024_hq.webp",
  "img/c5_d025_hq.webp",
  "img/c5_d026_hq.webp",
  "img/c5_d027_hq.webp",
  "img/c5_d028_hq.webp",
  "img/c5_d029_hq.webp",
  "img/c5_d030_hq.webp",
  "img/c5_d031_hq.webp",
  "img/c5_d032_hq.webp",
  "img/c5_d033_hq.webp",
  "img/c5_d034_hq.webp",
  "img/c5_d035_hq.webp",
  "img/c5_d036_hq.webp",
  "img/c5_d037_hq.webp",
  "img/c5_d038_hq.webp",
  "img/c5_d039_hq.webp",
  "img/c5_d040_hq.webp",
  "img/c5_d041_hq.webp",
  "img/c5_d042_hq.webp",
  "img/c5_d043_hq.webp",
  "img/c5_d044_hq.webp",
  "img/c5_d045_hq.webp",
  "img/c5_d046_hq.webp",
  "img/c5_d047_hq.webp",
  "img/c5_d048_hq.webp",
  "img/c5_d049_hq.webp",
  "img/c5_d050_hq.webp",
  "img/c5_d051_hq.webp",
  "img/c5_d052_hq.webp",
  "img/c5_d053_hq.webp",
  "img/c5_d054_hq.webp",
  "img/c5_d055_hq.webp",
  "img/c5_d056_hq.webp",
  "img/c5_d057_hq.webp",
  "img/c5_d058_hq.webp",
  "img/c5_d059_hq.webp",
  "img/c5_d060_hq.webp",
  "img/c5_d061_hq.webp",
  "img/c5_d062_hq.webp",
  "img/c5_d063_hq.webp",
  "img/c5_d064_hq.webp",
  "img/c5_d065_hq.webp",
  "img/c5_d066_hq.webp",
  "img/c5_d067_hq.webp",
  "img/c5_d068_hq.webp",
  "img/c5_d069_hq.webp",
  "img/c5_d070_hq.webp",
  "img/c5_d071_hq.webp",
  "img/c5_d072_hq.webp",
  "img/c5_d073_hq.webp",
  "img/c5_d074_hq.webp",
  "img/c5_d075_hq.webp",
  "img/c5_d076_hq.webp",
  "img/c5_d077_hq.webp",
  "img/c5_d078_hq.webp",
  "img/c5_d079_hq.webp",
  "img/c5_d080_hq.webp",
  "img/c5_d081_hq.webp",
  "img/c5_d082_hq.webp",
  "img/c5_d083_hq.webp",
  "img/c5_d084_hq.webp",
  "img/c5_d085_hq.webp",
  "img/c5_d086_hq.webp",
  "img/c5_d087_hq.webp",
  "img/c5_d088_hq.webp",
  "img/c5_d089_hq.webp",
  "img/c5_d090_hq.webp",
  "img/c5_d091_hq.webp",
  "img/c5_d092_hq.webp",
  "img/c5_d093_hq.webp",
  "img/c5_d094_hq.webp",
  "img/c5_d095_hq.webp",
  "img/c5_d096_hq.webp",
  "img/c5_d097_hq.webp",
  "img/c5_d098_hq.webp",
  "img/c5_d099_hq.webp",
  "img/c5_d100_hq.webp",
  "img/c5_d101_hq.webp",
  "img/c5_d102_hq.webp",
  "img/c5_d103_hq.webp",
  "img/c5_d104_hq.webp",
  "img/c5_d105_hq.webp",
  "img/c5_d106_hq.webp",
  "img/c5_d107_hq.webp",
  "img/c5_d108_hq.webp",
  "img/c5_d109_hq.webp",
  "img/c5_d110_hq.webp",
  "img/c5_d111_hq.webp",
  "img/c5_d112_hq.webp",
  "img/c5_d113_hq.webp",
  "img/c5_d114_hq.webp",
  "img/c5_d115_hq.webp",
  "img/c5_d116_hq.webp",
  "img/c5_fullplan.webp",
  "img/c5_fullplan_index.png",
  "img/c5_sec1_hq.webp",
  "img/c5_sec2_hq.webp",
  "img/c5_sec3_hq.webp",
  "img/c5_sec4_hq.webp",
  "img/c5_sec5_hq.webp",
  "img/c5_sec6_hq.webp",
  "img/c5_sec7_hq.webp",
  "img/c5_sec8_hq.webp",
  "img/c5_sec9_hq.webp",
  "img/c6_d010_hq.webp",
  "img/c6_d011_hq.webp",
  "img/c6_d012_hq.webp",
  "img/c6_d013_hq.webp",
  "img/c6_d014_hq.webp",
  "img/c6_d015_hq.webp",
  "img/c6_d016_hq.webp",
  "img/c6_d017_hq.webp",
  "img/c6_d018_hq.webp",
  "img/c6_d019_hq.webp",
  "img/c6_d020_hq.webp",
  "img/c6_d021_hq.webp",
  "img/c6_d022_hq.webp",
  "img/c6_d023_hq.webp",
  "img/c6_d024_hq.webp",
  "img/c6_d025_hq.webp",
  "img/c6_d026_hq.webp",
  "img/c6_d027_hq.webp",
  "img/c6_d028_hq.webp",
  "img/c6_d029_hq.webp",
  "img/c6_d030_hq.webp",
  "img/c6_d031_hq.webp",
  "img/c6_d032_hq.webp",
  "img/c6_d033_hq.webp",
  "img/c6_d034_hq.webp",
  "img/c6_d035_hq.webp",
  "img/c6_d036_hq.webp",
  "img/c6_d037_hq.webp",
  "img/c6_d038_hq.webp",
  "img/c6_d039_hq.webp",
  "img/c6_d040_hq.webp",
  "img/c6_d041_hq.webp",
  "img/c6_d042_hq.webp",
  "img/c6_d043_hq.webp",
  "img/c6_d044_hq.webp",
  "img/c6_d045_hq.webp",
  "img/c6_d046_hq.webp",
  "img/c6_d047_hq.webp",
  "img/c6_d048_hq.webp",
  "img/c6_d049_hq.webp",
  "img/c6_d050_hq.webp",
  "img/c6_d051_hq.webp",
  "img/c6_d052_hq.webp",
  "img/c6_d053_hq.webp",
  "img/c6_d054_hq.webp",
  "img/c6_d055_hq.webp",
  "img/c6_d056_hq.webp",
  "img/c6_d057_hq.webp",
  "img/c6_d058_hq.webp",
  "img/c6_d059_hq.webp",
  "img/c6_d060_hq.webp",
  "img/c6_d061_hq.webp",
  "img/c6_d062_hq.webp",
  "img/c6_d063_hq.webp",
  "img/c6_d064_hq.webp",
  "img/c6_d065_hq.webp",
  "img/c6_d066_hq.webp",
  "img/c6_d067_hq.webp",
  "img/c6_d068_hq.webp",
  "img/c6_d069_hq.webp",
  "img/c6_d070_hq.webp",
  "img/c6_d071_hq.webp",
  "img/c6_d072_hq.webp",
  "img/c6_d073_hq.webp",
  "img/c6_d074_hq.webp",
  "img/c6_d075_hq.webp",
  "img/c6_d076_hq.webp",
  "img/c6_d077_hq.webp",
  "img/c6_d078_hq.webp",
  "img/c6_d079_hq.webp",
  "img/c6_d080_hq.webp",
  "img/c6_d081_hq.webp",
  "img/c6_d082_hq.webp",
  "img/c6_d083_hq.webp",
  "img/c6_d084_hq.webp",
  "img/c6_d085_hq.webp",
  "img/c6_d086_hq.webp",
  "img/c6_d087_hq.webp",
  "img/c6_d088_hq.webp",
  "img/c6_d089_hq.webp",
  "img/c6_d090_hq.webp",
  "img/c6_d091_hq.webp",
  "img/c6_d092_hq.webp",
  "img/c6_d093_hq.webp",
  "img/c6_d094_hq.webp",
  "img/c6_d095_hq.webp",
  "img/c6_d096_hq.webp",
  "img/c6_d097_hq.webp",
  "img/c6_d098_hq.webp",
  "img/c6_d099_hq.webp",
  "img/c6_d100_hq.webp",
  "img/c6_d101_hq.webp",
  "img/c6_d102_hq.webp",
  "img/c6_d103_hq.webp",
  "img/c6_d104_hq.webp",
  "img/c6_d105_hq.webp",
  "img/c6_d106_hq.webp",
  "img/c6_d107_hq.webp",
  "img/c6_d108_hq.webp",
  "img/c6_d109_hq.webp",
  "img/c6_d110_hq.webp",
  "img/c6_d111_hq.webp",
  "img/c6_d112_hq.webp",
  "img/c6_d113_hq.webp",
  "img/c6_d114_hq.webp",
  "img/c6_d115_hq.webp",
  "img/c6_d116_hq.webp",
  "img/c6_d117_hq.webp",
  "img/c6_fullplan.webp",
  "img/c6_fullplan_index.png",
  "img/c6_sec1_hq.webp",
  "img/c6_sec2_hq.webp",
  "img/c6_sec3_hq.webp",
  "img/c6_sec4_hq.webp",
  "img/c6_sec5_hq.webp",
  "img/c6_sec6_hq.webp",
  "img/c6_sec7_hq.webp",
  "img/c6_sec8_hq.webp",
  "img/c6_sec9_hq.webp",
  "img/fullplan.webp",
  "img/fullplan_index.png",
  "img/how1.webp",
  "img/how2.webp",
  "img/how3.webp",
  "img/how4.webp",
  "img/p009.webp",
  "img/p010.webp",
  "img/p011.webp",
  "img/p012.webp",
  "img/p013.webp",
  "img/p014.webp",
  "img/p015.webp",
  "img/p016.webp",
  "img/p017.webp",
  "img/p018.webp",
  "img/p019.webp",
  "img/p020.webp",
  "img/p021.webp",
  "img/p022.webp",
  "img/p023.webp",
  "img/p024.webp",
  "img/p025.webp",
  "img/p026.webp",
  "img/p027.webp",
  "img/p028.webp",
  "img/p029.webp",
  "img/p030.webp",
  "img/p031.webp",
  "img/p032.webp",
  "img/p033.webp",
  "img/p034.webp",
  "img/p035.webp",
  "img/p036.webp",
  "img/p037.webp",
  "img/p038.webp",
  "img/p039.webp",
  "img/p040.webp",
  "img/p041.webp",
  "img/p042.webp",
  "img/p043.webp",
  "img/p044.webp",
  "img/p045.webp",
  "img/p046.webp",
  "img/p047.webp",
  "img/p048.webp",
  "img/p049.webp",
  "img/p050.webp",
  "img/p051.webp",
  "img/p052.webp",
  "img/p053.webp",
  "img/p054.webp",
  "img/p055.webp",
  "img/p056.webp",
  "img/p057.webp",
  "img/p058.webp",
  "img/p059.webp",
  "img/p060.webp",
  "img/p061.webp",
  "img/p062.webp",
  "img/p063.webp",
  "img/p064.webp",
  "img/p065.webp",
  "img/p066.webp",
  "img/p067.webp",
  "img/p068.webp",
  "img/p069.webp",
  "img/p070.webp",
  "img/p071.webp",
  "img/p072.webp",
  "img/p073.webp",
  "img/p074.webp",
  "img/p075.webp",
  "img/p076.webp",
  "img/p077.webp",
  "img/p078.webp",
  "img/p079.webp",
  "img/p080.webp",
  "img/p081.webp",
  "img/p082.webp",
  "img/p083.webp",
  "img/p084.webp",
  "img/p085.webp",
  "img/p086.webp",
  "img/p087.webp",
  "img/p088.webp",
  "img/p089.webp",
  "img/p090.webp",
  "img/p091.webp",
  "img/p092.webp",
  "img/p093.webp",
  "img/p094.webp",
  "img/p095.webp",
  "img/p096.webp",
  "img/p097.webp",
  "img/p098.webp",
  "img/p099.webp",
  "img/p100.webp",
  "img/p101.webp",
  "img/p102.webp",
  "img/p103.webp",
  "img/p104.webp",
  "img/p105.webp",
  "img/p106.webp",
  "img/p107.webp",
  "img/p108.webp",
  "img/p109.webp",
  "img/p110.webp",
  "img/p111.webp",
  "img/sec1.webp",
  "img/sec2.webp",
  "img/sec3.webp",
  "img/sec4.webp",
  "img/sec5.webp",
  "img/sec6.webp",
  "img/sec7.webp",
  "img/sec8.webp",
  "img/sw4_5AB.webp",
  "img/sw4_4D.webp",
  "img/sw4_4C.webp",
  "img/sw4_4B.webp",
  "img/sw4_4A.webp",
  "img/sw4_3C.webp",
  "img/sw4_3B.webp",
  "img/sw4_3A.webp",
  "img/sw5_5B.webp",
  "img/sw5_5A.webp",
  "img/sw5_4D.webp",
  "img/sw5_4C.webp",
  "img/sw5_4B.webp",
  "img/sw5_4A.webp",
  "img/sw5_3C.webp",
  "img/sw5_3B.webp",
  "img/sw5_3A.webp",
  "img/sw6_5B.webp",
  "img/sw6_5A.webp",
  "img/sw6_4D.webp",
  "img/sw6_4C.webp",
  "img/sw6_4B.webp",
  "img/sw6_4A.webp",
  "img/sw6_3C.webp",
  "img/sw6_3B.webp",
  "img/sw6_3A.webp",
  "trusses/layouts/L4-3A.webp",
  "trusses/layouts/L4-3B.webp",
  "trusses/layouts/L4-3C.webp",
  "trusses/layouts/L4-4A.webp",
  "trusses/layouts/L4-4B.webp",
  "trusses/layouts/L4-4C.webp",
  "trusses/layouts/L4-4D.webp",
  "trusses/layouts/L4-B5.webp",
  "trusses/layouts/L567-3A.webp",
  "trusses/layouts/L567-3B.webp",
  "trusses/layouts/L567-3C.webp",
  "trusses/layouts/L567-4A.webp",
  "trusses/layouts/L567-4B.webp",
  "trusses/layouts/L567-4C.webp",
  "trusses/layouts/L567-4D.webp"
];
const SHELL_PATHS = new Set(SHELL_URLS.map((u) => new URL(u, self.location).pathname));
const IMG_PATHS = new Set(IMG_URLS.map((u) => new URL(u, self.location).pathname));

async function migrateImages() {
  const img = await caches.open(IMG_CACHE);
  for (const u of IMG_URLS) {
    try {
      if (await img.match(u)) continue;
      const old = await caches.match(u);          // looks in every cache, incl. the previous versioned ones (no network)
      if (old && old.ok) await img.put(u, old.clone());
    } catch (e) {}
  }
}
async function prefetchImages() {
  const img = await caches.open(IMG_CACHE);
  const todo = [];
  for (const u of IMG_URLS) { if (!(await img.match(u))) todo.push(u); }
  let i = 0;
  const worker = async () => {
    while (i < todo.length) {
      const u = todo[i++];
      try { const r = await fetch(u, { cache: 'reload' }); if (r && r.status === 200) await img.put(u, r.clone()); } catch (e) {}
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  // UPDATE 30: once every current image is stored, drop images from older releases (old 5th/6th renders) to free phone storage.
  try {
    for (const u of IMG_URLS) { if (!(await img.match(u))) return; }
    for (const req of await img.keys()) { if (!IMG_PATHS.has(new URL(req.url).pathname)) await img.delete(req); }
  } catch (e) {}
}
async function fetchFresh(url, ms) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
  try { return await fetch(url, { cache: 'no-store', signal: ctl.signal }); } finally { clearTimeout(t); }
}
async function shellFirst(req) {
  const cache = await caches.open(CACHE_VERSION);
  const nav = req.mode === 'navigate';
  const key = nav ? './index.html' : req.url;
  try {
    const resp = await fetchFresh(nav ? './index.html' : req.url, 4000);
    if (resp && resp.status === 200) { cache.put(key, resp.clone()); return resp; }
  } catch (e) {}
  return (await cache.match(key, { ignoreSearch: nav })) || (await cache.match('./')) || fetch(req);
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    await Promise.all(SHELL_URLS.map((u) => cache.add(new Request(u, { cache: 'reload' }))));
    try { await migrateImages(); } catch (e) {}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter((n) => n.startsWith(CACHE_PREFIX) && n !== CACHE_VERSION && n !== IMG_CACHE).map((n) => caches.delete(n))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'prefetch') event.waitUntil(prefetchImages());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/version.json')) { event.respondWith(fetch(req, { cache: 'no-store' })); return; }   // UPDATE 31: always live, never cached
  if (req.mode === 'navigate' || SHELL_PATHS.has(url.pathname)) { event.respondWith(shellFirst(req)); return; }
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((resp) => {
        if (resp && resp.status === 200 && resp.type === 'basic' && url.pathname.indexOf('/trusses/designs/') < 0) {
          const copy = resp.clone();
          caches.open(IMG_PATHS.has(url.pathname) ? IMG_CACHE : CACHE_VERSION).then((c) => c.put(req, copy));
        }
        return resp;
      });
    })
  );
});
