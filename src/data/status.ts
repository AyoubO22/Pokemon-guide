export interface StatusCondition {
  name: string;
  nameFr: string;
  icon: string;
  color: string;
  effect: string;
  competitiveUse: string;
  keyMoves: string[];
  counters: string[];
}

export const STATUS_CONDITIONS: StatusCondition[] = [
  {
    name: "Burn", nameFr: "Brûlure", icon: "◈", color: "#F08030",
    effect: "Perd 1/16 PV par tour. L'Attaque physique est réduite de 50%.",
    competitiveUse: "Excellent contre les attaquants physiques. Will-O-Wisp est l'outil principal des walls physiques. La réduction d'Attaque est souvent plus importante que les dégâts au fil du temps.",
    keyMoves: ["Will-O-Wisp", "Scald (30%)", "Lava Plume (30%)", "Sacred Fire (50%)"],
    counters: ["Guts (ignore la baisse)", "Magic Guard (pas de dégâts)", "Flash Fire (immunité)", "Types Feu (immunité)"]
  },
  {
    name: "Poison", nameFr: "Empoisonnement", icon: "◈", color: "#A040A0",
    effect: "Perd 1/8 PV par tour. Le Toxic (empoisonnement grave) augmente les dégâts chaque tour (1/16, 2/16, 3/16...).",
    competitiveUse: "Toxic est la pression ultime contre les tanks/stall. Force les switchs. Le compteur de Toxic est reset au switch. Indispensable en stall wars.",
    keyMoves: ["Toxic", "Poison Jab (30%)", "Sludge Bomb (30%)", "Toxic Spikes"],
    counters: ["Poison Heal (soigne!)", "Immunity", "Types Poison/Acier (immunité)", "Magic Guard"]
  },
  {
    name: "Paralysis", nameFr: "Paralysie", icon: "◈", color: "#F8D030",
    effect: "Vitesse réduite de 50% (75% avant Gen 7). 25% de chance de ne pas agir.",
    competitiveUse: "Le speed control le plus permanent. Thunder Wave est fiable et touche presque tout. Crucial pour les équipes qui manquent de vitesse. L'aspect aléatoire peut faire ou défaire des matchs.",
    keyMoves: ["Thunder Wave", "Stun Spore", "Nuzzle", "Body Slam (30%)", "Glare"],
    counters: ["Limber", "Electric types (immunité depuis Gen 6)", "Lum Berry", "Ground types vs T-Wave"]
  },
  {
    name: "Sleep", nameFr: "Sommeil", icon: "◈", color: "#7890F0",
    effect: "Impossible d'agir pendant 1-3 tours (compteur reset au switch en Gen 5+).",
    competitiveUse: "Le statut le plus puissant car il retire un Pokémon du jeu. Limité par la Sleep Clause en compétitif (1 endormi max). Spore a 100% précision, c'est la meilleure move du jeu.",
    keyMoves: ["Spore (100%)", "Sleep Powder (75%)", "Hypnosis (60%)", "Yawn (force switch)", "Dark Void"],
    counters: ["Vital Spirit/Insomnia", "Safety Goggles (vs powder)", "Overcoat", "Electric Terrain", "Sleep Talk"]
  },
  {
    name: "Freeze", nameFr: "Gel", icon: "◈", color: "#98D8D8",
    effect: "Impossible d'agir. 20% de chance de dégeler chaque tour. Les attaques Feu dégelent.",
    competitiveUse: "Le plus puissant mais impossible à infliger de manière fiable (10% sur les attaques Glace). C'est un bonus chanceux, pas une stratégie. Remplacé par Frostbite en Légendes Arceus.",
    keyMoves: ["Ice Beam (10%)", "Blizzard (10%)", "Freeze-Dry (10%)"],
    counters: ["Magma Armor", "Types Glace (immunité)", "Attaques Feu (auto-dégel)"]
  },
  {
    name: "Confusion", nameFr: "Confusion", icon: "◈", color: "#F85888",
    effect: "33% de chance de se frapper soi-même (50% avant Gen 7). Dégâts basés sur sa propre Attaque.",
    competitiveUse: "Nerfé en Gen 7 (de 50% à 33%). Moins fiable qu'avant mais toujours utile combiné avec paralysie (parafusion). Swagger + Foul Play est un combo classique.",
    keyMoves: ["Confuse Ray", "Swagger (+2 Atk, confus)", "Flatter", "Hurricane (30%)"],
    counters: ["Own Tempo", "Switch out"]
  }
];

export interface VolatileStatus {
  name: string;
  nameFr: string;
  effect: string;
}

export const VOLATILE_STATUSES: VolatileStatus[] = [
  { name: "Flinch", nameFr: "Tressaillement", effect: "Empêche d'agir CE tour. Nécessite d'agir en premier. Serene Grace double le taux (ex: Togekiss Air Slash 60%)." },
  { name: "Taunt", nameFr: "Provoc", effect: "Empêche les attaques de statut pendant 3 tours. Détruit les walls/supports. Essentiel en lead." },
  { name: "Encore", nameFr: "Encore", effect: "Force à répéter la dernière attaque 3 tours. Piège sur un setup ou une attaque de statut." },
  { name: "Leech Seed", nameFr: "Vampigraine", effect: "Draine 1/8 PV par tour. Combo avec Protect et Substitute pour du stall." },
  { name: "Substitute", nameFr: "Clonage", effect: "Sacrifie 25% PV pour créer un clone. Bloque les statuts et certaines attaques. Combo SubSeed, SubPunch." },
  { name: "Protect", nameFr: "Abri", effect: "Bloque toute attaque ce tour. Fondamental en Doubles/VGC. Scout, stall, Leftovers/Poison heal." },
  { name: "Trick Room", nameFr: "Distorsion", effect: "Inverse l'ordre de vitesse pendant 5 tours. Les lents frappent en premier. Archétype d'équipe entier." },
  { name: "Tailwind", nameFr: "Vent Arrière", effect: "Double la Vitesse de l'équipe pendant 4 tours. Speed control majeur en VGC." },
];
