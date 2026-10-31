/** Shadow Realms — consolidated, accessible strategy controls.
 * One game feature: reuse existing Defense, Squad, Patrol and Research APIs.
 * Does not replace the GameEngine, create resources or attach Canvas listeners.
 */
const LOCALES = {
  km: {title:'យុទ្ធសាស្ត្រ',defense:'ការការពារ',research:'ស្រាវជ្រាវ',tactics:'បញ្ជាកងទ័ព',
    trap:'អន្ទាក់',wall:'របាំង',tower:'ប៉មបាញ់',line:'ជួរដេក',column:'ជួរឈរ',wedge:'ក្បាលព្រួញ',box:'ការ៉េ',guard:'ការពារ',patrol:'ល្បាត',
    drills:'ហ្វឹកហាត់ប្រយុទ្ធ',armor:'ពាសដែក',vitality:'សុខភាព',mobility:'ល្បឿន',archery:'បាញ់ធ្នូ',
    cancel:'បោះបង់',close:'បិទ',selected:'សូមជ្រើសទ័ពដែលហ្វឹកហាត់ចប់សិន',point:'ចុចលើដីដើម្បីបញ្ជា',placed:'បានបញ្ជាជោគជ័យ',
    failed:'មិនអាចធ្វើបាន',bought:'ស្រាវជ្រាវជោគជ័យ',busy:'កងទ័ពខ្លះស្ថិតក្នុង Squad ផ្សេង។ សូមជ្រើសក្រុមដើម ឬកងទ័ពដែលមិនទាន់មាន Squad។',
    blocked:'ទីតាំងនេះមិនអាចទៅដល់បាន',poor:'ធនធានមិនគ្រប់',limit:'បានដល់កម្រិតអតិបរមា',resources:'ធនធាន',rank:'កម្រិត',
    cost:'តម្លៃ',rice:'ស្រូវ',wood:'ឈើ',retry:'ចុចទីតាំងផ្សេង ឬបោះបង់បញ្ជា',none:'មិនមានកងទ័ពសម្រាប់បញ្ជា'},
  en: {title:'Strategy',defense:'Defenses',research:'Research',tactics:'Squad Commands',
    trap:'Spike Trap',wall:'Barricade',tower:'Watchtower',line:'Line',column:'Column',wedge:'Wedge',box:'Box',guard:'Guard',patrol:'Patrol',
    drills:'Combat Drills',armor:'Armor',vitality:'Vitality',mobility:'Mobility',archery:'Archery',
    cancel:'Cancel',close:'Close',selected:'Select trained soldiers first',point:'Tap terrain to issue the order',placed:'Command issued',
    failed:'Unavailable',bought:'Research complete',busy:'Some units already belong to another squad. Select that whole squad or unassigned units.',
    blocked:'Destination is blocked',poor:'Not enough resources',limit:'Maximum rank reached',resources:'Resources',rank:'Rank',
    cost:'Cost',rice:'Rice',wood:'Wood',retry:'Tap another location or cancel',none:'No units available for that command'},
  zh: {title:'策略',defense:'防御',research:'研究',tactics:'部队指令',
    trap:'陷阱',wall:'路障',tower:'箭塔',line:'横队',column:'纵队',wedge:'楔形',box:'方阵',guard:'守卫',patrol:'巡逻',
    drills:'战斗训练',armor:'装甲',vitality:'生命力',mobility:'机动性',archery:'弓术',
    cancel:'取消',close:'关闭',selected:'请先选择已完成训练的士兵',point:'点击地面发出命令',placed:'命令已执行',failed:'无法执行',bought:'研究完成',
    busy:'部分单位属于其他小队，请选择完整小队或未分配单位',blocked:'目标位置不可到达',poor:'资源不足',limit:'已达最高等级',resources:'资源',rank:'等级',
    cost:'费用',rice:'稻米',wood:'木材',retry:'请点击其他位置或取消',none:'没有可用单位'},
  ja: {title:'戦略',defense:'防御',research:'研究',tactics:'部隊指示',
    trap:'罠',wall:'柵',tower:'見張り塔',line:'横隊',column:'縦隊',wedge:'くさび',box:'方陣',guard:'防衛',patrol:'巡回',
    drills:'戦闘訓練',armor:'防具',vitality:'生命力',mobility:'機動力',archery:'弓術',
    cancel:'取消',close:'閉じる',selected:'訓練済みの兵士を選択',point:'地面をタップして指示',placed:'指示を実行しました',failed:'実行できません',bought:'研究完了',
    busy:'他の部隊に所属するユニットがいます。部隊全体または未所属ユニットを選んでください',blocked:'移動できない場所です',poor:'資源不足',limit:'最大レベルです',resources:'資源',rank:'レベル',
    cost:'費用',rice:'米',wood:'木材',retry:'別の場所をタップするか取消',none:'指示可能なユニットがいません'},
  ko: {title:'전략',defense:'방어',research:'연구',tactics:'분대 명령',
    trap:'함정',wall:'방벽',tower:'감시탑',line:'횡대',column:'종대',wedge:'쐐기',box:'사각',guard:'방어',patrol:'순찰',
    drills:'전투 훈련',armor:'방어구',vitality:'생명력',mobility:'기동력',archery:'궁술',
    cancel:'취소',close:'닫기',selected:'훈련을 마친 병사를 선택하세요',point:'지면을 눌러 명령하세요',placed:'명령 완료',failed:'실행 불가',bought:'연구 완료',
    busy:'일부 유닛이 다른 분대에 속해 있습니다. 분대 전체 또는 미배정 유닛을 선택하세요',blocked:'이동할 수 없는 위치',poor:'자원 부족',limit:'최대 단계 도달',resources:'자원',rank:'단계',
    cost:'비용',rice:'쌀',wood:'나무',retry:'다른 위치를 누르거나 취소하세요',none:'명령할 유닛이 없습니다'},
};

const DEFENSES = [['spikes','trap'],['barricade','wall'],['watchtower','tower']];
const RESEARCH = [['drills','⚔'],['armor','🛡'],['vitality','♥'],['mobility','➤'],['archery','🏹']];
const FORMATIONS = new Set(['line','column','wedge','box']);
const COMMANDS = ['line','column','wedge','box','guard','patrol'];
const validPoint = p => Number.isFinite(p?.x) && Number.isFinite(p?.y);

export function createFeature(scope) {
  if (!scope || typeof scope.get !== 'function') throw new TypeError('FeatureControls needs GameContext');
  const lang = document.documentElement.lang?.split('-')[0] || 'en';
  const t = LOCALES[lang] || LOCALES.en;
  const notify = msg => {
    const fn = scope.get('notify');
    if (typeof fn === 'function') {
      try { fn(msg); }
      catch (error) { console.warn('Shadow Realms strategy notice:', error); }
    }
  };
  const defense = () => scope.get('defense');
  const progression = () => scope.get('progression');
  const tactics = () => scope.get('tactics');
  const navigation = () => scope.get('navigation');
  const selection = () => scope.get('selection');
  const trainedSoldier = unit => unit?.team === 'blue' &&
    unit.alive !== false && Number.isFinite(unit.hp) && unit.hp > 0 &&
    unit.isCivilian === false && !unit.trainingInside &&
    !unit.trainingState && unit.training !== true &&
    (unit.type !== 'farmer' || unit.combatTraining === 'melee' ||
      unit.combatTraining === 'ranged');
  const players = () => {
    const ids = new Set(selection()?.getSelectedIds?.() || []);
    return (scope.get('farmers', []) || []).filter(u => ids.has(u?.id) &&
      trainedSoldier(u));
  };
  let toggle = null, panel = null, css = null, status = null, wallet = null;
  let mode = null, pendingIds = null, disposed = false, started = false;
  let syncElapsed = 0;
  const listeners = [];
  const listen = (target, type, handler) => {target.addEventListener(type, handler);listeners.push(() => target.removeEventListener(type, handler));};

  const updateAria = () => {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', String(!panel.hidden));
    toggle.setAttribute('aria-pressed', String(Boolean(mode)));
    if (mode) toggle.dataset.armed = 'true';
    else toggle.removeAttribute('data-armed');
  };
  const feedback = (text) => {if (status) status.textContent = text; notify(text);};
  const cancel = () => {
    mode = null; pendingIds = null;
    defense()?.cancel?.();
    updateAria();
  };
  const open = () => {
    if (!panel || disposed) return;
    panel.hidden = false;
    refresh(); updateAria();
  };
  const close = () => {
    if (!panel) return;
    panel.hidden = true; updateAria();
  };
  const reasonText = reason => ({
    insufficient_resources:t.poor, max_rank:t.limit,
    no_available_units:t.none, no_units:t.none, no_route:t.blocked,
    invalid_waypoints:t.blocked, invalid_input:t.blocked, outside_map:t.blocked,
    terrain:t.blocked, blocked:t.blocked, defense_overlap:t.blocked,
    building_overlap:t.blocked, rice_field:t.blocked,
  })[reason] || t.failed;
  function report(result, success = t.placed) {
    const ok = result === true || result?.ok === true;
    feedback(ok ? success : reasonText(result?.reason));
    return ok;
  }
  const controls = (items, category) => items.map(([id, label]) =>
    `<button type="button" data-action="${category}:${id}">${label}</button>`).join('');
  const researchTitles = RESEARCH.map(([id, icon]) => [id, `${icon} ${t[id]}`]);

  function refresh() {
    if (!panel || disposed || panel.hidden) return;
    const resources = defense()?.getResources?.() || progression()?.research?.getResources?.() || {};
    if (wallet) wallet.textContent = `${t.resources}: ${t.rice} ${Math.floor(resources.rice || 0)} · ${t.wood} ${Math.floor(resources.wood || 0)}`;
    for (const [id] of DEFENSES) {
      const button = panel.querySelector(`[data-action="defense:${id}"]`);
      if (!button) continue;
      const item = defense()?.types?.[id];
      button.disabled = !item || !defense()?.canAfford?.(id);
      button.title = item ? `${t.cost}: ${item.cost.rice} ${t.rice} + ${item.cost.wood} ${t.wood}` : t.failed;
    }
    for (const [id] of RESEARCH) {
      const button = panel.querySelector(`[data-action="research:${id}"]`);
      if (!button) continue;
      const system = progression()?.research;
      const rule = progression()?.types?.[id];
      const rank = system?.getRank?.(id) ?? 0;
      const cost = system?.getCost?.(id);
      button.disabled = !cost || !system?.canPurchase?.(id);
      const detail = button.querySelector('small');
      if (detail) detail.textContent = cost
        ? `${t.rank} ${rank}/${rule?.maxRank || 3} · ${cost.rice} ${t.rice} + ${cost.wood} ${t.wood}`
        : `${t.rank} ${rank}/${rule?.maxRank || 3} · ${t.limit}`;
      button.title = button.disabled ? (cost ? t.poor : t.limit) : t.bought;
    }
  }

  function execute(value) {
    if (disposed) return;
    if (value === 'close') {close();return;}
    if (value === 'cancel') {cancel();close();feedback(t.cancel);return;}
    const [category, id] = String(value).split(':');
    if (category === 'defense' && DEFENSES.some(d => d[0] === id)) {
      cancel();
      if (report(defense()?.arm?.(id), t.point)) {mode = 'defense';close();updateAria();}
      return;
    }
    if (category === 'research' && RESEARCH.some(d => d[0] === id)) {
      report(progression()?.purchase?.(id), t.bought);
      refresh();return;
    }
    if (category !== 'tactics' || !COMMANDS.includes(id)) return;
    const units = players();
    if (!units.length) {feedback(t.selected);return;}
    const squads = tactics()?.squads;
    if (!squads) {feedback(t.failed);return;}
    const ids = units.map(u => u.id);
    const all = squads.getSquads();
    const exact = all.find(s => s.unitIds.length === ids.length && ids.every(uid => s.unitIds.includes(uid)));
    if (!exact && all.some(s => ids.some(uid => s.unitIds.includes(uid)))) {
      feedback(t.busy);return;
    }
    // Do not create an empty squad merely by choosing an order from the menu.
    // The actual squad is created on a valid map tap and rolled back on failure.
    cancel();pendingIds = ids;mode = id;
    close();updateAria();feedback(t.point);
  }

  function onMapPointer(event) {
    if (disposed || !mode || mode === 'defense' || !['select','tap'].includes(event?.kind)) return false;
    // Mini-map taps belong to exploration, even if a map-world point is absent.
    const minimap = scope.get('exploration')?.miniMap;
    if (minimap?.enabled && minimap.hitTest?.(event.screen, scope.camera)) return false;
    if (!validPoint(event.world)) return true;
    const squads = tactics()?.squads, patrol = tactics()?.patrol;
    if (!squads || !pendingIds?.length) {cancel();return true;}
    const units = players().filter(u => pendingIds.includes(u.id));
    if (units.length !== pendingIds.length) {cancel();feedback(t.selected);return true;}
    if (!scope.map.isWalkable(event.world.x,event.world.y,14)) {
      feedback(`${t.blocked} · ${t.retry}`);return true;
    }
    const existing = squads.getSquads();
    const exact = existing.find(s => s.unitIds.length === pendingIds.length && pendingIds.every(id => s.unitIds.includes(id)));
    if (!exact && existing.some(s => pendingIds.some(id => s.unitIds.includes(id)))) {
      cancel();feedback(t.busy);return true;
    }
    const create = exact ? {ok:true,squad:exact} : squads.createSquad(pendingIds,
      {shape:FORMATIONS.has(mode)?mode:'line'});
    if (!create.ok) {report(create);return true;}
    const squadId = create.squad.id;
    const temporary = !exact;
    if (FORMATIONS.has(mode)) squads.setFormation(squadId,mode);
    let result;
    if (FORMATIONS.has(mode)) result = squads.move(squadId, event.world);
    else if (mode === 'guard') result = squads.guard(squadId, event.world);
    else if (mode === 'patrol') {
      if (typeof patrol?.start !== 'function') {
        if (temporary) squads.disband(squadId);
        feedback(t.failed);return true;
      }
      const from = {x:units[0].x, y:units[0].y};
      if (!scope.map.isWalkable(from.x,from.y,14)) {
        if (temporary) squads.disband(squadId);
        feedback(t.blocked);return true;
      }
      // Replacing an existing patrol is an explicit player command.
      for (const unit of units) patrol?.stopUnit?.(unit.id);
      result = patrol?.start?.(units.map(u=>u.id),[from,event.world]);
      if (result?.ok) {
        const claim = scope.get('claimTacticalUnit');
        if (typeof claim === 'function') for (const unit of units) claim(unit);
      }
    }
    if (result?.ok) {
      // Old patrols must not overwrite a freshly issued formation/guard.
      if (mode !== 'patrol') for (const unit of units) patrol?.stopUnit?.(unit.id);
      feedback(t.placed);cancel();
    } else {
      if (temporary) squads.disband(squadId);
      feedback(`${reasonText(result?.reason)} · ${t.retry}`);
    }
    return true;
  }

  function start() {
    if (disposed || started) return;
    const header = document.querySelector('.top');
    if (!header) throw new Error('Shadow Realms .top missing');
    css = document.createElement('style');
    css.textContent = `
      .sr-strategy-toggle{font-size:11px;white-space:nowrap;flex:none;min-height:35px;max-width:110px;border-radius:9px;border:1px solid #b3a16c;background:#425537;color:#fff4d5;padding:5px 9px;font-weight:800;overflow:hidden;text-overflow:ellipsis}
      .sr-strategy-toggle[data-armed=true]{background:#805138;border-color:#f9c56e}
      .sr-strategy-toggle:focus-visible,.sr-strategy-panel button:focus-visible{outline:2px solid #ffcd57;outline-offset:2px}
      .sr-strategy-panel{position:fixed;right:max(8px,env(safe-area-inset-right));top:55px;width:min(360px,calc(100vw - 16px));max-height:calc(100dvh - 67px);overflow-y:auto;overscroll-behavior:contain;z-index:900;padding:12px;border:1px solid #acaa7c;border-radius:12px;background:#19281c;color:#fff2d2;box-shadow:0 12px 38px #0009;font:12px system-ui,sans-serif}
      .sr-strategy-panel[hidden]{display:none!important}.sr-strategy-panel h3{font-size:12px;margin:13px 0 7px;color:#e9d3a0}.sr-strategy-panel strong{font-size:14px}.sr-strategy-panel .sr-strategy-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
      .sr-strategy-panel button{min-height:42px;border-radius:8px;border:1px solid #82936f;background:#385841;color:#f9f7de;padding:6px 4px;font-size:11px;line-height:1.3}
      .sr-strategy-panel button[disabled]{opacity:.45;cursor:not-allowed}.sr-strategy-panel button small{display:block;font-size:9px;margin-top:4px;color:#dfdebb}
      .sr-strategy-panel .sr-strategy-close{background:#63453c;padding:5px 10px;min-width:64px}
      .sr-strategy-panel .sr-strategy-info{font-size:11px;color:#dbe8cc;line-height:1.5;margin-top:9px}
      .sr-strategy-panel .sr-wallet{font-size:11px;margin-top:10px;padding:7px 9px;border:1px solid #607c5a;border-radius:8px;color:#f4e7b7}
      .sr-strategy-panel [data-action^="research:"]{min-height:60px}
      @media(max-width:640px){.sr-strategy-toggle{padding:5px 6px;font-size:10px;max-width:86px}.sr-strategy-panel{max-height:calc(100dvh - 63px)}}
    `;
    document.head.append(css);
    toggle = document.createElement('button');toggle.type='button';toggle.className='sr-strategy-toggle';
    toggle.textContent='⚔ '+t.title;toggle.title=t.title;
    toggle.setAttribute('aria-haspopup','dialog');
    const back = header.querySelector('.back');header.insertBefore(toggle,back || null);
    panel = document.createElement('div');panel.className='sr-strategy-panel';panel.hidden=true;
    panel.setAttribute('role','dialog');panel.setAttribute('aria-label',t.title);
    panel.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><strong>${t.title}</strong><button type="button" class="sr-strategy-close" data-action="close">${t.close}</button></div>
      <div class="sr-wallet" aria-live="polite"></div>
      <h3>${t.defense}</h3><div class="sr-strategy-row">${controls(DEFENSES.map(([id,key])=>[id,t[key]]),'defense')}</div>
      <h3>${t.tactics}</h3><div class="sr-strategy-row">${controls(COMMANDS.map(id=>[id,t[id]]),'tactics')}</div>
      <h3>${t.research}</h3><div class="sr-strategy-row">${controls(researchTitles,'research')}</div>
      <div class="sr-strategy-info" role="status" aria-live="polite">${t.point}</div>
      <div class="sr-strategy-row" style="margin-top:8px"><button type="button" data-action="cancel">${t.cancel}</button></div>`;
    document.body.append(panel);
    wallet = panel.querySelector('.sr-wallet');status = panel.querySelector('.sr-strategy-info');
    for(const button of panel.querySelectorAll('[data-action^="research:"]')){
      const meta=document.createElement('small');button.append(meta);
    }
    listen(toggle,'click',()=>panel.hidden?open():close());
    listen(panel,'click',event=>{
      const button=event.target.closest?.('button[data-action]');
      if(button && panel.contains(button) && !button.disabled) execute(button.dataset.action);
    });
    listen(document,'keydown',event=>{
      if (event.key!=='Escape' || (!mode && panel?.hidden)) return;
      if (mode) cancel();
      close();
      toggle?.focus?.({preventScroll:true});
    });
    scope.provide('strategyControls',Object.freeze({open,cancel,close,get mode(){return mode;}}));
    scope.on('defense:placement-result',({result})=>{
      if (result?.ok){cancel();feedback(t.placed);}
      else if(result) feedback(`${reasonText(result.reason)} · ${t.retry}`);
    });
    started=true;
    updateAria();
  }

  return {
    start,
    onPointer:onMapPointer,
    update(dt) {
      if (disposed || panel?.hidden || !Number.isFinite(dt)) return;
      syncElapsed+=Math.min(Math.max(0,dt),.1);
      if(syncElapsed >= .5){syncElapsed=0;refresh();}
    },
    dispose() {
      if (disposed) return; disposed=true;
      cancel(); for(const off of listeners.splice(0)) off();
      panel?.remove();toggle?.remove();css?.remove();
      panel=null;toggle=null;css=null;status=null;wallet=null;
    },
  };
}
export default createFeature;
