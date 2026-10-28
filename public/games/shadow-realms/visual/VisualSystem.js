/**
 * Shadow Realms — visual adapter/orchestrator (Step 18).
 * Attach all five NEW visual modules with ONE integration change later:
 *
 *   const visual = new VisualSystem({map, getUnits: () => [...farmers, ...enemyAI.getUnits()]})
 *   // game.onUpdate: visual.update(dt)   [after entity updates]
 *   // game.onRender: visual.drawAtmosphere(ctx,camera) and visual.drawOverlay(ctx,camera)
 *   // HealthSystem onEvent: (event,data)=>visual.onHealthEvent(event,data)
 *   // CombatSystem onEvent: (event,data)=>visual.onCombatEvent(event,data)
 *   // ProjectileSystem onEvent: (event,data)=>visual.onProjectileEvent(event,data)
 *   // game cleanup: visual.destroy()
 *
 * Existing Farmer.draw calls its renderer(ctx, unit). This adapter attaches a
 * chibi painter to each local unit and restores original renderers on destroy.
 * No modifying of Farmer, world, GameEngine, UI, or combat logic is necessary.
 */
import {UnitAnimationSystem} from './UnitAnimationSystem.js'
import {ChibiSpriteRenderer} from './ChibiSpriteRenderer.js'
import {CombatEffects} from './CombatEffects.js'
import {WorldAtmosphere} from './WorldAtmosphere.js'

export class VisualSystem {
  constructor({map,getUnits=()=>[],replaceExisting=true,reducedMotion=false,
    atmosphere=true,density=55,maxEffects=180}={}) {
    if(!map||!Number.isFinite(map.width)||!Number.isFinite(map.height))throw new TypeError('VisualSystem requires WorldMap')
    this.map=map
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits
    this.replaceExisting=Boolean(replaceExisting)
    this.animations=new UnitAnimationSystem({reducedMotion})
    this.sprites=new ChibiSpriteRenderer()
    this.effects=new CombatEffects({maxEffects,reducedMotion})
    this.atmosphere=new WorldAtmosphere(map,{density,reducedMotion,enabled:atmosphere})
    this.attached=new Map()
    this.enabled=true
    this.destroyed=false
    this.time=0
  }
  units(){const list=this.getUnits();return Array.isArray(list)?list.filter(x=>x&&x.id!=null):[]}
  /** Explicit binding is also supported for units just spawned. */
  attachUnit(unit) {
    if(this.destroyed||!unit||unit.id==null||typeof unit.draw!=='function')return false
    const existing=this.attached.get(unit)
    if(existing)return false
    if(!this.replaceExisting&&typeof unit.renderer==='function')return false
    const original=unit.renderer
    const painter=(ctx,entity)=>this.sprites.paint(ctx,entity,this.animations.frame(entity))
    this.attached.set(unit,{original,painter})
    unit.renderer=painter
    return true
  }
  /** Restore a renderer even if the unit is removed from the active list. */
  detachUnit(unit) {
    const rec=this.attached.get(unit)
    if(!rec)return false
    if(unit.renderer===rec.painter)unit.renderer=rec.original
    this.attached.delete(unit)
    this.animations.reset(unit)
    return true
  }
  syncUnits() {
    if(this.destroyed)return
    const active=this.units()
    const set=new Set(active)
    for(const unit of active)this.attachUnit(unit)
    for(const unit of [...this.attached.keys()])if(!set.has(unit))this.detachUnit(unit)
  }
  update(dt) {
    if(this.destroyed||!this.enabled||!Number.isFinite(dt)||dt<=0)return
    this.syncUnits()
    this.time+=Math.min(dt,.1)
    this.animations.update(dt,this.units())
    this.effects.update(dt)
    this.atmosphere.update(dt)
  }
  onHealthEvent(name,data={}) {
    if(this.destroyed)return false
    if(name==='damage'&&data.unit)this.animations.signal(data.unit,'hit')
    return this.effects.onHealthEvent(name,data)
  }
  onCombatEvent(name,data={}) {
    if(this.destroyed)return false
    if(name==='attack'&&data.unit)this.animations.signal(data.unit,'attack')
    return this.effects.onCombatEvent(name,data)
  }
  onProjectileEvent(name,data={}) {
    if(this.destroyed)return false
    return this.effects.onProjectileEvent(name,data)
  }
  drawAtmosphere(ctx,camera){if(this.enabled&&!this.destroyed)this.atmosphere.draw(ctx,camera)}
  drawOverlay(ctx,camera){if(this.enabled&&!this.destroyed)this.effects.draw(ctx,camera)}
  draw(ctx,camera){this.drawOverlay(ctx,camera)}
  setEnabled(value){this.enabled=Boolean(value);this.atmosphere.setEnabled(value)}
  destroy() {
    if(this.destroyed)return
    for(const u of [...this.attached.keys()])this.detachUnit(u)
    this.animations.reset();this.effects.reset();this.atmosphere.reset()
    this.destroyed=true
  }
}
export default VisualSystem
