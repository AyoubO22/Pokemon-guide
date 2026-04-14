import { useState, useEffect, useCallback, useMemo } from 'react'
import { TYPE_COLORS, TYPES } from '../data/types'
import { TOP_POKEMON } from '../data/pokemon'
import {
  fetchMoveList, fetchMove, capitalize, mapTypeName, mapDamageClass, getDamageClassColor,
  mapTarget, mapAilment, getMoveFrenchFlavor, getMoveEnglishEffect,
  type MoveData, type MoveListEntry
} from '../data/pokeapi'

// ── Competitive analysis helpers ────────────────────────────────────────────

function calcScore(m: MoveData): number {
  let score = 5;
  const isStatus = m.damage_class.name === "status";
  const pwr = m.power ?? 0;
  const acc = m.accuracy;

  // Power
  if (!isStatus) {
    if (pwr >= 120) score += 2;
    else if (pwr >= 100) score += 1.5;
    else if (pwr >= 80) score += 1;
    else if (pwr >= 60) score += 0.5;
    else if (pwr > 0 && pwr < 40) score -= 1;
  }

  // Accuracy
  if (acc === null && !isStatus) score += 1.5; // never misses
  else if (acc !== null) {
    if (acc === 100) score += 1;
    else if (acc >= 95) score += 0.5;
    else if (acc < 80) score -= 1;
    else if (acc < 70) score -= 2;
  }

  // Status moves: guaranteed ailment or guaranteed stat boost = high value
  if (isStatus && acc === 100) score += 1;
  if (isStatus && acc !== null && acc >= 85) score += 0.5;

  // Priority
  if (m.priority > 0) score += 1;
  if (m.priority < -1) score -= 0.5;

  // Drain / recoil
  if (m.meta?.drain && m.meta.drain > 0) score += 0.5;
  if (m.meta?.drain && m.meta.drain < 0) score -= 0.5;

  // Effects
  if ((m.meta?.flinch_chance ?? 0) >= 20) score += 0.3;
  if ((m.meta?.crit_rate ?? 0) > 0) score += 0.4;
  if (m.meta?.min_hits && m.meta?.max_hits) score += 0.3;

  // Spread (useful in doubles but 25% reduction)
  const isSpread = m.target.name === "all-other-pokemon" || m.target.name === "all-opponents";
  if (isSpread && pwr >= 80) score += 0.3;

  // PP penalty
  if (m.pp <= 5) score -= 0.5;

  // Guaranteed stat drop/raise on opponents = value
  if (m.meta?.stat_chance === 0 && m.stat_changes.length > 0) {
    const selfBuff = m.stat_changes.some(sc => sc.change > 0);
    score += selfBuff ? 0.5 : 0.3;
  }

  return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
}

function getScoreLabel(s: number): { label: string; color: string } {
  if (s >= 8.5) return { label: "S — Tier compétitif", color: "text-yellow-400" };
  if (s >= 7) return { label: "A — Très bon", color: "text-green-400" };
  if (s >= 5.5) return { label: "B — Solide", color: "text-blue-400" };
  if (s >= 4) return { label: "C — Situationnel", color: "text-zinc-400" };
  return { label: "D — Niche / Faible", color: "text-red-400" };
}

function getUsage(m: MoveData): { label: string; color: string } {
  const isStatus = m.damage_class.name === "status";
  const pwr = m.power ?? 0;
  const isSpread = m.target.name === "all-other-pokemon" || m.target.name === "all-opponents";
  const isSelfBoost = isStatus && m.stat_changes.some(sc => sc.change > 0);
  const isHeal = (m.meta?.healing ?? 0) > 0 && isStatus;
  const isAilment = m.meta?.ailment.name !== "none";
  const isDrain = (m.meta?.drain ?? 0) > 0;

  if (isSelfBoost) return { label: "Setup", color: "bg-purple-900/40 text-purple-300" };
  if (isHeal) return { label: "Soin / Recovery", color: "bg-green-900/40 text-green-300" };
  if (isStatus && isAilment) return { label: "Contrôle / Support", color: "bg-yellow-900/40 text-yellow-300" };
  if (isStatus) return { label: "Utilitaire", color: "bg-zinc-700 text-zinc-300" };
  if (m.priority > 0 && pwr <= 70) return { label: "Revenge Killing", color: "bg-red-900/40 text-red-300" };
  if (pwr >= 120) return { label: "Wallbreaker", color: "bg-orange-900/40 text-orange-300" };
  if (isDrain) return { label: "Sustain Offensif", color: "bg-teal-900/40 text-teal-300" };
  if (isSpread) return { label: "Doubles Offensif", color: "bg-blue-900/40 text-blue-300" };
  if (pwr >= 80) return { label: "Attaque Standard", color: "bg-zinc-700 text-zinc-300" };
  return { label: "Chip / Pression", color: "bg-zinc-700 text-zinc-300" };
}

function getFormat(m: MoveData): { label: string; color: string } {
  const isSpread = m.target.name === "all-other-pokemon" || m.target.name === "all-opponents";
  const isStatus = m.damage_class.name === "status";
  if (isSpread) return { label: "Doubles / VGC", color: "bg-purple-900/40 text-purple-300" };
  if (isStatus && m.priority > 0) return { label: "Singles+", color: "bg-blue-900/40 text-blue-300" };
  if (m.target.name === "user") return { label: "Les deux", color: "bg-zinc-700 text-zinc-300" };
  return { label: "Les deux", color: "bg-zinc-700 text-zinc-300" };
}

function getStrengths(m: MoveData): string[] {
  const out: string[] = [];
  const pwr = m.power ?? 0;
  const isStatus = m.damage_class.name === "status";
  const isSpread = m.target.name === "all-other-pokemon" || m.target.name === "all-opponents";

  if (m.accuracy === null && !isStatus) out.push("Précision parfaite — ne rate jamais");
  if (m.accuracy === 100) out.push("100% précision — fiable en toute circonstance");
  if (pwr >= 120) out.push(`Puissance ${pwr} — capable d'OHKO des cibles neutres avec STAB`);
  else if (pwr >= 90) out.push(`Bonne puissance (${pwr}) — 2HKO fiable sur la plupart des targets`);
  if (m.priority > 0) out.push(`Priorité +${m.priority} — frappe avant les moves normaux, crucial contre les sweepers`);
  if ((m.meta?.drain ?? 0) > 0) out.push(`Drain ${m.meta!.drain}% — sustain offensif sans item requis`);
  if ((m.meta?.flinch_chance ?? 0) >= 30) out.push(`Flinch ${m.meta!.flinch_chance}% — combo puissant avec Serene Grace`);
  if ((m.meta?.crit_rate ?? 0) > 0) out.push("Taux critique élevé — ignore les boosts défensifs adverses");
  if (m.meta?.min_hits) out.push(`Multi-hit (${m.meta.min_hits}-${m.meta.max_hits} coups) — perce les Subs, accumule les dégâts`);
  if (isSpread) out.push("Spread move — cible tous les adversaires en Doubles, pression maximale");
  if (isStatus && m.accuracy === 100) out.push("Statut garanti à 100% précision — impossible à esquiver (hors immunité)");
  if (m.pp >= 24) out.push(`PP élevés (${m.pp}) — peut être utilisé tout au long du match`);
  if (m.stat_changes.some(sc => sc.change >= 2)) out.push("Boost de +2 ou plus — setup ultra-efficace, menace immédiate");
  return out;
}

function getWeaknesses(m: MoveData): string[] {
  const out: string[] = [];
  const pwr = m.power ?? 0;
  const isStatus = m.damage_class.name === "status";
  const isSpread = m.target.name === "all-other-pokemon" || m.target.name === "all-opponents";

  if (m.accuracy !== null && m.accuracy < 80) out.push(`Précision basse (${m.accuracy}%) — un miss en situation critique peut coûter le match`);
  if (m.pp <= 5) out.push(`PP très limités (${m.pp}) — vulnérable au PP stall (Pressure, Spite)`);
  if ((m.meta?.drain ?? 0) < 0) out.push(`Recul de ${Math.abs(m.meta!.drain)}% — affaiblit avec Life Orb ou hazards`);
  if (isSpread && pwr > 0) out.push("Puissance réduite de 25% en Doubles sur les spread moves");
  if (isStatus) out.push("Bloqué par Taunt — inutilisable contre les leads agressifs");
  if (m.priority < -1) out.push(`Priorité ${m.priority} — agit en tout dernier, dangereux si la cible est KO avant`);
  if (pwr > 0 && pwr < 50 && m.priority === 0) out.push(`Puissance faible (${pwr}) — rarement suffisant sans boosts ou STAB cumulés`);
  if (m.target.name === "random-opponent") out.push("Cible aléatoire — non-contrôlable en Doubles/VGC");
  if (m.meta?.ailment.name === "sleep" && !isStatus) out.push("Mise en sommeil : Sleep Clause limite à 1 endormi en compétitif");
  return out;
}

function getSynergies(m: MoveData): string[] {
  const out: string[] = [];
  const isStatus = m.damage_class.name === "status";
  const ailment = m.meta?.ailment.name ?? "none";

  if ((m.meta?.flinch_chance ?? 0) > 0) out.push("Serene Grace — double le taux de flinch");
  if ((m.meta?.drain ?? 0) < 0) out.push("Rock Head — supprime le recul de l'attaquant");
  if ((m.meta?.drain ?? 0) < 0) out.push("Magic Guard — immunité aux dégâts de recul");
  if (isStatus && ailment !== "none") out.push("Prankster — priorité +1 sur les moves de statut");
  if (ailment === "poison" || ailment === "toxic") out.push("Poison Heal — transforme le poison en soin pour l'utilisateur");
  if (ailment === "burn") out.push("Guts — booste l'Attaque malgré la brûlure");
  if (m.priority > 0) out.push("Pokémon rapides — maximise l'avantage de la priorité");
  if (isStatus && m.stat_changes.some(sc => sc.change > 0)) out.push("Baton Pass — transfère les boosts à un sweeper");
  if ((m.meta?.drain ?? 0) > 0) out.push("Life Orb — le drain compense le recul du LO");
  if ((m.meta?.crit_rate ?? 0) > 0) out.push("Scope Lens / Lansat Berry — crit garanti sur la prochaine attaque");
  if (ailment === "sleep") out.push("Sleep Talk — utilise le move pendant le sommeil adverse");
  if (m.target.name === "all-other-pokemon") out.push("Tailwind / Trick Room — contrôle de vitesse en Doubles pour aller en premier");

  return [...new Set(out)]; // dedupe
}

function TypeBadge({ name }: { name: string }) {
  const mapped = mapTypeName(name);
  const color = TYPE_COLORS[mapped] || '#888';
  const fr = TYPES.find(t => t.name === mapped)?.nameFr || mapped;
  return <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-white" style={{ backgroundColor: color }}>{fr}</span>;
}

export function MoveExplorerSection() {
  const [allMoves, setAllMoves] = useState<MoveListEntry[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMove, setSelectedMove] = useState("earthquake");
  const [moveData, setMoveData] = useState<MoveData | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLearners, setShowLearners] = useState(false);
  const [visibleCount, setVisibleCount] = useState(30);

  useEffect(() => {
    fetchMoveList(950).then(list => {
      setAllMoves(list);
      setListLoading(false);
    }).catch(() => setListLoading(false));
  }, []);

  const loadMove = useCallback(async (name: string) => {
    setLoading(true);
    setError("");
    setShowLearners(false);
    try {
      const data = await fetchMove(name);
      setMoveData(data);
    } catch {
      setError("Move non trouvé. Essaie en anglais (ex: earthquake, swords-dance, stealth-rock).");
      setMoveData(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedMove) loadMove(selectedMove);
  }, [selectedMove, loadMove]);

  useEffect(() => {
    setVisibleCount(30);
  }, [search]);

  const filteredList = allMoves.filter(m =>
    !search || m.name.includes(search.toLowerCase().replace(/ /g, "-"))
  );
  
  const currentVisible = filteredList.slice(0, visibleCount);

  const frFlavor = moveData ? getMoveFrenchFlavor(moveData) : "";
  const enEffect = moveData ? getMoveEnglishEffect(moveData) : "";

  const notablePokemon = useMemo(() => {
    if (!moveData) return [];
    const moveName = capitalize(moveData.name).toLowerCase();
    return TOP_POKEMON.filter(p =>
      p.keyMoves.some(m => m.toLowerCase().replace(/[^a-z]/g, "").includes(moveName.replace(/[^a-z]/g, "")))
      || p.commonSets.some(s => s.moves.some(m => m.toLowerCase().replace(/[^a-z]/g, "").includes(moveName.replace(/[^a-z]/g, ""))))
    );
  }, [moveData]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Explorateur de Moves</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
          Explore les <strong className="text-zinc-200">900+ moves</strong> du jeu via PokéAPI. Chaque move affiche son type,
          sa puissance, catégorie, priorité, effets secondaires, et quels Pokémon l'apprennent.
        </p>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-4">
        {/* Move list */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="p-2 border-b border-zinc-800">
            <input
              type="text"
              placeholder="Nom du move (anglais)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && search) setSelectedMove(search.toLowerCase().replace(/ /g, "-")); }}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm"
            />
            <p className="text-[10px] text-zinc-600 mt-1">
              {listLoading ? "Chargement..." : `${allMoves.length} moves · Entrée pour chercher`}
            </p>
          </div>
          <div className="max-h-[550px] overflow-y-auto pb-2">
            {currentVisible.map(m => (
              <button
                key={m.name}
                onClick={() => setSelectedMove(m.name)}
                className={`w-full text-left px-3 py-2 border-b border-zinc-800/30 text-sm transition-colors
                  ${selectedMove === m.name ? 'bg-zinc-800 border-l-2 border-l-red-500' : 'hover:bg-zinc-800/50'}`}
              >
                <span className="text-zinc-200">{capitalize(m.name)}</span>
              </button>
            ))}
            {visibleCount < filteredList.length && (
              <button 
                onClick={() => setVisibleCount(v => v + 30)}
                className="w-full text-center px-3 py-3 mt-1 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
              >
                Voir plus ({filteredList.length - visibleCount} restants)
              </button>
            )}
          </div>
        </div>

        {/* Move Detail */}
        <div className="space-y-4">
          {loading && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
              <div className="animate-pulse text-zinc-500">Chargement du move...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 text-sm">{error}</div>
          )}

          {!loading && moveData && (
            <>
              {/* Header */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <h3 className="text-xl font-bold text-zinc-100">{capitalize(moveData.name)}</h3>
                  <TypeBadge name={moveData.type.name} />
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${getDamageClassColor(moveData.damage_class.name)}`}>
                    {mapDamageClass(moveData.damage_class.name)}
                  </span>
                  <span className="text-xs text-zinc-500 ml-auto">#{moveData.id} · {moveData.generation.name.replace("generation-", "Gen ").toUpperCase()}</span>
                </div>

                {/* Core stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  <div className="bg-zinc-800/60 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-zinc-500 uppercase">Puissance</p>
                    <p className="text-xl font-bold text-zinc-100">{moveData.power ?? "—"}</p>
                  </div>
                  <div className="bg-zinc-800/60 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-zinc-500 uppercase">Précision</p>
                    <p className="text-xl font-bold text-zinc-100">{moveData.accuracy ? `${moveData.accuracy}%` : "—"}</p>
                  </div>
                  <div className="bg-zinc-800/60 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-zinc-500 uppercase">PP</p>
                    <p className="text-xl font-bold text-zinc-100">{moveData.pp}</p>
                  </div>
                  <div className="bg-zinc-800/60 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-zinc-500 uppercase">Priorité</p>
                    <p className={`text-xl font-bold ${moveData.priority > 0 ? 'text-green-400' : moveData.priority < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                      {moveData.priority > 0 ? `+${moveData.priority}` : moveData.priority}
                    </p>
                  </div>
                  <div className="bg-zinc-800/60 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-zinc-500 uppercase">Cible</p>
                    <p className="text-xs font-medium text-zinc-300">{mapTarget(moveData.target.name)}</p>
                  </div>
                </div>

                {/* Description */}
                {frFlavor && (
                  <div className="bg-zinc-800/30 rounded p-3 mb-3">
                    <p className="text-sm text-zinc-300 italic">{frFlavor}</p>
                  </div>
                )}
                {enEffect && (
                  <p className="text-xs text-zinc-500">{enEffect}</p>
                )}
              </div>

              {/* Secondary effects */}
              {moveData.meta && (moveData.meta.ailment.name !== "none" || moveData.meta.flinch_chance > 0 || moveData.meta.drain !== 0 || moveData.meta.healing !== 0 || moveData.meta.crit_rate > 0 || moveData.meta.stat_chance > 0 || moveData.stat_changes.length > 0) && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <h4 className="font-semibold text-zinc-200 mb-3 text-sm">Effets Secondaires</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {moveData.meta.ailment.name !== "none" && (
                      <div className="bg-zinc-800/50 rounded p-2">
                        <p className="text-[10px] text-zinc-500 uppercase">Statut</p>
                        <p className="text-sm text-zinc-200">{mapAilment(moveData.meta.ailment.name)}</p>
                        {moveData.meta.ailment_chance > 0 && <p className="text-xs text-zinc-400">{moveData.meta.ailment_chance}% de chance</p>}
                        {moveData.meta.ailment_chance === 0 && <p className="text-xs text-zinc-400">100% (garanti)</p>}
                      </div>
                    )}
                    {moveData.meta.flinch_chance > 0 && (
                      <div className="bg-zinc-800/50 rounded p-2">
                        <p className="text-[10px] text-zinc-500 uppercase">Flinch</p>
                        <p className="text-sm text-zinc-200">{moveData.meta.flinch_chance}%</p>
                        <p className="text-xs text-zinc-400">Serene Grace double ce taux</p>
                      </div>
                    )}
                    {moveData.meta.drain !== 0 && (
                      <div className="bg-zinc-800/50 rounded p-2">
                        <p className="text-[10px] text-zinc-500 uppercase">{moveData.meta.drain > 0 ? "Drain" : "Recul"}</p>
                        <p className="text-sm text-zinc-200">{Math.abs(moveData.meta.drain)}% des dégâts</p>
                      </div>
                    )}
                    {moveData.meta.healing !== 0 && (
                      <div className="bg-zinc-800/50 rounded p-2">
                        <p className="text-[10px] text-zinc-500 uppercase">Soin</p>
                        <p className="text-sm text-zinc-200">{moveData.meta.healing}% PV max</p>
                      </div>
                    )}
                    {moveData.meta.crit_rate > 0 && (
                      <div className="bg-zinc-800/50 rounded p-2">
                        <p className="text-[10px] text-zinc-500 uppercase">Taux critique</p>
                        <p className="text-sm text-zinc-200">+{moveData.meta.crit_rate} stage{moveData.meta.crit_rate > 1 ? "s" : ""}</p>
                      </div>
                    )}
                    {moveData.meta.stat_chance > 0 && moveData.stat_changes.length > 0 && (
                      <div className="bg-zinc-800/50 rounded p-2">
                        <p className="text-[10px] text-zinc-500 uppercase">Changement stats</p>
                        {moveData.stat_changes.map(sc => (
                          <p key={sc.stat.name} className="text-sm text-zinc-200">
                            {sc.change > 0 ? "+" : ""}{sc.change} {capitalize(sc.stat.name)}
                          </p>
                        ))}
                        <p className="text-xs text-zinc-400">{moveData.meta.stat_chance}% de chance</p>
                      </div>
                    )}
                    {moveData.meta.stat_chance === 0 && moveData.stat_changes.length > 0 && (
                      <div className="bg-zinc-800/50 rounded p-2">
                        <p className="text-[10px] text-zinc-500 uppercase">Stats (garanti)</p>
                        {moveData.stat_changes.map(sc => (
                          <p key={sc.stat.name} className={`text-sm ${sc.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {sc.change > 0 ? "+" : ""}{sc.change} {capitalize(sc.stat.name)}
                          </p>
                        ))}
                      </div>
                    )}
                    {moveData.meta.min_hits && moveData.meta.max_hits && (
                      <div className="bg-zinc-800/50 rounded p-2">
                        <p className="text-[10px] text-zinc-500 uppercase">Multi-hit</p>
                        <p className="text-sm text-zinc-200">{moveData.meta.min_hits}-{moveData.meta.max_hits} coups</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Competitive analysis - full */}
              {(() => {
                const score = calcScore(moveData);
                const { label: scoreLabel, color: scoreColor } = getScoreLabel(score);
                const usage = getUsage(moveData);
                const format = getFormat(moveData);
                const strengths = getStrengths(moveData);
                const weaknesses = getWeaknesses(moveData);
                const synergies = getSynergies(moveData);
                const scorePct = (score / 10) * 100;
                const barColor = score >= 8.5 ? '#facc15' : score >= 7 ? '#4ade80' : score >= 5.5 ? '#60a5fa' : score >= 4 ? '#a1a1aa' : '#f87171';

                return (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
                    <h4 className="font-semibold text-zinc-200 text-sm">Analyse Compétitive</h4>

                    {/* Score + Badges */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex-1 min-w-[140px]">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className={`text-2xl font-bold font-mono ${scoreColor}`}>{score.toFixed(1)}</span>
                          <span className="text-xs text-zinc-500">/10</span>
                          <span className={`text-xs font-medium ${scoreColor}`}>{scoreLabel}</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${scorePct}%`, backgroundColor: barColor }} />
                        </div>
                      </div>
                      <span className={`text-[11px] font-medium px-2 py-1 rounded ${usage.color}`}>{usage.label}</span>
                      <span className={`text-[11px] font-medium px-2 py-1 rounded ${format.color}`}>{format.label}</span>
                    </div>

                    {/* Strengths */}
                    {strengths.length > 0 && (
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-medium mb-1.5">Points forts</p>
                        <ul className="space-y-1">
                          {strengths.map((s, i) => (
                            <li key={i} className="text-xs text-green-400 flex gap-1.5"><span className="shrink-0 mt-0.5">+</span>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Weaknesses */}
                    {weaknesses.length > 0 && (
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-medium mb-1.5">Points faibles</p>
                        <ul className="space-y-1">
                          {weaknesses.map((w, i) => (
                            <li key={i} className="text-xs text-red-400 flex gap-1.5"><span className="shrink-0 mt-0.5">−</span>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Synergies */}
                    {synergies.length > 0 && (
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-medium mb-1.5">Synergies</p>
                        <div className="flex flex-wrap gap-1.5">
                          {synergies.map((s, i) => (
                            <span key={i} className="text-[11px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notable users from TOP_POKEMON */}
                    {notablePokemon.length > 0 && (
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-medium mb-1.5">Utilisateurs notables (Top Meta)</p>
                        <div className="flex flex-wrap gap-1.5">
                          {notablePokemon.map(p => (
                            <span key={p.name} className="text-[11px] bg-red-900/30 text-red-300 border border-red-800/40 px-2 py-0.5 rounded">{p.name}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {strengths.length === 0 && weaknesses.length === 0 && synergies.length === 0 && (
                      <p className="text-xs text-zinc-500">Données insuffisantes pour une analyse approfondie.</p>
                    )}
                  </div>
                );
              })()}

              {/* Learned by pokemon */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <button
                  onClick={() => setShowLearners(!showLearners)}
                  className="font-semibold text-zinc-200 text-sm flex items-center gap-2 w-full"
                >
                  Pokémon qui apprennent ce move
                  <span className="text-xs text-zinc-500 font-normal">({moveData.learned_by_pokemon.length})</span>
                  <span className="ml-auto text-zinc-600 text-xs">{showLearners ? '▲' : '▼'}</span>
                </button>
                {showLearners && (
                  <div className="mt-3 flex flex-wrap gap-1 max-h-[300px] overflow-y-auto">
                    {moveData.learned_by_pokemon.map(p => (
                      <span key={p.name} className="text-[11px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded hover:text-zinc-200 cursor-default">
                        {capitalize(p.name)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
