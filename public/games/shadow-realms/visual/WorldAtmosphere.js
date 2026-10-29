/**
 * Shadow Realms — lightweight atmospheric visuals for three-quarter terrain.
 * Floating pollen, motes, soft light and river glints. All time-based local Canvas.
 * Does not modify WorldMap collision or its existing ground/foreground drawing.
 */
const TAU=Math.PI*2
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v))
function random(seed){let x=seed>>>0;return()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296}}

export class WorldAtmosphere {
  constructor(map,{density=55,seed=8229,reducedMotion=false,enabled=true}={}) {
    if(!map||!Number.isFinite(map.width)||!Number.isFinite(map.height))throw new TypeError('WorldAtmosphere requires WorldMap')
    this.map=map;this.enabled=Boolean(enabled);this.reducedMotion=Boolean(reducedMotion)
    this.elapsed=0
    const rand=random(seed)
    this.motes=Array.from({length:clamp(Number.isFinite(density)?Math.floor(density):55,0,130)},()=>({
      x:rand()*map.width,y:rand()*map.height,r:1.5+rand()*2.3,
      speed:4+rand()*13,phase:rand()*TAU,alpha:.07+rand()*.16,
      glow:rand()>.76,
    }))
    for(const m of this.motes){m.originX=m.x;m.originY=m.y}
  }
  update(dt) {
    if(!this.enabled||!Number.isFinite(dt)||dt<=0)return
    const d=Math.min(.1,dt)
    this.elapsed+=d
    if(this.reducedMotion)return
    for(const m of this.motes){
      m.x+=m.speed*d
      m.y+=Math.sin(this.elapsed*.6+m.phase)*d*2
      if(m.x>this.map.width+10)m.x=-10
      m.y=clamp(m.y,0,this.map.height)
    }
  }
  /** Overlay is subtle; call after the original map is painted. */
  draw(ctx,camera) {
    if(!this.enabled||!ctx||typeof camera?.getVisibleBounds!=='function'||
       typeof camera?.worldToScreen!=='function')return
    const bounds=camera.getVisibleBounds()
    if(!bounds||!Number.isFinite(bounds.left)||!Number.isFinite(bounds.right)||
       !Number.isFinite(bounds.top)||!Number.isFinite(bounds.bottom))return
    const zoom=Number.isFinite(camera.zoom)&&camera.zoom>0?camera.zoom:1
    ctx.save()
    for(const m of this.motes) {
      if(m.x<bounds.left-30||m.x>bounds.right+30||m.y<bounds.top-30||m.y>bounds.bottom+30)continue
      const p=camera.worldToScreen(m.x,m.y)
      ctx.globalAlpha=m.alpha*(.8+.2*Math.sin(this.elapsed*1.3+m.phase))
      ctx.fillStyle=m.glow?'#fff1b5':'#e1f1b4'
      ctx.beginPath();ctx.ellipse(p.x,p.y,m.r*zoom,m.r*.67*zoom,0,0,TAU);ctx.fill()
    }
    // River remains the original WorldMap river; these are only light glints.
    const y0=Math.max(0,Math.floor(bounds.top/145)*145)
    const y1=Math.min(this.map.height,bounds.bottom)
    for(let y=y0;y<=y1 && typeof this.map.riverX==='function';y+=145){
      const x=this.map.riverX(y)
      if(x<bounds.left-60||x>bounds.right+60)continue
      const p=camera.worldToScreen(x,y)
      const wave=this.reducedMotion?0:Math.sin(this.elapsed*1.4+y*.031)*8
      ctx.globalAlpha=.1+.05*Math.sin(this.elapsed*1.8+y)
      ctx.strokeStyle='#ebfafb';ctx.lineWidth=2.2;ctx.lineCap='round'
      ctx.beginPath();ctx.moveTo(p.x-16+wave,p.y);ctx.quadraticCurveTo(p.x+wave,p.y-3,p.x+14+wave,p.y);ctx.stroke()
    }
    ctx.restore()
  }
  setEnabled(value){this.enabled=Boolean(value)}
  reset(){this.elapsed=0;for(const m of this.motes){m.x=m.originX;m.y=m.originY}}
}
export default WorldAtmosphere
