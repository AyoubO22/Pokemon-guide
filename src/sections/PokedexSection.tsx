import { useState, useEffect, useCallback, useMemo } from 'react'
import { TOP_POKEMON, STAT_LABELS, STAT_COLORS } from '../data/pokemon'
import { TYPE_COLORS, TYPES } from '../data/types'
import {
  fetchPokemonList, fetchPokemon, fetchPokemonSpecies, fetchEvolutionChain,
  fetchMove, fetchAbility, getAbilityShortEffect, capitalize, mapTypeName, mapStatName,
  mapDamageClass, getDamageClassColor, getArtworkUrl, getFrenchName, getFrenchDescription,
  getFrenchGenus, getMoveFrenchFlavor, flattenEvolution,
  type PokemonData, type PokemonSpeciesData, type PokemonListEntry, type MoveData
} from '../data/pokeapi'

function TypeBadge({ name }: { name: string }) {
  const mapped = mapTypeName(name);
  const color = TYPE_COLORS[mapped] || '#888';
  const fr = TYPES.find(t => t.name === mapped)?.nameFr || mapped;
  return <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-white" style={{ backgroundColor: color }}>{fr}</span>;
}

function StatBar({ label, value, max, color, index }: { label: string; value: number; max: number; color: string; index: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const rating = value >= 130 ? "Exceptionnel" : value >= 100 ? "Excellent" : value >= 80 ? "Bon" : value >= 60 ? "Moyen" : "Faible";
  return (
    <div className="flex items-center gap-2 group">
      <span className="text-[10px] text-zinc-500 w-14 text-right">{label}</span>
      <span className="text-xs font-mono w-8 text-right font-bold" style={{ color }}>{value}</span>
      <div className="flex-1 bg-zinc-800 rounded-full h-3 overflow-hidden relative">
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: color, transitionDelay: `${index * 80}ms` }} />
      </div>
      <span className="text-[9px] text-zinc-600 w-20 hidden md:block">{rating}</span>
    </div>
  );
}

const STAT_ORDER = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];

export function PokedexSection() {
  const [view, setView] = useState<'api' | 'curated' | 'favorites'>('api');
  const [allPokemon, setAllPokemon] = useState<PokemonListEntry[]>([]);
  const [search, setSearch] = useState("");
  const [selectedName, setSelectedName] = useState("garchomp");
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [speciesData, setSpeciesData] = useState<PokemonSpeciesData | null>(null);
  const [evoChain, setEvoChain] = useState<{ name: string; level?: number; trigger: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");
  const [inspectedMove, setInspectedMove] = useState<MoveData | null>(null);
  const [moveLoading, setMoveLoading] = useState(false);

  // French name cache: lowercase french name → api english name
  const [frenchNameCache, setFrenchNameCache] = useState<Record<string, string>>({});

  // Mega evolutions
  const [megaPokemon, setMegaPokemon] = useState<PokemonListEntry[]>([]);
  const [showMegas, setShowMegas] = useState(false);

  // Ability tooltip — fixed position to avoid overflow clipping
  const [abilityCache, setAbilityCache] = useState<Record<string, string>>({});
  const [abilityTooltip, setAbilityTooltip] = useState<{ name: string; x: number; y: number } | null>(null);

  const handleAbilityEnter = useCallback(async (e: React.MouseEvent, name: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAbilityTooltip({ name, x: rect.left, y: rect.top });
    if (abilityCache[name]) return;
    try {
      const data = await fetchAbility(name);
      const effect = getAbilityShortEffect(data);
      setAbilityCache(prev => ({ ...prev, [name]: effect || "Aucune description disponible." }));
    } catch {
      setAbilityCache(prev => ({ ...prev, [name]: "Aucune description disponible." }));
    }
  }, [abilityCache]);

  const handleAbilityLeave = useCallback(() => setAbilityTooltip(null), []);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('pokemon_favorites') || '[]'); } catch { return []; }
  });
  const toggleFavorite = useCallback((name: string) => {
    setFavorites(prev => {
      const updated = prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name];
      try { localStorage.setItem('pokemon_favorites', JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, []);

  // Curated view state
  const [selectedCurated, setSelectedCurated] = useState(TOP_POKEMON[0].name);
  const [curatedRoleFilter, setCuratedRoleFilter] = useState("Tous");

  // Scan existing localStorage cache for French names on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('pokeapi_cache');
      if (!raw) return;
      const cacheData = JSON.parse(raw) as Record<string, unknown>;
      const map: Record<string, string> = {};
      Object.entries(cacheData).forEach(([url, data]) => {
        if (!url.includes('/pokemon-species/') || !data || typeof data !== 'object') return;
        const species = data as PokemonSpeciesData;
        if (!Array.isArray(species.names)) return;
        const frEntry = species.names.find((n: { name: string; language: { name: string } }) => n.language.name === 'fr');
        if (!frEntry) return;
        const engName = url.split('/').filter(Boolean).pop();
        if (engName) map[frEntry.name.toLowerCase()] = engName;
      });
      if (Object.keys(map).length > 0) setFrenchNameCache(map);
    } catch { /* ignore */ }
  }, []);

  // Load pokemon list (1500 to include megas)
  useEffect(() => {
    fetchPokemonList(1500).then(list => {
      const regular: PokemonListEntry[] = [];
      const megas: PokemonListEntry[] = [];
      list.forEach(p => {
        const id = Number(p.url.split('/').filter(Boolean).pop());
        if (id >= 1 && id <= 1025) regular.push(p);
        else if (p.name.includes('-mega')) megas.push(p);
      });
      setAllPokemon(regular);
      setMegaPokemon(megas);
      setListLoading(false);
    }).catch(() => setListLoading(false));
  }, []);

  // Load selected pokemon — mega forms use the base species
  const loadPokemon = useCallback(async (name: string) => {
    setLoading(true);
    setError("");
    setEvoChain([]);
    try {
      // For mega forms: strip -mega, -mega-x, -mega-y to get base species name
      const baseSpeciesName = name.replace(/-mega(-[xy])?$/, '');
      const [pData, sData] = await Promise.all([
        fetchPokemon(name),
        fetchPokemonSpecies(baseSpeciesName).catch(() => null)
      ]);
      setPokemonData(pData);
      setSpeciesData(sData);
      // Update French name cache from freshly loaded species
      if (sData) {
        const frName = getFrenchName(sData);
        if (frName) {
          setFrenchNameCache(prev => ({ ...prev, [frName.toLowerCase()]: baseSpeciesName }));
        }
      }
      if (sData?.evolution_chain?.url) {
        try {
          const evoData = await fetchEvolutionChain(sData.evolution_chain.url);
          setEvoChain(flattenEvolution(evoData.chain));
        } catch { /* ignore */ }
      }
    } catch {
      setError("Pokémon non trouvé.");
      setPokemonData(null);
      setSpeciesData(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (view === 'api' && selectedName) loadPokemon(selectedName);
  }, [selectedName, view, loadPokemon]);

  const filteredList = useMemo(() => {
    const base = showMegas ? megaPokemon : allPokemon;
    if (!search) return base.slice(0, 150);
    const s = search.toLowerCase().trim();
    return base.filter(p => {
      if (p.name.includes(s)) return true;
      const id = p.url.split('/').filter(Boolean).pop();
      if (id === s) return true;
      // French name: exact key match
      if (frenchNameCache[s] === p.name) return true;
      // French name: partial match (e.g. "drauca" → "dracaufeu")
      return Object.entries(frenchNameCache).some(([fr, en]) =>
        fr.includes(s) && en === p.name
      );
    }).slice(0, 150);
  }, [search, showMegas, allPokemon, megaPokemon, frenchNameCache]);

  const bst = pokemonData ? pokemonData.stats.reduce((a, s) => a + s.base_stat, 0) : 0;
  const frName = speciesData ? getFrenchName(speciesData) : "";
  const frDesc = speciesData ? getFrenchDescription(speciesData) : "";
  const frGenus = speciesData ? getFrenchGenus(speciesData) : "";

  // Curated
  const curatedAllRoles = ["Tous", ...Array.from(new Set(TOP_POKEMON.flatMap(p => p.role)))];
  const curatedFiltered = TOP_POKEMON.filter(p => curatedRoleFilter === "Tous" || p.role.includes(curatedRoleFilter));
  const curatedPkm = TOP_POKEMON.find(p => p.name === selectedCurated);
  const curatedBst = curatedPkm ? curatedPkm.baseStats.reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Pokédex Compétitif</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
          Explore les <strong className="text-zinc-200">1025 Pokémon</strong> + <strong className="text-zinc-200">Méga-Évolutions</strong> via PokéAPI en temps réel.
          Recherche par nom français ou anglais · Fiches stratégiques pour le metagame.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setView('api')}
          className={`px-3 py-1.5 text-sm rounded font-medium ${view === 'api' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
          Pokédex Complet (API)
        </button>
        <button onClick={() => setView('curated')}
          className={`px-3 py-1.5 text-sm rounded font-medium ${view === 'curated' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
          Fiches Stratégiques
        </button>
        <button onClick={() => setView('favorites')}
          className={`px-3 py-1.5 text-sm rounded font-medium ${view === 'favorites' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
          Favoris{favorites.length > 0 ? ` (${favorites.length})` : ''}
        </button>
      </div>

      {/* ============ API VIEW ============ */}
      {view === 'api' && (
        <div className="grid md:grid-cols-[280px_1fr] gap-4">
          {/* Search & List */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-2 border-b border-zinc-800 space-y-1.5">
              <input
                type="text"
                placeholder="Nom FR/EN ou numéro..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && search) { setSelectedName(search.toLowerCase()); } }}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm"
              />
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-zinc-600">
                  {listLoading ? "Chargement..." : showMegas ? `${megaPokemon.length} Méga-Évolutions` : `${allPokemon.length} Pokémon`}
                </p>
                <button
                  onClick={() => setShowMegas(v => !v)}
                  className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${showMegas ? 'bg-purple-700 text-white' : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                >
                  Méga
                </button>
              </div>
              {Object.keys(frenchNameCache).length > 0 && (
                <p className="text-[10px] text-zinc-700">
                  {Object.keys(frenchNameCache).length} noms FR en cache
                </p>
              )}
            </div>
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
              {filteredList.map(p => {
                const id = p.url.split("/").filter(Boolean).pop();
                return (
                  <button
                    key={p.name}
                    onClick={() => setSelectedName(p.name)}
                    className={`w-full text-left px-3 py-2 border-b border-zinc-800/30 text-sm transition-colors flex items-center gap-2
                      ${selectedName === p.name ? 'bg-zinc-800 border-l-2 border-l-red-500' : 'hover:bg-zinc-800/50'}`}
                  >
                    <span className="text-zinc-600 text-xs font-mono w-8">#{id}</span>
                    <span className="text-zinc-200 flex-1">{capitalize(p.name)}</span>
                    {p.name.includes('-mega') && (
                      <span className="text-[9px] bg-purple-900/50 text-purple-300 px-1 py-0.5 rounded shrink-0">Méga</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pokemon Detail */}
          <div className="space-y-4">
            {loading && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
                <div className="animate-pulse text-zinc-500">Chargement depuis PokéAPI...</div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 text-sm">{error}</div>
            )}

            {!loading && pokemonData && (
              <>
                {/* Header Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                  <div className="flex gap-4 items-start">
                    {/* Sprite */}
                    <div className="shrink-0">
                      {getArtworkUrl(pokemonData) ? (
                        <img
                          src={getArtworkUrl(pokemonData)}
                          alt={pokemonData.name}
                          className="w-28 h-28 object-contain bg-zinc-800/50 rounded-lg p-2"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-28 h-28 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 text-xs">No img</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-zinc-500 text-sm font-mono">#{pokemonData.id}</span>
                        <h3 className="text-xl font-bold text-zinc-100">{capitalize(pokemonData.name)}</h3>
                        {frName && <span className="text-sm text-zinc-400">({frName})</span>}
                        {pokemonData.name.includes('-mega') && <span className="text-[10px] bg-purple-900/40 text-purple-300 px-1.5 py-0.5 rounded">Méga-Évolution</span>}
                        {speciesData?.is_legendary && <span className="text-[10px] bg-yellow-900/40 text-yellow-300 px-1.5 py-0.5 rounded">Légendaire</span>}
                        {speciesData?.is_mythical && <span className="text-[10px] bg-purple-900/40 text-purple-300 px-1.5 py-0.5 rounded">Fabuleux</span>}
                        <button
                          onClick={() => toggleFavorite(pokemonData.name)}
                          className={`ml-auto text-xl leading-none transition-colors ${favorites.includes(pokemonData.name) ? 'text-red-400' : 'text-zinc-600 hover:text-zinc-400'}`}
                          title={favorites.includes(pokemonData.name) ? "Retirer des favoris" : "Ajouter aux favoris"}
                        >
                          {favorites.includes(pokemonData.name) ? '♥' : '♡'}
                        </button>
                      </div>

                      {frGenus && <p className="text-xs text-zinc-500 mb-2">{frGenus}</p>}

                      {/* Types */}
                      <div className="flex gap-1 mb-3">
                        {pokemonData.types.map(t => <TypeBadge key={t.type.name} name={t.type.name} />)}
                      </div>

                      {/* Abilities */}
                      <div className="mb-3">
                        <p className="text-xs text-zinc-500 mb-1">Talents <span className="text-zinc-600">(survole pour voir l'effet)</span></p>
                        <div className="flex flex-wrap gap-1">
                          {pokemonData.abilities.map(a => (
                            <span
                              key={a.ability.name}
                              onMouseEnter={e => handleAbilityEnter(e, a.ability.name)}
                              onMouseLeave={handleAbilityLeave}
                              className={`text-xs px-2 py-0.5 rounded cursor-help inline-block ${a.is_hidden ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-800/50' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                            >
                              {capitalize(a.ability.name)} {a.is_hidden ? "(HA)" : ""}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Physical info */}
                      <div className="flex gap-4 text-xs text-zinc-500">
                        <span>Taille: <strong className="text-zinc-300">{(pokemonData.height / 10).toFixed(1)}m</strong></span>
                        <span>Poids: <strong className="text-zinc-300">{(pokemonData.weight / 10).toFixed(1)}kg</strong></span>
                        {speciesData && <span>Capture: <strong className="text-zinc-300">{speciesData.capture_rate}</strong></span>}
                        {speciesData && <span>Génération: <strong className="text-zinc-300">{speciesData.generation.name.replace("generation-", "").toUpperCase()}</strong></span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                  <h4 className="font-semibold text-zinc-200 mb-3">Base Stats</h4>
                  <div className="space-y-2">
                    {STAT_ORDER.map((statKey, i) => {
                      const s = pokemonData.stats.find(st => st.stat.name === statKey);
                      if (!s) return null;
                      return (
                        <StatBar
                          key={statKey}
                          label={mapStatName(s.stat.name)}
                          value={s.base_stat}
                          max={200}
                          color={STAT_COLORS[i]}
                          index={i}
                        />
                      );
                    })}
                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                      <span className="text-[10px] text-zinc-500 w-14 text-right">BST</span>
                      <span className="text-sm font-mono font-bold text-zinc-200 w-8 text-right">{bst}</span>
                      <div className="flex-1 bg-zinc-800 rounded-full h-3 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500" style={{ width: `${Math.min(100, (bst / 720) * 100)}%` }} />
                      </div>
                      <span className="text-[9px] text-zinc-600 w-20 hidden md:block">
                        {bst >= 600 ? "Pseudo/Légen." : bst >= 530 ? "Très fort" : bst >= 480 ? "Bon" : bst >= 400 ? "Moyen" : "Faible"}
                      </span>
                    </div>
                  </div>

                  {/* Competitive stat analysis */}
                  <div className="mt-4 p-3 bg-zinc-800/30 rounded text-xs text-zinc-400">
                    {(() => {
                      const stats = pokemonData.stats;
                      const atk = stats.find(s => s.stat.name === "attack")?.base_stat || 0;
                      const spa = stats.find(s => s.stat.name === "special-attack")?.base_stat || 0;
                      const spe = stats.find(s => s.stat.name === "speed")?.base_stat || 0;
                      const def_ = stats.find(s => s.stat.name === "defense")?.base_stat || 0;
                      const spd = stats.find(s => s.stat.name === "special-defense")?.base_stat || 0;
                      const hp = stats.find(s => s.stat.name === "hp")?.base_stat || 0;

                      const suggestions: string[] = [];
                      if (atk > spa && atk >= 100) suggestions.push("Attaquant physique — investir en Atq + Vit");
                      if (spa > atk && spa >= 100) suggestions.push("Attaquant spécial — investir en Atq.Spé + Vit");
                      if (spe >= 100) suggestions.push(`Rapide (${spe}) — peut outspeed beaucoup sans Scarf`);
                      if (spe < 50) suggestions.push(`Très lent (${spe}) — candidat Trick Room ou tank`);
                      if (def_ >= 100 && hp >= 80) suggestions.push("Bonne bulk physique — potentiel wall physique");
                      if (spd >= 100 && hp >= 80) suggestions.push("Bonne bulk spéciale — potentiel wall spécial");
                      if (atk >= 130 || spa >= 130) suggestions.push("Puissance brute extrême — Wallbreaker potentiel");
                      if (hp >= 100 && def_ >= 80 && spd >= 80) suggestions.push("Bulk globale — tank ou pivot");

                      return suggestions.length > 0 ? (
                        <div>
                          <p className="text-zinc-500 text-[10px] uppercase font-medium mb-1">Analyse compétitive rapide</p>
                          {suggestions.map((s, i) => <p key={i}>• {s}</p>)}
                        </div>
                      ) : <p>Stats moyennes — vérifier les talents et moves pour la viabilité.</p>;
                    })()}
                  </div>
                </div>

                {/* Matchups */}
                {pokemonData && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                    <h4 className="font-semibold text-zinc-200 mb-4">Matchups Compétitifs</h4>
                    <div className="space-y-5">
                      {/* Defensive Matchups */}
                      <div>
                        <p className="text-xs text-zinc-500 mb-2.5 uppercase font-medium">Faiblesses et Résistances</p>
                        <div className="space-y-2">
                          {(() => {
                            const SE_MAP: Record<string, string[]> = {
                              Normal: [], Fire: ["Grass","Ice","Bug","Steel"], Water: ["Fire","Ground","Rock"],
                              Electric: ["Water","Flying"], Grass: ["Water","Ground","Rock"], Ice: ["Grass","Ground","Flying","Dragon"],
                              Fighting: ["Normal","Ice","Rock","Dark","Steel"], Poison: ["Grass","Fairy"],
                              Ground: ["Fire","Electric","Poison","Rock","Steel"], Flying: ["Grass","Fighting","Bug"],
                              Psychic: ["Fighting","Poison"], Bug: ["Grass","Psychic","Dark"],
                              Rock: ["Fire","Ice","Flying","Bug"], Ghost: ["Psychic","Ghost"],
                              Dragon: ["Dragon"], Dark: ["Psychic","Ghost"], Steel: ["Ice","Rock","Fairy"],
                              Fairy: ["Fighting","Dragon","Dark"]
                            };

                            // Calculate defensive effectiveness
                            const weaknesses: Record<string, number> = {};
                            const resistances: Record<string, number> = {};

                            TYPES.forEach(type => {
                              if (type.name === "Normal") return;

                              pokemonData.types.forEach(t => {
                                const mapped = mapTypeName(t.type.name);
                                const typeData = TYPES.find(ty => ty.name === mapped);
                                if (!typeData) return;

                                if (SE_MAP[type.name]?.includes(typeData.name)) {
                                  weaknesses[type.name] = (weaknesses[type.name] || 1) * 2;
                                } else if (SE_MAP[typeData.name]?.includes(type.name)) {
                                  resistances[type.name] = (resistances[type.name] || 1) * 0.5;
                                }
                              });
                            });

                            const weaknessEntries = Object.entries(weaknesses).filter(([, val]) => val >= 2).sort((a, b) => b[1] - a[1]);
                            const resistanceEntries = Object.entries(resistances).filter(([, val]) => val <= 0.5).sort((a, b) => a[1] - b[1]);

                            return (
                              <>
                                {weaknessEntries.length > 0 && (
                                  <div>
                                    <p className="text-[10px] text-zinc-600 mb-1.5">Faiblesses</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {weaknessEntries.map(([typeName, mult]) => {
                                        const typeData = TYPES.find(t => t.name === typeName);
                                        const color = TYPE_COLORS[typeName] || '#666';
                                        const frName = typeData?.nameFr || typeName;
                                        const badge = mult === 4 ? `x4` : `x2`;
                                        return (
                                          <span key={typeName} className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium text-white border border-red-700/50" style={{ backgroundColor: color + '40' }}>
                                            <span className="text-red-400">▼</span> {frName} {badge}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                                {resistanceEntries.length > 0 && (
                                  <div>
                                    <p className="text-[10px] text-zinc-600 mb-1.5">Résistances</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {resistanceEntries.map(([typeName, mult]) => {
                                        const typeData = TYPES.find(t => t.name === typeName);
                                        const color = TYPE_COLORS[typeName] || '#666';
                                        const frName = typeData?.nameFr || typeName;
                                        const badge = mult === 0.25 ? `x0.25` : `x0.5`;
                                        return (
                                          <span key={typeName} className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium text-white border border-green-700/50" style={{ backgroundColor: color + '40' }}>
                                            <span className="text-green-400">▲</span> {frName} {badge}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      {/* STAB Coverage */}
                      <div>
                        <p className="text-xs text-zinc-500 mb-2.5 uppercase font-medium">Couverture STAB</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(() => {
                            const SE_MAP: Record<string, string[]> = {
                              Normal: [], Fire: ["Grass","Ice","Bug","Steel"], Water: ["Fire","Ground","Rock"],
                              Electric: ["Water","Flying"], Grass: ["Water","Ground","Rock"], Ice: ["Grass","Ground","Flying","Dragon"],
                              Fighting: ["Normal","Ice","Rock","Dark","Steel"], Poison: ["Grass","Fairy"],
                              Ground: ["Fire","Electric","Poison","Rock","Steel"], Flying: ["Grass","Fighting","Bug"],
                              Psychic: ["Fighting","Poison"], Bug: ["Grass","Psychic","Dark"],
                              Rock: ["Fire","Ice","Flying","Bug"], Ghost: ["Psychic","Ghost"],
                              Dragon: ["Dragon"], Dark: ["Psychic","Ghost"], Steel: ["Ice","Rock","Fairy"],
                              Fairy: ["Fighting","Dragon","Dark"]
                            };

                            const stabCoverage = new Set<string>();
                            pokemonData.types.forEach(t => {
                              const mapped = mapTypeName(t.type.name);
                              const coverage = SE_MAP[mapped] || [];
                              coverage.forEach(c => stabCoverage.add(c));
                            });

                            return Array.from(stabCoverage).map(typeName => {
                              const typeData = TYPES.find(t => t.name === typeName);
                              const color = TYPE_COLORS[typeName] || '#666';
                              const frName = typeData?.nameFr || typeName;
                              return (
                                <span key={typeName} className="inline-block px-2.5 py-1 rounded text-[11px] font-medium text-white border border-blue-700/50" style={{ backgroundColor: color + '40' }}>
                                  {frName}
                                </span>
                              );
                            });
                          })()}
                        </div>
                      </div>

                      {/* Suggested Checks/Counters */}
                      <div>
                        <p className="text-xs text-zinc-500 mb-2.5 uppercase font-medium">Checks/Counters Courants</p>
                        <div className="text-sm text-zinc-400">
                          {(() => {
                            const COMMON_THREATS: Record<string, string[]> = {
                              Fire: ["Heatran", "Volcarona", "Blaziken"],
                              Water: ["Urshifu-Rapid", "Barraskewda", "Dracovish"],
                              Grass: ["Rillaboom", "Kartana", "Ferrothorn"],
                              Electric: ["Regieleki", "Tapu Koko", "Zapdos"],
                              Ice: ["Kyurem", "Weavile", "Baxcalibur"],
                              Fighting: ["Urshifu", "Iron Valiant", "Blaziken"],
                              Ground: ["Garchomp", "Landorus-T", "Great Tusk"],
                              Flying: ["Tornadus-T", "Dragonite", "Corviknight"],
                              Psychic: ["Mewtwo", "Alakazam", "Iron Valiant"],
                              Poison: ["Gengar", "Toxapex", "Galarian Slowking"],
                              Rock: ["Tyranitar", "Garganacl", "Terrakion"],
                              Bug: ["Volcarona", "Scizor", "Pheromosa"],
                              Ghost: ["Dragapult", "Gholdengo", "Gengar"],
                              Dark: ["Kingambit", "Darkrai", "Tyranitar"],
                              Dragon: ["Dragapult", "Garchomp", "Roaring Moon"],
                              Steel: ["Gholdengo", "Heatran", "Kingambit"],
                              Fairy: ["Clefable", "Flutter Mane", "Iron Valiant"],
                              Normal: []
                            };

                            const SE_MAP: Record<string, string[]> = {
                              Normal: [], Fire: ["Grass","Ice","Bug","Steel"], Water: ["Fire","Ground","Rock"],
                              Electric: ["Water","Flying"], Grass: ["Water","Ground","Rock"], Ice: ["Grass","Ground","Flying","Dragon"],
                              Fighting: ["Normal","Ice","Rock","Dark","Steel"], Poison: ["Grass","Fairy"],
                              Ground: ["Fire","Electric","Poison","Rock","Steel"], Flying: ["Grass","Fighting","Bug"],
                              Psychic: ["Fighting","Poison"], Bug: ["Grass","Psychic","Dark"],
                              Rock: ["Fire","Ice","Flying","Bug"], Ghost: ["Psychic","Ghost"],
                              Dragon: ["Dragon"], Dark: ["Psychic","Ghost"], Steel: ["Ice","Rock","Fairy"],
                              Fairy: ["Fighting","Dragon","Dark"]
                            };

                            const threats: string[] = [];
                            pokemonData.types.forEach(t => {
                              const mapped = mapTypeName(t.type.name);
                              const weakAgainst = Object.entries(SE_MAP).filter(([, victims]) => victims.includes(mapped));
                              weakAgainst.forEach(([attType]) => {
                                const checks = COMMON_THREATS[attType] || [];
                                threats.push(...checks);
                              });
                            });

                            const uniqueThreats = [...new Set(threats)];
                            return uniqueThreats.length > 0 ? (
                              <p>{uniqueThreats.slice(0, 5).join(", ")} sont des checks courants.</p>
                            ) : (
                              <p>Pas de faiblesses importantes — excellente couverture défensive !</p>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                {frDesc && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <h4 className="font-semibold text-zinc-200 mb-1 text-sm">Description Pokédex</h4>
                    <p className="text-sm text-zinc-400 italic">{frDesc}</p>
                  </div>
                )}

                {/* Evolution Chain */}
                {evoChain.length > 1 && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <h4 className="font-semibold text-zinc-200 mb-3 text-sm">Chaîne d'Évolution</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {evoChain.map((evo, i) => (
                        <div key={evo.name} className="flex items-center gap-2">
                          {i > 0 && (
                            <span className="text-zinc-600 text-xs">
                              → {evo.level ? `Niv.${evo.level}` : evo.trigger === "use-item" ? "Pierre" : evo.trigger === "trade" ? "Échange" : ""}
                            </span>
                          )}
                          <button
                            onClick={() => setSelectedName(evo.name)}
                            className={`px-2 py-1 rounded text-sm font-medium transition ${
                              evo.name === pokemonData.name ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            }`}
                          >
                            {capitalize(evo.name)}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Moves - clickable with detail */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <h4 className="font-semibold text-zinc-200 mb-2 text-sm">
                    Moves disponibles <span className="text-zinc-500 font-normal">({pokemonData.moves.length} — clique pour détails)</span>
                  </h4>
                  <div className="flex flex-wrap gap-1 max-h-[220px] overflow-y-auto mb-3">
                    {pokemonData.moves.map(m => (
                      <button
                        key={m.move.name}
                        onClick={async () => {
                          setMoveLoading(true);
                          setInspectedMove(null);
                          try { const md = await fetchMove(m.move.name); setInspectedMove(md); } catch { /* */ }
                          setMoveLoading(false);
                        }}
                        className={`text-[11px] px-1.5 py-0.5 rounded transition hover:bg-zinc-700 hover:text-zinc-100 ${
                          inspectedMove?.name === m.move.name ? 'bg-red-900/40 text-red-300 ring-1 ring-red-500' : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {capitalize(m.move.name)}
                      </button>
                    ))}
                  </div>

                  {/* Move detail inline */}
                  {moveLoading && <div className="text-xs text-zinc-500 animate-pulse py-2">Chargement du move...</div>}
                  {inspectedMove && !moveLoading && (
                    <div className="border-t border-zinc-800 pt-3 mt-2">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h5 className="font-semibold text-sm text-zinc-100">{capitalize(inspectedMove.name)}</h5>
                        <TypeBadge name={inspectedMove.type.name} />
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getDamageClassColor(inspectedMove.damage_class.name)}`}>
                          {mapDamageClass(inspectedMove.damage_class.name)}
                        </span>
                        <button onClick={() => setInspectedMove(null)} className="ml-auto text-zinc-600 text-xs hover:text-zinc-400">✕</button>
                      </div>
                      <div className="flex gap-4 text-xs text-zinc-400 mb-2">
                        <span>Puissance: <strong className="text-zinc-200">{inspectedMove.power ?? "—"}</strong></span>
                        <span>Précision: <strong className="text-zinc-200">{inspectedMove.accuracy ? `${inspectedMove.accuracy}%` : "—"}</strong></span>
                        <span>PP: <strong className="text-zinc-200">{inspectedMove.pp}</strong></span>
                        {inspectedMove.priority !== 0 && (
                          <span>Priorité: <strong className={inspectedMove.priority > 0 ? "text-green-400" : "text-red-400"}>
                            {inspectedMove.priority > 0 ? "+" : ""}{inspectedMove.priority}
                          </strong></span>
                        )}
                      </div>
                      {getMoveFrenchFlavor(inspectedMove) && (
                        <p className="text-xs text-zinc-400 italic mb-1">{getMoveFrenchFlavor(inspectedMove)}</p>
                      )}
                      {inspectedMove.meta && (
                        <div className="flex flex-wrap gap-2 text-[10px] mt-1">
                          {inspectedMove.meta.ailment.name !== "none" && (
                            <span className="bg-purple-900/30 text-purple-300 px-1.5 py-0.5 rounded">
                              {inspectedMove.meta.ailment.name} {inspectedMove.meta.ailment_chance > 0 ? `${inspectedMove.meta.ailment_chance}%` : '100%'}
                            </span>
                          )}
                          {inspectedMove.meta.flinch_chance > 0 && (
                            <span className="bg-yellow-900/30 text-yellow-300 px-1.5 py-0.5 rounded">Flinch {inspectedMove.meta.flinch_chance}%</span>
                          )}
                          {inspectedMove.meta.drain !== 0 && (
                            <span className="bg-green-900/30 text-green-300 px-1.5 py-0.5 rounded">{inspectedMove.meta.drain > 0 ? 'Drain' : 'Recul'} {Math.abs(inspectedMove.meta.drain)}%</span>
                          )}
                          {inspectedMove.meta.healing !== 0 && (
                            <span className="bg-green-900/30 text-green-300 px-1.5 py-0.5 rounded">Soin {inspectedMove.meta.healing}%</span>
                          )}
                          {inspectedMove.meta.crit_rate > 0 && (
                            <span className="bg-red-900/30 text-red-300 px-1.5 py-0.5 rounded">Crit +{inspectedMove.meta.crit_rate}</span>
                          )}
                          {inspectedMove.stat_changes.length > 0 && inspectedMove.stat_changes.map(sc => (
                            <span key={sc.stat.name} className={`px-1.5 py-0.5 rounded ${sc.change > 0 ? 'bg-blue-900/30 text-blue-300' : 'bg-red-900/30 text-red-300'}`}>
                              {sc.change > 0 ? '+' : ''}{sc.change} {capitalize(sc.stat.name)} {inspectedMove.meta && inspectedMove.meta.stat_chance > 0 ? `${inspectedMove.meta.stat_chance}%` : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ============ FAVORITES VIEW ============ */}
      {view === 'favorites' && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">Tes Pokémon favoris sauvegardés localement.</p>
          {favorites.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-10 text-center">
              <p className="text-3xl mb-3 text-zinc-600">♡</p>
              <p className="text-sm text-zinc-400">Aucun favori pour l'instant.</p>
              <p className="text-xs text-zinc-600 mt-1">Clique sur ♡ dans la fiche d'un Pokémon pour l'ajouter.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {favorites.map(name => (
                <div key={name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center gap-3">
                  <button
                    className="flex-1 text-left"
                    onClick={() => { setSelectedName(name); setView('api'); }}
                  >
                    <p className="font-medium text-zinc-200">{capitalize(name)}</p>
                    <p className="text-xs text-zinc-500">Voir dans le Pokédex</p>
                  </button>
                  <button
                    onClick={() => toggleFavorite(name)}
                    className="text-red-400 hover:text-red-300 text-xl leading-none transition-colors"
                    title="Retirer des favoris"
                  >
                    ♥
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============ CURATED VIEW ============ */}
      {view === 'curated' && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Fiches stratégiques détaillées avec sets recommandés, analyses et notes compétitives.
          </p>
          <div className="flex flex-wrap gap-1">
            {curatedAllRoles.slice(0, 8).map(r => (
              <button key={r} onClick={() => setCuratedRoleFilter(r)}
                className={`px-2 py-1 text-[11px] rounded ${curatedRoleFilter === r ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>{r}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-[260px_1fr] gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto">
                {curatedFiltered.map(p => (
                  <button key={p.name} onClick={() => setSelectedCurated(p.name)}
                    className={`w-full text-left px-3 py-2.5 border-b border-zinc-800/50 transition ${selectedCurated === p.name ? 'bg-zinc-800 border-l-2 border-l-red-500' : 'hover:bg-zinc-800/50'}`}>
                    <p className="font-medium text-sm text-zinc-200">{p.name}</p>
                    <div className="flex gap-1 mt-0.5">
                      {p.types.filter(Boolean).map(t => {
                        const color = TYPE_COLORS[t!] || '#888';
                        const fr = TYPES.find(ty => ty.name === t!)?.nameFr || t!;
                        return <span key={t!} className="inline-block px-1 py-0.5 rounded text-[9px] font-medium text-white" style={{ backgroundColor: color }}>{fr}</span>;
                      })}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {curatedPkm && (
              <div className="space-y-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className="text-xl font-bold text-zinc-100">{curatedPkm.name}</h3>
                    <div className="flex gap-1">
                      {curatedPkm.types.filter(Boolean).map(t => {
                        const color = TYPE_COLORS[t!] || '#888';
                        const fr = TYPES.find(ty => ty.name === t!)?.nameFr || t!;
                        return <span key={t!} className="inline-block px-2 py-1 rounded text-xs font-medium text-white" style={{ backgroundColor: color }}>{fr}</span>;
                      })}
                    </div>
                    <span className="text-xs text-zinc-500">{curatedPkm.tier}</span>
                    <button
                      onClick={() => toggleFavorite(curatedPkm.name.toLowerCase().replace(" ", "-"))}
                      className={`ml-auto text-xl leading-none transition-colors ${favorites.includes(curatedPkm.name.toLowerCase().replace(" ", "-")) ? 'text-red-400' : 'text-zinc-600 hover:text-zinc-400'}`}
                      title={favorites.includes(curatedPkm.name.toLowerCase().replace(" ", "-")) ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      {favorites.includes(curatedPkm.name.toLowerCase().replace(" ", "-")) ? '♥' : '♡'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {curatedPkm.role.map(r => <span key={r} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">{r}</span>)}
                  </div>
                  <div className="space-y-1.5 mb-4">
                    {curatedPkm.baseStats.map((val, i) => (
                      <StatBar key={i} label={STAT_LABELS[i]} value={val} max={200} color={STAT_COLORS[i]} index={i} />
                    ))}
                    <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
                      <span className="text-[10px] text-zinc-500 w-14 text-right">BST</span>
                      <span className="text-xs font-mono font-bold text-zinc-300 w-8 text-right">{curatedBst}</span>
                      <div className="flex-1 bg-zinc-800 rounded-full h-3 overflow-hidden">
                        <div className="h-full rounded-full bg-zinc-500" style={{ width: `${(curatedBst / 720) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Talents</p>
                      <div className="flex flex-wrap gap-1">
                        {curatedPkm.keyAbilities.map(a => <span key={a} className="text-xs bg-yellow-900/30 text-yellow-300 px-2 py-0.5 rounded">{a}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Moves clés</p>
                      <div className="flex flex-wrap gap-1">
                        {curatedPkm.keyMoves.map(m => <span key={m} className="text-xs bg-blue-900/30 text-blue-300 px-1.5 py-0.5 rounded">{m}</span>)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <h4 className="font-semibold text-zinc-200 mb-2">Analyse Compétitive</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">{curatedPkm.notes}</p>
                </div>

                {curatedPkm.commonSets.map(set => (
                  <div key={set.name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-semibold text-sm text-red-400">{set.name}</h5>
                      {set.format && (
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${set.format === 'VGC' ? 'bg-purple-900/50 text-purple-300' : 'bg-blue-900/50 text-blue-300'}`}>
                          {set.format}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="bg-zinc-800/80 rounded p-2 border-l-2 border-l-yellow-500"><span className="text-zinc-500">Objet:</span> <span className="text-yellow-400 font-medium ml-1">{set.item}</span></div>
                      <div className="bg-zinc-800/50 rounded p-2"><span className="text-zinc-500">Talent:</span> <span className="text-zinc-200 ml-1">{set.ability}</span></div>
                      <div className="bg-zinc-800/50 rounded p-2"><span className="text-zinc-500">Nature:</span> <span className="text-zinc-200 ml-1">{set.nature}</span></div>
                      <div className="bg-zinc-800/50 rounded p-2"><span className="text-zinc-500">EVs:</span> <span className="text-zinc-200 ml-1">{set.evs}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {set.moves.map(m => <span key={m} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded font-medium">{m}</span>)}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{set.description}</p>
                  </div>
                ))}

                {/* Quick API link */}
                <button
                  onClick={() => { setSelectedName(curatedPkm.name.toLowerCase().replace(" ", "-")); setView('api'); }}
                  className="text-xs text-red-400 hover:text-red-300 underline"
                >
                  Voir dans le Pokédex API (artwork, moves complets, évolutions)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ability tooltip — fixed to viewport, never clipped */}
      {abilityTooltip && (
        <div
          className="fixed z-[9999] w-64 bg-zinc-800 border border-zinc-600 rounded-lg p-2.5 shadow-xl pointer-events-none"
          style={{
            left: Math.min(abilityTooltip.x, window.innerWidth - 272),
            top: abilityTooltip.y > 160 ? abilityTooltip.y - 8 - 80 : abilityTooltip.y + 28,
          }}
        >
          <p className="text-xs font-semibold text-zinc-100 mb-1">{capitalize(abilityTooltip.name)}</p>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {abilityCache[abilityTooltip.name] ?? "Chargement..."}
          </p>
        </div>
      )}
    </div>
  );
}
