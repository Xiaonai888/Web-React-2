/**
 * Shadow Realms — short-lived battle VFX: local hit sparks, floating damage,
 * attack arcs, healing rings and death bursts. Pure Canvas; no timers or requests.
 * Connect with HealthSystem, CombatSystem and ProjectileSystem onEvent hooks.
 */
const TAU=Math.PI*2
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x))
const ok=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y)

export class CombatEffects {
  constructor({maxEffects=180,reducedMotion=false}={}) {
    this.maxEffects=Math.max(10,Math.floor(maxEffects)||180)
    this.reducedMotion=Boolean(reducedMotion)
    this.effects=[]
    this.seed=0x1234abcd
  }
  #rand() {
    this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0
    return this.seed/4294967296
  }
  #add(effect) {
    this.effects.push(effect)
    if(this.effects.length>this.maxEffects)this.effects.splice(0,this.effects.length-this.maxEffects)
    return effect
  }
  burst(point,{kind='hit',color='#f6df9b',count=7}={}) {
    if(!ok(point))return false
    const pieces=this.reducedMotion?Math.min(count,2):Math.min(25,Math.max(1,Math.floor(count)))
    for(let i=0;i<pieces;i++) {
      const a=TAU*this.#rand(),v=25+this.#rand()*68
      this.#add({kind:'spark',x:point.x,y:point.y,age:0,life:0.27+this.#rand()*.25,
        vx:Math.cos(a)*v,vy:Math.sin(a)*v-24,color,radius:2+this.#rand()*2,variant:kind})
    }
    return true
  }
  damage(unit,amount,{killed=false,type='physical'}={}) {
    if(!ok(unit))return false
    const value=Math.max(0,Math.round(Number(amount)||0))
    if(value<=0)return false
    this.#add({kind:'text',x:unit.x,y:unit.y,offset:0,age:0,life:.83,
      text:`−${value}`,color:type==='projectile'?'#ffeb9a':'#fff2de'})
    this.burst(unit,{kind:killed?'death':'hit',color:killed?'#c8cbba':'#ef9888',count:killed?17:7})
    return true
  }
  heal(unit,amount) {
    if(!ok(unit))return false
    this.#add({kind:'text',x:unit.x,y:unit.y,age:0,life:.9,offset:0,
      text:`+${Math.max(0,Math.round(amount||0))}`,color:'#a3f0bc'})
    return true
  }
  attack(unit,{ranged=false}={}) {
    if(!ok(unit))return false
    if(ranged)return this.burst(unit,{color:'#f6dc97',count:2})
    this.#add({kind:'slash',x:unit.x,y:unit.y,age:0,life:.18,
      direction:Number.isFinite(unit.angle)?unit.angle:0,color:'#f8eed0'})
    return true
  }
  impact(position,{target=null}={}) {
    if(!ok(position))return false
    return this.burst(position,{color:target?'#f6c477':'#c8e5de',count:9})
  }
  /** Pass original event name and payload without rewriting event objects. */
  onHealthEvent(name,data={}) {
    if(name==='damage')return this.damage(data.unit,data.applied,{killed:data.killed,type:data.type})
    if(name==='heal')return this.heal(data.unit,data.applied)
    if(name==='death')return this.burst(data.unit,{kind:'death',color:'#dad9bd',count:13})
    return false
  }
  onCombatEvent(name,data={}) {return name==='attack'?this.attack(data.unit,{ranged:data.ranged}):false}
  onProjectileEvent(name,data={}) {return name==='impact'?this.impact(data.position,{target:data.target}):false}
  update(dt) {
    if(!Number.isFinite(dt)||dt<=0)return
    const t=Math.min(dt,.1)
    for(const e of this.effects) {
      e.age+=t
      if(e.kind==='spark') {e.x+=e.vx*t;e.y+=e.vy*t;e.vy+=70*t}
    }
    this.effects=this.effects.filter(e=>e.age<e.life)
  }
  draw(ctx,camera) {
    if(!ctx||!camera)return
    ctx.save()
    for(const e of this.effects) {
      const t=clamp(e.age/e.life,0,1)
      const p=camera.worldToScreen(e.x,e.y)
      if(p.x < -110||p.x>camera.viewportWidth+110||p.y < -130||p.y >camera.viewportHeight+130)continue
      ctx.globalAlpha=(1-t)*.97
      if(e.kind==='text') {
        const y=p.y-69-t*38
        ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`900 ${Math.round(13+2*camera.zoom)}px system-ui,sans-serif`
        ctx.lineWidth=3.6;ctx.strokeStyle='#203023';ctx.strokeText(e.text,p.x,y)
        ctx.fillStyle=e.color;ctx.fillText(e.text,p.x,y)
      }else if(e.kind==='slash') {
        const r=19+14*t
        ctx.beginPath();ctx.ellipse(p.x,p.y-21,r,r*.66,e.direction,-1.3,.95)
        ctx.lineWidth=3;ctx.strokeStyle=e.color;ctx.stroke()
      }else {
        ctx.fillStyle=e.color;ctx.beginPath();ctx.arc(p.x,p.y-14,e.radius*(1-t*.65)*camera.zoom,0,TAU);ctx.fill()
      }
    }
    ctx.restore()
  }
  reset(){this.effects=[]}
}
export default CombatEffects
