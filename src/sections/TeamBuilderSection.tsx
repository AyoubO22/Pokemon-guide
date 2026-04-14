import { useState, useEffect, useRef } from 'react'
import { fetchPokemonList, fetchPokemon, capitalize, mapTypeName, type PokemonData, type PokemonListEntry } from '../data/pokeapi'
import { TYPE_COLORS, TYPES, getDualTypeDefense } from '../data/types'

function toShowdownName(name: string): string {
  return name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('-');
}

function toShowdownAbility(raw: string): string {
  return raw.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function toShowdownExport(team: (TeamMember | null)[]): string {
  return team
    .filter((s): s is TeamMember => s !== null)
    .map(slot => {
      const p = slot.pokemon;
      const name = toShowdownName(p.name);
      const abilityRaw = p.abilities.find(a => !a.is_hidden)?.ability.name || p.abilities[0]?.ability.name || '';
      const ability = abilityRaw ? toShowdownAbility(abilityRaw) : '';
      const item = slot.item ? ` @ ${slot.item}` : '';
      const moves = Array(4).fill('').map((_, i) => slot.moves?.[i] || '');
      return [
        `${name}${item}`,
        ability ? `Ability: ${ability}` : '',
        'Level: 100',
        'EVs: 252 Atk / 4 SpD / 252 Spe',
        'Jolly Nature',
        ...moves.map(m => m ? `- ${m}` : '- '),
      ].filter(Boolean).join('\n');
    })
    .join('\n\n');
}

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
  item?: string;
  moves?: string[]; // 4 move names (formatted for Showdown: "Dragon Claw")
}

interface SavedTeam {
  id: string;
  name: string;
  members: { pokemonName: string; role: string; item?: string; moves?: string[] }[];
  explanation?: string;
  savedAt: number;
}

const COMPETITIVE_ITEMS: { group: string; items: string[] }[] = [
  { group: 'Récupération', items: ['Leftovers', 'Black Sludge', 'Shell Bell'] },
  { group: 'Défensif', items: ['Rocky Helmet', 'Assault Vest', 'Eviolite', 'Focus Sash', 'Air Balloon', 'Heavy-Duty Boots', 'Safety Goggles', 'Covert Cloak', 'Shed Shell'] },
  { group: 'Choice', items: ['Choice Band', 'Choice Specs', 'Choice Scarf'] },
  { group: 'Puissance', items: ['Life Orb', 'Expert Belt', 'Muscle Band', 'Wise Glasses', 'Scope Lens', 'Razor Claw', 'Loaded Dice', 'Punching Glove', 'Throat Spray'] },
  { group: 'Setup', items: ['Weakness Policy', 'Booster Energy', 'White Herb', 'Power Herb', 'Mental Herb', 'Mirror Herb', 'Blunder Policy', 'Clear Amulet'] },
  { group: 'Terrain / Météo', items: ['Terrain Extender', 'Light Clay', 'Heat Rock', 'Damp Rock', 'Smooth Rock', 'Icy Rock'] },
  { group: 'Status', items: ['Flame Orb', 'Toxic Orb', 'Iron Ball', 'Lagging Tail'] },
  { group: 'Baies récup.', items: ['Sitrus Berry', 'Lum Berry', 'Iapapa Berry'] },
  { group: 'Baies résist.', items: ['Occa Berry', 'Passho Berry', 'Wacan Berry', 'Rindo Berry', 'Yache Berry', 'Chople Berry', 'Shuca Berry', 'Coba Berry', 'Payapa Berry', 'Kasib Berry', 'Haban Berry', 'Colbur Berry', 'Babiri Berry', 'Roseli Berry'] },
  { group: 'Baies pinch', items: ['Salac Berry', 'Petaya Berry', 'Liechi Berry', 'Apicot Berry', 'Custap Berry'] },
];

function moveFmt(raw: string): string {
  return raw.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function generateTeamExplanation(members: TeamMember[]): string {
  if (members.length === 0) return '';
  const roles = members.map(m => m.role || detectRole(m.pokemon));
  const trCount = roles.filter(r => r === 'Trick Room').length;
  const fastCount = roles.filter(r => r === 'Rapide').length;
  const atkCount = roles.filter(r => r === 'Attaquant').length;
  const defCount = roles.filter(r => r === 'Défensif').length;

  const lines: string[] = [];

  // Archetype
  if (trCount >= 2) {
    const setters = members.filter(m => (m.role || detectRole(m.pokemon)) === 'Trick Room').map(m => capitalize(m.pokemon.name));
    lines.push(`Archétype : Trick Room — pose le Trick Room avec ${setters.join(' ou ')} pour inverser les vitesses. Priorise les Pokémon lents et puissants.`);
  } else if (fastCount >= 3 && atkCount >= 1) {
    lines.push(`Archétype : Hyper Offensif — vitesse et pression maximales dès le départ. Elimine les menaces avant qu'elles agissent.`);
  } else if (defCount >= 3) {
    lines.push(`Archétype : Stall/Balance — attrition et switchs sécurisés. Use l'adversaire et capitalise sur les fautes.`);
  } else if (atkCount >= 2 && defCount >= 1) {
    lines.push(`Archétype : Balance — allie pression offensive et socle défensif pour s'adapter à tous les archétypes.`);
  } else {
    lines.push(`Équipe polyvalente — adapte ton style selon les matchups adverses.`);
  }

  // Key roles
  const attackers = members.filter(m => ['Attaquant', 'Rapide'].includes(m.role || detectRole(m.pokemon)));
  const walls = members.filter(m => (m.role || detectRole(m.pokemon)) === 'Défensif');
  if (attackers.length) lines.push(`Menaces offensives : ${attackers.map(m => capitalize(m.pokemon.name)).join(', ')}.`);
  if (walls.length) lines.push(`Noyau défensif : ${walls.map(m => capitalize(m.pokemon.name)).join(', ')} — absorbent les coups et sécurisent les switchs.`);

  // Items hints
  const choiceUsers = members.filter(m => m.item?.startsWith('Choice'));
  if (choiceUsers.length) lines.push(`${choiceUsers.map(m => capitalize(m.pokemon.name)).join(', ')} ${choiceUsers.length > 1 ? 'sont verrouillés' : 'est verrouillé'} sur un move — engage uniquement sur des switchs prédictibles.`);
  if (members.some(m => m.item === 'Focus Sash')) lines.push(`Le Focus Sash protège contre les OHKO — garde les PV au max avant l'engagement.`);
  if (members.some(m => m.item === 'Life Orb')) lines.push(`Life Orb : puissance maximale avec souplesse de move, mais surveille les PV.`);
  if (members.some(m => m.item === 'Booster Energy' || m.item === 'Weakness Policy')) lines.push(`Déclenche Booster Energy / Weakness Policy dès le bon moment pour une montée en puissance décisive.`);

  // Win condition
  const closers = attackers.length ? attackers.map(m => capitalize(m.pokemon.name)).join(' ou ') : members.map(m => capitalize(m.pokemon.name))[0];
  lines.push(`Condition de victoire : établis le contrôle (${trCount > 0 ? 'Trick Room, ' : ''}${fastCount > 0 ? 'vitesse, ' : ''}${defCount > 0 ? 'attrition' : 'pression'}), puis conclue avec ${closers}.`);

  return lines.join('\n\n');
}

const LS_KEY = 'team_builder_saved_teams';

function loadSavedTeams(): SavedTeam[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}

function persistSavedTeams(teams: SavedTeam[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(teams)); } catch { /* ignore */ }
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

function TeamSlot({
  pokemon, onRemove, onAdd, onItemChange, onMoveChange,
}: {
  pokemon: TeamMember | null;
  onRemove: () => void;
  onAdd: () => void;
  onItemChange: (item: string) => void;
  onMoveChange: (index: number, move: string) => void;
}) {
  if (!pokemon) {
    return (
      <button
        onClick={onAdd}
        className="bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-lg p-6 hover:border-red-600 hover:bg-zinc-800 transition text-center w-full"
      >
        <div className="text-zinc-400 text-sm">Cliquer pour ajouter</div>
      </button>
    );
  }

  const bst = calculateBST(pokemon.pokemon);
  const availableMoves = pokemon.pokemon.moves.map(m => moveFmt(m.move.name));

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white mb-1 truncate">{capitalize(pokemon.pokemon.name)}</h4>
          <div className="flex gap-1 flex-wrap mb-1.5">
            {pokemon.pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} name={mapTypeName(t.type.name)} small />
            ))}
          </div>
          {pokemon.role && (
            <div className="text-[11px] text-zinc-500">
              <span className="text-red-400">{pokemon.role}</span>
              {' · '}BST <span className="text-zinc-300">{bst}</span>
            </div>
          )}
        </div>
        {pokemon.pokemon.sprites.other?.["official-artwork"]?.front_default && (
          <img
            src={pokemon.pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.pokemon.name}
            className="w-14 h-14 object-contain shrink-0"
          />
        )}
      </div>

      {/* Item */}
      <div>
        <label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1 block">Objet</label>
        <select
          value={pokemon.item || ''}
          onChange={e => onItemChange(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-red-600"
        >
          <option value="">— Aucun objet —</option>
          {COMPETITIVE_ITEMS.map(group => (
            <optgroup key={group.group} label={group.group}>
              {group.items.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Moves */}
      <div>
        <label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1 block">Moves</label>
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="relative">
              <input
                list={`moves-${pokemon.pokemon.name}-${i}`}
                placeholder={`Move ${i + 1}`}
                value={pokemon.moves?.[i] || ''}
                onChange={e => onMoveChange(i, e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-600"
              />
              <datalist id={`moves-${pokemon.pokemon.name}-${i}`}>
                {availableMoves.map(m => <option key={m} value={m} />)}
              </datalist>
            </div>
          ))}
        </div>
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

function SavedTeamCard({ saved, loading, onLoad, onDelete }: {
  saved: SavedTeam;
  loading: boolean;
  onLoad: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-zinc-200 truncate">{saved.name}</div>
          <div className="text-[11px] text-zinc-500 truncate">
            {saved.members.map(m => capitalize(m.pokemonName)).join(' · ')}
          </div>
        </div>
        {saved.explanation && (
          <button
            onClick={() => setOpen(v => !v)}
            className="shrink-0 px-2 py-1 text-zinc-500 hover:text-zinc-300 text-xs transition"
            title="Guide de jeu"
          >
            {open ? '▲' : '▼'} Guide
          </button>
        )}
        <button
          onClick={onLoad}
          disabled={loading}
          className="shrink-0 px-2.5 py-1 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-zinc-200 rounded text-xs font-medium transition"
        >
          {loading ? '...' : 'Charger'}
        </button>
        <button
          onClick={onDelete}
          className="shrink-0 px-2 py-1 text-zinc-500 hover:text-red-400 text-xs transition"
          title="Supprimer"
        >
          ✕
        </button>
      </div>
      {open && saved.explanation && (
        <div className="border-t border-zinc-700/50 px-3 py-3 bg-zinc-950/50 space-y-2">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium mb-2">Guide de jeu</p>
          {saved.explanation.split('\n\n').map((para, i) => (
            <p key={i} className="text-xs text-zinc-300 leading-relaxed">{para}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export function TeamBuilderSection() {
  const [team, setTeam] = useState<(TeamMember | null)[]>(Array(6).fill(null));
  const [pokemonList, setPokemonList] = useState<PokemonListEntry[]>([]);
  const [showSearch, setShowSearch] = useState<number | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Saved teams
  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>(loadSavedTeams);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTeamName, setSaveTeamName] = useState('');
  const [loadingTeamId, setLoadingTeamId] = useState<string | null>(null);

  const handleItemChange = (index: number, item: string) => {
    const newTeam = [...team];
    if (newTeam[index]) newTeam[index] = { ...newTeam[index]!, item };
    setTeam(newTeam);
  };

  const handleMoveChange = (slotIndex: number, moveIndex: number, move: string) => {
    const newTeam = [...team];
    if (!newTeam[slotIndex]) return;
    const moves = [...(newTeam[slotIndex]!.moves || ['', '', '', ''])];
    moves[moveIndex] = move;
    newTeam[slotIndex] = { ...newTeam[slotIndex]!, moves };
    setTeam(newTeam);
  };

  const handleSaveTeam = () => {
    const trimmed = saveTeamName.trim();
    if (!trimmed) return;
    const activeMembers = team.filter((s): s is TeamMember => s !== null);
    const explanation = generateTeamExplanation(activeMembers);
    const newEntry: SavedTeam = {
      id: Date.now().toString(),
      name: trimmed,
      members: activeMembers.map(s => ({
        pokemonName: s.pokemon.name,
        role: s.role || '',
        item: s.item,
        moves: s.moves,
      })),
      explanation,
      savedAt: Date.now(),
    };
    const updated = [newEntry, ...savedTeams];
    setSavedTeams(updated);
    persistSavedTeams(updated);
    setSaveTeamName('');
    setShowSaveModal(false);
  };

  const handleLoadTeam = async (saved: SavedTeam) => {
    setLoadingTeamId(saved.id);
    const newTeam: (TeamMember | null)[] = Array(6).fill(null);
    await Promise.all(
      saved.members.map(async (m, i) => {
        try {
          const pokemon = await fetchPokemon(m.pokemonName);
          newTeam[i] = { pokemon, role: m.role, item: m.item, moves: m.moves };
        } catch { /* skip */ }
      })
    );
    setTeam(newTeam);
    setLoadingTeamId(null);
  };

  const handleDeleteTeam = (id: string) => {
    const updated = savedTeams.filter(t => t.id !== id);
    setSavedTeams(updated);
    persistSavedTeams(updated);
  };

  const handleCopy = () => {
    const text = toShowdownExport(team);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
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
      newTeam[index] = { pokemon, role, item: '', moves: ['', '', '', ''] };
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Constructeur d'Équipe</h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
            Construisez votre équipe compétitive et analysez sa synergie. Vérifiez la couverture de type,
            les faiblesses collectives, et les rôles de chaque Pokémon pour optimiser votre stratégie.
          </p>
        </div>
        {team.some(s => s) && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => { setSaveTeamName(''); setShowSaveModal(true); }}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-sm text-zinc-200 font-medium transition flex items-center gap-2"
            >
              <span>💾</span> Sauvegarder
            </button>
            <button
              onClick={() => setShowExport(true)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-sm text-zinc-200 font-medium transition flex items-center gap-2"
            >
              <span>↗</span> Export Showdown
            </button>
          </div>
        )}
      </div>

      {/* Showdown Export Modal */}
      {showExport && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowExport(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="font-bold text-zinc-100">Export Pokémon Showdown</h3>
              <button onClick={() => setShowExport(false)} className="text-zinc-500 hover:text-zinc-300 text-xl leading-none">×</button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-zinc-500">Colle ce texte dans le Team Builder de Pokémon Showdown. Complète les moves, EVs et nature selon ton build.</p>
              <textarea
                ref={textareaRef}
                readOnly
                value={toShowdownExport(team)}
                className="w-full h-64 bg-zinc-950 border border-zinc-800 rounded p-3 text-sm font-mono text-zinc-200 resize-none focus:outline-none"
                onClick={e => (e.target as HTMLTextAreaElement).select()}
              />
              <button
                onClick={handleCopy}
                className={`w-full py-2 rounded text-sm font-medium transition ${copied ? 'bg-green-700 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
              >
                {copied ? '✓ Copié !' : 'Copier dans le presse-papier'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Team Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowSaveModal(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="font-bold text-zinc-100">Sauvegarder l'équipe</h3>
              <button onClick={() => setShowSaveModal(false)} className="text-zinc-500 hover:text-zinc-300 text-xl leading-none">×</button>
            </div>
            <div className="p-4 space-y-4">
              <input
                type="text"
                autoFocus
                placeholder="Nom de l'équipe..."
                value={saveTeamName}
                onChange={e => setSaveTeamName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSaveTeam(); }}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
              />
              {/* Preview explanation */}
              {team.some(s => s) && (
                <div className="bg-zinc-950 border border-zinc-800 rounded p-3 space-y-2">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">Guide de jeu généré</p>
                  {generateTeamExplanation(team.filter((s): s is TeamMember => s !== null))
                    .split('\n\n')
                    .map((para, i) => (
                      <p key={i} className="text-xs text-zinc-300 leading-relaxed">{para}</p>
                    ))}
                </div>
              )}
              <button
                onClick={handleSaveTeam}
                disabled={!saveTeamName.trim()}
                className="w-full py-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Teams */}
      {savedTeams.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="text-sm font-bold text-zinc-300 mb-3">Mes équipes sauvegardées</h3>
          <div className="space-y-2">
            {savedTeams.map(saved => (
              <SavedTeamCard
                key={saved.id}
                saved={saved}
                loading={loadingTeamId === saved.id}
                onLoad={() => handleLoadTeam(saved)}
                onDelete={() => handleDeleteTeam(saved.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Team Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {team.map((pokemon, index) => (
          <div key={index}>
            <div className="text-xs text-zinc-500 mb-2 font-medium">#{index + 1}</div>
            <TeamSlot
              pokemon={pokemon}
              onAdd={() => setShowSearch(index)}
              onRemove={() => handleRemove(index)}
              onItemChange={(item) => handleItemChange(index, item)}
              onMoveChange={(mi, move) => handleMoveChange(index, mi, move)}
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
