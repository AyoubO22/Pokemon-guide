import { useState, useEffect } from 'react'
import { fetchPokemonList, fetchPokemon, capitalize, mapTypeName, type PokemonData, type PokemonListEntry } from '../data/pokeapi'
import { TYPE_COLORS, TYPES, getDualTypeDefense } from '../data/types'

// Type effectiveness for offense coverage
const TYPE_EFFECTIVENESS: Record<string, string[]> = {
  Normal: [], Fire: ["Grass", "Ice", "Bug", "Steel"], Water: ["Fire", "Ground", "Rock"],
  Electric: ["Water", "Flying"], Grass: ["Water", "Ground", "Rock"], Ice: ["Grass", "Ground", "Flying", "Dragon"],
  Fighting: ["Normal", "Ice", "Rock", "Dark", "Steel"], Poison: ["Grass", "Fairy"],
  Ground: ["Fire", "Electric", "Poison", "Rock", "Steel"], Flying: ["Grass", "Fighting", "Bug"],
  Psychic: ["Fighting", "Poison"], Bug: ["Grass", "Psychic", "Dark"],
  Rock: ["Fire", "Ice", "Flying", "Bug"], Ghost: ["Psychic", "Ghost"],
  Dragon: ["Dragon"], Dark: ["Psychic", "Ghost"], Steel: ["Ice", "Rock", "Fairy"],
  Fairy: ["Fighting", "Dragon", "Dark"]
};

interface TeamMember {
  pokemon: PokemonData;
  role?: string;
}

function TypeBadge({ name, small = false }: { name: string; small?: boolean }) {
  const color = TYPE_COLORS[name] || '#888';
  const frName = TYPES.find(t => t.name === name)?.nameFr || name;
  return (
    <span
      className={`inline-block rounded font-medium text-white ${small ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'}`}
      style={{ backgroundColor: color }}
    >
      {frName}
    </span>
  );
}

function getStatValue(pokemon: PokemonData, statName: string): number {
  const stat = pokemon.stats.find(s => s.stat.name === statName);
  return stat?.base_stat || 0;
}

function calculateBST(pokemon: PokemonData): number {
  return pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
}

function detectRole(pokemon: PokemonData): string {
  const spd = getStatValue(pokemon, 'speed');
  const atk = getStatValue(pokemon, 'attack');
  const spa = getStatValue(pokemon, 'special-attack');
  const def = getStatValue(pokemon, 'defense');
  const spd_stat = getStatValue(pokemon, 'special-defense');

  if (spd < 50) return 'Trick Room';
  if (spd >= 100) return 'Rapide';
  if (atk >= 100 || spa >= 100) return 'Attaquant';
  if (def >= 100 || spd_stat >= 100) return 'Défensif';
  return 'Généraliste';
}

interface SearchPopupProps {
  isOpen: boolean;
  pokemonList: PokemonListEntry[];
  onSelect: (entry: PokemonListEntry) => void;
  onClose: () => void;
}

function SearchPopup({ isOpen, pokemonList, onSelect, onClose }: SearchPopupProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filtered = pokemonList
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 50);

  const handleSelect = async (entry: PokemonListEntry) => {
    setIsLoading(true);
    onSelect(entry);
    setSearchTerm('');
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="text-lg font-bold mb-3">Sélectionner un Pokémon</h3>
          <input
            type="text"
            placeholder="Chercher par nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-zinc-400">
              {pokemonList.length === 0 ? 'Chargement...' : 'Aucun résultat'}
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {filtered.map((entry) => (
                <button
                  key={entry.name}
                  onClick={() => handleSelect(entry)}
                  disabled={isLoading}
                  className="w-full p-3 text-left hover:bg-zinc-800 transition disabled:opacity-50"
                >
                  <span className="text-white font-medium">{capitalize(entry.name)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="w-full px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-white transition text-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamSlot({ pokemon, onRemove, onAdd }: { pokemon: TeamMember | null; onRemove: () => void; onAdd: () => void }) {
  if (!pokemon) {
    return (
      <button
        onClick={onAdd}
        className="bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-lg p-6 hover:border-red-600 hover:bg-zinc-800 transition text-center"
      >
        <div className="text-zinc-400 text-sm">Cliquer pour ajouter</div>
      </button>
    );
  }

  const bst = calculateBST(pokemon.pokemon);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-bold text-white mb-1">{capitalize(pokemon.pokemon.name)}</h4>
          <div className="flex gap-1 flex-wrap mb-2">
            {pokemon.pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} name={mapTypeName(t.type.name)} small />
            ))}
          </div>
          {pokemon.role && (
            <div className="text-xs text-zinc-400 mb-2">
              Rôle: <span className="text-red-400 font-medium">{pokemon.role}</span>
            </div>
          )}
          <div className="text-xs text-zinc-500">
            BST: <span className="text-zinc-300 font-medium">{bst}</span>
          </div>
        </div>
        {pokemon.pokemon.sprites.other?.["official-artwork"]?.front_default && (
          <img
            src={pokemon.pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.pokemon.name}
            className="w-16 h-16 object-contain"
          />
        )}
      </div>
      <button
        onClick={onRemove}
        className="w-full px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded text-xs font-medium transition"
      >
        Retirer
      </button>
    </div>
  );
}

export function TeamBuilderSection() {
  const [team, setTeam] = useState<(TeamMember | null)[]>(Array(6).fill(null));
  const [pokemonList, setPokemonList] = useState<PokemonListEntry[]>([]);
  const [showSearch, setShowSearch] = useState<number | null>(null);
  // Load full Pokémon list on mount
  useEffect(() => {
    const loadList = async () => {
      try {
        const list = await fetchPokemonList();
        setPokemonList(list);
      } catch (error) {
        console.error('Erreur lors du chargement de la liste:', error);
      }
    };
    loadList();
  }, []);

  const handleSelectPokemon = async (index: number, entry: PokemonListEntry) => {
    try {
      const pokemon = await fetchPokemon(entry.name);
      const role = detectRole(pokemon);
      const newTeam = [...team];
      newTeam[index] = { pokemon, role };
      setTeam(newTeam);
      setShowSearch(null);
    } catch (error) {
      console.error('Erreur lors du chargement du Pokémon:', error);
    }
  };

  const handleRemove = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  // === Analysis Panel ===

  // Type Defense Analysis
  const typeDefenseChart = (() => {
    const chart: Record<string, { weak: number; resist: number; immune: number }> = {};
    TYPES.forEach(t => {
      chart[t.name] = { weak: 0, resist: 0, immune: 0 };
    });

    team.forEach((slot) => {
      if (!slot) return;
      const pokemon = slot.pokemon;
      const type1 = mapTypeName(pokemon.types[0].type.name);
      const type2 = pokemon.types[1] ? mapTypeName(pokemon.types[1].type.name) : null;

      const defense = getDualTypeDefense(type1, type2);

      for (const [atkType, multiplier] of Object.entries(defense)) {
        if (multiplier > 1) {
          chart[atkType].weak++;
        } else if (multiplier < 1 && multiplier > 0) {
          chart[atkType].resist++;
        } else if (multiplier === 0) {
          chart[atkType].immune++;
        }
      }
    });

    return chart;
  })();

  const problematicTypes = Object.entries(typeDefenseChart)
    .filter(([, stats]) => stats.weak >= 3)
    .map(([type]) => type);

  // Type Coverage Analysis
  const typeCoverage = (() => {
    const covered = new Set<string>();
    team.forEach((slot) => {
      if (!slot) return;
      const pokemon = slot.pokemon;
      pokemon.types.forEach((t) => {
        const mappedType = mapTypeName(t.type.name);
        const coverage = TYPE_EFFECTIVENESS[mappedType] || [];
        coverage.forEach(type => covered.add(type));
      });
    });
    return covered;
  })();

  const uncoveredTypes = TYPES
    .map(t => t.name)
    .filter(type => !typeCoverage.has(type));

  // Role detection summary
  const roleCount = (() => {
    const counts: Record<string, number> = {};
    team.forEach((slot) => {
      if (!slot || !slot.role) return;
      counts[slot.role] = (counts[slot.role] || 0) + 1;
    });
    return counts;
  })();

  const warnings: string[] = [];
  if (roleCount['Rapide'] === 0) warnings.push('Aucun Pokémon rapide (Vitesse >= 100)');
  if (roleCount['Attaquant'] === 0) warnings.push('Aucun attaquant');
  if (roleCount['Défensif'] === 0) warnings.push('Aucune défense');
  if (uncoveredTypes.length > 0 && team.some(s => s)) {
    warnings.push(`Couverture incomplète: ${uncoveredTypes.slice(0, 3).map(t => TYPES.find(ty => ty.name === t)?.nameFr).join(', ')}...`);
  }

  // BST overview
  const teamBSTs = team.map((slot) => slot ? calculateBST(slot.pokemon) : 0);
  const avgBST = team.filter(s => s).length > 0
    ? Math.round(teamBSTs.reduce((a, b) => a + b) / team.filter(s => s).length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Constructeur d'Équipe</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
          Construisez votre équipe compétitive et analysez sa synergie. Vérifiez la couverture de type,
          les faiblesses collectives, et les rôles de chaque Pokémon pour optimiser votre stratégie.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {team.map((pokemon, index) => (
          <div key={index}>
            <div className="text-xs text-zinc-500 mb-2 font-medium">#{index + 1}</div>
            <TeamSlot
              pokemon={pokemon}
              onAdd={() => setShowSearch(index)}
              onRemove={() => handleRemove(index)}
            />
          </div>
        ))}
      </div>

      {/* Search Popup */}
      <SearchPopup
        isOpen={showSearch !== null}
        pokemonList={pokemonList}
        onSelect={(entry) => handleSelectPokemon(showSearch!, entry)}
        onClose={() => setShowSearch(null)}
      />

      {/* Only show analysis if team has at least one Pokémon */}
      {team.some(s => s) && (
        <div className="space-y-6">
          {/* Type Defense Chart */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <h3 className="text-lg font-bold mb-4">Analyse de Défense</h3>
            <div className="grid grid-cols-6 md:grid-cols-9 gap-2">
              {TYPES.map((t) => {
                const stats = typeDefenseChart[t.name];
                const isProblematic = problematicTypes.includes(t.name);
                return (
                  <div
                    key={t.name}
                    className={`p-3 rounded-lg border ${isProblematic ? 'border-red-600/50 bg-red-900/20' : 'border-zinc-700 bg-zinc-800/50'}`}
                  >
                    <div className="text-[10px] font-semibold text-zinc-400 mb-2 uppercase text-center">
                      {t.nameFr}
                    </div>
                    <div className="space-y-1 text-[10px] font-medium">
                      {stats.weak > 0 && (
                        <div className="text-red-400">Faible: {stats.weak}</div>
                      )}
                      {stats.resist > 0 && (
                        <div className="text-green-400">Résiste: {stats.resist}</div>
                      )}
                      {stats.immune > 0 && (
                        <div className="text-blue-400">Immunité: {stats.immune}</div>
                      )}
                      {stats.weak === 0 && stats.resist === 0 && stats.immune === 0 && (
                        <div className="text-zinc-500">—</div>
                      )}
                    </div>
                    {isProblematic && (
                      <div className="text-[9px] text-red-400 mt-1 font-semibold">! Risqué</div>
                    )}
                  </div>
                );
              })}
            </div>
            {problematicTypes.length > 0 && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-600/50 rounded text-sm text-red-300">
                <strong>Attention:</strong> {problematicTypes.length} type(s) contre lequel(s) 3+ Pokémon sont faibles.
              </div>
            )}
          </div>

          {/* Type Coverage */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <h3 className="text-lg font-bold mb-4">Couverture Offensive (STAB)</h3>
            <div className="mb-4">
              <p className="text-xs text-zinc-400 mb-3">
                Types couverts en super efficace par au moins un Pokémon :
              </p>
              <div className="flex flex-wrap gap-2">
                {typeCoverage.size > 0 ? (
                  Array.from(typeCoverage)
                    .sort()
                    .map(type => (
                      <TypeBadge key={type} name={type} small />
                    ))
                ) : (
                  <span className="text-xs text-zinc-500">Aucune couverture</span>
                )}
              </div>
            </div>
            {uncoveredTypes.length > 0 && (
              <div className="p-3 bg-orange-900/20 border border-orange-600/50 rounded">
                <p className="text-xs text-orange-300 mb-2">
                  <strong>Types non couverts:</strong>
                </p>
                <div className="flex flex-wrap gap-1">
                  {uncoveredTypes.map(type => (
                    <TypeBadge key={type} name={type} small />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Detection & Warnings */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <h3 className="text-lg font-bold mb-4">Analyse de Rôles</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {['Rapide', 'Attaquant', 'Défensif', 'Trick Room'].map(role => (
                <div key={role} className="bg-zinc-800 rounded p-3 text-center">
                  <div className="text-xs text-zinc-400 mb-1">{role}</div>
                  <div className="text-2xl font-bold text-red-400">
                    {roleCount[role] || 0}
                  </div>
                </div>
              ))}
            </div>

            {warnings.length > 0 && (
              <div className="space-y-2">
                {warnings.map((warning, i) => (
                  <div key={i} className="p-3 bg-yellow-900/20 border border-yellow-600/50 rounded text-sm text-yellow-300">
                    ! {warning}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BST Overview */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <h3 className="text-lg font-bold mb-4">Résumé BST</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Moyennes équipe:</span>
                <span className="text-lg font-bold text-red-400">{avgBST}</span>
              </div>
              <div className="space-y-2">
                {team.map((slot, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">
                      #{i + 1} {slot ? capitalize(slot.pokemon.name) : '(vide)'}
                    </span>
                    <div className="flex items-center gap-2 flex-1 ml-4">
                      <div className="flex-1 h-2 bg-zinc-800 rounded overflow-hidden">
                        {slot && (
                          <div
                            className="h-full bg-red-600"
                            style={{ width: `${(calculateBST(slot.pokemon) / 720) * 100}%` }}
                          />
                        )}
                      </div>
                      {slot && (
                        <span className="text-xs font-medium text-zinc-300 w-10 text-right">
                          {calculateBST(slot.pokemon)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state message */}
      {!team.some(s => s) && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center text-zinc-400">
          Commencez par ajouter un Pokémon à votre équipe pour voir l'analyse.
        </div>
      )}
    </div>
  );
}
