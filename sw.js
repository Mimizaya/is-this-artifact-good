if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,t)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let o={};const c=e=>n(e,r),l={module:{uri:r},exports:o,require:c};s[r]=Promise.all(i.map((e=>l[e]||c(e)))).then((e=>(t(...e),o)))}}define(["./workbox-4245c4a1"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-CzSqs5TJ.js",revision:null},{url:"assets/index-D5ze4tkT.css",revision:null},{url:"index.html",revision:"1090ea34b3f1aa4ff2e7007c74b58bc0"},{url:"registerSW.js",revision:"05399c2edb71869dc52e133692e07de1"},{url:"manifest.webmanifest",revision:"beebec9b03b6ea0bb89872541dc92d1d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute((e=>{const{url:s}=e;return s.pathname.startsWith("/")}),new e.CacheFirst({cacheName:"assets-cache",plugins:[new e.ExpirationPlugin({maxEntries:1e3,maxAgeSeconds:2592e3})]}),"GET")}));
