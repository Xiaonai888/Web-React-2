/**
 * Shadow Realms — Step 43: enemy targeting, purely observational.
 * Only ranks existing live BLUE units; never moves/spawns them or touches DOM.
 * API: players(), score(enemy,player), choose(enemy,preferredId), ranked(enemy,limit).
 */
const finite = Number.isFinite;
const pos = p => finite(p?.x) && finite(p?.y);
const living = u => u?.id != null && u.team === 'blue' && u.alive !== false &&
  u.trainingInside !== true && u.trainingState !== 'training' &&
  finite(u.hp) && u.hp > 0 && pos(u);
const dist = (a,b) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
const safe = (n,fallback) => finite(n) ? n : fallback;

export class ThreatAnalyzer {
  constructor({getPlayers = () => [],home = null,maxDistance = 3500} = {}) {
    this.getPlayers = typeof getPlayers === 'function' ? getPlayers : () => getPlayers;
    this.home = pos(home) ? {x:home.x,y:home.y} : null;
    this.maxDistance = clamp(safe(maxDistance,3500),150,20000);
  }

  players() {
    const roster = this.getPlayers() || [];
    if (!Array.isArray(roster)) return [];
    const ids = new Set();
    return roster.filter(u => {
      if (!living(u) || ids.has(u.id)) return false;
      ids.add(u.id);
      return true;
    });
  }

  score(enemy,player) {
    if (!pos(enemy) || !living(player) || enemy.id === player.id) return -Infinity;
    const distance = dist(enemy,player);
    if (distance > this.maxDistance) return -Infinity;
    const maxHp = Math.max(1,safe(player.maxHp,player.hp));
    const weakness = 1 - clamp(player.hp / maxHp,0,1);
    const damage = clamp(safe(player.attackDamage,0),0,80);
    const ranged = player.attackType === 'ranged' ? 30 : 0;
    const nearBase = this.home && dist(player,this.home) <= 260 ? 35 : 0;
    // Distance still dominates: weak archers and base defenders earn priority.
    return 600 - distance * .45 + weakness * 110 + damage * .65 + ranged + nearBase;
  }

  choose(enemy,preferredId = null) {
    let best = -Infinity, chosen = null;
    for (const player of this.players()) {
      const raw = this.score(enemy,player);
      if (!finite(raw)) continue; // Never choose an unreachable/out-of-range target.
      const value = raw + (preferredId != null && player.id === preferredId ? 100 : 0);
      if (value > best || (value === best && chosen && String(player.id) < String(chosen.id))) {
        best = value;
        chosen = player;
      }
    }
    return chosen;
  }

  ranked(enemy,limit = 5) {
    const max = clamp(Math.floor(safe(limit,5)),1,100);
    return this.players().map(unit => ({unit,score:this.score(enemy,unit)}))
      .filter(entry => finite(entry.score))
      .sort((a,b) => b.score - a.score || String(a.unit.id).localeCompare(String(b.unit.id)))
      .slice(0,max);
  }
}
export default ThreatAnalyzer;
