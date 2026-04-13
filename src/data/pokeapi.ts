const API_BASE = "https://pokeapi.co/api/v2";

// Cache to avoid re-fetching
const cache: Record<string, unknown> = {};

async function fetchCached<T>(url: string): Promise<T> {
  if (cache[url]) return cache[url] as T;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  cache[url] = data;
  return data as T;
}

// ============ POKEMON ============

export interface PokemonListEntry {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  results: PokemonListEntry[];
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

export interface PokemonType {
  slot: number;
  type: { name: string };
}

export interface PokemonAbility {
  ability: { name: string };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    "official-artwork"?: { front_default?: string | null };
    showdown?: { front_default?: string | null };
  };
}

export interface PokemonMoveEntry {
  move: { name: string; url: string };
  version_group_details: { level_learned_at: number; move_learn_method: { name: string } }[];
}

export interface PokemonData {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
  moves: PokemonMoveEntry[];
}

export interface PokemonSpeciesData {
  flavor_text_entries: { flavor_text: string; language: { name: string }; version: { name: string } }[];
  genera: { genus: string; language: { name: string } }[];
  names: { name: string; language: { name: string } }[];
  generation: { name: string };
  evolution_chain: { url: string };
  is_legendary: boolean;
  is_mythical: boolean;
  capture_rate: number;
}

export interface EvolutionChainLink {
  species: { name: string };
  evolution_details: { trigger: { name: string }; min_level?: number; item?: { name: string } | null }[];
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionChainData {
  chain: EvolutionChainLink;
}

// ============ MOVES ============

export interface MoveMetaData {
  ailment: { name: string };
  ailment_chance: number;
  crit_rate: number;
  drain: number;
  flinch_chance: number;
  healing: number;
  stat_chance: number;
  category: { name: string };
  max_hits: number | null;
  min_hits: number | null;
}

export interface MoveStatChange {
  change: number;
  stat: { name: string };
}

export interface MoveData {
  id: number;
  name: string;
  type: { name: string };
  power: number | null;
  accuracy: number | null;
  pp: number;
  priority: number;
  damage_class: { name: string };
  effect_entries: { effect: string; short_effect: string; language: { name: string } }[];
  flavor_text_entries: { flavor_text: string; language: { name: string }; version_group: { name: string } }[];
  meta: MoveMetaData | null;
  stat_changes: MoveStatChange[];
  target: { name: string };
  generation: { name: string };
  learned_by_pokemon: { name: string; url: string }[];
}

export interface MoveListEntry {
  name: string;
  url: string;
}

export interface MoveListResponse {
  count: number;
  results: MoveListEntry[];
}

// ============ FETCH FUNCTIONS ============

export async function fetchPokemonList(limit = 1025): Promise<PokemonListEntry[]> {
  const data = await fetchCached<PokemonListResponse>(`${API_BASE}/pokemon?limit=${limit}&offset=0`);
  return data.results;
}

export async function fetchPokemon(nameOrId: string | number): Promise<PokemonData> {
  return fetchCached<PokemonData>(`${API_BASE}/pokemon/${nameOrId}`);
}

export async function fetchPokemonSpecies(nameOrId: string | number): Promise<PokemonSpeciesData> {
  return fetchCached<PokemonSpeciesData>(`${API_BASE}/pokemon-species/${nameOrId}`);
}

export async function fetchEvolutionChain(url: string): Promise<EvolutionChainData> {
  return fetchCached<EvolutionChainData>(url);
}

export async function fetchMove(nameOrId: string | number): Promise<MoveData> {
  return fetchCached<MoveData>(`${API_BASE}/move/${nameOrId}`);
}

export async function fetchMoveList(limit = 950): Promise<MoveListEntry[]> {
  const data = await fetchCached<MoveListResponse>(`${API_BASE}/move?limit=${limit}&offset=0`);
  return data.results;
}

// ============ HELPERS ============

export function capitalize(name: string): string {
  return name.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

const TYPE_MAP: Record<string, string> = {
  normal: "Normal", fire: "Fire", water: "Water", electric: "Electric",
  grass: "Grass", ice: "Ice", fighting: "Fighting", poison: "Poison",
  ground: "Ground", flying: "Flying", psychic: "Psychic", bug: "Bug",
  rock: "Rock", ghost: "Ghost", dragon: "Dragon", dark: "Dark",
  steel: "Steel", fairy: "Fairy",
};

export function mapTypeName(apiType: string): string {
  return TYPE_MAP[apiType] || apiType;
}

const STAT_MAP: Record<string, string> = {
  hp: "PV", attack: "Attaque", defense: "Défense",
  "special-attack": "Atq. Spé.", "special-defense": "Déf. Spé.", speed: "Vitesse",
};

export function mapStatName(apiStat: string): string {
  return STAT_MAP[apiStat] || apiStat;
}

const DAMAGE_CLASS_FR: Record<string, string> = {
  physical: "Physique", special: "Spécial", status: "Statut",
};

export function mapDamageClass(dc: string): string {
  return DAMAGE_CLASS_FR[dc] || dc;
}

const DAMAGE_CLASS_COLOR: Record<string, string> = {
  physical: "bg-orange-900/40 text-orange-400",
  special: "bg-blue-900/40 text-blue-400",
  status: "bg-zinc-700 text-zinc-400",
};

export function getDamageClassColor(dc: string): string {
  return DAMAGE_CLASS_COLOR[dc] || "bg-zinc-700 text-zinc-400";
}

const TARGET_FR: Record<string, string> = {
  "specific-move": "Move spécifique",
  "selected-pokemon-me-first": "Cible (Me First)",
  "ally": "Allié",
  "users-field": "Côté allié",
  "user-or-ally": "Soi ou allié",
  "opponents-field": "Côté adverse",
  "user": "Soi-même",
  "random-opponent": "Adversaire aléatoire",
  "all-other-pokemon": "Tous les autres Pokémon",
  "selected-pokemon": "Cible sélectionnée",
  "all-opponents": "Tous les adversaires",
  "entire-field": "Tout le terrain",
  "user-and-allies": "Soi et alliés",
  "all-pokemon": "Tous les Pokémon",
};

export function mapTarget(target: string): string {
  return TARGET_FR[target] || target;
}

const AILMENT_FR: Record<string, string> = {
  none: "Aucun", paralysis: "Paralysie", sleep: "Sommeil", freeze: "Gel",
  burn: "Brûlure", poison: "Poison", confusion: "Confusion",
  infatuation: "Attraction", trap: "Piège", nightmare: "Cauchemar",
  torment: "Tourmente", disable: "Entrave", yawn: "Bâillement",
  "no-type-immunity": "—", "leech-seed": "Vampigraine", embargo: "Embargo",
  "perish-song": "Requiem", ingrain: "Enracinement",
};

export function mapAilment(ailment: string): string {
  return AILMENT_FR[ailment] || ailment;
}

export function getArtworkUrl(pokemon: PokemonData): string {
  return pokemon.sprites?.other?.["official-artwork"]?.front_default
    || pokemon.sprites?.other?.showdown?.front_default
    || pokemon.sprites?.front_default
    || "";
}

export function getFrenchName(species: PokemonSpeciesData): string {
  return species.names.find(n => n.language.name === "fr")?.name || "";
}

export function getFrenchDescription(species: PokemonSpeciesData): string {
  const entries = species.flavor_text_entries.filter(e => e.language.name === "fr");
  return entries.length > 0 ? entries[entries.length - 1].flavor_text.replace(/\n|\f/g, " ") : "";
}

export function getFrenchGenus(species: PokemonSpeciesData): string {
  return species.genera.find(g => g.language.name === "fr")?.genus || "";
}

export function getMoveFrenchFlavor(move: MoveData): string {
  const entries = move.flavor_text_entries.filter(e => e.language.name === "fr");
  return entries.length > 0 ? entries[entries.length - 1].flavor_text.replace(/\n|\f/g, " ") : "";
}

export function getMoveEnglishEffect(move: MoveData): string {
  const entry = move.effect_entries.find(e => e.language.name === "en");
  return entry ? entry.short_effect : "";
}

export function flattenEvolution(link: EvolutionChainLink): { name: string; level?: number; trigger: string }[] {
  const result: { name: string; level?: number; trigger: string }[] = [{ name: link.species.name, trigger: "base" }];
  for (const evo of link.evolves_to) {
    const detail = evo.evolution_details[0];
    result.push({ name: evo.species.name, level: detail?.min_level ?? undefined, trigger: detail?.trigger?.name || "unknown" });
    for (const evo2 of evo.evolves_to) {
      const detail2 = evo2.evolution_details[0];
      result.push({ name: evo2.species.name, level: detail2?.min_level ?? undefined, trigger: detail2?.trigger?.name || "unknown" });
    }
  }
  return result;
}
