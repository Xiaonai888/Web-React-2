/**
 * Shadow Realms — lightweight minimap drawn on the existing game Canvas.
 * No extra DOM, Canvas, libraries, network calls, or second input listener.
 */
const clamp = (n,a,b) => Math.min(b,Math.max(a,n));
export class MiniMap {
  constructor(map, {fog = null, zones = null, getUnits = () => [],
    width = 168, height = 118, y = 170, margin = 10, enabled = true} = {}) {
    if(!map || !Number.isFinite(map.width) || !Number.isFinite(map.height)) throw new TypeError('MiniMap needs WorldMap');
    this.map=map;this.fog=fog;this.zones=zones;
    this.getUnits=typeof getUnits==='function'?getUnits:()=>getUnits;
    this.width=clamp(width,100,300);this.height=clamp(height,75,220);
    this.y=Math.max(0,y);this.margin=Math.max(0,margin);this.enabled=!!enabled;
    this.bounds={x:0,y:0,width:this.width,height:this.height};
  }
  #layout(camera) {
    const size = camera.viewportWidth < 500 ? .73 : camera.viewportWidth < 700 ? .85 : 1;
    const width = Math.min(this.width*size,Math.max(95,camera.viewportWidth-22));
    const height = this.height*size;
    const x = camera.viewportWidth-width-this.margin;
    const y = clamp(this.y,camera.viewportHeight>height+18?4:0,Math.max(4,camera.viewportHeight-height-12));
    this.bounds={x,y,width,height};return this.bounds;
  }
  hitTest(screen,camera) {
    if(!this.enabled || !screen || !camera) return null;
    const r=this.#layout(camera);
    if(screen.x<r.x||screen.y<r.y||screen.x>r.x+r.width||screen.y>r.y+r.height)return null;
    return {x:clamp((screen.x-r.x)/r.width,0,1)*this.map.width,
      y:clamp((screen.y-r.y)/r.height,0,1)*this.map.height};
  }
  onPointer(event,camera) {
    if (!['tap','select'].includes(event?.kind)) return false;
    const p=this.hitTest(event.screen,camera);
    if (!p)return false;
    camera.centerOn(p.x,p.y);
    return true;
  }
  draw(ctx,camera) {
    if(!this.enabled||!ctx||!camera)return;
    const r=this.#layout(camera),mx=x=>r.x+x/this.map.width*r.width,my=y=>r.y+y/this.map.height*r.height;
    ctx.save();
    ctx.fillStyle='rgba(17,35,23,.94)';ctx.strokeStyle='#d8c08b';ctx.lineWidth=1.4;
    ctx.beginPath();ctx.roundRect(r.x-3,r.y-3,r.width+6,r.height+6,8);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.rect(r.x,r.y,r.width,r.height);ctx.clip();
    ctx.fillStyle='#65804b';ctx.fillRect(r.x,r.y,r.width,r.height);
    ctx.strokeStyle='#568fa4';ctx.lineWidth=Math.max(4,r.width*.07);
    ctx.beginPath();for(let i=0;i<=24;i++){const y=i*this.map.height/24,x=this.map.riverX(y);if(i===0)ctx.moveTo(mx(x),my(y));else ctx.lineTo(mx(x),my(y));}ctx.stroke();
    ctx.fillStyle='#bba47f';
    for(const b of this.map.bridges||[])ctx.fillRect(mx(b.x-b.halfWidth),my(b.y-b.halfHeight),2*b.halfWidth/this.map.width*r.width,2*b.halfHeight/this.map.height*r.height);
    ctx.fillStyle='#3c5c3e';
    for(const t of this.map.trees||[])ctx.fillRect(mx(t.x)-.7,my(t.y)-.7,1.4,1.4);
    for(const z of this.zones?.zones||[])if(z.discovered){ctx.fillStyle='#f3d67c';ctx.fillRect(mx(z.x)-1.6,my(z.y)-1.6,3.2,3.2);}
    if(this.fog?.enabled){
      const fog=this.fog, fw=r.width/fog.columns,fh=r.height/fog.rows;
      for(let row=0;row<fog.rows;row++)for(let col=0;col<fog.columns;col++){
        const index=row*fog.columns+col;
        if(fog.visible[index])continue;
        ctx.fillStyle=fog.visited[index]?'rgba(10,20,14,.42)':'rgba(6,14,9,.88)';
        ctx.fillRect(r.x+col*fw,r.y+row*fh,fw+.5,fh+.5);
      }
    }
    for(const u of this.getUnits()||[]){
      if(u?.alive===false||!Number.isFinite(u?.x)||!Number.isFinite(u?.y))continue;
      if(u.team!=='blue'&&!this.fog?.isVisible(u.x,u.y))continue;
      ctx.fillStyle=u.team==='blue'?'#85d7ff':'#f98b83';
      ctx.beginPath();ctx.arc(mx(u.x),my(u.y),u.team==='blue'?2.8:2.2,0,Math.PI*2);ctx.fill();
    }
    const view=camera.getVisibleBounds();
    ctx.strokeStyle='#fff7cf';ctx.lineWidth=1.1;ctx.strokeRect(mx(view.left),my(view.top),
      (view.right-view.left)/this.map.width*r.width,(view.bottom-view.top)/this.map.height*r.height);
    ctx.restore();
  }
  setEnabled(flag){this.enabled=!!flag;}
  destroy(){this.getUnits=()=>[];this.fog=null;this.zones=null;}
}
export default MiniMap;
