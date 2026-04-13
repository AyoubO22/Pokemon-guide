export interface Nature {
  name: string;
  nameFr: string;
  plus: string | null;
  minus: string | null;
}

export const NATURES: Nature[] = [
  { name: "Adamant", nameFr: "Rigide", plus: "Attack", minus: "Sp. Atk" },
  { name: "Bashful", nameFr: "Pudique", plus: null, minus: null },
  { name: "Bold", nameFr: "Assuré", plus: "Defense", minus: "Attack" },
  { name: "Brave", nameFr: "Brave", plus: "Attack", minus: "Speed" },
  { name: "Calm", nameFr: "Calme", plus: "Sp. Def", minus: "Attack" },
  { name: "Careful", nameFr: "Prudent", plus: "Sp. Def", minus: "Sp. Atk" },
  { name: "Docile", nameFr: "Docile", plus: null, minus: null },
  { name: "Gentle", nameFr: "Gentil", plus: "Sp. Def", minus: "Defense" },
  { name: "Hardy", nameFr: "Hardi", plus: null, minus: null },
  { name: "Hasty", nameFr: "Pressé", plus: "Speed", minus: "Defense" },
  { name: "Impish", nameFr: "Malin", plus: "Defense", minus: "Sp. Atk" },
  { name: "Jolly", nameFr: "Jovial", plus: "Speed", minus: "Sp. Atk" },
  { name: "Lax", nameFr: "Lâche", plus: "Defense", minus: "Sp. Def" },
  { name: "Lonely", nameFr: "Solo", plus: "Attack", minus: "Defense" },
  { name: "Mild", nameFr: "Doux", plus: "Sp. Atk", minus: "Defense" },
  { name: "Modest", nameFr: "Modeste", plus: "Sp. Atk", minus: "Attack" },
  { name: "Naive", nameFr: "Naïf", plus: "Speed", minus: "Sp. Def" },
  { name: "Naughty", nameFr: "Mauvais", plus: "Attack", minus: "Sp. Def" },
  { name: "Quiet", nameFr: "Discret", plus: "Sp. Atk", minus: "Speed" },
  { name: "Quirky", nameFr: "Bizarre", plus: null, minus: null },
  { name: "Rash", nameFr: "Foufou", plus: "Sp. Atk", minus: "Sp. Def" },
  { name: "Relaxed", nameFr: "Relax", plus: "Defense", minus: "Speed" },
  { name: "Sassy", nameFr: "Malpoli", plus: "Sp. Def", minus: "Speed" },
  { name: "Serious", nameFr: "Sérieux", plus: null, minus: null },
  { name: "Timid", nameFr: "Timide", plus: "Speed", minus: "Attack" },
];

export const STAT_NAMES = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];
export const STAT_NAMES_FR = ["PV", "Attaque", "Défense", "Atq. Spé.", "Déf. Spé.", "Vitesse"];

export interface EVSpread {
  name: string;
  description: string;
  spread: Record<string, number>;
}

export const COMMON_EV_SPREADS: EVSpread[] = [
  { name: "Sweeper Physique", description: "Max Attaque + Vitesse pour frapper fort et vite", spread: { Attack: 252, Speed: 252, HP: 4 } },
  { name: "Sweeper Spécial", description: "Max Atq. Spé + Vitesse", spread: { "Sp. Atk": 252, Speed: 252, HP: 4 } },
  { name: "Tank Physique", description: "Max PV + Défense pour encaisser les coups physiques", spread: { HP: 252, Defense: 252, "Sp. Def": 4 } },
  { name: "Tank Spécial", description: "Max PV + Déf. Spé pour encaisser les attaques spéciales", spread: { HP: 252, "Sp. Def": 252, Defense: 4 } },
  { name: "Mixte Bulk", description: "PV max avec défenses mixtes", spread: { HP: 252, Defense: 128, "Sp. Def": 128 } },
  { name: "Bulky Offense", description: "Survie + puissance de frappe", spread: { HP: 252, Attack: 252, Speed: 4 } },
];

export function calculateStat(
  baseStat: number, iv: number, ev: number, level: number, natureMultiplier: number, isHP: boolean
): number {
  if (isHP) {
    return Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
  }
  return Math.floor((Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + 5) * natureMultiplier);
}
