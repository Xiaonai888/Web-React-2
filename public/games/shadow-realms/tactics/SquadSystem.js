/** Shadow Realms — player-owned squads, using existing Farmer/CombatSystem. */
import {FORMATIONS} from './FormationSystem.js';
const valid=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
const alive=u=>u?.id!=null&&u.team==='blue'&&u.alive!==false&&Number.isFinite(u.hp)&&u.hp>0;

export class SquadSystem {
  constructor({getUnits=()=>[],formation,combat=null,maxSquads=12,onClaimUnit=null,onEvent=null}={}){
    if(typeof formation?.move!=='function')throw new TypeError('SquadSystem needs FormationSystem');
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits;
    this.formation=formation;this.combat=combat;this.maxSquads=maxSquads;
    this.onClaimUnit=onClaimUnit;this.onEvent=onEvent;this.squads=new Map();this.members=new Map();this.serial=0;
  }
  #units(){const list=this.getUnits();return Array.isArray(list)?list:[];}
  #resolve(ids){const keys=new Set(Array.isArray(ids)?ids:[ids]);return this.#units().filter(u=>keys.has(u.id)&&alive(u));}
  getSquad(id){const s=this.squads.get(id);return s?{...s,unitIds:[...s.unitIds]}:null;}
  getSquads(){return [...this.squads.keys()].map(id=>this.getSquad(id));}
  getUnits(id){const s=this.squads.get(id);return s?this.#resolve(s.unitIds):[];}
  createSquad(unitIds,{name=null,shape='line'}={}){
    if(this.squads.size>=this.maxSquads)return {ok:false,reason:'squad_limit'};
    if(!FORMATIONS.includes(shape))return {ok:false,reason:'invalid_formation'};
    const selected=this.#resolve(unitIds).filter(u=>!this.members.has(u.id));
    if(!selected.length)return {ok:false,reason:'no_available_units'};
    const id=`squad-${++this.serial}`;
    const squad={id,name:String(name||`Squad ${this.serial}`).slice(0,50),shape,
      unitIds:selected.map(u=>u.id)};
    this.squads.set(id,squad);for(const u of selected)this.members.set(u.id,id);
    this.onEvent?.('created',this.getSquad(id));return {ok:true,squad:this.getSquad(id)};
  }
  addUnits(id,unitIds){
    const s=this.squads.get(id);if(!s)return {ok:false,reason:'unknown_squad'};
    const chosen=this.#resolve(unitIds).filter(u=>!this.members.has(u.id));
    for(const u of chosen){s.unitIds.push(u.id);this.members.set(u.id,id);}
    this.onEvent?.('updated',this.getSquad(id));return {ok:true,added:chosen.length};
  }
  removeUnit(unitId){
    const id=this.members.get(unitId),s=this.squads.get(id);if(!s)return false;
    s.unitIds=s.unitIds.filter(x=>x!==unitId);this.members.delete(unitId);
    if(!s.unitIds.length)this.squads.delete(id);
    this.onEvent?.('updated',this.getSquad(id));return true;
  }
  disband(id){const s=this.squads.get(id);if(!s)return false;
    for(const uid of s.unitIds)this.members.delete(uid);this.squads.delete(id);
    this.onEvent?.('disbanded',{id});return true;
  }
  setFormation(id,shape){const s=this.squads.get(id);
    if(!s||!FORMATIONS.includes(shape))return false;s.shape=shape;return true;
  }
  /** By default, movement never claims a farmer doing another task; caller can explicitly release it. */
  #claim(units){
    if(typeof this.onClaimUnit!=='function')return;
    for(const unit of units)this.onClaimUnit(unit);
  }
  move(id,point,options={}){
    const s=this.squads.get(id);if(!s||!valid(point))return {ok:false,reason:'invalid_command'};
    const units=this.getUnits(id);if(!units.length)return {ok:false,reason:'no_units'};
    this.#claim(units);
    this.combat?.orderStop?.(units.map(u=>u.id));
    const result=this.formation.move(units,point,{...options,shape:options.shape||s.shape});
    this.onEvent?.('ordered',{id,type:'move',result});return result;
  }
  attackMove(id,point){const s=this.squads.get(id);
    if(!s||!valid(point)||typeof this.combat?.orderAttackMove!=='function')return {ok:false,reason:'combat_unavailable'};
    const units=this.getUnits(id);if(!units.length)return {ok:false,reason:'no_units'};
    this.#claim(units);
    const count=this.combat.orderAttackMove(units.map(u=>u.id),point);
    return {ok:count>0,count};
  }
  guard(id,point=null,{radius=290}={}){
    if(!this.squads.has(id)||typeof this.combat?.orderGuard!=='function')return {ok:false,reason:'combat_unavailable'};
    const units=this.getUnits(id);if(!units.length)return {ok:false,reason:'no_units'};
    if(point!=null&&!valid(point))return {ok:false,reason:'invalid_point'};
    this.#claim(units);
    const centre=point||{x:units.reduce((n,u)=>n+u.x,0)/units.length,
      y:units.reduce((n,u)=>n+u.y,0)/units.length};
    const count=this.combat.orderGuard(units.map(u=>u.id),centre,{radius});
    this.onEvent?.('ordered',{id,type:'guard',point:centre,count});
    return {ok:count>0,count,point:centre};
  }
  stop(id){if(!this.squads.has(id))return false;
    const ids=this.getUnits(id).map(u=>u.id);this.combat?.orderStop?.(ids);return true;
  }
  prune(){const live=new Set(this.#units().filter(alive).map(u=>u.id));
    for(const [unitId] of [...this.members])if(!live.has(unitId))this.removeUnit(unitId);
  }
  draw(ctx,camera){if(!ctx||!camera)return;
    ctx.save();for(const s of this.squads.values()){
      const units=this.getUnits(s.id);if(!units.length)continue;
      const p=camera.worldToScreen(units[0].x,units[0].y);
      ctx.fillStyle='rgba(18,39,48,.8)';ctx.strokeStyle='#a1dafa';ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(p.x,p.y-74*camera.zoom,12,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.fillStyle='#e5f8ff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(String([...this.squads.keys()].indexOf(s.id)+1),p.x,p.y-74*camera.zoom);
    }ctx.restore();
  }
  getSummary(){return {squads:this.squads.size,units:this.members.size};}
  destroy(){for(const id of [...this.squads.keys()])this.disband(id);}
}
export default SquadSystem;
