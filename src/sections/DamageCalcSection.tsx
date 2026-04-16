import { useState, useEffect } from 'react'
import {
  fetchPokemonList,
  fetchPokemon,
  fetchMove,
  capitalize,
  mapTypeName,
  mapStatName,
  getArtworkUrl,
  mapDamageClass,
  getDamageClassColor,
  type PokemonData,
  type PokemonListEntry,
  type PokemonMoveEntry,
  type MoveData,
} from '../data/pokeapi'
import { TYPE_COLORS } from '../data/types'

// Type effectiveness maps
const SE: Record<string, string[]> = {
  Normal: [], Fire: ["Grass","Ice","Bug","Steel"], Water: ["Fire","Ground","Rock"],
  Electric: ["Water","Flying"], Grass: ["Water","Ground","Rock"], Ice: ["Grass","Ground","Flying","Dragon"],
  Fighting: ["Normal","Ice","Rock","Dark","Steel"], Poison: ["Grass","Fairy"],
  Ground: ["Fire","Electric","Poison","Rock","Steel"], Flying: ["Grass","Fighting","Bug"],
  Psychic: ["Fighting","Poison"], Bug: ["Grass","Psychic","Dark"],
  Rock: ["Fire","Ice","Flying","Bug"], Ghost: ["Psychic","Ghost"],
  Dragon: ["Dragon"], Dark: ["Psychic","Ghost"], Steel: ["Ice","Rock","Fairy"],
  Fairy: ["Fighting","Dragon","Dark"]
};

const NVE: Record<string, string[]> = {
  Normal: ["Rock","Steel"], Fire: ["Fire","Water","Rock","Dragon"], Water: ["Water","Grass","Dragon"],
  Electric: ["Electric","Grass","Dragon"], Grass: ["Fire","Grass","Poison","Flying","Bug","Dragon","Steel"],
  Ice: ["Fire","Water","Ice","Steel"], Fighting: ["Poison","Flying","Psychic","Bug","Fairy"],
  Poison: ["Poison","Ground","Rock","Ghost"], Ground: ["Grass","Bug"],
  Flying: ["Electric","Rock","Steel"], Psychic: ["Psychic","Steel"],
  Bug: ["Fire","Fighting","Poison","Flying","Ghost","Steel","Fairy"],
  Rock: ["Fighting","Ground","Steel"], Ghost: ["Dark"],
  Dragon: ["Steel"], Dark: ["Fighting","Dark","Fairy"], Steel: ["Fire","Water","Electric","Steel"],
  Fairy: ["Fire","Poison","Steel"]
};

const IMMUNE: Record<string, string[]> = {
  Normal: ["Ghost"], Electric: ["Ground"], Fighting: ["Ghost"], Poison: ["Steel"],
  Ground: ["Flying"], Psychic: ["Dark"], Ghost: ["Normal"], Dragon: ["Fairy"]
};

function calculateTypeEffectiveness(moveType: string, defenderTypes: string[]): number {
  const mappedMoveType = mapTypeName(moveType);

  // Check immunity
  if (IMMUNE[mappedMoveType]?.includes(defenderTypes[0])) return 0;
  if (defenderTypes[1] && IMMUNE[mappedMoveType]?.includes(defenderTypes[1])) return 0;

  let multiplier = 1;

  // Super effective
  const seMoves = SE[mappedMoveType] || [];
  if (seMoves.includes(defenderTypes[0])) multiplier *= 2;
  if (defenderTypes[1] && seMoves.includes(defenderTypes[1])) multiplier *= 2;

  // Not very effective
  const nveMoves = NVE[mappedMoveType] || [];
  if (nveMoves.includes(defenderTypes[0])) multiplier *= 0.5;
  if (defenderTypes[1] && nveMoves.includes(defenderTypes[1])) multiplier *= 0.5;

  return multiplier;
}

function calculateStat(base: number, iv: number, ev: number, level: number, nature: number, isHP: boolean): number {
  const stat = Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100 + (isHP ? 100 : 5));
  return isHP ? stat : Math.floor(stat * nature);
}

function getStatStageMultiplier(stage: number): number {
  if (stage > 0) {
    const mults = [1, 1.5, 2, 2.5, 3, 3.5, 4];
    return mults[Math.min(stage, 6)];
  } else if (stage < 0) {
    const mults = [1, 0.667, 0.5, 0.4, 0.333, 0.286, 0.25];
    return mults[Math.min(-stage, 6)];
  }
  return 1;
}

interface PokemonPickerProps {
  label: string;
  selected: PokemonData | null;
  onSelect: (pokemon: PokemonData) => void;
  pokemonList: PokemonListEntry[];
  isLoading: boolean;
}

function PokemonPicker({ label, selected, onSelect, pokemonList, isLoading }: PokemonPickerProps) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingPokemon, setIsLoadingPokemon] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const filtered = pokemonList.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 30);

  const handleSelect = async (entry: PokemonListEntry) => {
    setIsLoadingPokemon(true);
    setFetchError(null);
    try {
      const data = await fetchPokemon(entry.name);
      onSelect(data);
      setSearch('');
      setShowDropdown(false);
    } catch {
      setFetchError('Impossible de charger ce Pokémon. Vérifie ta connexion.');
    } finally {
      setIsLoadingPokemon(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-zinc-400 uppercase">{label}</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          disabled={isLoading}
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-600"
        />
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 bg-zinc-800 border border-zinc-700 rounded mt-1 max-h-48 overflow-y-auto z-10">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-xs text-zinc-500">Aucun résultat</div>
            ) : (
              filtered.map(p => (
                <button
                  key={p.name}
                  onClick={() => handleSelect(p)}
                  disabled={isLoadingPokemon}
                  className="w-full text-left px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700 transition disabled:opacity-50"
                >
                  {capitalize(p.name)}
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {fetchError && (
        <p className="text-xs text-red-400 mt-1">{fetchError}</p>
      )}
      {selected && (
        <div className="bg-zinc-800 rounded p-3 space-y-2">
          <div className="flex items-start gap-3">
            <img src={getArtworkUrl(selected)} alt={selected.name} className="w-16 h-16" />
            <div className="flex-1">
              <p className="font-semibold text-zinc-200">{capitalize(selected.name)}</p>
              <div className="flex gap-1 mt-1">
                {selected.types.map(t => (
                  <span
                    key={t.type.name}
                    className="text-xs font-semibold px-2 py-1 rounded"
                    style={{ backgroundColor: TYPE_COLORS[mapTypeName(t.type.name)] || '#666' }}
                  >
                    {mapTypeName(t.type.name)}
                  </span>
                ))}
              </div>
              <div className="text-xs text-zinc-400 mt-2 space-y-1">
                {['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].map(stat => {
                  const baseStat = selected.stats.find(s => s.stat.name === stat)?.base_stat ?? 0;
                  return (
                    <div key={stat} className="flex justify-between">
                      <span>{mapStatName(stat)}:</span>
                      <span className="font-semibold text-zinc-300">{baseStat}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function DamageCalcSection() {
  const [pokemonList, setPokemonList] = useState<PokemonListEntry[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  const [attacker, setAttacker] = useState<PokemonData | null>(null);
  const [defender, setDefender] = useState<PokemonData | null>(null);
  const [selectedMove, setSelectedMove] = useState<MoveData | null>(null);
  const [loadingMove, setLoadingMove] = useState(false);

  // Stats
  const [atkIV, setAtkIV] = useState(31);
  const [atkEV, setAtkEV] = useState(252);
  const [atkNature, setAtkNature] = useState(1);
  const [defIV, setDefIV] = useState(31);
  const [defEV, setDefEV] = useState(4);
  const [defNature, setDefNature] = useState(1);

  // Modifiers
  const [item, setItem] = useState<number>(1);
  const [weather, setWeather] = useState<number>(1);
  const [burn, setBurn] = useState(false);
  const [crit, setCrit] = useState(false);
  const [atkStage, setAtkStage] = useState(0);
  const [defStage, setDefStage] = useState(0);
  const [stealthRock, setStealthRock] = useState(false);

  useEffect(() => {
    fetchPokemonList().then(setPokemonList).catch(console.error).finally(() => setIsLoadingList(false));
  }, []);

  const handleSelectMove = async (entry: PokemonMoveEntry) => {
    setLoadingMove(true);
    try {
      const fullMove = await fetchMove(entry.move.name);
      setSelectedMove(fullMove);
    } catch (err) {
      console.error('Error fetching move:', err);
    } finally {
      setLoadingMove(false);
    }
  };

  const atkStat = attacker ? calculateStat(attacker.stats.find(s => s.stat.name === 'attack')?.base_stat ?? 0, atkIV, atkEV, 100, atkNature, false) : 0;
  const defStat = defender ? calculateStat(defender.stats.find(s => s.stat.name === 'defense')?.base_stat ?? 0, defIV, defEV, 100, defNature, false) : 0;
  const defHP = defender ? calculateStat(defender.stats.find(s => s.stat.name === 'hp')?.base_stat ?? 0, 31, 0, 100, 1, true) : 1;

  const level = 100;
  const movePower = selectedMove?.power || 0;
  const hasAuto = attacker && selectedMove && attacker.types.some(t => t.type.name === selectedMove.type.name);
  const stabMult = hasAuto ? 1.5 : 1;
  const typeMult = attacker && defender && selectedMove ? calculateTypeEffectiveness(selectedMove.type.name, defender.types.map(t => mapTypeName(t.type.name))) : 1;
  const burnMult = burn ? 0.5 : 1;
  const critMult = crit ? 1.5 : 1;
  const atkStageMultiplier = getStatStageMultiplier(atkStage);
  const defStageMultiplier = getStatStageMultiplier(defStage);

  const baseDmg = movePower === 0 ? 0 : Math.floor(
    (Math.floor((2 * level) / 5 + 2) * movePower * atkStat / defStat) / 50 + 2
  );

  const total = baseDmg * stabMult * typeMult * item * weather * burnMult * critMult * atkStageMultiplier / defStageMultiplier;
  const minDmg = Math.floor(total * 0.85);
  const maxDmg = Math.floor(total);

  const minPct = defHP > 0 ? (minDmg / defHP * 100).toFixed(1) : '0';
  const maxPct = defHP > 0 ? (maxDmg / defHP * 100).toFixed(1) : '0';

  const minDmgWithSR = stealthRock ? Math.floor(minDmg - defHP * 0.125) : minDmg;
  const maxDmgWithSR = stealthRock ? Math.floor(maxDmg - defHP * 0.125) : maxDmg;
  const minPctWithSR = defHP > 0 ? (minDmgWithSR / defHP * 100).toFixed(1) : '0';
  const maxPctWithSR = defHP > 0 ? (maxDmgWithSR / defHP * 100).toFixed(1) : '0';

  const getVerdict = (maxPct: number, minPct: number) => {
    if (maxPct >= 100) return { text: 'OHKO garanti!', color: 'text-red-400' };
    if (minPct >= 50) return { text: '2HKO probable', color: 'text-orange-400' };
    if (minPct >= 33) return { text: '3HKO', color: 'text-yellow-400' };
    return { text: 'Pas un KO viable', color: 'text-green-400' };
  };

  const verdict = getVerdict(+maxPct, +minPct);
  const verdictSR = getVerdict(+maxPctWithSR, +minPctWithSR);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Calculateur de Dégâts</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
          Calculateur interactif alimenté par la PokéAPI. Sélectionne l'attaquant, le défenseur et le move pour obtenir des calculs de dégâts précis.
          Comprends tous les modificateurs : STAB, efficacité de type, objets, météo, et étapes de stats.
        </p>
      </div>

      {/* Pokemon Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PokemonPicker
          label="Attaquant"
          selected={attacker}
          onSelect={setAttacker}
          pokemonList={pokemonList}
          isLoading={isLoadingList}
        />
        <PokemonPicker
          label="Défenseur"
          selected={defender}
          onSelect={setDefender}
          pokemonList={pokemonList}
          isLoading={isLoadingList}
        />
      </div>

      {/* Move Selector */}
      {attacker && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-zinc-200">Moves</h3>
          <div className="flex flex-wrap gap-2">
            {attacker.moves.slice(0, 10).map(move => (
              <button
                key={move.move.name}
                onClick={() => handleSelectMove(move)}
                disabled={loadingMove}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  selectedMove?.name === move.move.name
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                }`}
              >
                {capitalize(move.move.name)}
              </button>
            ))}
          </div>
          {selectedMove && (
            <div className="bg-zinc-800 rounded p-3 text-sm space-y-1 border-l-2" style={{ borderColor: TYPE_COLORS[mapTypeName(selectedMove.type.name)] || '#666' }}>
              <p><strong>Type:</strong> <span style={{ color: TYPE_COLORS[mapTypeName(selectedMove.type.name)] || '#666' }}>{mapTypeName(selectedMove.type.name)}</span></p>
              <p><strong>Puissance:</strong> {selectedMove.power || '—'}</p>
              <p><strong>Précision:</strong> {selectedMove.accuracy || '—'}</p>
              <p><strong>Classe:</strong> <span className={getDamageClassColor(selectedMove.damage_class.name)}>{mapDamageClass(selectedMove.damage_class.name)}</span></p>
            </div>
          )}
        </div>
      )}

      {/* Stats Configuration */}
      {attacker && defender && selectedMove && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-zinc-200">Configuration des Stats (Niveau 100)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-zinc-300">Attaque (Attaquant)</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>IV</span>
                  <span className="text-zinc-200">{atkIV}</span>
                </div>
                <input type="range" min="0" max="31" value={atkIV} onChange={e => setAtkIV(+e.target.value)} className="w-full" />

                <div className="flex justify-between text-xs text-zinc-400">
                  <span>EV</span>
                  <span className="text-zinc-200">{atkEV}</span>
                </div>
                <input type="range" min="0" max="252" step="4" value={atkEV} onChange={e => setAtkEV(+e.target.value)} className="w-full" />

                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Nature</span>
                  <select value={atkNature} onChange={e => setAtkNature(+e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs">
                    <option value={0.9}>Néfaste (0.9)</option>
                    <option value={1}>Neutre (1.0)</option>
                    <option value={1.1}>Boostante (1.1)</option>
                  </select>
                </div>

                <div className="bg-zinc-800 rounded p-2 text-center">
                  <p className="text-xs text-zinc-400">Stat calculée</p>
                  <p className="text-lg font-bold text-red-400">{atkStat}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-zinc-300">Défense (Défenseur)</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>IV</span>
                  <span className="text-zinc-200">{defIV}</span>
                </div>
                <input type="range" min="0" max="31" value={defIV} onChange={e => setDefIV(+e.target.value)} className="w-full" />

                <div className="flex justify-between text-xs text-zinc-400">
                  <span>EV</span>
                  <span className="text-zinc-200">{defEV}</span>
                </div>
                <input type="range" min="0" max="252" step="4" value={defEV} onChange={e => setDefEV(+e.target.value)} className="w-full" />

                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Nature</span>
                  <select value={defNature} onChange={e => setDefNature(+e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs">
                    <option value={0.9}>Néfaste (0.9)</option>
                    <option value={1}>Neutre (1.0)</option>
                    <option value={1.1}>Boostante (1.1)</option>
                  </select>
                </div>

                <div className="bg-zinc-800 rounded p-2 text-center">
                  <p className="text-xs text-zinc-400">Stat calculée / PV</p>
                  <p className="text-lg font-bold text-red-400">{defStat} / {defHP}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modifiers */}
      {attacker && defender && selectedMove && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-zinc-200">Modificateurs</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-2">Objet</label>
                <select value={item} onChange={e => setItem(+e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm">
                  <option value={1}>Aucun</option>
                  <option value={1.5}>Choice Band / Specs (×1.5)</option>
                  <option value={1.3}>Life Orb (×1.3)</option>
                  <option value={1.2}>Expert Belt SE (×1.2)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-2">Météo</label>
                <select value={weather} onChange={e => setWeather(+e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm">
                  <option value={1}>Aucune</option>
                  <option value={1.5}>Boost (Soleil+Feu / Pluie+Eau)</option>
                  <option value={0.5}>Nerf (Soleil+Eau / Pluie+Feu)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-2">Étage d'Attaque (Attaquant)</label>
                <input type="range" min="-6" max="6" value={atkStage} onChange={e => setAtkStage(+e.target.value)} className="w-full" />
                <p className="text-xs text-zinc-400 text-center mt-1">{atkStage > 0 ? '+' : ''}{atkStage} ({getStatStageMultiplier(atkStage).toFixed(2)}×)</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-2">Étage de Défense (Défenseur)</label>
                <input type="range" min="-6" max="6" value={defStage} onChange={e => setDefStage(+e.target.value)} className="w-full" />
                <p className="text-xs text-zinc-400 text-center mt-1">{defStage > 0 ? '+' : ''}{defStage} ({getStatStageMultiplier(defStage).toFixed(2)}×)</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <input type="checkbox" checked={burn} onChange={e => setBurn(e.target.checked)} className="rounded bg-zinc-800 border-zinc-700" />
                  <span>Brûlé (×0.5 physique)</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <input type="checkbox" checked={crit} onChange={e => setCrit(e.target.checked)} className="rounded bg-zinc-800 border-zinc-700" />
                  <span>Coup Critique (×1.5)</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <input type="checkbox" checked={stealthRock} onChange={e => setStealthRock(e.target.checked)} className="rounded bg-zinc-800 border-zinc-700" />
                  <span>Stealth Rock (montrer l'ajustement)</span>
                </label>
              </div>

              {/* Effectiveness breakdown */}
              <div className="bg-zinc-800 rounded p-3 space-y-2 text-xs">
                <p className="font-semibold text-zinc-300">Résumé</p>
                <p className="text-zinc-400">
                  <strong>STAB:</strong> {hasAuto ? '✓ (1.5×)' : '✗ (1.0×)'}
                </p>
                <p className="text-zinc-400">
                  <strong>Efficacité:</strong> {typeMult === 0 ? 'Immunité (0×)' : typeMult === 4 ? 'Super efficace (4×)' : typeMult === 2 ? 'Super efficace (2×)' : typeMult === 0.5 ? 'Pas très efficace (0.5×)' : 'Neutre (1×)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {attacker && defender && selectedMove && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <h3 className="font-semibold text-zinc-200 mb-4">Résultats</h3>

            <div className="space-y-4">
              {/* Main damage */}
              <div className="bg-zinc-800 rounded-lg p-4 space-y-3">
                <div className="text-center">
                  <p className="text-xs text-zinc-500 mb-1">Dégâts (plage)</p>
                  <p className="text-3xl font-bold text-red-400">{minDmg} — {maxDmg}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {minPct}% — {maxPct}% des {defHP} PV
                  </p>
                </div>

                <div className="w-full bg-zinc-700 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, +maxPct)}%`,
                      background: +maxPct >= 100
                        ? 'linear-gradient(90deg, #dc2626, #f87171)'
                        : +maxPct >= 50
                        ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                        : 'linear-gradient(90deg, #22c55e, #86efac)'
                    }}
                  />
                </div>

                <div className="text-center">
                  <p className={`text-sm font-semibold ${verdict.color}`}>{verdict.text}</p>
                </div>
              </div>

              {/* Stealth Rock adjustment */}
              {stealthRock && (
                <div className="bg-zinc-800 rounded-lg p-4 space-y-3 border-l-4 border-red-600">
                  <p className="text-sm font-semibold text-zinc-300">Avec Stealth Rock (12.5% pré-dégâts)</p>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-400">{minDmgWithSR} — {maxDmgWithSR}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {minPctWithSR}% — {maxPctWithSR}% des {defHP} PV
                    </p>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, +maxPctWithSR)}%`,
                        background: +maxPctWithSR >= 100
                          ? 'linear-gradient(90deg, #dc2626, #f87171)'
                          : +maxPctWithSR >= 50
                          ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                          : 'linear-gradient(90deg, #22c55e, #86efac)'
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-semibold ${verdictSR.color}`}>{verdictSR.text}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Educational section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="font-semibold text-zinc-200 mb-3">Penser en % de PV</h3>
        <div className="text-sm text-zinc-400 space-y-2">
          <p>
            Les bons joueurs ne pensent pas en points de dégâts mais en <strong className="text-zinc-200">% de PV</strong>.
            "Est-ce que mon Earthquake fait 45% ou 55% à Heatran ?" détermine si tu dois aller pour le 2HKO ou pivoter.
          </p>
          <p>
            <strong className="text-zinc-200">Benchmark clé :</strong> Stealth Rock fait 12.5% aux neutres. Donc un Pokémon
            qui entre sur SR puis prend un 2HKO doit encaisser 87.5% en un coup, pas 100%. Ça change tout.
          </p>
          <p>
            <strong className="text-zinc-200">Restes vs Leftovers :</strong> Leftovers soigne 6.25% par tour. Sur 3 tours
            (entrée + 2 tours), ça fait ~18% de récupération. Un Pokémon qui prend un 3HKO à 34% peut donc
            survivre grâce aux Leftovers si l'adversaire ne boost pas.
          </p>
          <p>
            <strong className="text-zinc-200">Pour t'entraîner :</strong> utilise ce calculateur pour vérifier tes calcs avant chaque match.
            Les top players connaissent leurs calcs par cœur.
          </p>
        </div>
      </div>
    </div>
  );
}
