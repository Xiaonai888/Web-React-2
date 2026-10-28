/**
 * Shadow Realms — explicit, paid placement + durability for defenses.
 * Reuses one RiceSystem/ConstructionSystem wallet and existing map pathfinding.
 * Never places automatically or writes to a server. Does not own old buildings.
 */
import { DEFENSE_BLUEPRINTS, getDefenseBlueprint } from './DefenseBlueprints.js';

const valid = p => Number.isFinite(p?.x) && Number.isFinite(p?.y);
const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
const overlaps = (a,b,padding=0) =>
  Math.abs(a.x-b.x)<(a.width+b.width)/2+padding &&
  Math.abs(a.y-b.y)<(a.depth+b.depth)/2+padding;
const hitRect = (x,y,r,b) => {
  const dx=Math.max(Math.abs(x-b.x)-b.width/2,0);
  const dy=Math.max(Math.abs(y-b.y)-b.depth/2,0);
  return dx*dx+dy*dy <= r*r;
};

export class DefenseSystem {
  constructor({map,construction,rice,navigation=null,getUnits=()=>[],
    maxStructures=36, onEvent=null}={}) {
    if(typeof map?.isWalkable!=='function'||typeof map?.getTerrainAt!=='function')
      throw new TypeError('DefenseSystem requires the existing WorldMap');
    if(typeof construction?.getResources!=='function'||typeof construction?.setWood!=='function')
      throw new TypeError('DefenseSystem requires ConstructionSystem with setWood');
    if(typeof rice?.getResources!=='function'||typeof rice?.setStorageRice!=='function')
      throw new TypeError('DefenseSystem requires RiceSystem');
    if(typeof map.isWalkable.__shadowDefenseOwner!=='undefined')
      throw new Error('DefenseSystem already attached to this map');
    this.map=map;this.construction=construction;this.rice=rice;this.navigation=navigation;
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits;
    this.maxStructures=Math.max(1,Math.min(150,Math.floor(maxStructures)||36));
    this.onEvent=typeof onEvent==='function'?onEvent:null;
    this.structures=[];this.byId=new Map();this.serial=0;this.destroyed=false;
    this.siegeClock=0;this.elapsed=0;this.siegeCooldowns=new Map();

    // Wrap the existing construction map collision without losing its original rules.
    this.originalWalkable=map.isWalkable;
    const owner=this;
    const wrapped=function(x,y,radius=13){
      if(!owner.originalWalkable.call(this,x,y,radius))return false;
      if(!Number.isFinite(x)||!Number.isFinite(y))return false;
      const r=Math.max(0,Number.isFinite(radius)?radius:13);
      return !owner.structures.some(s=>s.alive&&s.kind!=='trap'&&hitRect(x,y,r,s));
    };
    wrapped.__shadowDefenseOwner=this;
    this.wrappedWalkable=wrapped;
    map.isWalkable=wrapped;
    this.navigation?.invalidate?.();

    // Do not permit new houses/barns to overlap an existing defense footprint.
    this.originalValidate=construction.validatePlacement;
    if(typeof this.originalValidate==='function'){
      this.wrappedValidate=function(type,position){
        const result=owner.originalValidate.call(this,type,position);
        if(!result?.ok || !valid(position))return result;
        const sizes={house:[94,70],barn:[108,80]};
        const size=sizes[type];if(!size)return result;
        const footprint={...position,width:size[0],depth:size[1]};
        return owner.structures.some(s=>s.alive&&overlaps(s,footprint,12))
          ? {ok:false,reason:'defense_overlap'} : result;
      };
      construction.validatePlacement=this.wrappedValidate;
    }
  }

  getStructures(){return this.structures.filter(s=>s.alive);}
  getById(id){return this.byId.get(id)||null;}
  getBlueprints(){return DEFENSE_BLUEPRINTS;}
  getSummary(){const entries=this.getStructures();return {
    total:entries.length,traps:entries.filter(s=>s.kind==='trap').length,
    towers:entries.filter(s=>s.kind==='tower').length,
    barricades:entries.filter(s=>s.type==='barricade').length,
  };}
  getResources(){return this.construction.getResources();}
  canAfford(type){const spec=getDefenseBlueprint(type),res=this.getResources();
    return !!spec&&res.rice>=spec.cost.rice&&res.wood>=spec.cost.wood;}

  validatePlacement(type,position){
    if(this.destroyed)return {ok:false,reason:'destroyed'};
    const spec=getDefenseBlueprint(type);
    if(!spec)return {ok:false,reason:'unknown_type'};
    if(!valid(position))return {ok:false,reason:'invalid_position'};
    if(this.getStructures().length>=this.maxStructures)return {ok:false,reason:'limit'};
    const margin=20,hw=spec.width/2,hd=spec.depth/2;
    if(position.x-hw<margin||position.x+hw>this.map.width-margin||
       position.y-hd<margin||position.y+hd>this.map.height-margin)
      return {ok:false,reason:'outside_map'};
    // Check the WHOLE footprint. Terrain/collision may vary along edges.
    for(let y=position.y-hd;y<=position.y+hd+1;y+=10){
      for(let x=position.x-hw;x<=position.x+hw+1;x+=10){
        const sx=Math.min(x,position.x+hw),sy=Math.min(y,position.y+hd);
        const terrain=this.map.getTerrainAt(sx,sy);
        if(spec.kind==='trap' ? !['grass','road','bridge'].includes(terrain) : terrain!=='grass')
          return {ok:false,reason:'terrain'};
        if(!this.originalWalkable.call(this.map,sx,sy,3))
          return {ok:false,reason:'blocked'};
      }
    }
    const box={...position,width:spec.width,depth:spec.depth};
    if(this.getStructures().some(s=>overlaps(box,s,9)))return {ok:false,reason:'defense_overlap'};
    for(const b of this.construction.getBuildings?.()||[]){
      if(overlaps(box,{x:b.x,y:b.y,width:b.width,depth:b.depth},12))
        return {ok:false,reason:'building_overlap'};
    }
    for(const f of this.rice.getFields?.()||[]){
      const field={x:f.x,y:f.y,width:f.width,depth:f.height};
      if(overlaps(box,field,9))return {ok:false,reason:'rice_field'};
    }
    if(spec.kind!=='trap')for(const u of this.getUnits()||[]){
      if(u?.alive===false||!valid(u))continue;
      if(hitRect(u.x,u.y,u.radius||13,box))return {ok:false,reason:'unit_occupying'};
    }
    return {ok:true,reason:'ready'};
  }

  place(type,position,{team='blue'}={}){
    const status=this.validatePlacement(type,position);if(!status.ok)return status;
    const spec=getDefenseBlueprint(type),res=this.getResources();
    if(res.rice<spec.cost.rice||res.wood<spec.cost.wood)
      return {ok:false,reason:'insufficient_resources'};
    // Reversible synchronous transaction against the SHARED existing ledgers.
    if(!this.rice.setStorageRice(res.rice-spec.cost.rice))
      return {ok:false,reason:'rice_payment_failed'};
    let paid=false;
    try{paid=this.construction.setWood(res.wood-spec.cost.wood)===true;}
    catch{paid=false;}
    if(!paid){this.rice.setStorageRice(res.rice);return {ok:false,reason:'wood_payment_failed'};}
    const structure={id:`defense-${++this.serial}`,type,kind:spec.kind,team,
      x:position.x,y:position.y,width:spec.width,depth:spec.depth,
      hp:spec.hp,maxHp:spec.hp,alive:true,armor:0,
      damage:spec.damage??0,cooldown:spec.cooldown??0,charges:spec.charges??null,
      range:spec.range??0,placedAt:this.elapsed};
    this.structures.push(structure);this.byId.set(structure.id,structure);
    if(spec.kind!=='trap')this.navigation?.invalidate?.();
    this.onEvent?.('placed',{structure,cost:{...spec.cost}});
    return {ok:true,structure};
  }

  damageStructure(id,damage,{source=null}={}){
    const s=this.getById(id);
    if(!s?.alive||!Number.isFinite(damage)||damage<=0)return {ok:false,reason:'invalid'};
    const applied=Math.min(s.hp,Math.max(1,Math.round(damage-Math.max(0,s.armor||0))));
    s.hp-=applied;this.onEvent?.('hit',{structure:s,applied,source});
    if(s.hp<=0)this.remove(id,{reason:'destroyed'});
    return {ok:true,applied,remaining:s.hp,killed:!s.alive};
  }

  remove(id,{reason='removed'}={}){
    const s=this.byId.get(id);if(!s?.alive)return false;
    s.alive=false;this.byId.delete(id);
    this.structures=this.structures.filter(v=>v!==s);
    this.siegeCooldowns.delete(id);
    if(s.kind!=='trap')this.navigation?.invalidate?.();
    this.onEvent?.('removed',{structure:s,reason});
    return true;
  }

  /** Raiders can tear down defenses; not immortal or secretly registered as farmers. */
  update(dt){
    if(this.destroyed||!Number.isFinite(dt)||dt<=0)return;
    const delta=Math.min(dt,.1);this.elapsed+=delta;this.siegeClock+=delta;
    if(this.siegeClock<.2)return;
    const seconds=this.siegeClock;this.siegeClock=0;
    const enemies=(this.getUnits()||[]).filter(u=>u?.team==='red'&&u.alive!==false&&u.hp>0);
    for(const s of [...this.getStructures()]){
      if(s.kind==='trap')continue;
      let timer=Math.max(0,(this.siegeCooldowns.get(s.id)||0)-seconds);
      if(timer>0){this.siegeCooldowns.set(s.id,timer);continue;}
      const enemy=enemies.find(e=>hitRect(e.x,e.y,(e.attackRange||36)+12,s));
      if(!enemy)continue;
      this.damageStructure(s.id,enemy.attackDamage||8,{source:enemy});
      this.siegeCooldowns.set(s.id,Math.max(.3,enemy.attackCooldown||1.25));
    }
  }

  draw(ctx,camera){
    if(!ctx||!camera)return;
    for(const s of [...this.getStructures()].sort((a,b)=>a.y-b.y)){
      const p=camera.worldToScreen(s.x,s.y),z=camera.zoom;
      if(p.x<-120||p.x>camera.viewportWidth+120||p.y<-170||p.y>camera.viewportHeight+100)continue;
      ctx.save();ctx.translate(p.x,p.y);ctx.scale(z,z);
      ctx.fillStyle='rgba(13,32,21,.32)';ctx.beginPath();ctx.ellipse(2,3,s.width*.51,7,0,0,Math.PI*2);ctx.fill();
      if(s.type==='spikes'){
        ctx.fillStyle='#715438';ctx.fillRect(-26,-13,52,28);
        ctx.fillStyle='#c2a879';for(let x=-19;x<24;x+=13){
          ctx.beginPath();ctx.moveTo(x,-8);ctx.lineTo(x+6,-24);ctx.lineTo(x+12,-8);ctx.fill();}
      }else if(s.type==='barricade'){
        ctx.fillStyle='#68452f';ctx.fillRect(-40,-33,80,39);
        ctx.strokeStyle='#b88952';ctx.lineWidth=6;
        for(let x=-30;x<=30;x+=20){ctx.beginPath();ctx.moveTo(x,-34);ctx.lineTo(x,5);ctx.stroke();}
        ctx.strokeStyle='#493227';ctx.lineWidth=3;ctx.strokeRect(-39,-33,78,39);
      }else if(s.type==='watchtower'){
        ctx.fillStyle='#644431';ctx.fillRect(-24,-84,10,88);ctx.fillRect(14,-84,10,88);
        ctx.fillStyle='#9b7650';ctx.fillRect(-36,-103,72,25);
        ctx.fillStyle='#4d6557';ctx.beginPath();ctx.moveTo(-43,-101);ctx.lineTo(0,-137);ctx.lineTo(43,-101);ctx.closePath();ctx.fill();
        ctx.fillStyle='#d8ad69';ctx.fillRect(-13,-94,26,9);
      }
      if(s.hp<s.maxHp){ctx.fillStyle='#332d29';ctx.fillRect(-25,-s.depth-18,50,5);
        ctx.fillStyle=s.hp/s.maxHp>.4?'#79ca7b':'#e8766c';ctx.fillRect(-25,-s.depth-18,50*s.hp/s.maxHp,5);}
      ctx.restore();
    }
  }

  destroy(){
    if(this.destroyed)return;
    if(this.map.isWalkable===this.wrappedWalkable)this.map.isWalkable=this.originalWalkable;
    if(this.wrappedValidate&&this.construction.validatePlacement===this.wrappedValidate)
      this.construction.validatePlacement=this.originalValidate;
    this.structures=[];this.byId.clear();this.siegeCooldowns.clear();
    this.navigation?.invalidate?.();this.destroyed=true;
  }
}
export default DefenseSystem;
