/** The final wave's FIRST existing brute becomes boss (no untracked extra enemy). */
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const valid=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export class BossEncounter {
  constructor({waves,health,getPlayers=()=>[],onEvent=null,finalWaveOnly=true,
    slamRadius=115,slamDamage=13,slamCooldown=11,windup=1.1}={}){
    if(!waves||typeof waves.getSummary!=='function'||typeof health?.damage!=='function')
      throw new TypeError('BossEncounter needs existing WaveSystem and HealthSystem');
    this.waves=waves;this.health=health;this.getPlayers=getPlayers;this.onEvent=onEvent;
    this.finalWaveOnly=!!finalWaveOnly;
    this.slamRadius=clamp(slamRadius,45,260);this.slamDamage=clamp(slamDamage,1,40);
    this.slamCooldown=clamp(slamCooldown,5,40);this.windup=clamp(windup,.3,3);
    this.bosses=new Map();this.announced=new Set();
  }
  promote(unit,{wave=null,totalWaves=null}={}){
    const current=wave??this.waves.wave;
    const total=totalWaves??this.waves.totalWaves;
    if(this.finalWaveOnly && (this.waves.endless || current!==total))return false;
    if(!unit||unit.team!=='red'||unit.type!=='brute'||unit.hp<=0||unit.alive===false||unit.id==null)return false;
    if(this.announced.has(current)||this.bosses.has(unit.id))return false;
    const stats=['maxHp','hp','attackDamage','armor','attackCooldown'];
    const before=Object.fromEntries(stats.map(s=>[s,unit[s]]));
    const boosted={
      maxHp:Math.round(Math.max(1,unit.maxHp||unit.hp)*2.35),
      hp:Math.round(Math.max(1,unit.hp)*2.35),
      attackDamage:Math.round(Math.max(1,unit.attackDamage||10)*1.65),
      armor:clamp((unit.armor||0)+4,0,50),
      attackCooldown:clamp((unit.attackCooldown||2)*.8,.45,6),
    };
    Object.assign(unit,boosted);
    const boss={unit,before,boosted,wave:current,cooldown:this.slamCooldown,
      windup:0,armed:false,slams:0,dead:false};
    this.bosses.set(unit.id,boss);this.announced.add(current);
    this.onEvent?.('spawned',{unitId:unit.id,wave:current});
    return true;
  }
  onWaveEvent(name,data={}){
    if(name!=='enemy_spawned')return false;
    return this.promote(data.unit,{wave:data.wave,totalWaves:data.totalWaves});
  }
  onHealthEvent(name,data={}){
    if(name!=='death'||!data.unit||!this.bosses.has(data.unit.id))return false;
    const b=this.bosses.get(data.unit.id);
    if(b.dead)return false;
    b.dead=true;b.armed=false;
    this.onEvent?.('defeated',{unitId:data.unit.id,wave:b.wave});
    return true;
  }
  update(dt){
    if(!Number.isFinite(dt)||dt<=0)return;
    const t=Math.min(.1,dt);
    const players=(this.getPlayers()||[]).filter(u=>u?.team==='blue'&&u.alive!==false&&u.hp>0&&valid(u));
    for(const b of this.bosses.values()){
      const unit=b.unit;
      if(b.dead||unit.alive===false||!(unit.hp>0))continue;
      if(b.armed){
        b.windup-=t;
        if(b.windup<=0){
          b.armed=false;b.cooldown=this.slamCooldown;b.slams++;
          const hits=[];
          for(const player of players)if(dist(unit,player)<=this.slamRadius){
            const result=this.health.damage(player,this.slamDamage,{source:unit,type:'boss-slam'});
            if(result.ok)hits.push(player.id);
          }
          this.onEvent?.('slam',{unitId:unit.id,hits});
        }
      } else {
        b.cooldown-=t;
        if(b.cooldown<=0){
          if(players.some(u=>dist(unit,u)<=this.slamRadius+35)){
            b.armed=true;b.windup=this.windup;
            this.onEvent?.('slam-warning',{unitId:unit.id,duration:this.windup});
          } else b.cooldown=1.2;
        }
      }
    }
  }
  draw(ctx,camera){
    if(!ctx||!camera)return;
    ctx.save();
    for(const b of this.bosses.values()){
      const u=b.unit;
      if(b.dead||u.alive===false||!(u.hp>0))continue;
      const p=camera.worldToScreen(u.x,u.y);
      if(p.x<-110||p.x>camera.viewportWidth+110||p.y<-110||p.y>camera.viewportHeight+100)continue;
      ctx.textAlign='center';ctx.font='bold 19px system-ui';ctx.fillStyle='#fff1a7';
      ctx.fillText('♛',p.x,p.y-90*camera.zoom);
      if(b.armed){
        ctx.strokeStyle='rgba(255,104,56,.85)';ctx.lineWidth=3;
        ctx.beginPath();ctx.ellipse(p.x,p.y,this.slamRadius*camera.zoom,
          this.slamRadius*camera.zoom*(camera.tilt||.72),0,0,Math.PI*2);ctx.stroke();
      }
    }
    ctx.restore();
  }
  getSummary(){return {promoted:this.bosses.size,alive:[...this.bosses.values()].filter(b=>!b.dead&&b.unit.hp>0).length,
    defeated:[...this.bosses.values()].filter(b=>b.dead).length};}
  destroy(){
    for(const b of this.bosses.values()){
      const unit=b.unit;
      if(unit.alive===false||unit.hp<=0)continue;
      for(const key of ['maxHp','attackDamage','armor','attackCooldown']){
        if(unit[key]===b.boosted[key])unit[key]=b.before[key];
      }
      unit.hp=Math.min(unit.hp,unit.maxHp);
    }
    this.bosses.clear();this.announced.clear();this.onEvent=null;
  }
}
export default BossEncounter;
