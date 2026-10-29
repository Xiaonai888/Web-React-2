/**
 * Shadow Realms — procedural upright 2D chibi sprites for tilted 2.5D ground.
 * The ctx passed here is ALREADY centered on the entity and scaled by Farmer.draw().
 * Future image-based sprites may replace this painter without altering the game.
 * Supports Farmer / Guard / Archer / Scout / Raider / Brute, four directions,
 * animated walk, swing, harvest, shield, bows, expressive eyes and team colors.
 */
const TAU = Math.PI * 2
const dark = '#2a2a31'
const palettes = Object.freeze({
  blue: { cloth: '#507bb8', shadow: '#2a497a', accent: '#dfbc6d', hair: '#483c35' },
  red:  { cloth: '#b75a59', shadow: '#773f4c', accent: '#d7b184', hair: '#423038' },
  green:{ cloth: '#5c9971', shadow: '#3b6854', accent: '#e2c471', hair: '#43362d' },
})
// Farmer.type remains 'farmer' after Guard/Archer training in index.html.
// Explicit combat training takes priority over the unchanged entity type.
const roleOf = u => {
  const requested = u?.isEnemy ? u.type || 'raider' :
    u?.combatTraining === 'ranged' || u?.attackType === 'ranged' ? 'archer' :
    u?.combatTraining === 'melee' || u?.attackType === 'melee' ? 'guard' :
    u?.type || 'farmer'
  return typeof requested === 'string' ? requested.toLowerCase() : 'farmer'
}
function oval(ctx, x, y, rx, ry, fill, border = null, width = 1.6) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU)
  ctx.fillStyle = fill; ctx.fill()
  if (border) { ctx.strokeStyle = border; ctx.lineWidth = width; ctx.stroke() }
}
function line(ctx, x1, y1, x2, y2, stroke, width = 3) {
  ctx.beginPath(); ctx.moveTo(x1,y1);ctx.lineTo(x2,y2)
  ctx.lineCap='round';ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()
}
function polygon(ctx, pts, color, stroke = null) {
  ctx.beginPath();ctx.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)ctx.lineTo(...pts[i]);ctx.closePath()
  ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.7;ctx.stroke()}
}
function rounded(ctx,x,y,w,h,r,fill,stroke=null) {
  const R=Math.min(r,w/2,h/2)
  ctx.beginPath();ctx.moveTo(x+R,y);ctx.arcTo(x+w,y,x+w,y+h,R);ctx.arcTo(x+w,y+h,x,y+h,R);ctx.arcTo(x,y+h,x,y,R);ctx.arcTo(x,y,x+w,y,R);ctx.closePath()
  ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.8;ctx.stroke()}
}
function sword(ctx, swing, guard = false) {
  ctx.save();ctx.translate(16,-23);ctx.rotate(-0.36 - swing * 0.95)
  line(ctx,0,0,0,-12,'#825f42',4)
  line(ctx,-5,-10,5,-10,'#dabd75',3)
  polygon(ctx,[[-3,-12],[0,-41],[3,-12]],'#d2e4e8','#647d8b')
  polygon(ctx,[[0,-39],[3,-14],[0,-17]],'#fbf9d9')
  if(guard)oval(ctx,0,-8,3,2,'#d7c58b')
  ctx.restore()
}
function bow(ctx, swing) {
  ctx.save();ctx.translate(15,-22);ctx.rotate(-swing*.45)
  ctx.beginPath();ctx.moveTo(0,-28);ctx.quadraticCurveTo(21,-12,0,9)
  ctx.strokeStyle='#8b673e';ctx.lineWidth=4;ctx.stroke()
  line(ctx,0,-28,0,9,'#ded8b6',1.4)
  line(ctx,0,-10,28,-10,'#6c6b63',2.1)
  polygon(ctx,[[30,-10],[22,-15],[22,-5]],'#dedbce')
  ctx.restore()
}
function sickle(ctx, swing) {
  ctx.save();ctx.translate(15,-17);ctx.rotate(swing*.8)
  line(ctx,0,0,3,-20,'#8b694c',3.5)
  ctx.beginPath();ctx.arc(-4,-24,9,-0.9,1.8);ctx.strokeStyle='#d5e5e1';ctx.lineWidth=3;ctx.stroke()
  ctx.restore()
}
function shield(ctx, role, pal) {
  if (!['guard','brute','raider'].includes(role)) return
  const w=role==='brute'?12:10
  polygon(ctx,[[-15,-30],[-15-w,-28],[-15-w,-13],[-15,-7],[-11,-14],[-11,-27]],pal.shadow,'#c7ab78')
  line(ctx,-23,-25,-17,-17,pal.accent,2)
}
function helmet(ctx, role, pal, back) {
  if(role==='farmer'){
    oval(ctx,0,-58,24,6,'#a97b43','#78532e')
    oval(ctx,0,-62,17,6,'#ecd07e','#ba8e4e')
    oval(ctx,0,-65,13,3.5,'#f6e7a3')
    line(ctx,-14,-59,14,-59,'#79572b',1.4)
    return
  }
  if(role==='archer'){
    polygon(ctx,[[-17,-48],[-17,-64],[0,-75],[17,-64],[17,-48]],pal.shadow,'#28313e')
    oval(ctx,0,-69,8,2.8,pal.cloth)
    line(ctx,-15,-56,15,-56,pal.accent,1.8)
    return
  }
  if(role==='scout'){
    polygon(ctx,[[-14,-59],[-11,-69],[4,-70],[16,-60],[12,-56],[-13,-56]],'#6c5347','#342e30')
    return
  }
  if(role==='brute'){
    oval(ctx,0,-62,19,9,'#505064','#272b3a')
    polygon(ctx,[[-15,-64],[-27,-74],[-17,-59]],'#e0c6a0','#493f44')
    polygon(ctx,[[15,-64],[27,-74],[17,-59]],'#e0c6a0','#493f44')
    return
  }
  oval(ctx,0,-61,18,8,'#596078','#33384b')
  polygon(ctx,[[-14,-62],[-10,-74],[-5,-67]],'#c3d0d5','#586270')
  polygon(ctx,[[14,-62],[10,-74],[5,-67]],'#c3d0d5','#586270')
  if(role==='guard')line(ctx,-14,-59,14,-59,pal.accent,2)
}

export class ChibiSpriteRenderer {
  constructor({ outline = true, detailed = true } = {}) {
    this.outline = Boolean(outline)
    this.detailed = Boolean(detailed)
  }
  paint(ctx, unit, frame = {}) {
    if(!ctx || !unit) return
    const role=roleOf(unit)
    const pal=palettes[unit.team] || palettes.blue
    const back=(frame.facing || unit.facing)==='up'
    const left=(frame.facing || unit.facing)==='left'
    const side=(frame.facing || unit.facing)==='left'||(frame.facing || unit.facing)==='right'
    const step=Number.isFinite(frame.stride)?frame.stride:0
    const swing=Number.isFinite(frame.swing)?frame.swing:0
    const bob=Number.isFinite(frame.bob)?frame.bob:0
    const size=role==='brute'?1.18:role==='scout'?.95:1
    ctx.save();ctx.scale(size,size);ctx.translate(0,-bob)
    if(left)ctx.scale(-1,1)

    // Layered boots and feet, sturdy silhouette for low zoom levels.
    line(ctx,-6,-19,-6+step*5,-4,'#473834',6)
    line(ctx,6,-19,6-step*5,-4,'#3a3333',6)
    oval(ctx,-7+step*5,-2,6,3.4,'#242b32')
    oval(ctx,7-step*5,-2,6,3.4,'#252a32')
    line(ctx,-9,-21,9,-21,'#66584d',2)

    // Rear hand and shoulder; broad tunic retains readable team silhouette.
    line(ctx,-10,-36,-18-step*2,-19,pal.shadow,7)
    oval(ctx,-18-step*2,-18,3.9,4.5,'#edb481','#724d46')
    polygon(ctx,[[-11,-39],[9,-39],[13,-19],[0,-12],[-13,-19]],pal.shadow,this.outline?dark:null)
    polygon(ctx,[[-9,-37],[3,-37],[4,-20],[-10,-20]],pal.cloth)
    polygon(ctx,[[-4,-36],[0,-36],[-1,-21],[-5,-20]],'#ffffff18')
    line(ctx,-10,-20,11,-20,pal.accent,3)
    rounded(ctx,-3,-23,6,6,2,'#e3cd95','#77583e')
    if(role==='archer'){
      line(ctx,-8,-37,8,-17,'#be955a',3)
      for(let i=0;i<3;i++)line(ctx,-13+i*3,-31,-13+i*3,-47,'#d2d6c1',1.5)
    }
    if(role==='farmer' && Number(unit.carry)>0){
      oval(ctx,-16,-25,10,10,'#d8bc75','#947648')
      line(ctx,-20,-28,-13,-28,'#a78b54',2)
    }
    if(role==='brute')rounded(ctx,-12,-37,24,10,4,'#666174','#292e36')
    if(role==='guard')rounded(ctx,-8,-34,16,9,4,'#a7b9b8','#395f70')

    shield(ctx,role,pal)
    line(ctx,10,-34,16+swing*2,-21-swing*5,pal.cloth,7)
    oval(ctx,16+swing*2,-19-swing*5,4,4,'#e8ad7d','#80573c')
    if(role==='archer')bow(ctx,swing)
    else if(role==='farmer')sickle(ctx,swing)
    else sword(ctx,swing,role==='guard')

    // Manga-style oversized head with skin highlights and expressive eyes.
    oval(ctx,0,-49,17,17,'#a96b56',this.outline?'#53403d':null)
    oval(ctx,-1.2,-51,15,15,'#f0bc8b')
    if(back){
      oval(ctx,0,-49,12,10,pal.hair)
    } else {
      if(this.detailed){
        oval(ctx,-11,-46,3.2,1.9,'#e9978b')
        oval(ctx,10,-46,3.2,1.9,'#e9978b')
      }
      const eyeShift=side?2:0
      oval(ctx,-6+eyeShift,-50,2.5,4.2,'#fff9e9')
      oval(ctx,6+eyeShift,-50,2.5,4.2,'#fff9e9')
      oval(ctx,-5.5+eyeShift,-49.5,1.5,3.4,'#273a4c')
      oval(ctx,6.5+eyeShift,-49.5,1.5,3.4,'#273a4c')
      oval(ctx,-6+eyeShift,-51.4,.7,1.05,'#ffffff')
      oval(ctx,6+eyeShift,-51.4,.7,1.05,'#ffffff')
      line(ctx,-10+eyeShift,-57,-3+eyeShift,-58,pal.hair,1.8)
      line(ctx,2+eyeShift,-58,10+eyeShift,-57,pal.hair,1.8)
      ctx.beginPath();ctx.arc(0,-43.2,2.5,.1,Math.PI-.1)
      ctx.strokeStyle='#945a52';ctx.lineWidth=1.2;ctx.stroke()
    }
    helmet(ctx,role,pal,back)
    if(Number.isFinite(frame.flash) && frame.flash>0){
      ctx.globalAlpha=Math.min(.6,frame.flash*.65)
      oval(ctx,0,-41,17,34,'#fffbe3')
    }
    ctx.restore()
  }
}
export default ChibiSpriteRenderer
