if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const c=e=>n(e,t),l={module:{uri:t},exports:o,require:c};s[t]=Promise.all(i.map((e=>l[e]||c(e)))).then((e=>(r(...e),o)))}}define(["./workbox-4245c4a1"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-C7fe3k0n.js",revision:null},{url:"assets/index-DV9Q1OvO.css",revision:null},{url:"index.html",revision:"5872233938dcc45f1275b9ff53080f72"},{url:"registerSW.js",revision:"05399c2edb71869dc52e133692e07de1"},{url:"manifest.webmanifest",revision:"beebec9b03b6ea0bb89872541dc92d1d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute((e=>{const{url:s}=e;return s.pathname.startsWith("/")}),new e.CacheFirst({cacheName:"assets-cache",plugins:[new e.ExpirationPlugin({maxEntries:1e3,maxAgeSeconds:2592e3})]}),"GET")}));
