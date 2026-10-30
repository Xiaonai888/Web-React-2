const ART = Object.freeze({
  frameLeft: '',
  frameCenter: '',
  frameRight: '',
  crest: '',
  portraits: Object.freeze({ farmer: '', guardian: '', archer: '', ghost: '', mage: '' }),
});

const LANG = Object.freeze({
  km: { units: 'ទ័ព', resources: 'ធនធាន', map: 'ផែនទី', tools: 'ឧបករណ៍', close: 'បិទ', rice: 'ស្រូវ', wood: 'ឈើ', people: 'ចំនួនទ័ព', none: 'មិនទាន់មានទ័ព', page: 'ក្រុម' },
  en: { units: 'TROOPS', resources: 'RESOURCES', map: 'WORLD MAP', tools: 'Tools', close: 'Close', rice: 'Rice', wood: 'Wood', people: 'Units', none: 'No units yet', page: 'Squad' },
  zh: { units: '部队', resources: '资源', map: '地图', tools: '工具', close: '关闭', rice: '稻米', wood: '木材', people: '单位', none: '暂无单位', page: '小队' },
  ja: { units: '部隊', resources: '資源', map: '地図', tools: '操作', close: '閉じる', rice: '米', wood: '木材', people: 'ユニット', none: '部隊がありません', page: '部隊' },
  ko: { units: '부대', resources: '자원', map: '지도', tools: '도구', close: '닫기', rice: '쌀', wood: '나무', people: '유닛', none: '유닛 없음', page: '부대' },
});

const STYLE = `
.srnf-root{--srnf-h:194px;position:fixed;bottom:0;left:0;right:0;z-index:45;pointer-events:none;color:#e6d5ff;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;isolation:isolate}
.srnf-root *{box-sizing:border-box}.srnf-root button{font:inherit;cursor:pointer}.srnf-root button:focus-visible{outline:2px solid #6cf0ed;outline-offset:2px}
.srnf-back{position:absolute;bottom:0;inset-inline:0;height:calc(var(--srnf-h) + 18px);background:linear-gradient(to top,#090713 0%,#141022 78%,#21142aeb 93%,transparent 100%);border-top:3px solid #584069;box-shadow:0 -8px 35px #05050b95,inset 0 7px 14px #8b61b120;pointer-events:none}
.srnf-back::before{content:'';position:absolute;top:7px;left:2.5%;right:2.5%;height:2px;background:linear-gradient(90deg,transparent,#a18bd3,#63e9de,#a18bd3,transparent);opacity:.6}
.srnf-shell{position:relative;display:grid;grid-template-columns:minmax(155px,21fr) minmax(310px,54fr) minmax(185px,25fr);gap:10px;height:var(--srnf-h);padding:9px clamp(8px,1vw,18px) 11px;pointer-events:none;align-items:stretch}
.srnf-section{min-width:0;min-height:0;position:relative;background:linear-gradient(155deg,#242037ee,#0c0e1be8 58%,#191425f7);border:2px solid #554369;border-radius:13px;box-shadow:inset 0 0 0 2px #0b0815,inset 0 2px #9682a05c,0 4px 17px #040409b0;pointer-events:auto;padding:8px 10px}
.srnf-section::after{content:'';position:absolute;pointer-events:none;inset:4px;border:1px solid #ab8aeb17;border-radius:9px}
.srnf-section[data-art]{background-position:center;background-size:100% 100%}
.srnf-heading{margin:0 0 7px;font-size:10px;font-weight:900;letter-spacing:.16em;color:#c7aeed;text-shadow:0 1px 8px #672ac08c}
.srnf-resource-list{display:grid;gap:6px}.srnf-resource{display:grid;grid-template-columns:30px 1fr auto;align-items:center;gap:6px;min-height:35px;padding:4px 8px;background:#090b17a6;border:1px solid #55466e;border-radius:7px}
.srnf-resource-symbol{font-size:18px;filter:drop-shadow(0 0 4px #42f7ea7a);text-align:center}.srnf-resource-label{font-size:10px;color:#c6b7cf}.srnf-resource-value{font-size:14px;font-weight:900;letter-spacing:.03em;color:#fcf2ff;font-variant-numeric:tabular-nums}
.srnf-center{padding:7px 10px 8px;display:flex;flex-direction:column}.srnf-center-head{display:flex;gap:7px;align-items:center;justify-content:space-between;min-height:17px;margin-bottom:5px}.srnf-center-head .srnf-heading{margin:0}.srnf-page{display:flex;align-items:center;gap:7px;font-size:10px;color:#b8a5c9}.srnf-page button{background:#25172f;border:1px solid #755b92;color:#e6caff;border-radius:6px;padding:2px 9px;min-width:27px;line-height:1.2}.srnf-page button:disabled{opacity:.28;cursor:default}
.srnf-crest{position:absolute;left:50%;top:-37px;transform:translateX(-50%);width:64px;height:64px;display:grid;place-items:center;z-index:3;background:radial-gradient(circle,#35165a,#0a0e24 68%);border:4px ridge #9178bb;border-radius:50%;box-shadow:0 0 0 4px #0c0b16,0 0 19px #6b2fc286,inset 0 0 18px #58dceba6;pointer-events:none}
.srnf-crest::before{content:'♰';font-size:28px;color:#c5e9fa;text-shadow:0 0 9px #a93dfe,0 0 20px #44f3ff;animation:srnf-glow 3s ease-in-out infinite alternate}.srnf-crest.is-art::before{content:''}
.srnf-crest img{max-width:90%;max-height:90%;object-fit:contain;filter:drop-shadow(0 0 11px #49efdc)}
.srnf-unit-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:4px;flex:1;min-height:0}
.srnf-card{min-width:0;min-height:0;position:relative;padding:2px;background:linear-gradient(140deg,#45345c,#151625 50%,#362345);border:1px solid #805c9c;border-radius:5px;box-shadow:inset 0 1px #f3d2ff44,0 2px 4px #0008;color:#fff;overflow:hidden;transition:transform .15s,border-color .15s,box-shadow .15s}
.srnf-card:not(:disabled):hover{transform:translateY(-4px);border-color:#56ebdf;box-shadow:0 0 12px #22e6e570,0 5px 12px #0008}.srnf-card[aria-pressed=true]{border:2px solid #54f8e4;box-shadow:0 0 9px #29e9ef9b,inset 0 0 11px #45dfea38}
.srnf-card:disabled{cursor:default;opacity:.48}.srnf-card svg,.srnf-card img{width:100%;height:100%;display:block;object-fit:cover;border-radius:2px}.srnf-slot{height:100%;display:grid;place-items:center;opacity:.34;font-size:19px;color:#bda8d9;background:repeating-linear-gradient(45deg,#201b2f,#201b2f 6px,#151320 7px,#151320 12px)}
.srnf-hp{position:absolute;bottom:2px;left:3px;right:3px;height:4px;background:#310d27;border:1px solid #120813;border-radius:5px;overflow:hidden}.srnf-hp-fill{height:100%;background:linear-gradient(90deg,#17bb9a,#b1f68b);transition:width .2s}
.srnf-mini{padding:7px 8px 8px;display:flex;flex-direction:column}.srnf-mini-head{display:flex;align-items:center;justify-content:space-between;gap:5px}.srnf-mini-head .srnf-heading{margin:0 0 4px}.srnf-tools{background:#1a1931;border:1px solid #88669a;color:#e3d3f6;border-radius:8px;padding:3px 8px;font-size:11px;min-height:26px;box-shadow:0 0 7px #5c34a044}.srnf-tools:hover{border-color:#42eee2;color:#fff}
.srnf-map{flex:1;min-height:0;width:100%;display:block;border:2px solid #594378;border-radius:8px;background:#151d24;cursor:crosshair;touch-action:manipulation;image-rendering:auto}
.srnf-root.srnf-reduced *{animation:none!important;transition:none!important}
@keyframes srnf-glow{to{filter:brightness(1.55);box-shadow:0 0 12px #a541f3}}
body.srnf-active .sr-ui-shell>.sr-ui-footer,body.srnf-active .sr-ui-shell>.sr-ui-mobile-pad{display:none!important}
body.srnf-active.srnf-tools-open .sr-ui-shell>.sr-ui-footer{display:grid!important;position:fixed!important;left:12px!important;right:12px!important;bottom:calc(var(--srnf-h,194px) + 15px)!important;max-height:50vh;overflow:auto;grid-template-columns:1fr 1.5fr 1fr;z-index:60!important;background:#0b0c16f2;border:1px solid #87719e;border-radius:15px;box-shadow:0 0 28px #000b;padding:10px}
body.srnf-active .sr-ui-shell [data-action="attackTarget"],body.srnf-active .sr-ui-shell [data-action="attackMove"],body.srnf-active .sr-ui-shell [data-action="guardBase"],body.srnf-active .sr-ui-shell [data-action="stopFight"],body.srnf-active .sr-ui-shell [data-action="combatMenu"]{display:none!important}
@media(max-width:990px){.srnf-root{--srnf-h:178px}.srnf-shell{grid-template-columns:minmax(110px,23fr) minmax(230px,52fr) minmax(145px,25fr);gap:5px;padding:8px 5px}.srnf-section{padding:6px}.srnf-resource{grid-template-columns:23px 1fr;gap:3px}.srnf-resource-value{grid-column:2;justify-self:start;font-size:13px}.srnf-resource-label{font-size:9px}.srnf-resource-symbol{grid-row:span 2}.srnf-unit-grid{gap:3px}.srnf-crest{width:52px;height:52px;top:-27px}}
@media(max-width:690px){.srnf-root{--srnf-h:154px}.srnf-shell{grid-template-columns:minmax(74px,20fr) minmax(180px,55fr) minmax(90px,25fr);gap:3px;padding:5px 3px}.srnf-section{padding:4px;border-radius:7px}.srnf-heading{font-size:8px;letter-spacing:0;margin-bottom:5px}.srnf-resource-list{gap:3px}.srnf-resource{min-height:31px;display:flex;flex-direction:column;gap:0;padding:2px}.srnf-resource-symbol{font-size:13px}.srnf-resource-label{display:none}.srnf-resource-value{font-size:11px}.srnf-crest{width:40px;height:40px;top:-20px}.srnf-center-head{margin:0 0 3px}.srnf-page{font-size:8px;gap:2px}.srnf-page button{padding:1px 3px;min-width:18px}.srnf-unit-grid{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr))}.srnf-mini .srnf-heading{display:none}.srnf-tools{font-size:10px;padding:2px 5px}.srnf-mini-head{justify-content:center;margin-bottom:3px}body.srnf-active.srnf-tools-open .sr-ui-shell>.sr-ui-footer{grid-template-columns:1fr!important;bottom:calc(var(--srnf-h,154px) + 8px)!important;max-height:56vh}body.srnf-active.srnf-tools-open .sr-ui-shell>.sr-ui-footer>.sr-ui-panel--center{display:block!important}body.srnf-active.srnf-tools-open .sr-ui-shell>.sr-ui-mobile-pad{display:block!important;position:fixed!important;top:auto!important;right:6px!important;bottom:calc(var(--srnf-h,154px) + 6px)!important;width:120px;z-index:63}}
@media(prefers-reduced-motion:reduce){.srnf-root *{animation:none!important;transition:none!important}}
`;

const make = (tag, cls, value) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (value != null) e.textContent = value;
  return e;
};
const number = n => Number.isFinite(Number(n)) ? Math.max(0, Math.floor(Number(n))) : 0;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function unitVariant(unit) {
  const flag = String(unit?.combatTraining || unit?.unitClass || unit?.role || unit?.type || '').toLowerCase();
  if (/archer|ranged|bow/.test(flag)) return 'archer';
  if (/guard|knight|sword|melee/.test(flag)) return 'guardian';
  if (/ghost|spirit|soul/.test(flag)) return 'ghost';
  if (/mage|witch|wizard/.test(flag)) return 'mage';
  return 'farmer';
}

const PAL = Object.freeze({
  farmer: ['#6fdccb', '#41538e', '#a4e9eb'], guardian: ['#8d76e5','#342c78','#e4cffd'],
  archer: ['#b7a2f3','#3e5d74','#d0f8ee'], ghost: ['#86d4ff','#272e68','#c3f9ff'], mage: ['#c48bed','#48265e','#e8d5ff'],
});

function portrait(kind) {
  const [hair, robe, eyes] = PAL[kind] || PAL.farmer;
  const hood = kind === 'ghost' || kind === 'mage';
  return `<svg viewBox="0 0 70 75" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="srnf-bg" x2="1" y2="1"><stop stop-color="#291947"/><stop offset="1" stop-color="#103842"/></linearGradient></defs>
    <rect width="70" height="75" fill="url(#srnf-bg)"/><circle cx="35" cy="23" r="31" fill="#47c4ed" opacity=".09"/>
    <path d="M4 78Q10 52 24 49L46 49Q60 56 67 78" fill="${robe}" stroke="#130f27" stroke-width="3"/>
    <path d="M12 50Q5 12 34 6Q63 8 58 53L51 56Q44 29 34 29Q22 31 18 56Z" fill="${hair}" stroke="#1b1742" stroke-width="3"/>
    ${hood ? `<path d="M11 49Q6 6 35 5Q62 6 59 50L51 43Q44 20 35 21Q25 21 18 43Z" fill="${robe}" stroke="${hair}" stroke-width="3"/>` : ''}
    <ellipse cx="35" cy="39" rx="18" ry="19" fill="#f1cccf" stroke="#44314f" stroke-width="2"/>
    <ellipse cx="27" cy="37" rx="5" ry="7" fill="${eyes}" stroke="#202047" stroke-width="2"/><ellipse cx="43" cy="37" rx="5" ry="7" fill="${eyes}" stroke="#202047" stroke-width="2"/>
    <circle cx="28" cy="34" r="2" fill="#fff"/><circle cx="44" cy="34" r="2" fill="#fff"/><path d="M32 49Q35 52 38 49" fill="none" stroke="#8a526e" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M20 21Q35 7 51 21L48 30Q35 24 23 30Z" fill="${hair}" stroke="#312d57" stroke-width="2"/>
    <path d="M33 54L35 61L39 54" fill="#c0ffff"/><path d="M24 64L35 73L45 64" fill="none" stroke="#a38bea" stroke-width="2"/>
    <path d="M9 9L12 4L15 9L12 13Z" fill="#5fe8e5" opacity=".8"/>
  </svg>`;
}

function drawMiniMap(canvas, map, camera, units, fog) {
  const b = canvas.getBoundingClientRect();
  if (b.width < 20 || b.height < 20) return;
  const density = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.round(b.width * density));
  const h = Math.max(1, Math.round(b.height * density));
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(density, 0, 0, density, 0, 0);
  const width = b.width, height = b.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#23362c';ctx.fillRect(0,0,width,height);
  const mx = x => x / map.width * width;
  const my = y => y / map.height * height;
  if (typeof map.riverX === 'function') {
    ctx.beginPath();ctx.strokeStyle='#295a75';ctx.lineWidth=Math.max(3,width*.057);
    for(let i=0;i<=32;i++){
      const y=i*map.height/32;
      if(!i)ctx.moveTo(mx(map.riverX(y)),my(y));else ctx.lineTo(mx(map.riverX(y)),my(y));
    }ctx.stroke();
  }
  ctx.fillStyle='#56724d';
  for (const tree of map.trees || []) {ctx.fillRect(mx(tree.x),my(tree.y),1.5,1.5);}
  ctx.fillStyle='#d7b996';
  for (const bridge of map.bridges || []) {ctx.fillRect(mx(bridge.x)-3,my(bridge.y)-2,6,4);}
  const seen = Array.isArray(units) ? units : [];
  for (const unit of seen) {
    if (!Number.isFinite(unit?.x) || !Number.isFinite(unit?.y) || unit.alive === false) continue;
    if (unit.team !== 'blue' && typeof fog?.isVisible === 'function' && !fog.isVisible(unit.x,unit.y)) continue;
    ctx.fillStyle=unit.team==='blue'?'#5ff8e3':'#ff946c';
    ctx.beginPath();ctx.arc(mx(unit.x),my(unit.y),2.7,0,Math.PI*2);ctx.fill();
  }
  const view = camera?.getVisibleBounds?.();
  if (view && [view.left,view.top,view.right,view.bottom].every(Number.isFinite)) {
    ctx.strokeStyle='#f5e8bf';ctx.lineWidth=1.1;
    ctx.strokeRect(mx(view.left),my(view.top),mx(view.right)-mx(view.left),my(view.bottom)-my(view.top));
  }
  ctx.strokeStyle='#7563a3';ctx.lineWidth=2;ctx.strokeRect(1,1,width-2,height-2);
}

export function mountNecromancerFooter({ footer, engine, selection, getUnits, getAllUnits, exploration = null } = {}) {
  if (!footer?.nodes?.shell || !engine?.map || !engine?.camera || typeof getUnits !== 'function') {
    throw new TypeError('NecromancerFooter requires mounted CommandFooter, GameEngine and getUnits()');
  }
  if (document.getElementById('sr-necromancer-footer')) return null;
  const lang = String(document.documentElement.lang || 'en').toLowerCase().split('-')[0];
  const t = LANG[lang] || LANG.en;
  const body = document.body;
  const style = make('style');style.id='sr-necromancer-footer-style';style.textContent=STYLE;
  const root = make('aside','srnf-root');root.id='sr-necromancer-footer';
  root.setAttribute('aria-label',t.units);
  const back = make('div','srnf-back');
  const shell = make('div','srnf-shell');
  const left = make('section','srnf-section srnf-left');
  const center = make('section','srnf-section srnf-center');
  const right = make('section','srnf-section srnf-mini');
  const frames = [ART.frameLeft,ART.frameCenter,ART.frameRight];
  [left,center,right].forEach((section,i)=>{
    if (frames[i]) {section.dataset.art='';section.style.backgroundImage=`linear-gradient(#0a0a1b77,#090919ad),url("${frames[i]}")`;}
  });
  left.append(make('h2','srnf-heading',t.resources));
  const resources = make('div','srnf-resource-list');
  const values = {};
  for (const [key,sym,label] of [['rice','🌾',t.rice],['wood','🪵',t.wood],['villagers','♟',t.people]]) {
    const row = make('div','srnf-resource');
    const n=make('span','srnf-resource-value','0');values[key]=n;
    row.append(make('span','srnf-resource-symbol',sym),make('span','srnf-resource-label',label),n);
    resources.append(row);
  }
  left.append(resources);
  const heading = make('div','srnf-center-head');
  const title = make('h2','srnf-heading',t.units);
  const pageNav = make('div','srnf-page');
  const prev = make('button','', '‹');prev.type='button';prev.setAttribute('aria-label','Previous squad');
  const pageLabel=make('span','',`1/1`);
  const next=make('button','', '›');next.type='button';next.setAttribute('aria-label','Next squad');
  pageNav.append(prev,pageLabel,next);heading.append(title,pageNav);
  const crest=make('div','srnf-crest');
  if (ART.crest) {const img=make('img');img.src=ART.crest;img.alt='';crest.append(img);crest.classList.add('is-art');}
  const grid=make('div','srnf-unit-grid');
  const capacity=16;
  const cards=[];
  for(let i=0;i<capacity;i++){
    const card=make('button','srnf-card');card.type='button';card.disabled=true;
    card.append(make('span','srnf-slot','✧'));
    grid.append(card);cards.push(card);
  }
  center.append(crest,heading,grid);
  const miniHeading=make('div','srnf-mini-head');
  miniHeading.append(make('h2','srnf-heading',t.map));
  const tools=make('button','srnf-tools',`⚙ ${t.tools}`);tools.type='button';tools.setAttribute('aria-expanded','false');
  miniHeading.append(tools);
  const mapCanvas=make('canvas','srnf-map');
  mapCanvas.setAttribute('aria-label',t.map);mapCanvas.setAttribute('role','img');
  right.append(miniHeading,mapCanvas);
  shell.append(left,center,right);root.append(back,shell);
  body.append(style,root);
  body.classList.add('srnf-active');
  body.style.setProperty('--srnf-h', window.matchMedia('(max-width:690px)').matches?'154px':window.matchMedia('(max-width:990px)').matches?'178px':'194px');
  const mini = exploration?.miniMap || null;
  const miniWasEnabled = mini?.enabled;
  mini?.setEnabled?.(false);
  let toolsOpen=false, page=0, lastSignature='', destroyed=false;
  const perPage=()=>window.matchMedia('(max-width:690px)').matches?8:16;
  function updateCards(units){
    const size=perPage(),total=Math.max(1,Math.ceil(units.length/size));
    page=clamp(page,0,total-1);
    pageLabel.textContent=`${page+1}/${total}`;
    prev.disabled=page===0;next.disabled=page===total-1;
    const selected=new Set(selection?.getSelectedIds?.()||[]);
    const roster=units.slice(page*size,(page+1)*size);
    const sig=roster.map(u=>`${u.id}:${u.hp}:${u.combatTraining||''}:${selected.has(u.id)}`).join('|')+`/${size}/${page}`;
    if (sig===lastSignature)return;
    lastSignature=sig;
    for(let i=0;i<cards.length;i++){
      const card=cards[i],unit=roster[i];
      if (i>=size){card.hidden=true;continue;}card.hidden=false;
      if (!unit){card.disabled=true;card.removeAttribute('aria-pressed');card.title='';card.innerHTML='<span class="srnf-slot">✧</span>';continue;}
      card.disabled=false;
      card.setAttribute('aria-pressed',String(selected.has(unit.id)));
      card.title=String(unit.name||unit.type||t.units);
      card.setAttribute('aria-label',card.title);
      const variant=unitVariant(unit), asset=ART.portraits[variant];
      card.innerHTML='';
      if(asset){const img=make('img');img.src=asset;img.alt='';img.loading='lazy';card.append(img);}
      else {const img=make('span');img.innerHTML=portrait(variant);card.append(img);}
      const hp=make('div','srnf-hp'),fill=make('div','srnf-hp-fill');
      const ratio=Number.isFinite(unit.hp)&&Number.isFinite(unit.maxHp)&&unit.maxHp>0?unit.hp/unit.maxHp:1;
      fill.style.width=`${clamp(ratio,0,1)*100}%`;hp.append(fill);card.append(hp);
    }
  }
  function update(){
    if(destroyed)return;
    const state=footer.state||{};
    for(const key of Object.keys(values))values[key].textContent=number(state[key]).toLocaleString();
    const all=getUnits();const available=Array.isArray(all)?all.filter(u=>u&&u.alive!==false&&(u.team==null||u.team==='blue')):[];
    updateCards(available);
    const every=typeof getAllUnits==='function'?getAllUnits():available;
    drawMiniMap(mapCanvas,engine.map,engine.camera,every,exploration?.fog);
  }
  function onGridClick(event){
    const btn=event.target.closest?.('.srnf-card');
    if(!btn || btn.disabled)return;
    const idx=cards.indexOf(btn);if(idx<0)return;
    const all=getUnits().filter(u=>u&&u.alive!==false&&(u.team==null||u.team==='blue'));
    const u=all[page*perPage()+idx];if(!u)return;
    const current=selection?.getSelectedIds?.()||[];
    const nextIds=event.shiftKey?(current.includes(u.id)?current.filter(x=>x!==u.id):[...current,u.id]):[u.id];
    selection?.setSelectedIds?.(nextIds);
    update();
  }
  function onMapDown(event){
    const rect=mapCanvas.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    engine.camera.centerOn(clamp((event.clientX-rect.left)/rect.width,0,1)*engine.map.width,clamp((event.clientY-rect.top)/rect.height,0,1)*engine.map.height);
    update();
  }
  function toggleTools(force){
    toolsOpen=typeof force==='boolean'?force:!toolsOpen;
    body.classList.toggle('srnf-tools-open',toolsOpen);
    tools.textContent=`⚙ ${toolsOpen?t.close:t.tools}`;
    tools.setAttribute('aria-expanded',String(toolsOpen));
  }
  const onEsc=e=>{if(e.key==='Escape'&&toolsOpen){toggleTools(false);}};
  const onPageHide=()=>destroy();
  const onResize=()=>{body.style.setProperty('--srnf-h',window.matchMedia('(max-width:690px)').matches?'154px':window.matchMedia('(max-width:990px)').matches?'178px':'194px');lastSignature='';update();};
  grid.addEventListener('click',onGridClick);
  mapCanvas.addEventListener('pointerdown',onMapDown);
  tools.addEventListener('click',()=>toggleTools());
  prev.addEventListener('click',()=>{page=Math.max(0,page-1);lastSignature='';update();});
  next.addEventListener('click',()=>{page++;lastSignature='';update();});
  document.addEventListener('keydown',onEsc);
  window.addEventListener('resize',onResize);
  window.addEventListener('pagehide',onPageHide,{once:true});
  const timer=window.setInterval(update,350);
  function destroy(){
    if(destroyed)return;
    destroyed=true;
    window.clearInterval(timer);
    document.removeEventListener('keydown',onEsc);
    window.removeEventListener('resize',onResize);
    window.removeEventListener('pagehide',onPageHide);
    body.classList.remove('srnf-active','srnf-tools-open');
    body.style.removeProperty('--srnf-h');
    if(mini && typeof miniWasEnabled==='boolean')mini.setEnabled(miniWasEnabled);
    root.remove();style.remove();
  }
  update();
  return {destroy,refresh:update,showTools:toggleTools};
}

export default mountNecromancerFooter;
