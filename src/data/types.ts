export interface TypeMatchup {
  name: string;
  nameFr: string;
  color: string;
  superEffective: string[];
  notVeryEffective: string[];
  noEffect: string[];
  weakTo: string[];
  resistantTo: string[];
  immuneTo: string[];
}

export const TYPES: TypeMatchup[] = [
  {
    name: "Normal", nameFr: "Normal", color: "#A8A878",
    superEffective: [],
    notVeryEffective: ["Rock", "Steel"],
    noEffect: ["Ghost"],
    weakTo: ["Fighting"],
    resistantTo: [],
    immuneTo: ["Ghost"]
  },
  {
    name: "Fire", nameFr: "Feu", color: "#F08030",
    superEffective: ["Grass", "Ice", "Bug", "Steel"],
    notVeryEffective: ["Fire", "Water", "Rock", "Dragon"],
    noEffect: [],
    weakTo: ["Water", "Ground", "Rock"],
    resistantTo: ["Fire", "Grass", "Ice", "Bug", "Steel", "Fairy"],
    immuneTo: []
  },
  {
    name: "Water", nameFr: "Eau", color: "#6890F0",
    superEffective: ["Fire", "Ground", "Rock"],
    notVeryEffective: ["Water", "Grass", "Dragon"],
    noEffect: [],
    weakTo: ["Electric", "Grass"],
    resistantTo: ["Fire", "Water", "Ice", "Steel"],
    immuneTo: []
  },
  {
    name: "Electric", nameFr: "Électrik", color: "#F8D030",
    superEffective: ["Water", "Flying"],
    notVeryEffective: ["Electric", "Grass", "Dragon"],
    noEffect: ["Ground"],
    weakTo: ["Ground"],
    resistantTo: ["Electric", "Flying", "Steel"],
    immuneTo: []
  },
  {
    name: "Grass", nameFr: "Plante", color: "#78C850",
    superEffective: ["Water", "Ground", "Rock"],
    notVeryEffective: ["Fire", "Grass", "Poison", "Flying", "Bug", "Dragon", "Steel"],
    noEffect: [],
    weakTo: ["Fire", "Ice", "Poison", "Flying", "Bug"],
    resistantTo: ["Water", "Electric", "Grass", "Ground"],
    immuneTo: []
  },
  {
    name: "Ice", nameFr: "Glace", color: "#98D8D8",
    superEffective: ["Grass", "Ground", "Flying", "Dragon"],
    notVeryEffective: ["Fire", "Water", "Ice", "Steel"],
    noEffect: [],
    weakTo: ["Fire", "Fighting", "Rock", "Steel"],
    resistantTo: ["Ice"],
    immuneTo: []
  },
  {
    name: "Fighting", nameFr: "Combat", color: "#C03028",
    superEffective: ["Normal", "Ice", "Rock", "Dark", "Steel"],
    notVeryEffective: ["Poison", "Flying", "Psychic", "Bug", "Fairy"],
    noEffect: ["Ghost"],
    weakTo: ["Flying", "Psychic", "Fairy"],
    resistantTo: ["Bug", "Rock", "Dark"],
    immuneTo: []
  },
  {
    name: "Poison", nameFr: "Poison", color: "#A040A0",
    superEffective: ["Grass", "Fairy"],
    notVeryEffective: ["Poison", "Ground", "Rock", "Ghost"],
    noEffect: ["Steel"],
    weakTo: ["Ground", "Psychic"],
    resistantTo: ["Grass", "Fighting", "Poison", "Bug", "Fairy"],
    immuneTo: []
  },
  {
    name: "Ground", nameFr: "Sol", color: "#E0C068",
    superEffective: ["Fire", "Electric", "Poison", "Rock", "Steel"],
    notVeryEffective: ["Grass", "Bug"],
    noEffect: ["Flying"],
    weakTo: ["Water", "Grass", "Ice"],
    resistantTo: ["Poison", "Rock"],
    immuneTo: ["Electric"]
  },
  {
    name: "Flying", nameFr: "Vol", color: "#A890F0",
    superEffective: ["Grass", "Fighting", "Bug"],
    notVeryEffective: ["Electric", "Rock", "Steel"],
    noEffect: [],
    weakTo: ["Electric", "Ice", "Rock"],
    resistantTo: ["Grass", "Fighting", "Bug"],
    immuneTo: ["Ground"]
  },
  {
    name: "Psychic", nameFr: "Psy", color: "#F85888",
    superEffective: ["Fighting", "Poison"],
    notVeryEffective: ["Psychic", "Steel"],
    noEffect: ["Dark"],
    weakTo: ["Bug", "Ghost", "Dark"],
    resistantTo: ["Fighting", "Psychic"],
    immuneTo: []
  },
  {
    name: "Bug", nameFr: "Insecte", color: "#A8B820",
    superEffective: ["Grass", "Psychic", "Dark"],
    notVeryEffective: ["Fire", "Fighting", "Poison", "Flying", "Ghost", "Steel", "Fairy"],
    noEffect: [],
    weakTo: ["Fire", "Flying", "Rock"],
    resistantTo: ["Grass", "Fighting", "Ground"],
    immuneTo: []
  },
  {
    name: "Rock", nameFr: "Roche", color: "#B8A038",
    superEffective: ["Fire", "Ice", "Flying", "Bug"],
    notVeryEffective: ["Fighting", "Ground", "Steel"],
    noEffect: [],
    weakTo: ["Water", "Grass", "Fighting", "Ground", "Steel"],
    resistantTo: ["Normal", "Fire", "Poison", "Flying"],
    immuneTo: []
  },
  {
    name: "Ghost", nameFr: "Spectre", color: "#705898",
    superEffective: ["Psychic", "Ghost"],
    notVeryEffective: ["Dark"],
    noEffect: ["Normal"],
    weakTo: ["Ghost", "Dark"],
    resistantTo: ["Poison", "Bug"],
    immuneTo: ["Normal", "Fighting"]
  },
  {
    name: "Dragon", nameFr: "Dragon", color: "#7038F8",
    superEffective: ["Dragon"],
    notVeryEffective: ["Steel"],
    noEffect: ["Fairy"],
    weakTo: ["Ice", "Dragon", "Fairy"],
    resistantTo: ["Fire", "Water", "Electric", "Grass"],
    immuneTo: []
  },
  {
    name: "Dark", nameFr: "Ténèbres", color: "#705848",
    superEffective: ["Psychic", "Ghost"],
    notVeryEffective: ["Fighting", "Dark", "Fairy"],
    noEffect: [],
    weakTo: ["Fighting", "Bug", "Fairy"],
    resistantTo: ["Ghost", "Dark"],
    immuneTo: ["Psychic"]
  },
  {
    name: "Steel", nameFr: "Acier", color: "#B8B8D0",
    superEffective: ["Ice", "Rock", "Fairy"],
    notVeryEffective: ["Fire", "Water", "Electric", "Steel"],
    noEffect: [],
    weakTo: ["Fire", "Fighting", "Ground"],
    resistantTo: ["Normal", "Grass", "Ice", "Flying", "Psychic", "Bug", "Rock", "Dragon", "Steel", "Fairy"],
    immuneTo: ["Poison"]
  },
  {
    name: "Fairy", nameFr: "Fée", color: "#EE99AC",
    superEffective: ["Fighting", "Dragon", "Dark"],
    notVeryEffective: ["Fire", "Poison", "Steel"],
    noEffect: [],
    weakTo: ["Poison", "Steel"],
    resistantTo: ["Fighting", "Bug", "Dark"],
    immuneTo: ["Dragon"]
  }
];

export const TYPE_COLORS: Record<string, string> = {};
TYPES.forEach(t => { TYPE_COLORS[t.name] = t.color; });

// Dual type combinations for the dual type calculator
export function getDualTypeDefense(type1: string, type2: string | null): Record<string, number> {
  const result: Record<string, number> = {};
  const t1 = TYPES.find(t => t.name === type1);
  if (!t1) return result;

  for (const atkType of TYPES) {
    let mult = 1;
    // type1 defense
    if (t1.weakTo.includes(atkType.name)) mult *= 2;
    if (t1.resistantTo.includes(atkType.name)) mult *= 0.5;
    if (t1.immuneTo.includes(atkType.name)) mult *= 0;

    if (type2) {
      const t2 = TYPES.find(t => t.name === type2);
      if (t2) {
        if (t2.weakTo.includes(atkType.name)) mult *= 2;
        if (t2.resistantTo.includes(atkType.name)) mult *= 0.5;
        if (t2.immuneTo.includes(atkType.name)) mult *= 0;
      }
    }
    result[atkType.name] = mult;
  }
  return result;
}

export interface TypeCombo {
  types: [string, string];
  examples: string;
  strengths: string;
  resistances: number;
  weaknesses: number;
  immunities: number;
}

export const NOTABLE_TYPE_COMBOS: TypeCombo[] = [
  { types: ["Steel", "Fairy"], examples: "Magearna, Klefki, Zacian-C", strengths: "Le meilleur typing défensif. 9 résistances + 2 immunités. Seulement faible à Feu et Sol.", resistances: 9, weaknesses: 2, immunities: 2 },
  { types: ["Water", "Ground"], examples: "Swampert, Gastrodon, Quagsire", strengths: "Seule faiblesse : Plante (x4). Immunité Électrik. Offensivement excellent.", resistances: 4, weaknesses: 1, immunities: 1 },
  { types: ["Steel", "Flying"], examples: "Skarmory, Corviknight, Celesteela", strengths: "10 résistances + 2 immunités. Le mur physique ultime.", resistances: 10, weaknesses: 3, immunities: 2 },
  { types: ["Poison", "Dark"], examples: "Skuntank, Drapion, Overqwil", strengths: "Immunité Psy. Seule faiblesse : Sol. Bon contre Fairy et Psychic.", resistances: 5, weaknesses: 1, immunities: 1 },
  { types: ["Water", "Fairy"], examples: "Azumarill, Primarina, Tapu Fini", strengths: "Résiste Dragon, Combat, Ténèbres, Feu, Eau, Glace. Offensivement puissant.", resistances: 6, weaknesses: 3, immunities: 1 },
  { types: ["Ghost", "Dark"], examples: "Sableye, Spiritomb", strengths: "Avant Gen 6 : 0 faiblesses. Depuis Gen 6 : faible seulement à Fée. Double immunité Normal+Combat+Psy.", resistances: 2, weaknesses: 1, immunities: 3 },
  { types: ["Dragon", "Steel"], examples: "Dialga, Duraludon", strengths: "10 résistances + 1 immunité. Seul Dragon sans faiblesse Fée. Faible à Combat et Sol.", resistances: 10, weaknesses: 2, immunities: 1 },
  { types: ["Fire", "Water"], examples: "Volcanion", strengths: "Combinaison rare et unique. Résiste à 6 types. Offensivement excellent coverage.", resistances: 6, weaknesses: 3, immunities: 0 },
  { types: ["Electric", "Steel"], examples: "Magnezone, Togedemaru", strengths: "11 résistances + 1 immunité! Le plus de résistances possibles. Mais 4x faible Sol.", resistances: 11, weaknesses: 3, immunities: 1 },
  { types: ["Ghost", "Fairy"], examples: "Mimikyu, Flutter Mane", strengths: "Triple immunité (Normal, Combat, Dragon). Offensivement touche presque tout neutralement.", resistances: 2, weaknesses: 3, immunities: 3 },
  { types: ["Water", "Steel"], examples: "Empoleon, Melmetal (via Tera)", strengths: "11 résistances + 1 immunité. Incroyable défensivement.", resistances: 11, weaknesses: 3, immunities: 1 },
  { types: ["Ground", "Flying"], examples: "Gliscor, Landorus-T, Gligar", strengths: "Immunité Électrik + Sol. Le pivot défensif par excellence. Seule vraie faiblesse : Glace (x4).", resistances: 4, weaknesses: 2, immunities: 2 },
];

export interface TeraTypeStrategy {
  type: string;
  offensiveUse: string;
  defensiveUse: string;
  bestUsers: string[];
}

export const TERA_STRATEGIES: TeraTypeStrategy[] = [
  { type: "Ghost", offensiveUse: "STAB sur Poltergeist/Shadow Ball. Neutralise les checks Fighting.", defensiveUse: "Immunité Normal+Combat. Dodge les Fake Out et Close Combat.", bestUsers: ["Kingambit", "Dragonite", "Iron Valiant"] },
  { type: "Water", offensiveUse: "Coverage Eau pour les Pokémon Feu/Sol.", defensiveUse: "Résiste Feu/Eau/Glace/Acier. Enlève les faiblesses Feu.", bestUsers: ["Heatran", "Iron Moth", "Volcarona"] },
  { type: "Fairy", offensiveUse: "STAB Moonblast. Immunité Dragon.", defensiveUse: "Immunité Dragon, résiste Combat/Ténèbres/Insecte.", bestUsers: ["Garchomp", "Iron Valiant", "Dragonite"] },
  { type: "Steel", offensiveUse: "Rarement offensif.", defensiveUse: "10 résistances + immunité Poison. Le Tera le plus sûr défensivement.", bestUsers: ["Garganacl", "Clodsire", "Slowking"] },
  { type: "Fire", offensiveUse: "STAB sur les attaques Feu. Boost sous Soleil.", defensiveUse: "Résiste 6 types. Enlève faiblesse Glace des Dragons.", bestUsers: ["Dragonite", "Iron Valiant", "Baxcalibur"] },
  { type: "Poison", offensiveUse: "STAB sur Sludge Bomb pour toucher les Fairy.", defensiveUse: "Résiste Combat/Fée/Plante/Poison/Insecte. Absorbe Toxic Spikes.", bestUsers: ["Iron Hands", "Garganacl", "Ting-Lu"] },
  { type: "Normal", offensiveUse: "STAB Extreme Speed/Return/Body Slam.", defensiveUse: "Immunité Ghost. Utile contre Shadow Ball spam.", bestUsers: ["Dragonite (E-Speed)", "Annihilape", "Ceruledge"] },
  { type: "Ground", offensiveUse: "STAB Earthquake. Le meilleur coverage offensif.", defensiveUse: "Immunité Électrik. Résiste Poison/Roche.", bestUsers: ["Great Tusk", "Iron Treads", "Roaring Moon"] },
  { type: "Grass", offensiveUse: "Coverage pour Water/Ground types.", defensiveUse: "Immunité aux Powder moves, résiste Eau/Sol/Plante/Électrik.", bestUsers: ["Ogerpon", "Meowscarada", "Rillaboom"] },
  { type: "Ice", offensiveUse: "STAB Ice coverage touche Dragon/Sol/Vol/Plante.", defensiveUse: "Mauvais défensivement. Usage purement offensif.", bestUsers: ["Baxcalibur", "Chien-Pao", "Kyurem"] },
];
