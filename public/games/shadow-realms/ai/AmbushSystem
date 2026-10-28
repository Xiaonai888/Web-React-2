/** Ambush cues near existing river bridges. Never duplicates WaveSystem spawns. */
const valid = p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export class AmbushSystem {
  constructor({map,getPlayers=()=>[],getEnemies=()=>[],activationRadius=255,
    supportRadius=800,focusSeconds=4,onEvent=null}={}){
    if(!map||!Number.isFinite(map.width)||typeof map.isWalkable!=='function')
      throw new TypeError('AmbushSystem needs WorldMap');
    this.map=map;this.getPlayers=getPlayers;this.getEnemies=getEnemies;
    this.activationRadius=Math.max(60,Math.min(550,activationRadius));
    this.supportRadius=Math.max(150,Math.min(2000,supportRadius));
    this.focusSeconds=Math.max(1,Math.min(20,focusSeconds));
    this.onEvent=onEvent;this.timer=0;this.time=0;
    const places=Array.isArray(map.bridges)?map.bridges.filter(valid).slice(0,3):[];
    this.zones=places.map((p,i)=>({id:`river-ambush-${i+1}`,x:p.x,y:p.y,
      triggered:false,cooldown:0}));
    this.focus=null;
  }
  update(dt){
    if(!Number.isFinite(dt)||dt<=0)return null;
    const step=Math.min(.1,dt);this.time+=step;this.timer+=step;
    if(this.focus && this.time>=this.focus.until)this.focus=null;
    if(this.timer<.4)return this.focus;
    this.timer=0;
    const players=(this.getPlayers()||[]).filter(p=>p?.team==='blue'&&p.alive!==false&&p.hp>0&&valid(p));
    const enemies=(this.getEnemies()||[]).filter(e=>e?.team==='red'&&e.alive!==false&&e.hp>0&&valid(e));
    for(const zone of this.zones){
      if(zone.triggered||this.time<zone.cooldown)continue;
      const player=players.find(p=>distance(p,zone)<=this.activationRadius);
      if(!player)continue;
      if(!enemies.some(e=>distance(e,zone)<=this.supportRadius))continue;
      zone.triggered=true;
      this.focus={targetId:player.id,until:this.time+this.focusSeconds,zoneId:zone.id};
      this.onEvent?.('triggered',{zoneId:zone.id,targetId:player.id});
      return this.focus;
    }
    return this.focus;
  }
  getFocusId(){return this.focus?.targetId||null;}
  getZones(){return this.zones.map(z=>({...z}));}
  reset(){this.focus=null;this.time=0;this.timer=0;for(const z of this.zones){z.triggered=false;z.cooldown=0;}}
  destroy(){this.reset();this.onEvent=null;}
}
export default AmbushSystem;
