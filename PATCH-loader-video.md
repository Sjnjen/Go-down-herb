# Patch: swap CSS spinner loader for your intro video

Your product images were already correctly wired to `assets/gdh1.jpg`, `assets/ugh1.jpg`, `assets/sil1.jpg`, `assets/stc1.jpg`, `assets/mps1.jpg`, `assets/oil1.jpg` — so you don't need to touch any code for the herbs. Just drop the 6 new jpgs + `loader.mp4` from `new-assets-only.zip` into your existing `assets/` folder and they'll appear automatically.

Only the loader needed code changes. Apply these 3 edits to your HTML:

## 1. Replace the loader CSS

Find this block:
```css
#loader{position:fixed;inset:0;z-index:9999;background:var(--cream);display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity .8s ease,visibility .8s ease}
#loader.hide{opacity:0;visibility:hidden;pointer-events:none}
.loader-leaf{width:70px;height:70px;background:var(--lime);border-radius:0 70% 0 70%;animation:leafSpin 2s ease-in-out infinite;margin-bottom:24px;box-shadow:0 0 40px rgba(179,217,90,.3)}
@keyframes leafSpin{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(180deg) scale(1.1)}100%{transform:rotate(360deg) scale(1)}}
.loader-text{font-family:var(--display);font-size:20px;color:var(--forest);letter-spacing:.15em}
.loader-text em{color:var(--lime-bright);font-style:normal}
```

Replace with:
```css
#loader{position:fixed;inset:0;z-index:9999;background:#0f2e24;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity .8s ease,visibility .8s ease;overflow:hidden}
#loader.hide{opacity:0;visibility:hidden;pointer-events:none}
#loaderVideo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
#loader::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 50%, rgba(15,46,36,.15), rgba(15,46,36,.75));pointer-events:none}
.loader-text{position:relative;z-index:2;font-family:var(--display);font-size:20px;color:var(--white);letter-spacing:.15em;margin-top:auto;margin-bottom:48px;text-shadow:0 2px 12px rgba(0,0,0,.5)}
.loader-text em{color:var(--lime-bright);font-style:normal}
```

## 2. Replace the loader markup

Find:
```html
<!-- LOADER -->
<div id="loader"><div class="loader-leaf"></div><div class="loader-text">Go Down <em>Herbs</em></div></div>
```

Replace with:
```html
<!-- LOADER -->
<div id="loader">
  <video id="loaderVideo" autoplay muted playsinline preload="auto">
    <source src="assets/loader.mp4" type="video/mp4">
  </video>
  <div class="loader-text">Go Down <em>Herbs</em></div>
</div>
```

## 3. Replace the loader-hide JS

Find:
```js
// ----- LOADER HIDE -----
setTimeout(()=>document.getElementById('loader').classList.add('hide'), 2000);
```

Replace with:
```js
// ----- LOADER HIDE (synced to intro video) -----
(function(){
  const loader = document.getElementById('loader');
  const vid = document.getElementById('loaderVideo');
  const hide = ()=>loader.classList.add('hide');
  let hidden = false;
  const doHide = ()=>{ if(hidden) return; hidden = true; hide(); };
  vid.addEventListener('ended', doHide);
  setTimeout(doHide, 6000); // safety fallback, never blocks the site more than ~6s
  vid.addEventListener('error', ()=>setTimeout(doHide, 300));
})();
```

That's it — three small edits + the new asset files, nothing else changed.
