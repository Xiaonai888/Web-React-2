/** Shadow Realms strategy controls. One self-contained optional bootstrap feature.
 * No dependency on index.html markup beyond .top and existing #game.
 * Defensive placement, research and squad orders are explicit player actions.
 */
const STRINGS={
 km:{title:'យុទ្ធសាស្ត្រ',defense:'ការពារ',research:'ស្រាវជ្រាវ',tactics:'កងទ័ព',
  trap:'អន្ទាក់',wall:'របាំង',tower:'ប៉មបាញ់',line:'ជួរដេក',column:'ជួរឈរ',wedge:'ក្បាលព្រួញ',box:'ការ៉េ',guard:'ការពារ',patrol:'ល្បាត',cancel:'បោះបង់',close:'បិទ',selected:'សូមជ្រើសកងទ័ពខៀវសិន',point:'ចុចទីតាំងលើផែនទី',placed:'បានបញ្ជា',failed:'មិនអាចធ្វើបាន',bought:'ស្រាវជ្រាវជោគជ័យ'},
 en:{title:'Strategy',defense:'Defenses',research:'Research',tactics:'Squads',trap:'Spike Trap',wall:'Barricade',tower:'Watchtower',line:'Line',column:'Column',wedge:'Wedge',box:'Box',guard:'Guard',patrol:'Patrol',cancel:'Cancel',close:'Close',selected:'Select a blue unit first',point:'Tap a location on the map',placed:'Command issued',failed:'Unavailable',bought:'Research complete'},
 zh:{title:'策略',defense:'防御',research:'研究',tactics:'部队',trap:'陷阱',wall:'路障',tower:'箭塔',line:'横队',column:'纵队',wedge:'楔形',box:'方阵',guard:'守卫',patrol:'巡逻',cancel:'取消',close:'关闭',selected:'先选择友军',point:'点击地图位置',placed:'指令已执行',failed:'无法执行',bought:'研究完成'},
 ja:{title:'戦略',defense:'防御',research:'研究',tactics:'部隊',trap:'罠',wall:'柵',tower:'見張り塔',line:'横隊',column:'縦隊',wedge:'くさび',box:'方陣',guard:'防衛',patrol:'巡回',cancel:'取消',close:'閉じる',selected:'味方を選択',point:'マップをタップ',placed:'命令完了',failed:'実行不可',bought:'研究完了'},
 ko:{title:'전략',defense:'방어',research:'연구',tactics:'분대',trap:'함정',wall:'방벽',tower:'감시탑',line:'횡대',column:'종대',wedge:'쐐기',box:'사각',guard:'방어',patrol:'순찰',cancel:'취소',close:'닫기',selected:'아군 선택',point:'지도에서 위치 선택',placed:'명령 완료',failed:'실패',bought:'연구 완료'},
};
export function createFeature(scope){
  if(!scope || typeof scope.get!=='function') throw new TypeError('FeatureControls needs GameContext');
  const t=STRINGS[document.documentElement.lang]||STRINGS.en;
  const notify=message=>{const callback=scope.get('notify');if(typeof callback==='function')callback(message);};
  const defenses=()=>scope.get('defense');
  const research=()=>scope.get('progression');
  const tactics=()=>scope.get('tactics');
  const selection=()=>scope.get('selection');
  const players=()=>{const ids=new Set(selection()?.getSelectedIds?.()||[]);
    return (scope.get('farmers',[])||[]).filter(u=>ids.has(u.id)&&u.team==='blue'&&u.alive!==false&&u.hp>0);
  };
  let toggle=null,panel=null,style=null,mode=null,activeSquad=null,disposed=false;
  function cancel(){mode=null;activeSquad=null;defenses()?.cancel?.();if(toggle)toggle.removeAttribute('data-armed');}
  function showMessage(result,success){const ok=result===true||result?.ok===true;
    notify(ok?(success||t.placed):`${t.failed}${result?.reason?' · '+result.reason:''}`);
    return ok;
  }
  function action(value){
    if(value==='close'){panel.hidden=true;return;}
    if(value==='cancel'){cancel();panel.hidden=true;notify(t.cancel);return;}
    if(value.startsWith('defense:')){
      cancel();const type=value.split(':')[1];if(showMessage(defenses()?.arm(type),t.point)){
        mode='defense';toggle.dataset.armed='true';panel.hidden=true;
      }return;
    }
    if(value.startsWith('research:')){
      const id=value.split(':')[1];showMessage(research()?.purchase?.(id),t.bought);return;
    }
    const actionMap={line:'line',column:'column',wedge:'wedge',box:'box',guard:'guard',patrol:'patrol'};
    const key=value.split(':')[1];if(value.startsWith('tactics:')&&actionMap[key]){
      const units=players();if(!units.length){notify(t.selected);return;}
      cancel();const squads=tactics()?.squads;if(!squads){notify(t.failed);return;}
      const ids=units.map(u=>u.id);
      const old=squads.getSquads().find(s=>ids.every(id=>s.unitIds.includes(id))&&s.unitIds.length===ids.length);
      const res=old?{ok:true,squad:old}:squads.createSquad(ids,{shape:['line','column','wedge','box'].includes(key)?key:'line'});
      if(!res.ok){showMessage(res);return;}
      if(['line','column','wedge','box'].includes(key))squads.setFormation(res.squad.id,key);
      activeSquad=res.squad.id;mode=key;toggle.dataset.armed='true';panel.hidden=true;notify(t.point);
    }
  }
  function start(){
    if(disposed)return;
    const header=document.querySelector('.top');if(!header)throw new Error('Shadow Realms .top missing');
    style=document.createElement('style');style.textContent=`
      .sr-strategy-toggle{font-size:11px;white-space:nowrap;flex:none;min-height:34px;border-radius:9px;border:1px solid #b3a16c;background:#425537;color:#fff4d5;padding:6px 10px;font-weight:800}
      .sr-strategy-toggle[data-armed=true]{background:#805138;border-color:#f9c56e}
      .sr-strategy-panel{position:fixed;right:9px;top:55px;width:min(335px,calc(100vw - 18px));max-height:calc(100dvh - 75px);overflow:auto;z-index:900;padding:12px;border:1px solid #acaa7c;border-radius:12px;background:rgba(25,40,28,.98);color:#fff2d2;box-shadow:0 12px 38px #0009;font:12px system-ui,sans-serif}
      .sr-strategy-panel[hidden]{display:none!important}.sr-strategy-panel h3{font-size:12px;margin:13px 0 6px;color:#e9d3a0}.sr-strategy-panel strong{font-size:14px}.sr-strategy-panel .sr-strategy-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
      .sr-strategy-panel button{min-height:34px;border-radius:8px;border:1px solid #82936f;background:#385841;color:#f9f7de;padding:6px 4px;font-size:11px}
      .sr-strategy-panel .sr-strategy-close{background:#63453c}.sr-strategy-panel .sr-strategy-info{font-size:10px;color:#c9d1b5;margin-top:6px}
      @media(max-width:640px){.sr-strategy-toggle{padding:5px 6px;font-size:10px}.sr-strategy-panel{max-height:calc(100dvh - 65px)}}
    `;
    document.head.append(style);
    toggle=document.createElement('button');toggle.type='button';toggle.className='sr-strategy-toggle';toggle.textContent='⚔ '+t.title;toggle.setAttribute('aria-expanded','false');toggle.title=t.title;
    const back=header.querySelector('.back');header.insertBefore(toggle,back||null);
    panel=document.createElement('div');panel.className='sr-strategy-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-label',t.title);
    const defs=[['spikes',t.trap],['barricade',t.wall],['watchtower',t.tower]];
    const names=[['drills','⚔'],['armor','🛡'],['vitality','♥'],['mobility','➤'],['archery','🏹']];
    const forms=[['line',t.line],['column',t.column],['wedge',t.wedge],['box',t.box],['guard',t.guard],['patrol',t.patrol]];
    const mkButtons=(items,prefix)=>items.map(([id,label])=>`<button type="button" data-action="${prefix}:${id}">${label}</button>`).join('');
    panel.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><strong>${t.title}</strong><button type="button" class="sr-strategy-close" data-action="close">${t.close}</button></div>
      <h3>${t.defense}</h3><div class="sr-strategy-row">${mkButtons(defs,'defense')}</div>
      <h3>${t.tactics}</h3><div class="sr-strategy-row">${mkButtons(forms,'tactics')}</div>
      <h3>${t.research}</h3><div class="sr-strategy-row">${mkButtons(names.map(([id,ico])=>[id,ico+' '+id]),'research')}</div>
      <div class="sr-strategy-info">${t.point}</div><div class="sr-strategy-row" style="margin-top:8px"><button data-action="cancel" type="button">${t.cancel}</button></div>`;
    document.body.append(panel);
    toggle.addEventListener('click',()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));});
    panel.addEventListener('click',event=>{const button=event.target.closest('button[data-action]');if(button)action(button.dataset.action);});
    scope.provide('strategyControls',Object.freeze({open:()=>{panel.hidden=false;},cancel}));
    scope.on('defense:placement-result',({result})=>{if(result?.ok){cancel();notify(t.placed);}});
  }
  return {
    start,
    onPointer(event){
      if(disposed||!mode||mode==='defense'||!['select','tap'].includes(event?.kind))return false;
      const squads=tactics()?.squads,patrol=tactics()?.patrol;
      if(!squads||!activeSquad)return false;
      const units=squads.getUnits(activeSquad);
      if(!units.length){cancel();return true;}
      let result;
      if(['line','column','wedge','box'].includes(mode))result=squads.move(activeSquad,event.world);
      else if(mode==='guard')result=squads.guard(activeSquad,event.world);
      else {
        const start={x:units[0].x,y:units[0].y};
        result=patrol.start(units.map(u=>u.id),[start,event.world]);
      }
      showMessage(result);
      cancel();return true;
    },
    dispose(){if(disposed)return;disposed=true;cancel();panel?.remove();toggle?.remove();style?.remove();},
  };
}
export default createFeature;
