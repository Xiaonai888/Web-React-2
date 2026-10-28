/** Shadow Realms — research purchases spend the EXISTING rice/wood balances. */
import {RESEARCH_RULES,researchCost,aggregateResearchBonuses} from './ProgressionRules.js';

export class ResearchSystem {
  constructor({rice,construction,onEvent=null}={}) {
    if(typeof rice?.getResources!=='function'||typeof rice?.setStorageRice!=='function'||
       typeof construction?.getResources!=='function'||typeof construction?.setWood!=='function') {
      throw new TypeError('ResearchSystem requires existing RiceSystem and ConstructionSystem');
    }
    this.rice=rice;this.construction=construction;
    this.onEvent=typeof onEvent==='function'?onEvent:null;
    this.ranks=Object.fromEntries(Object.keys(RESEARCH_RULES).map(k=>[k,0]));
    this.version=0;
  }
  getRank(id){return this.ranks[id]??null;}
  getResources(){const a=this.rice.getResources(),b=this.construction.getResources();return {rice:a.rice,wood:b.wood};}
  getCost(id){const current=this.getRank(id);return current==null?null:researchCost(id,current+1);}
  canPurchase(id){
    const cost=this.getCost(id),balance=this.getResources();
    return Boolean(cost && Number.isFinite(balance.rice)&&Number.isFinite(balance.wood)&&
      balance.rice>=cost.rice&&balance.wood>=cost.wood);
  }
  purchase(id){
    if(!Object.hasOwn(RESEARCH_RULES,id))return {ok:false,reason:'unknown_research'};
    const cost=this.getCost(id);
    if(!cost)return {ok:false,reason:'max_rank'};
    if(!this.canPurchase(id))return {ok:false,reason:'insufficient_resources',cost};
    const before=this.getResources();
    if(this.rice.setStorageRice(before.rice-cost.rice)!==true)return {ok:false,reason:'rice_payment_failed'};
    try{
      if(this.construction.setWood(before.wood-cost.wood)!==true){
        this.rice.setStorageRice(before.rice);
        return {ok:false,reason:'wood_payment_failed'};
      }
    }catch(error){
      this.rice.setStorageRice(before.rice);
      return {ok:false,reason:'wood_payment_failed',error};
    }
    const rank=++this.ranks[id];this.version++;
    const result={ok:true,id,rank,cost:{...cost},bonuses:this.getBonuses()};
    try{this.onEvent?.('purchased',result);}catch{/* External UI must not double-spend or undo successful research. */}
    return result;
  }
  getBonuses(){return aggregateResearchBonuses(this.ranks);}
  getSummary(){return {version:this.version,ranks:{...this.ranks},bonuses:this.getBonuses(),
    available:Object.keys(RESEARCH_RULES).filter(id=>this.canPurchase(id)),resources:this.getResources()};}
  reset(){for(const id of Object.keys(this.ranks))this.ranks[id]=0;this.version++;}
}
export default ResearchSystem;
