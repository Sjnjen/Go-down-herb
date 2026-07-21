<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no">
<title>Go Down Herbs | Venda-Herbs by T/Dr Bubudza</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  :root{
    --ink:#1c1712;
    --moss:#2f4a2e;
    --moss-dark:#213622;
    --moss-light:#4c6b45;
    --ochre:#c17f2a;
    --ochre-light:#dba454;
    --parchment:#f4ecd8;
    --parchment-dim:#e6dabb;
    --card:#fbf6e9;
    --ember:#9c3b2a;
    --sage:#7f9673;
    --line: rgba(28,23,18,0.12);
    --line-strong: rgba(28,23,18,0.22);
  }
  *{box-sizing:border-box; margin:0; padding:0;}
  html{scroll-behavior:smooth;}
  body{
    background:var(--parchment);
    color:var(--ink);
    font-family:'Manrope', sans-serif;
    overflow-x:hidden;
    -webkit-tap-highlight-color: transparent;
  }
  @media (prefers-reduced-motion: reduce){
    *{animation-duration:0.001ms !important; animation-iteration-count:1 !important; transition-duration:0.001ms !important;}
  }
  .serif{ font-family:'Instrument Serif', serif; }
  .mono{ font-family:'Space Mono', monospace; }
  h1,h2,h3{ font-family:'Instrument Serif', serif; font-weight:400; line-height:1.02; }
  a{color:inherit;}
  button{font-family:inherit; cursor:pointer; border:none;}
  ::selection{ background:var(--ochre); color:var(--parchment); }
  img{max-width:100%; display:block;}

  /* ============ LOADER ============ */
  #loader{
    position:fixed; inset:0; z-index:999;
    background: var(--moss-dark);
    display:flex; align-items:center; justify-content:center; flex-direction:column;
    transition: opacity 0.7s ease, visibility 0.7s ease;
  }
  #loader.hide{ opacity:0; visibility:hidden; pointer-events:none; }
  .loader-pot{ position:relative; width:160px; height:160px; }
  .loader-pot svg{ width:100%; height:100%; }
  .steam{
    position:absolute; width:6px; height:6px; border-radius:50%;
    background:rgba(244,236,216,0.5);
    left:50%; top:28%;
    animation: steam-rise 2.2s ease-in infinite;
    filter: blur(1px);
  }
  .steam:nth-child(2){ left:44%; animation-delay:0.4s; }
  .steam:nth-child(3){ left:58%; animation-delay:0.8s; }
  .steam:nth-child(4){ left:50%; animation-delay:1.2s; }
  @keyframes steam-rise{
    0%{ opacity:0; transform:translate(0,0) scale(0.6); }
    30%{ opacity:0.7; }
    100%{ opacity:0; transform:translate(10px,-90px) scale(1.8); }
  }
  .loader-word{
    margin-top:20px; font-family:'Instrument Serif'; font-style:italic;
    font-size:22px; color:var(--parchment); letter-spacing:0.01em;
  }
  .loader-sub{
    margin-top:8px; font-size:10.5px; letter-spacing:0.3em; color:var(--ochre-light);
  }

  /* ============ NAV ============ */
  header{
    position:sticky; top:0; z-index:60;
    background:rgba(244,236,216,0.92); backdrop-filter: blur(10px);
    border-bottom:1px solid var(--line);
  }
  .nav-wrap{
    max-width:1200px; margin:0 auto; padding:14px 20px;
    display:flex; align-items:center; justify-content:space-between;
  }
  .logo{ display:flex; align-items:center; gap:10px; }
  .logo-mark{ width:36px; height:36px; flex-shrink:0; }
  .logo-text{ display:flex; flex-direction:column; line-height:1; }
  .logo-text .l1{ font-family:'Instrument Serif'; font-style:italic; font-size:19px; color:var(--moss); }
  .logo-text .l2{ font-size:8.5px; letter-spacing:0.24em; color:var(--ochre); margin-top:3px; }
  .nav-links{ display:flex; gap:26px; font-size:13px; font-weight:600; }
  .nav-links a{ text-decoration:none; color:var(--ink); opacity:0.75; }
  .nav-links a:hover{ opacity:1; }
  @media (max-width:780px){ .nav-links{ display:none; } }
  .cart-btn{
    position:relative; display:flex; align-items:center; gap:8px;
    background:var(--moss); color:var(--parchment);
    padding:10px 16px; border-radius:2px; font-size:13px; font-weight:700; letter-spacing:0.02em;
  }
  .cart-count{
    position:absolute; top:-7px; right:-7px; background:var(--ember); color:var(--parchment);
    width:18px; height:18px; border-radius:50%; font-size:10px; display:flex; align-items:center; justify-content:center;
    font-family:'Space Mono'; font-weight:700;
  }

  /* ============ HERO ============ */
  .hero{
    position:relative; padding:70px 20px 60px;
    background:
      radial-gradient(ellipse at 20% 0%, rgba(193,127,42,0.14), transparent 55%),
      var(--parchment);
    border-bottom:1px solid var(--line);
    overflow:hidden;
  }
  .hero-inner{
    max-width:1200px; margin:0 auto; position:relative; z-index:2;
    display:grid; grid-template-columns:1.15fr 0.85fr; gap:40px; align-items:center;
  }
  @media (max-width:900px){ .hero-inner{ grid-template-columns:1fr; } }
  .eyebrow{
    display:inline-flex; align-items:center; gap:8px; font-size:11px; letter-spacing:0.26em;
    color:var(--moss-light); font-weight:700; margin-bottom:18px; text-transform:uppercase;
  }
  .eyebrow::before{ content:''; width:22px; height:1px; background:var(--moss-light); }
  .hero h1{
    font-size:clamp(42px, 7.5vw, 78px); color:var(--ink);
  }
  .hero h1 em{ color:var(--moss); font-style:italic; }
  .hero p.lede{
    margin-top:22px; max-width:460px; font-size:16.5px; line-height:1.65; color:rgba(28,23,18,0.72);
  }
  .hero-ctas{ display:flex; gap:14px; margin-top:32px; flex-wrap:wrap; }
  .btn-primary{
    background:var(--moss); color:var(--parchment); padding:16px 28px; border-radius:2px;
    font-weight:700; font-size:14px; letter-spacing:0.02em; display:inline-flex; align-items:center; gap:8px;
    transition: transform 0.15s ease;
  }
  .btn-primary:active{ transform:scale(0.97); }
  .btn-ghost{
    border:1.5px solid var(--line-strong); color:var(--ink); padding:15px 26px; border-radius:2px;
    font-weight:700; font-size:14px; background:transparent;
  }
  .hero-visual{
    position:relative; aspect-ratio:1/1; max-width:420px; margin:0 auto;
    display:flex; align-items:center; justify-content:center;
  }
  .hero-visual .pot-ring{
    position:absolute; inset:0; border:1.5px dashed var(--line-strong); border-radius:50%;
    animation: spin-slow 60s linear infinite;
  }
  @keyframes spin-slow{ to{ transform:rotate(360deg); } }
  .hero-pot-svg{ width:78%; }
  .hero-steam{
    position:absolute; width:8px; height:8px; border-radius:50%;
    background:rgba(79,107,69,0.35); left:50%; top:8%;
    animation: hero-steam 3.4s ease-in infinite;
  }
  .hero-steam:nth-child(2){ left:44%; animation-delay:0.6s; }
  .hero-steam:nth-child(3){ left:57%; animation-delay:1.2s; }

  /* ============ TRUST BAR ============ */
  .trust-bar{ background:var(--moss); border-bottom:1px solid var(--line); }
  .trust-track{ display:flex; width:max-content; animation: scroll-left 24s linear infinite; }
  .trust-bar:hover .trust-track{ animation-play-state:paused; }
  @keyframes scroll-left{ 0%{transform:translateX(0);} 100%{transform:translateX(-50%);} }
  .trust-item{
    display:flex; align-items:center; gap:10px; padding:16px 30px;
    border-right:1px solid rgba(244,236,216,0.14); white-space:nowrap; color:var(--parchment);
  }
  .trust-item svg{ width:18px; height:18px; flex-shrink:0; color:var(--ochre-light); }
  .trust-item span{ font-size:12.5px; letter-spacing:0.05em; font-weight:600; }

  /* ============ SECTIONS SHARED ============ */
  section{ padding:84px 20px; max-width:1200px; margin:0 auto; }
  .section-head{ margin-bottom:44px; max-width:640px; }
  .section-head .eyebrow{ margin-bottom:12px; }
  .section-head h2{ font-size:clamp(32px,4.6vw,50px); color:var(--ink); }
  .section-head h2 em{ color:var(--moss); font-style:italic; }
  .section-head p{ margin-top:14px; color:rgba(28,23,18,0.68); font-size:15px; line-height:1.65; }

  /* ============ PRODUCTS ============ */
  .products-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
  @media (max-width:900px){ .products-grid{ grid-template-columns:repeat(2,1fr); } }
  @media (max-width:620px){ .products-grid{ grid-template-columns:1fr; } }
  .product-card{
    background:var(--card); border:1px solid var(--line); border-radius:6px; padding:26px;
    display:flex; flex-direction:column; position:relative; transition: border-color 0.2s ease, transform 0.2s ease;
  }
  .product-card:hover{ border-color:var(--ochre); transform:translateY(-3px); }
  .pc-number{ font-family:'Space Mono'; font-size:11px; color:var(--ochre); letter-spacing:0.08em; margin-bottom:14px; }
  .pc-icon{ width:44px; height:44px; margin-bottom:16px; }
  .pc-name{ font-size:26px; color:var(--ink); margin-bottom:6px; }
  .pc-tag{ font-size:12.5px; color:var(--moss-light); font-weight:600; margin-bottom:14px; }
  .pc-desc{ font-size:13.5px; line-height:1.55; color:rgba(28,23,18,0.68); margin-bottom:18px; flex:1; }
  .pc-foot{ display:flex; align-items:center; justify-content:space-between; margin-top:auto; }
  .pc-price{ font-family:'Space Mono'; font-weight:700; font-size:18px; color:var(--ink); }
  .pc-add{
    background:var(--moss); color:var(--parchment); padding:9px 14px; border-radius:2px;
    font-size:12px; font-weight:700; display:flex; align-items:center; gap:6px;
  }
  .pc-add svg{ width:13px; height:13px; }
  .pc-instructions{
    font-size:11px; color:var(--ochre); border-top:1px dashed var(--line); padding-top:10px; margin-top:14px;
    letter-spacing:0.01em;
  }

  /* ============ COMPARISON ============ */
  .compare-wrap{ overflow-x:auto; border:1px solid var(--line); border-radius:6px; background:var(--card); }
  table.compare{ width:100%; border-collapse:collapse; min-width:640px; }
  table.compare th, table.compare td{ padding:16px 18px; text-align:left; border-bottom:1px solid var(--line); font-size:13.5px; }
  table.compare th{ font-family:'Space Mono'; font-size:11px; letter-spacing:0.06em; text-transform:uppercase; color:var(--moss); background:var(--parchment-dim); }
  table.compare td:first-child{ font-weight:700; font-family:'Instrument Serif'; font-size:17px; }
  table.compare tr:last-child td{ border-bottom:none; }
  .strength-dots{ display:flex; gap:4px; }
  .strength-dot{ width:8px; height:8px; border-radius:50%; background:var(--line-strong); }
  .strength-dot.on{ background:var(--ochre); }

  /* ============ DIFFERENTIATORS ============ */
  .diff-band{ background:var(--moss-dark); color:var(--parchment); }
  .diff-band .section-head h2{ color:var(--parchment); }
  .diff-band .section-head p{ color:rgba(244,236,216,0.68); }
  .diff-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:2px; background:rgba(244,236,216,0.12); border:1px solid rgba(244,236,216,0.12); }
  @media (max-width:860px){ .diff-grid{ grid-template-columns:repeat(2,1fr); } }
  .diff-card{ background:var(--moss-dark); padding:30px 22px; }
  .diff-card svg{ width:26px; height:26px; color:var(--ochre-light); margin-bottom:14px; }
  .diff-card h3{ font-size:19px; margin-bottom:8px; color:var(--parchment); }
  .diff-card p{ font-size:12.5px; color:rgba(244,236,216,0.62); line-height:1.55; }

  /* ============ LOCATIONS / MAP ============ */
  .map-wrap{ display:grid; grid-template-columns:1fr 1fr; gap:36px; }
  @media (max-width:900px){ .map-wrap{ grid-template-columns:1fr; } }
  #map{ width:100%; height:420px; border-radius:6px; border:1px solid var(--line); filter: sepia(0.12) saturate(0.9); }
  .branch-list{ display:flex; flex-direction:column; gap:0; max-height:420px; overflow-y:auto; border:1px solid var(--line); border-radius:6px; }
  .branch-item{ padding:16px 18px; border-bottom:1px solid var(--line); cursor:pointer; transition:background 0.15s ease; }
  .branch-item:last-child{ border-bottom:none; }
  .branch-item:hover, .branch-item.active{ background:var(--card); }
  .branch-num{ font-family:'Space Mono'; font-size:10.5px; color:var(--ochre); }
  .branch-name{ font-size:17px; font-family:'Instrument Serif'; margin:3px 0 4px; }
  .branch-addr{ font-size:12px; color:rgba(28,23,18,0.62); line-height:1.5; }

  /* ============ DELIVERY OPTIONS ============ */
  .delivery-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-top:10px; }
  @media (max-width:800px){ .delivery-grid{ grid-template-columns:repeat(2,1fr); } }
  .delivery-card{ background:var(--card); border:1px solid var(--line); border-radius:6px; padding:22px; text-align:center; }
  .delivery-card img, .delivery-card .dc-icon{ height:26px; margin:0 auto 12px; }
  .dc-price{ font-family:'Space Mono'; font-weight:700; font-size:16px; color:var(--ochre); margin-bottom:6px; }
  .dc-name{ font-weight:700; font-size:13.5px; margin-bottom:4px; }
  .dc-desc{ font-size:11.5px; color:rgba(28,23,18,0.6); }
  .delivery-note{ margin-top:18px; font-size:12.5px; color:var(--ember); background:rgba(156,59,42,0.08); border:1px solid rgba(156,59,42,0.25); border-radius:4px; padding:12px 16px; }

  /* ============ PAYMENT / EFT ============ */
  .eft-card{
    background:var(--card); border:1px solid var(--line); border-radius:6px; padding:30px;
    display:grid; grid-template-columns:1fr 1fr; gap:24px;
  }
  @media (max-width:700px){ .eft-card{ grid-template-columns:1fr; } }
  .eft-row{ display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--line); font-size:13.5px; }
  .eft-row:last-child{ border-bottom:none; }
  .eft-row .er-label{ color:rgba(28,23,18,0.55); }
  .eft-row .er-val{ font-family:'Space Mono'; font-weight:700; }

  /* ============ DISCLAIMER ============ */
  .disclaimer-band{ background:var(--parchment-dim); border-top:1px solid var(--line); border-bottom:1px solid var(--line); }
  .disclaimer-box{
    display:flex; gap:18px; align-items:flex-start; background:var(--card);
    border:1.5px solid var(--ember); border-radius:6px; padding:26px 28px;
  }
  .disclaimer-box svg{ width:26px; height:26px; color:var(--ember); flex-shrink:0; }
  .disclaimer-box h3{ font-family:'Manrope'; font-weight:800; font-size:15px; text-transform:uppercase; letter-spacing:0.04em; color:var(--ember); margin-bottom:8px; }
  .disclaimer-box p{ font-size:13.5px; line-height:1.65; color:rgba(28,23,18,0.78); }
  .disclaimer-box p + p{ margin-top:10px; }

  footer{ border-top:1px solid var(--line); padding:40px 20px 100px; text-align:center; }
  footer .fmark{ font-family:'Instrument Serif'; font-style:italic; font-size:20px; color:var(--moss); margin-bottom:8px; }
  footer .fsub{ font-size:11.5px; color:rgba(28,23,18,0.5); letter-spacing:0.08em; }
  footer .dev-credit{ display:block; margin-top:16px; font-size:11.5px; color:var(--ochre); text-decoration:none; }

  /* ============ CART DRAWER ============ */
  .overlay{
    position:fixed; inset:0; background:rgba(28,23,18,0.55); z-index:80;
    opacity:0; visibility:hidden; transition:opacity 0.3s ease, visibility 0.3s ease;
  }
  .overlay.open{ opacity:1; visibility:visible; }
  .drawer{
    position:fixed; top:0; right:0; height:100%; width:min(440px,100%);
    background:var(--parchment); z-index:90; border-left:1px solid var(--line-strong);
    transform:translateX(100%); transition:transform 0.35s cubic-bezier(.2,.8,.2,1);
    display:flex; flex-direction:column;
  }
  .drawer.open{ transform:translateX(0); }
  .drawer-head{ display:flex; align-items:center; justify-content:space-between; padding:20px 22px; border-bottom:1px solid var(--line); }
  .drawer-head h3{ font-size:22px; }
  .drawer-close{ background:transparent; color:var(--ink); font-size:24px; line-height:1; }
  .drawer-body{ flex:1; overflow-y:auto; padding:18px 22px; }
  .cart-line{ display:flex; gap:12px; padding:14px 0; border-bottom:1px solid var(--line); }
  .cl-icon{ width:44px; height:44px; flex-shrink:0; }
  .cl-info{ flex:1; }
  .cl-name{ font-size:14.5px; font-weight:700; }
  .cl-meta{ font-size:11px; color:rgba(28,23,18,0.55); margin-top:2px; }
  .cl-qty-row{ display:flex; align-items:center; justify-content:space-between; margin-top:8px; }
  .cl-qty{ display:flex; align-items:center; border:1px solid var(--line-strong); border-radius:2px; }
  .cl-qty button{ width:24px; height:24px; background:transparent; color:var(--ink); font-size:13px; }
  .cl-qty span{ width:24px; text-align:center; font-family:'Space Mono'; font-size:12px; }
  .cl-price{ font-family:'Space Mono'; font-size:13px; font-weight:700; }
  .cl-remove{ background:transparent; color:var(--ember); font-size:10.5px; text-decoration:underline; margin-top:6px; }
  .empty-cart{ text-align:center; padding:60px 10px; color:rgba(28,23,18,0.5); }
  .empty-cart svg{ width:42px; height:42px; margin-bottom:14px; opacity:0.5; }

  .fulfil-select{ margin:16px 0 12px; }
  .fulfil-select label{ font-size:11px; letter-spacing:0.05em; color:var(--moss-light); text-transform:uppercase; display:block; margin-bottom:8px; font-weight:700;}
  .fulfil-options{ display:flex; flex-direction:column; gap:8px; }
  .fulfil-opt{
    display:flex; justify-content:space-between; align-items:center;
    border:1px solid var(--line-strong); border-radius:4px; padding:11px 13px; font-size:12.5px;
  }
  .fulfil-opt.active{ border-color:var(--ochre); background:var(--card); }
  .fulfil-opt .fo-price{ font-family:'Space Mono'; color:var(--ochre); font-size:11.5px; }

  #branchSelectWrap, #addressFieldsWrap{ display:none; margin-top:12px; }
  #branchSelectWrap.show, #addressFieldsWrap.show{ display:block; }

  .field-group{ margin-bottom:12px; }
  .field-group label{ font-size:10.5px; letter-spacing:0.05em; color:var(--moss-light); text-transform:uppercase; display:block; margin-bottom:5px; font-weight:700; }
  .field-group input, .field-group select, .field-group textarea{
    width:100%; background:var(--card); border:1px solid var(--line-strong); color:var(--ink);
    padding:10px 12px; border-radius:4px; font-family:'Manrope'; font-size:13px; resize:vertical;
  }
  .field-group input:focus, .field-group select:focus, .field-group textarea:focus{ outline:2px solid var(--ochre); outline-offset:1px; }

  .drawer-foot{ border-top:1px solid var(--line); padding:16px 22px 24px; }
  .total-row{ display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
  .total-row .tr-label{ font-size:13px; color:rgba(28,23,18,0.6); }
  .total-row .tr-value{ font-family:'Space Mono'; font-size:21px; font-weight:700; color:var(--ochre); }
  .checkout-btn{
    width:100%; background:#25D366; color:#0d1a10; padding:15px; border-radius:4px;
    font-weight:700; font-size:14px; display:flex; align-items:center; justify-content:center; gap:9px; margin-bottom:8px;
  }
  .checkout-btn svg{ width:18px; height:18px; }
  .eft-hint{ font-size:11px; text-align:center; color:rgba(28,23,18,0.5); }

  a:focus-visible, button:focus-visible{ outline:2px solid var(--ochre); outline-offset:2px; }
</style>
</head>
<body>

<!-- ============ LOADER ============ -->
<div id="loader" aria-hidden="true">
  <div class="loader-pot">
    <div class="steam"></div><div class="steam"></div><div class="steam"></div><div class="steam"></div>
    <svg viewBox="0 0 160 160" fill="none">
      <ellipse cx="80" cy="128" rx="46" ry="10" fill="rgba(0,0,0,0.25)"/>
      <path d="M35 60 h90 l-8 46 a26 26 0 0 1 -26 22 H69 a26 26 0 0 1 -26 -22 Z" fill="#171512" stroke="#4c6b45" stroke-width="1.5"/>
      <path d="M35 60 c-8 -4 -8 -14 0 -16 M125 60 c8 -4 8 -14 0 -16" stroke="#4c6b45" stroke-width="3" stroke-linecap="round" fill="none"/>
      <ellipse cx="80" cy="60" rx="45" ry="8" fill="#213622" stroke="#4c6b45" stroke-width="1.5"/>
      <path d="M60 58 q4 -8 10 -2 q4 -8 10 0 q4 -8 10 2" stroke="#dba454" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M20 96 h20 M120 96 h20" stroke="#c17f2a" stroke-width="4" stroke-linecap="round"/>
    </svg>
  </div>
  <div class="loader-word">Pot of Life</div>
  <div class="loader-sub">WARMING THE HERBS</div>
</div>

<!-- ============ HEADER ============ -->
<header>
  <div class="nav-wrap">
    <div class="logo">
      <svg class="logo-mark" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="19" fill="var(--moss)"/>
        <path d="M10 16h20l-2 11a7 7 0 0 1-7 6h-2a7 7 0 0 1-7-6Z" fill="#f4ecd8"/>
        <path d="M10 16c-2-1-2-4 0-5M30 16c2-1 2-4 0-5" stroke="#f4ecd8" stroke-width="1.6" stroke-linecap="round" fill="none"/>
        <path d="M16 15q1-3 2.5-1t2.5-1t2.5 1" stroke="#c17f2a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      </svg>
      <div class="logo-text">
        <span class="l1">Go Down Herbs</span>
        <span class="l2">VENDA-HERBS · T/DR BUBUDZA</span>
      </div>
    </div>
    <nav class="nav-links">
      <a href="#products">Products</a>
      <a href="#compare">Compare</a>
      <a href="#locations">Branches</a>
      <a href="#delivery">Delivery</a>
    </nav>
    <button class="cart-btn" onclick="openDrawer()" aria-label="Open cart">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="21" r="1.4" fill="currentColor"/><circle cx="18" cy="21" r="1.4" fill="currentColor"/></svg>
      Cart <span class="cart-count" id="cartCount">0</span>
    </button>
  </div>
</header>

<!-- ============ HERO ============ -->
<div class="hero">
  <div class="hero-inner">
    <div>
      <div class="eyebrow">100% NATURAL · HANDCRAFTED IN VENDA</div>
      <h1>From the <em>pot</em><br>of life, to<br>your home.</h1>
      <p class="lede">Six traditional Venda herbal preparations, blended the way T/Dr Bubudza's family has for generations. Order online, collect at one of eight branches, or have it delivered nationwide.</p>
      <div class="hero-ctas">
        <a href="#products" class="btn-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Shop the range
        </a>
        <a href="#locations" class="btn-ghost">Find a branch</a>
      </div>
    </div>
    <div class="hero-visual">
      <div class="pot-ring"></div>
      <div class="hero-steam"></div><div class="hero-steam"></div><div class="hero-steam"></div>
      <svg class="hero-pot-svg" viewBox="0 0 260 260" fill="none">
        <ellipse cx="130" cy="210" rx="70" ry="12" fill="rgba(28,23,18,0.08)"/>
        <path d="M60 100 h140 l-13 74 a42 42 0 0 1-42 35 h-30 a42 42 0 0 1-42-35Z" fill="#1c1712"/>
        <path d="M60 100 c-14-6-14-24 0-28M200 100c14-6 14-24 0-28" stroke="#4c6b45" stroke-width="5" stroke-linecap="round" fill="none"/>
        <ellipse cx="130" cy="100" rx="72" ry="13" fill="#2f4a2e" stroke="#4c6b45" stroke-width="2"/>
        <path d="M95 96q6-13 16-3q6-13 16 0q6-13 16 3" stroke="#dba454" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M28 168h32M200 168h32" stroke="#c17f2a" stroke-width="7" stroke-linecap="round"/>
      </svg>
    </div>
  </div>
</div>

<!-- ============ TRUST BAR ============ -->
<div class="trust-bar">
  <div class="trust-track" id="trustTrack"></div>
</div>

<!-- ============ PRODUCTS ============ -->
<section id="products">
  <div class="section-head">
    <div class="eyebrow">THE RANGE</div>
    <h2>Six blends, one <em>pot</em>.</h2>
    <p>Every bottle is prepared traditionally by hand. Descriptions below reflect traditional use — these are herbal preparations, not medically tested treatments. See our notice further down the page.</p>
  </div>
  <div class="products-grid" id="productsGrid"></div>
</section>

<!-- ============ COMPARE ============ -->
<section id="compare">
  <div class="section-head">
    <div class="eyebrow">WHICH ONE IS RIGHT FOR YOU</div>
    <h2>Compare the <em>range</em></h2>
    <p>Not sure where to start? Here's how the six blends differ in strength, form and who they're generally prepared for. Message us on WhatsApp and we'll help you choose.</p>
  </div>
  <div class="compare-wrap">
    <table class="compare" id="compareTable"></table>
  </div>
</section>

<!-- ============ DIFFERENTIATORS ============ -->
<div class="diff-band">
  <section>
    <div class="section-head">
      <div class="eyebrow">WHY GO DOWN HERBS</div>
      <h2>Not mass-produced.<br><em>Not imported.</em></h2>
      <p>Where a lot of "traditional wellness" products on the market are bottled overseas and rebranded, ours are prepared in-house from the same pot pictured on every label.</p>
    </div>
    <div class="diff-grid" id="diffGrid"></div>
  </section>
</div>

<!-- ============ LOCATIONS ============ -->
<section id="locations">
  <div class="section-head">
    <div class="eyebrow">FIND US</div>
    <h2>Eight branches, <em>nationwide</em>.</h2>
    <p>Visit a branch to collect in person, or order online for delivery to your door, a Postnet, or a Pudo locker.</p>
  </div>
  <div class="map-wrap">
    <div id="map"></div>
    <div class="branch-list" id="branchList"></div>
  </div>
</section>

<!-- ============ DELIVERY ============ -->
<section id="delivery">
  <div class="section-head">
    <div class="eyebrow">DELIVERY &amp; COLLECTION</div>
    <h2>However suits <em>you</em>.</h2>
    <p>Choose your delivery method at checkout — pricing is shown in your cart before you confirm.</p>
  </div>
  <div class="delivery-grid" id="deliveryGrid"></div>
  <div class="delivery-note">Liquids cannot travel via PEP/Paxi, so we don't offer it as an option — please choose one of the methods above instead.</div>
</section>

<!-- ============ EFT / PAYMENT ============ -->
<section id="payment">
  <div class="section-head">
    <div class="eyebrow">PAYMENT</div>
    <h2>WhatsApp order, <em>or EFT</em>.</h2>
    <p>Check out through WhatsApp for the fastest response, or pay directly by bank transfer using the details below — then send proof of payment to confirm your order.</p>
  </div>
  <div class="eft-card">
    <div>
      <div class="eft-row"><span class="er-label">Bank</span><span class="er-val">FNB</span></div>
      <div class="eft-row"><span class="er-label">Account No.</span><span class="er-val">62927074831</span></div>
      <div class="eft-row"><span class="er-label">Account Holder</span><span class="er-val">The Go Down Pty (Ltd)</span></div>
    </div>
    <div>
      <div class="eft-row"><span class="er-label">Branch</span><span class="er-val">Sunnypark</span></div>
      <div class="eft-row"><span class="er-label">Branch Code</span><span class="er-val">250655</span></div>
      <div class="eft-row"><span class="er-label">Reference</span><span class="er-val">Your name</span></div>
    </div>
  </div>
</section>

<!-- ============ DISCLAIMER ============ -->
<div class="disclaimer-band">
  <section style="padding:56px 20px;">
    <div class="disclaimer-box">
      <svg viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
      <div>
        <h3>Important notice</h3>
        <p>These are traditional herbal preparations rooted in Venda cultural practice. They are <strong>not medically tested, evaluated, or approved</strong> to diagnose, treat, cure or prevent any disease or medical condition.</p>
        <p>If you have a medical condition, are pregnant or breastfeeding, or are on chronic medication, please speak to a qualified healthcare professional before use — and never stop or delay prescribed medical treatment on the basis of these products.</p>
      </div>
    </div>
  </section>
</div>

<footer>
  <div class="fmark">Go Down Herbs</div>
  <div class="fsub">VENDA-HERBS BY T/DR BUBUDZA · POT OF LIFE</div>
  <a class="dev-credit" href="#" onclick="return false;">Site by SJ DEV</a>
</footer>

<!-- ============ CART DRAWER ============ -->
<div class="overlay" id="overlay" onclick="closeDrawer()"></div>
<div class="drawer" id="drawer" role="dialog" aria-label="Shopping cart">
  <div class="drawer-head">
    <h3>Your basket</h3>
    <button class="drawer-close" onclick="closeDrawer()" aria-label="Close cart">×</button>
  </div>
  <div class="drawer-body" id="drawerBody"></div>
  <div class="drawer-foot" id="drawerFoot" style="display:none;">
    <div class="fulfil-select">
      <label>Delivery method</label>
      <div class="fulfil-options" id="fulfilOptions"></div>
    </div>

    <div id="branchSelectWrap">
      <div class="field-group">
        <label for="branchSelect">Collection branch</label>
        <select id="branchSelect"></select>
      </div>
    </div>

    <div id="addressFieldsWrap">
      <div class="field-group">
        <label for="custName">Your name</label>
        <input type="text" id="custName" placeholder="Full name">
      </div>
      <div class="field-group">
        <label for="custAddress" id="addressLabel">Delivery address</label>
        <textarea id="custAddress" rows="2" placeholder="Street, suburb, town, postal code"></textarea>
      </div>
    </div>

    <div class="total-row">
      <span class="tr-label">Total</span>
      <span class="tr-value mono" id="totalValue">R0</span>
    </div>
    <button class="checkout-btn" onclick="checkout()">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.44 5.13L2 22l5.13-1.53a9.87 9.87 0 0 0 4.9 1.3h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Z"/></svg>
      Checkout on WhatsApp
    </button>
    <div class="eft-hint">Prefer EFT? Scroll to the Payment section for our banking details.</div>
  </div>
</div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
/* ============ ICONS ============ */
const ICON = {
  pot: '<svg viewBox="0 0 44 44" fill="none"><path d="M8 16h28l-3 20a10 10 0 0 1-10 8h-2a10 10 0 0 1-10-8Z" fill="#2f4a2e"/><ellipse cx="22" cy="16" rx="18" ry="4" fill="#4c6b45"/></svg>',
  bottle: '<svg viewBox="0 0 44 44" fill="none"><rect x="16" y="2" width="12" height="8" rx="1.5" fill="#c17f2a"/><path d="M12 12h20a2 2 0 0 1 2 2v22a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V14a2 2 0 0 1 2-2Z" fill="#2f4a2e"/></svg>',
  jar: '<svg viewBox="0 0 44 44" fill="none"><rect x="8" y="14" width="28" height="22" rx="4" fill="#c17f2a"/><rect x="10" y="8" width="24" height="8" rx="2" fill="#2f4a2e"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 20c8 0 16-6 16-16C10 4 4 12 4 20Z" stroke="currentColor" stroke-width="1.6"/><path d="M6 18c4-4 8-8 12-12" stroke="currentColor" stroke-width="1.4"/></svg>',
  hand: '<svg viewBox="0 0 24 24" fill="none"><path d="M8 12V5a2 2 0 0 1 4 0v6M12 11V4a2 2 0 0 1 4 0v7M16 12V6a2 2 0 0 1 4 0v9c0 3.5-2.5 7-6.5 7h-2C8 22 6 19 5 17l-1.8-3.6a1.6 1.6 0 0 1 2.6-1.8L8 15" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9.5" r="2.4" stroke="currentColor" stroke-width="1.6"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 7h11v9H3z" stroke="currentColor" stroke-width="1.6"/><path d="M14 10h4l3 3v3h-7" stroke="currentColor" stroke-width="1.6"/><circle cx="7" cy="18" r="1.6" stroke="currentColor" stroke-width="1.4"/><circle cx="17" cy="18" r="1.6" stroke="currentColor" stroke-width="1.4"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 7 12 3l9 4-9 4-9-4Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M3 7v10l9 4 9-4V7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 11v10" stroke="currentColor" stroke-width="1.5"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6" stroke="currentColor" stroke-width="1.6"/></svg>'
};

/* ============ PRODUCT DATA ============ */
const PRODUCTS = [
  {id:'go-down', num:'01', name:'Go Down Herb', price:150, form:'Tonic', strength:2, forWho:'Adults', tag:'The everyday foundation blend',
    desc:'The original Go Down formula. Traditionally used for everyday vitality, easing tiredness and general body discomfort.',
    instructions:'Half a cup morning & evening. Keep refrigerated.'},
  {id:'underground', num:'02', name:'Underground Herb', price:200, form:'Tonic', strength:4, forWho:'Adults', tag:'The stronger sibling of Go Down',
    desc:'Same family as Go Down Herb, prepared to a stronger concentration for those wanting a more intensive traditional remedy.',
    instructions:'Half a cup morning & evening. Keep refrigerated.'},
  {id:'silent', num:'03', name:'Silent Herb', price:250, form:'Tonic', strength:1, forWho:'Children', tag:'Gentle, child-friendly blend',
    desc:'A gentle, all-natural blend prepared specifically with children in mind — for general wellness support and everyday appetite.',
    instructions:'Quarter cup morning & evening. Keep refrigerated.'},
  {id:'stomach', num:'04', name:'Stomach Cleanser', price:50, form:'Powder blend', strength:2, forWho:'Adults', tag:'Traditional digestive blend',
    desc:'Mixed with cold milk as a once-off traditional cleanse — used for easing bloating, cramping and constipation.',
    instructions:'Mix with cold milk, shake well & drink before meals. Once, morning or early evening.'},
  {id:'mpesu', num:'05', name:'Mpesu Energy', price:50, form:'Tonic', strength:3, forWho:'Adults', tag:'Traditional energy tonic',
    desc:'A traditional pick-me-up blend used for natural energy and overall vitality throughout the day.',
    instructions:'Drink half the bottle in the morning with 1 litre of water. Drink the rest as needed.'},
  {id:'oil', num:'06', name:'Anointed Oil', price:200, form:'Topical oil', strength:1, forWho:'Adults & children', tag:'All-in-one herbal skin oil',
    desc:'A nourishing herbal oil for everyday skin care — traditionally applied to soothe irritation and as a nourishing face treatment.',
    instructions:'Apply a thin layer to the affected area once in the evening.'}
];

function renderProducts(){
  document.getElementById('productsGrid').innerHTML = PRODUCTS.map(p=>`
    <div class="product-card">
      <div class="pc-number mono">PRODUCT NO. ${p.num}</div>
      <div class="pc-icon">${ICON[p.form==='Topical oil'?'jar':'bottle']}</div>
      <div class="pc-name">${p.name}</div>
      <div class="pc-tag">${p.tag}</div>
      <div class="pc-desc">${p.desc}</div>
      <div class="pc-foot">
        <div class="pc-price mono">R${p.price}</div>
        <button class="pc-add" onclick="addToCart('${p.id}')">${ICON.cart} Add</button>
      </div>
      <div class="pc-instructions">${p.instructions}</div>
    </div>
  `).join('');
}
renderProducts();

function renderCompare(){
  const rows = PRODUCTS.map(p=>`
    <tr>
      <td>${p.name}</td>
      <td>${p.form}</td>
      <td><div class="strength-dots">${[1,2,3,4].map(i=>`<div class="strength-dot ${i<=p.strength?'on':''}"></div>`).join('')}</div></td>
      <td>${p.forWho}</td>
      <td class="mono">R${p.price}</td>
    </tr>
  `).join('');
  document.getElementById('compareTable').innerHTML = `
    <thead><tr><th>Blend</th><th>Form</th><th>Strength</th><th>Prepared for</th><th>Price</th></tr></thead>
    <tbody>${rows}</tbody>
  `;
}
renderCompare();

/* ============ TRUST BAR ============ */
const TRUST = [
  {icon:'leaf', text:'100% Natural Ingredients'},
  {icon:'hand', text:'Handcrafted in Venda'},
  {icon:'pin', text:'8 Branches Nationwide'},
  {icon:'truck', text:'Nationwide Delivery'},
  {icon:'box', text:'Collection or Courier'}
];
function renderTrust(){
  let html = '';
  for(let r=0;r<2;r++){
    TRUST.forEach(t=>{ html += `<div class="trust-item">${ICON[t.icon]}<span>${t.text}</span></div>`; });
  }
  document.getElementById('trustTrack').innerHTML = html;
}
renderTrust();

/* ============ DIFFERENTIATORS ============ */
const DIFFS = [
  {icon:'hand', title:'Family-prepared', text:'Every blend is prepared by hand from the same pot pictured on our label — not outsourced to a factory.'},
  {icon:'pin', title:'8 real branches', text:'Walk into a shop in Pretoria, Joburg, Polokwane, Makhado, Thohoyandou, Nzhelele or Soweto and speak to us directly.'},
  {icon:'leaf', title:'No synthetic fillers', text:'Our formulas are made from natural herbs, prepared the traditional way — nothing artificial added.'},
  {icon:'truck', title:'You choose how it arrives', text:'Courier to your door, Postnet, a Pudo locker near you, or same-day Bolt/Uber — your call.'}
];
document.getElementById('diffGrid').innerHTML = DIFFS.map(d=>`
  <div class="diff-card">${ICON[d.icon]}<h3>${d.title}</h3><p>${d.text}</p></div>
`).join('');

/* ============ BRANCHES ============ */
const BRANCHES = [
  {num:'01', name:'Pretoria', addr:'Shop No. 37, Barclay Square Shopping Centre, 296 Justice Mohammed St, Sunnyside, 0002', lat:-25.7487, lng:28.2094},
  {num:'02', name:'Johannesburg', addr:'Shop No. 3, Cnr 16 Station & De Korte St, Braamfontein, 2001 (behind Wits Museum)', lat:-26.1926, lng:28.0389},
  {num:'03', name:'Polokwane', addr:'Shop No. 10, Dada Square, 52a Market St, Polokwane Central, 0699 (opposite Museum)', lat:-23.9045, lng:29.4636},
  {num:'04', name:'Makhado', addr:'Shop No. 02 (Magulani), N1 & Commercial St, Louis Trichardt, 0920 (opposite KFC)', lat:-23.0465, lng:29.9019},
  {num:'05', name:'Thohoyandou', addr:'Jerice Palace Complex, Thohoyandou, 0950 (behind Star Glass, Coja Shop & Zube Spare Parts)', lat:-22.9770, lng:30.4850},
  {num:'06', name:'Nzhelele', addr:'Biaba Shopping Center, R523 Dzanani (red container opposite Spar, next to Mabirimisa Offices)', lat:-22.9250, lng:30.1980},
  {num:'07', name:'Soweto', addr:'Bara, Cnr Chris Hani & Dynamo St, Shop No. 13 (behind Shell Garage & SARS, opposite Builders Warehouse)', lat:-26.2485, lng:27.8540}
];
document.getElementById('branchList').innerHTML = BRANCHES.map((b,i)=>`
  <div class="branch-item" onclick="focusBranch(${i})" id="branch-${i}">
    <div class="branch-num mono">BRANCH ${b.num}</div>
    <div class="branch-name">${b.name}</div>
    <div class="branch-addr">${b.addr}</div>
  </div>
`).join('');

let mapInstance, markers = [];
window.addEventListener('load', ()=>{
  try{
    mapInstance = L.map('map', {scrollWheelZoom:false}).setView([-24.3, 29.2], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:'&copy; OpenStreetMap contributors', maxZoom:19
    }).addTo(mapInstance);
    const icon = L.divIcon({
      html:`<div style="background:#c17f2a;width:15px;height:15px;border-radius:50%;border:3px solid #2f4a2e;box-shadow:0 0 0 4px rgba(193,127,42,0.22);"></div>`,
      className:'', iconSize:[15,15], iconAnchor:[7,7]
    });
    BRANCHES.forEach((b,i)=>{
      const m = L.marker([b.lat,b.lng],{icon}).addTo(mapInstance).bindPopup(`<strong>${b.name}</strong><br>${b.addr}`);
      m.on('click', ()=>focusBranch(i, false));
      markers.push(m);
    });
  }catch(e){ console.error('Map failed to load', e); }
});
function focusBranch(i, pan=true){
  document.querySelectorAll('.branch-item').forEach(el=>el.classList.remove('active'));
  document.getElementById('branch-'+i).classList.add('active');
  if(mapInstance && pan){ mapInstance.setView([BRANCHES[i].lat, BRANCHES[i].lng], 13); markers[i].openPopup(); }
}

/* ============ DELIVERY OPTIONS ============ */
const DELIVERY_METHODS = [
  {id:'courier', name:'The Courier Guy', desc:'Straight to your door · 2–4 business days', price:145, priceLabel:'From R145'},
  {id:'postnet', name:'PostNet', desc:'To your nearest branch · 2–3 business days', price:110, priceLabel:'From R110'},
  {id:'pudo', name:'Pudo Locker', desc:'To your nearest locker · 1–4 business days', price:80, priceLabel:'From R80'},
  {id:'bolt', name:'Bolt / Uber', desc:'Same-day, priced by distance', price:0, priceLabel:'By distance'},
  {id:'collect', name:'Branch Collection', desc:'Free — collect at any of our 8 branches', price:0, priceLabel:'Free'}
];
document.getElementById('deliveryGrid').innerHTML = DELIVERY_METHODS.slice(0,4).map(d=>`
  <div class="delivery-card">
    <div class="dc-price mono">${d.priceLabel}</div>
    <div class="dc-name">${d.name}</div>
    <div class="dc-desc">${d.desc}</div>
  </div>
`).join('');

/* ============ CART ============ */
let cart = [];
function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  const existing = cart.find(c=>c.id===id);
  if(existing){ existing.qty += 1; } else { cart.push({id:p.id, name:p.name, price:p.price, qty:1}); }
  renderCart(); openDrawer();
}
function changeCartQty(id, delta){
  const item = cart.find(c=>c.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0){ cart = cart.filter(c=>c.id!==id); }
  renderCart();
}
function removeFromCart(id){ cart = cart.filter(c=>c.id!==id); renderCart(); }
function cartTotal(){ return cart.reduce((s,c)=>s+c.price*c.qty,0); }
function cartCount(){ return cart.reduce((s,c)=>s+c.qty,0); }

function renderCart(){
  document.getElementById('cartCount').textContent = cartCount();
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  if(cart.length===0){
    body.innerHTML = `<div class="empty-cart">${ICON.cart}<div>Your basket is empty.<br>Add a blend to get started.</div></div>`;
    foot.style.display='none';
    return;
  }
  foot.style.display='block';
  body.innerHTML = cart.map(c=>`
    <div class="cart-line">
      <div class="cl-icon">${ICON.bottle}</div>
      <div class="cl-info">
        <div class="cl-name">${c.name}</div>
        <div class="cl-meta">R${c.price} each</div>
        <div class="cl-qty-row">
          <div class="cl-qty">
            <button onclick="changeCartQty('${c.id}',-1)" aria-label="Decrease">−</button>
            <span>${c.qty}</span>
            <button onclick="changeCartQty('${c.id}',1)" aria-label="Increase">+</button>
          </div>
          <div class="cl-price mono">R${c.price*c.qty}</div>
        </div>
        <button class="cl-remove" onclick="removeFromCart('${c.id}')">Remove</button>
      </div>
    </div>
  `).join('');
  document.getElementById('totalValue').textContent = 'R' + cartTotal();
}
renderCart();

function openDrawer(){ document.getElementById('drawer').classList.add('open'); document.getElementById('overlay').classList.add('open'); }
function closeDrawer(){ document.getElementById('drawer').classList.remove('open'); document.getElementById('overlay').classList.remove('open'); }

/* ============ FULFILMENT ============ */
let fulfilment = 'courier';
function renderFulfilOptions(){
  document.getElementById('fulfilOptions').innerHTML = DELIVERY_METHODS.map(d=>`
    <div class="fulfil-opt ${d.id===fulfilment?'active':''}" onclick="setFulfilment('${d.id}')" role="button" tabindex="0">
      <span>${d.name}</span><span class="fo-price">${d.priceLabel}</span>
    </div>
  `).join('');
}
function setFulfilment(id){
  fulfilment = id;
  renderFulfilOptions();
  const needsAddress = ['courier','postnet','bolt'].includes(id);
  document.getElementById('addressFieldsWrap').classList.toggle('show', needsAddress);
  document.getElementById('branchSelectWrap').classList.toggle('show', id==='collect');
  document.getElementById('addressLabel').textContent = id==='postnet' ? 'Nearest PostNet branch' : (id==='bolt' ? 'Pickup address for Bolt/Uber' : 'Delivery address');
}
document.getElementById('branchSelect').innerHTML = BRANCHES.map(b=>`<option value="${b.name}">${b.name} — ${b.addr}</option>`).join('');
renderFulfilOptions();
setFulfilment('courier');

/* ============ CHECKOUT ============ */
const PHONE = '27715336706';
function checkout(){
  if(cart.length===0) return;
  const name = document.getElementById('custName').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const needsAddress = ['courier','postnet','bolt'].includes(fulfilment);
  if(needsAddress && (!name || !address)){
    alert('Please add your name and address so we know where to send your order.');
    return;
  }
  const methodObj = DELIVERY_METHODS.find(d=>d.id===fulfilment);
  let msg = `Hi Go Down Herbs! I'd like to order:%0a`;
  cart.forEach(c=>{ msg += `- ${c.name} x${c.qty} — R${c.price*c.qty}%0a`; });
  msg += `Subtotal: R${cartTotal()}%0a%0a`;
  msg += `Delivery method: ${methodObj.name} (${methodObj.priceLabel})%0a`;
  if(fulfilment==='collect'){
    const branch = document.getElementById('branchSelect').value;
    msg += `Collection branch: ${branch}`;
    if(name) msg += `%0aName: ${name}`;
  } else {
    msg += `Name: ${name}%0aAddress: ${address}`;
  }
  window.open(`https://wa.me/${PHONE}?text=${msg}`, '_blank');
}

/* ============ LOADER ============ */
window.addEventListener('load', ()=>{
  setTimeout(()=>{ document.getElementById('loader').classList.add('hide'); }, 1900);
});
</script>
</body>
</html>
