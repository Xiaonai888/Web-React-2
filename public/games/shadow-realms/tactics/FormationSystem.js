/**
 * Shadow Realms — safe tactical formations (Step 43).
 *
 * Single-file replacement for the existing FormationSystem. Keeps the public
 * FORMATIONS constant, constructor, plan() and move() API used by SquadSystem.
 * Positions respect BOTH unit radii, adapt to trees / map borders, and remain
 * deterministic. Direct move() preflights every route and rolls back a failed
 * commit; the existing SquadSystem also performs its own preflight.
 *
 * Only called by explicit player orders. No game-loop work, DOM or network.
 */
const finite = Number.isFinite;
const point = p => finite(p?.x) && finite(p?.y);
const dist = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
const clamp = (n,lo,hi) => Math.max(lo,Math.min(hi,n));
const safe = (value,fallback,lo,hi) => clamp(finite(value)?value:fallback,lo,hi);
const radiusOf = unit => safe(unit?.radius,14,6,35);
const good = unit => unit?.id != null && unit.team === 'blue' &&
  unit.alive !== false && finite(unit.hp) && unit.hp > 0 && point(unit);
export const FORMATIONS = Object.freeze(['line','column','wedge','box']);

export class FormationSystem {
  constructor({map,navigation=null,spacing=42,maxSearchRadius=130}={}) {
    if(typeof map?.isWalkable !== 'function')
      throw new TypeError('FormationSystem needs WorldMap');
    this.map = map;
    this.navigation = navigation;
    this.spacing = safe(spacing,42,24,100);
    this.maxSearchRadius = safe(maxSearchRadius,130,20,350);
  }

  /** Local frame: x is across the direction of travel; y is behind. */
  #offsets(count,shape,spacing) {
    const offsets=[];
    if(shape==='column') {
      for(let i=0;i<count;i++) offsets.push({x:0,y:i*spacing});
    }else if(shape==='wedge') {
      offsets.push({x:0,y:0});
      for(let row=1;offsets.length<count;row++) {
        offsets.push({x:-row*spacing*.7,y:row*spacing});
        if(offsets.length<count) offsets.push({x:row*spacing*.7,y:row*spacing});
      }
    }else if(shape==='box') {
      const columns=Math.ceil(Math.sqrt(count));
      for(let i=0;i<count;i++) {
        const column=i%columns,row=Math.floor(i/columns);
        const width=Math.min(columns,count-row*columns);
        offsets.push({x:(column-(width-1)/2)*spacing,y:row*spacing});
      }
    }else {
      for(let i=0;i<count;i++) offsets.push({x:(i-(count-1)/2)*spacing,y:0});
    }
    return offsets;
  }

  /** Candidate points must be terrain-clear and separated by BOTH radii. */
  #freeNear(wanted,unitRadius,reserved,spacing) {
    const clearance=Math.max(3,spacing*.08);
    const free = candidate => this.map.isWalkable(candidate.x,candidate.y,unitRadius) &&
      reserved.every(previous =>
        dist(candidate,previous.point) >= unitRadius+previous.radius+clearance);
    if(free(wanted)) return {point:wanted,deviation:0};

    // Bounded search: prefer the closest open location around an obstructed slot.
    // The half-step plus inner ring works better by rivers and dense trees.
    const increment=Math.max(8,Math.min(spacing*.42,unitRadius+9));
    for(let ring=increment;ring<=this.maxSearchRadius+0.001;ring+=increment) {
      const steps=Math.max(12,Math.min(48,Math.ceil(Math.PI*2*ring/Math.max(9,unitRadius))));
      for(let i=0;i<steps;i++) {
        const angle=2*Math.PI*i/steps;
        const candidate={x:wanted.x+Math.cos(angle)*ring,
          y:wanted.y+Math.sin(angle)*ring};
        if(free(candidate)) return {point:candidate,deviation:ring};
      }
    }
    return null;
  }

  #layout(units,destination,shape,spacing,angle) {
    const forward={x:Math.cos(angle),y:Math.sin(angle)};
    const side={x:-forward.y,y:forward.x};
    const offsets=this.#offsets(units.length,shape,spacing);
    const reserved=[],assignments=[],skipped=[];
    let deviation=0;
    for(let i=0;i<units.length;i++) {
      const unit=units[i],offset=offsets[i],radius=radiusOf(unit);
      const proposed={x:destination.x+side.x*offset.x-forward.x*offset.y,
        y:destination.y+side.y*offset.x-forward.y*offset.y};
      const chosen=this.#freeNear(proposed,radius,reserved,spacing);
      if(!chosen) {
        skipped.push({unitId:unit.id,reason:'blocked'});
        continue;
      }
      reserved.push({point:chosen.point,radius});
      assignments.push({unitId:unit.id,unit,point:chosen.point});
      deviation+=chosen.deviation;
    }
    return {assignments,skipped,deviation,angle};
  }

  /**
   * Compute destinations without issuing movement, cancelling jobs or orders.
   * When a map edge / obstacle prevents the default orientation, rotate the
   * formation as a unit rather than returning a fragmented squad immediately.
   * Explicit `facing` is respected and never silently rotated.
   */
  plan(units,destination,{shape='line',spacing=this.spacing,facing=null}={}) {
    if(!Array.isArray(units)||!point(destination)||!FORMATIONS.includes(shape)||
       !this.map.isWalkable(destination.x,destination.y,0))
      return {ok:false,reason:'invalid_input',assignments:[],skipped:[]};
    const seen=new Set();
    const chosen=units.filter(unit=>{
      if(!good(unit)||seen.has(unit.id))return false;
      seen.add(unit.id);return true;
    });
    if(!chosen.length)
      return {ok:false,reason:'no_units',assignments:[],skipped:[]};

    const spacingValue=safe(spacing,this.spacing,24,100);
    const center={x:chosen.reduce((n,u)=>n+u.x,0)/chosen.length,
      y:chosen.reduce((n,u)=>n+u.y,0)/chosen.length};
    const original=finite(facing)?facing:
      Math.atan2(destination.y-center.y,destination.x-center.x);
    const turns=finite(facing)?[0]:[0,Math.PI/4,-Math.PI/4,Math.PI/2,-Math.PI/2,Math.PI];
    let best=null;
    for(const turn of turns) {
      const proposal=this.#layout(chosen,destination,shape,spacingValue,original+turn);
      const better=!best || proposal.assignments.length>best.assignments.length ||
        (proposal.assignments.length===best.assignments.length &&
          proposal.deviation+Math.abs(turn)*spacingValue*.15 < best.deviation+
          Math.abs(best.angle-original)*spacingValue*.15-1e-7);
      if(better)best=proposal;
      // A completely clear formation needs no alternative orientations.
      if(turn===0 && best.skipped.length===0 && best.deviation===0)break;
    }
    return {ok:best.assignments.length>0,shape,
      assignments:best.assignments,skipped:best.skipped,
      ...(best.assignments.length?{}:{reason:'blocked'})};
  }

  /** Snapshot only fields touched by Farmer.setPath / Pathfinding.moveUnit. */
  #snapshot(unit) {
    return {unit,state:unit.state,
      path:Array.isArray(unit.path)?unit.path.map(p=>({...p})):unit.path,
      destination:point(unit.destination)?{...unit.destination}:unit.destination,
      blockedSeconds:unit.blockedSeconds};
  }
  #restore(snapshot) {
    const {unit}=snapshot;
    unit.state=snapshot.state;
    unit.path=snapshot.path;
    unit.destination=snapshot.destination;
    unit.blockedSeconds=snapshot.blockedSeconds;
  }

  /**
   * Direct navigation remains atomic when real Pathfinding.findPath() exists:
   * validate ALL routes first, THEN set every path. On failure restore each
   * unit's previous movement state. SquadSystem continues to own job release.
   */
  move(units,destination,options={}) {
    const plan=this.plan(units,destination,options);
    if(!plan.ok) return {...plan,moved:0};
    if(plan.skipped.length) return {...plan,ok:false,reason:'no_route',moved:0,
      requested:plan.assignments.length};
    if(typeof this.navigation?.moveUnit !== 'function')
      return {...plan,ok:false,reason:'navigation_unavailable',moved:0};

    const canPreflight=typeof this.navigation.findPath==='function' &&
      plan.assignments.every(a=>typeof a.unit.setPath==='function');
    const routes=[];
    if(canPreflight) {
      for(const assignment of plan.assignments) {
        let route=[];
        try {route=this.navigation.findPath(assignment.unit,assignment.point,
          {radius:radiusOf(assignment.unit)});}catch{/* Unreachable or invalid grid. */}
        if(!Array.isArray(route)||!route.length)
          return {...plan,ok:false,reason:'no_route',moved:0,
            requested:plan.assignments.length,
            skipped:[...plan.skipped,{unitId:assignment.unitId,reason:'no_route'}]};
        routes.push(route);
      }
    }

    const previous=plan.assignments.map(a=>this.#snapshot(a.unit));
    for(let i=0;i<plan.assignments.length;i++) {
      const entry=plan.assignments[i];
      let success=false;
      try {success=canPreflight ? entry.unit.setPath(routes[i])===true :
        this.navigation.moveUnit(entry.unit,entry.point)===true;}
      catch{/* Restore all paths on any unexpected navigation failure. */}
      if(!success) {
        for(const original of previous)this.#restore(original);
        return {...plan,ok:false,reason:'no_route',moved:0,
          requested:plan.assignments.length,
          skipped:[...plan.skipped,{unitId:entry.unitId,reason:'no_route'}]};
      }
    }
    return {...plan,ok:true,moved:plan.assignments.length,
      requested:plan.assignments.length};
  }
}
export default FormationSystem;
