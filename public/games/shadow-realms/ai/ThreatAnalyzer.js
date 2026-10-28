/** Shadow Realms: score existing blue units; never changes state or creates units. */
const valid = p => Number.isFinite(p?.x) && Number.isFinite(p?.y);
const living = u => u?.team === 'blue' && u.alive !== false && u.hp > 0 && valid(u);
const distance = (a,b) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (n,a,b) => Math.max(a, Math.min(b,n));

export class ThreatAnalyzer {
  constructor({getPlayers = () => [], home = null, maxDistance = 3500} = {}) {
    this.getPlayers = typeof getPlayers === 'function' ? getPlayers : () => getPlayers;
    this.home = valid(home) ? {...home} : null;
    this.maxDistance = clamp(Number(maxDistance) || 3500, 150, 20000);
  }
  players() {
    const list = this.getPlayers();
    return Array.isArray(list) ? list.filter(living) : [];
  }
  score(enemy, player) {
    if (!valid(enemy) || !living(player)) return -Infinity;
    const d = distance(enemy, player);
    if (d > this.maxDistance) return -Infinity;
    const max = Math.max(1, Number(player.maxHp) || Number(player.hp) || 100);
    const weakness = 1 - clamp(player.hp / max, 0, 1);
    const damage = clamp(Number(player.attackDamage) || 0, 0, 80);
    const closeToBase = this.home && distance(player,this.home) < 260 ? 35 : 0;
    const ranged = player.attackType === 'ranged' ? 30 : 0;
    // Distance matters most, but fragile ranged targets remain attractive.
    return 600 - d * .45 + weakness * 110 + damage * .65 + ranged + closeToBase;
  }
  choose(enemy, preferredId = null) {
    const players = this.players();
    let selected = null, best = -Infinity;
    for (const player of players) {
      const preference = preferredId != null && player.id === preferredId ? 100 : 0;
      const score = this.score(enemy, player) + preference;
      if (score > best) { best = score; selected = player; }
    }
    return selected;
  }
  ranked(enemy, limit = 5) {
    return this.players().map(unit => ({unit, score:this.score(enemy,unit)}))
      .filter(x => Number.isFinite(x.score)).sort((a,b)=>b.score-a.score)
      .slice(0,clamp(Math.floor(limit)||5,1,100));
  }
}
export default ThreatAnalyzer;
