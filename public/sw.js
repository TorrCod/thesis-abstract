if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,n)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let t={};const r=e=>a(e,i),o={module:{uri:i},exports:t,require:r};s[i]=Promise.all(c.map((e=>o[e]||r(e)))).then((e=>(n(...e),t)))}}define(["./workbox-e13f827e"],(function(e){"use strict";importScripts("fallback-IVIoE2N8awM4tnFRZ07Bf.js"),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/404.svg",revision:"eb1785dd89f1e52ada564fc9354fe3af"},{url:"/PC.png",revision:"cdbdb93924d4bd1fc7fe29cc649eed18"},{url:"/_next/static/IVIoE2N8awM4tnFRZ07Bf/_buildManifest.js",revision:"a969254deb4f74f16ec2229d04eebe5d"},{url:"/_next/static/IVIoE2N8awM4tnFRZ07Bf/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/138.89afcc2692d93ca6.js",revision:"89afcc2692d93ca6"},{url:"/_next/static/chunks/1b8dab7b.156f7ffcdf43d0e6.js",revision:"156f7ffcdf43d0e6"},{url:"/_next/static/chunks/228771e0.b606f51f513e3a50.js",revision:"b606f51f513e3a50"},{url:"/_next/static/chunks/246-9b94d7fec5003783.js",revision:"9b94d7fec5003783"},{url:"/_next/static/chunks/254-590c2af58b4a6bcb.js",revision:"590c2af58b4a6bcb"},{url:"/_next/static/chunks/31664189-5a2660fd15a1d949.js",revision:"5a2660fd15a1d949"},{url:"/_next/static/chunks/394-2b3043de2521b104.js",revision:"2b3043de2521b104"},{url:"/_next/static/chunks/527-0c2f9802fbeeb96d.js",revision:"0c2f9802fbeeb96d"},{url:"/_next/static/chunks/589-dac16ef878e12cf1.js",revision:"dac16ef878e12cf1"},{url:"/_next/static/chunks/647-c567e864425baa9c.js",revision:"c567e864425baa9c"},{url:"/_next/static/chunks/65291039.a0a36b3a69a2381b.js",revision:"a0a36b3a69a2381b"},{url:"/_next/static/chunks/653-7bd5c328b74b8573.js",revision:"7bd5c328b74b8573"},{url:"/_next/static/chunks/709-d0a0adc985dff64d.js",revision:"d0a0adc985dff64d"},{url:"/_next/static/chunks/762.58967c3792e84e4c.js",revision:"58967c3792e84e4c"},{url:"/_next/static/chunks/893-3c1ed4ed3f5380aa.js",revision:"3c1ed4ed3f5380aa"},{url:"/_next/static/chunks/ae51ba48-40c85192529bbd51.js",revision:"40c85192529bbd51"},{url:"/_next/static/chunks/c9184924.3a24371419a1d932.js",revision:"3a24371419a1d932"},{url:"/_next/static/chunks/framework-73b8966a3c579ab0.js",revision:"73b8966a3c579ab0"},{url:"/_next/static/chunks/main-410e92b0a597566b.js",revision:"410e92b0a597566b"},{url:"/_next/static/chunks/pages/404-5bfc3102b5e6f991.js",revision:"5bfc3102b5e6f991"},{url:"/_next/static/chunks/pages/_app-a5fcd873a2f1b6d6.js",revision:"a5fcd873a2f1b6d6"},{url:"/_next/static/chunks/pages/_error-409f831d3504c8f5.js",revision:"409f831d3504c8f5"},{url:"/_next/static/chunks/pages/_offline-d85219e2ac57cd24.js",revision:"d85219e2ac57cd24"},{url:"/_next/static/chunks/pages/aboutus-8e954f719acf8d76.js",revision:"8e954f719acf8d76"},{url:"/_next/static/chunks/pages/dashboard-b8d8cc6fbcac9cb3.js",revision:"b8d8cc6fbcac9cb3"},{url:"/_next/static/chunks/pages/dashboard/account-setting-37c6b9389feb80be.js",revision:"37c6b9389feb80be"},{url:"/_next/static/chunks/pages/dashboard/activitylog-961d134c0a516783.js",revision:"961d134c0a516783"},{url:"/_next/static/chunks/pages/dashboard/admins-dbc08f0143bfdbf4.js",revision:"dbc08f0143bfdbf4"},{url:"/_next/static/chunks/pages/dashboard/thesis-5533593e0f1d304a.js",revision:"5533593e0f1d304a"},{url:"/_next/static/chunks/pages/dashboard/thesis/success-89725b7331a3c96f.js",revision:"89725b7331a3c96f"},{url:"/_next/static/chunks/pages/dashboard/thesis/upload-thesis-7f712a69545f1cc1.js",revision:"7f712a69545f1cc1"},{url:"/_next/static/chunks/pages/forgot-password-9bb8d60ee0159c94.js",revision:"9bb8d60ee0159c94"},{url:"/_next/static/chunks/pages/index-d824ed27a58cda82.js",revision:"d824ed27a58cda82"},{url:"/_next/static/chunks/pages/link-expired-1b4693a5654c1673.js",revision:"1b4693a5654c1673"},{url:"/_next/static/chunks/pages/sign-up/%5Bid%5D-53af9721ee4a0437.js",revision:"53af9721ee4a0437"},{url:"/_next/static/chunks/pages/thesis-b371a76b1fd22805.js",revision:"b371a76b1fd22805"},{url:"/_next/static/chunks/pages/thesis/%5Bid%5D-b3b6dade36f06902.js",revision:"b3b6dade36f06902"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-0d1db1c7c1582893.js",revision:"0d1db1c7c1582893"},{url:"/_next/static/css/50f992dbb9b905fb.css",revision:"50f992dbb9b905fb"},{url:"/_offline",revision:"IVIoE2N8awM4tnFRZ07Bf"},{url:"/asset/Roboto-Black.ttf",revision:"d6a6f8878adb0d8e69f9fa2e0b622924"},{url:"/asset/Roboto-BlackItalic.ttf",revision:"c3332e3b8feff748ecb0c6cb75d65eae"},{url:"/asset/Roboto-Bold.ttf",revision:"b8e42971dec8d49207a8c8e2b919a6ac"},{url:"/asset/Roboto-BoldItalic.ttf",revision:"fd6e9700781c4aaae877999d09db9e09"},{url:"/asset/Roboto-Italic.ttf",revision:"cebd892d1acfcc455f5e52d4104f2719"},{url:"/asset/Roboto-Light.ttf",revision:"881e150ab929e26d1f812c4342c15a7c"},{url:"/asset/Roboto-LightItalic.ttf",revision:"5788d5ce921d7a9b4fa0eaa9bf7fec8d"},{url:"/asset/Roboto-Medium.ttf",revision:"68ea4734cf86bd544650aee05137d7bb"},{url:"/asset/Roboto-MediumItalic.ttf",revision:"c16d19c2c0fd1278390a82fc245f4923"},{url:"/asset/Roboto-Regular.ttf",revision:"8a36205bd9b83e03af0591a004bc97f4"},{url:"/asset/Roboto-Thin.ttf",revision:"66209ae01f484e46679622dd607fcbc5"},{url:"/asset/Roboto-ThinItalic.ttf",revision:"7bcadd0675fe47d69c2d8aaef683416f"},{url:"/bg-circles.svg",revision:"22139c103997cae8c120ed703cae8bbf"},{url:"/book.svg",revision:"2d62b6260e0969efd6f2e727d1bf51f9"},{url:"/default-profile.png",revision:"930f5bc07f0b925452ac627ea842e19e"},{url:"/favicon.ico",revision:"46f65bdae9b3826eab135a338989a773"},{url:"/goals.svg",revision:"c604c4c0f36539fe97e64110294cd7f8"},{url:"/icon-144.png",revision:"16442035454f178ff05b90d8c40742d5"},{url:"/icon-192.png",revision:"fd894b7259292554487b2d33e8068093"},{url:"/icon-512.png",revision:"3808fff02159fc0ad65c96d8a0846324"},{url:"/icons/browserconfig.xml",revision:"ddfa8fba3574a0dc929e1ff9d051af99"},{url:"/icons/favicon-16x16.png",revision:"46f65bdae9b3826eab135a338989a773"},{url:"/icons/favicon-32x32.png",revision:"0ce2305a1cdf67928785937c70a36a48"},{url:"/icons/safari-pinned-tab.svg",revision:"273a69c9dc384ca0b9676e5831755565"},{url:"/icons/touch-icon-ipad-retina.png",revision:"e5850e782779bc4b4156e04c3d5298b4"},{url:"/icons/touch-icon-ipad.png",revision:"7a49ea2d265ccb3d25f3484b04ae26e2"},{url:"/icons/touch-icon-iphone-retina.png",revision:"aa91d14582ca4aeda3c15f7aae210ca3"},{url:"/icons/touch-icon-iphone.png",revision:"9ec66bbf84f3edd3a624c8d54e0e28c0"},{url:"/manifest.json",revision:"88476b062d328d22ae56b3e405e07e60"},{url:"/puzzle.svg",revision:"329267e9ae3c957806879c29cc820037"},{url:"/test pdf.pdf",revision:"fa520e1c9bc30f4e43498e3b213dcfce"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s},{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET")}));
