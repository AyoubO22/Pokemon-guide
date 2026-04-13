import { useState, useEffect, useCallback } from 'react'
import { TYPE_COLORS, TYPES } from '../data/types'
import {
  fetchMoveList, fetchMove, capitalize, mapTypeName, mapDamageClass, getDamageClassColor,
  mapTarget, mapAilment, getMoveFrenchFlavor, getMoveEnglishEffect,
  type MoveData, type MoveListEntry
} from '../data/pokeapi'

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

              {/* Competitive analysis */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <h4 className="font-semibold text-zinc-200 mb-2 text-sm">Analyse Rapide</h4>
                <div className="text-xs text-zinc-400 space-y-1">
                  {moveData.power && moveData.power >= 120 && <p className="text-yellow-400">Puissance très élevée ({moveData.power}) — potentiel wallbreaking.</p>}
                  {moveData.power && moveData.power >= 80 && moveData.power < 120 && moveData.accuracy && moveData.accuracy >= 95 && <p className="text-green-400">Bon ratio puissance/précision — move fiable.</p>}
                  {moveData.power && moveData.power < 60 && moveData.priority > 0 && <p className="text-blue-400">Move prioritaire — excellent pour le revenge killing.</p>}
                  {moveData.damage_class.name === "status" && <p>Move de statut — bloqué par Taunt. Essentiel en support/setup.</p>}
                  {moveData.priority > 0 && <p className="text-green-400">Priorité +{moveData.priority} — agit avant les moves normaux!</p>}
                  {moveData.priority < -1 && <p className="text-red-400">Priorité {moveData.priority} — agit en dernier. Souvent voulu (slow pivot, Trick Room).</p>}
                  {moveData.target.name === "all-other-pokemon" && <p className="text-yellow-400">Touche tous les Pokémon autour — spread move! 75% puissance en Doubles.</p>}
                  {moveData.target.name === "all-opponents" && <p className="text-yellow-400">Touche tous les adversaires — spread move en Doubles.</p>}
                  {moveData.accuracy && moveData.accuracy < 85 && <p className="text-red-400">Précision basse ({moveData.accuracy}%) — risque de miss en situation critique.</p>}
                  {moveData.accuracy === null && moveData.damage_class.name !== "status" && <p>Précision — ne rate jamais (bypass les changements de précision/évasion).</p>}
                  {moveData.meta?.drain && moveData.meta.drain > 0 && <p className="text-green-400">Drain {moveData.meta.drain}% — sustain offensif.</p>}
                  {moveData.meta?.drain && moveData.meta.drain < 0 && <p className="text-red-400">Recul de {Math.abs(moveData.meta.drain)}% — risque d'auto-chip damage.</p>}
                </div>
              </div>

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
