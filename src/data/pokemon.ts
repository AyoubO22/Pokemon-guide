// Top competitive Pokémon database for interactive lookup
export interface CompetitivePokemon {
  name: string;
  types: [string, string?];
  baseStats: [number, number, number, number, number, number]; // HP, Atk, Def, SpA, SpD, Spe
  tier: string;
  role: string[];
  keyAbilities: string[];
  keyMoves: string[];
  commonSets: PokemonSet[];
  notes: string;
}

export interface PokemonSet {
  name: string;
  item: string;
  ability: string;
  nature: string;
  evs: string;
  moves: string[];
  description: string;
}

export const TOP_POKEMON: CompetitivePokemon[] = [
  {
    name: "Landorus-Therian",
    types: ["Ground", "Flying"],
    baseStats: [89, 145, 90, 105, 80, 91],
    tier: "OU (toutes gens depuis Gen 5)",
    role: ["Pivot", "Wallbreaker", "Hazard Setter", "Revenge Killer"],
    keyAbilities: ["Intimidate"],
    keyMoves: ["Earthquake", "U-turn", "Stealth Rock", "Stone Edge", "Knock Off", "Superpower"],
    commonSets: [
      { name: "Pivot Défensif", item: "Leftovers / Rocky Helmet", ability: "Intimidate", nature: "Impish", evs: "252 HP / 216 Def / 40 Spe", moves: ["Earthquake", "U-turn", "Stealth Rock", "Knock Off"], description: "Le set le plus utilisé. Pose SR, pivot avec U-turn, Intimidate en boucle. La colonne vertébrale de tout teambuilding." },
      { name: "Choice Scarf", item: "Choice Scarf", ability: "Intimidate", nature: "Jolly", evs: "252 Atk / 4 SpD / 252 Spe", moves: ["Earthquake", "U-turn", "Stone Edge", "Superpower"], description: "Revenge killer rapide. Outspeed tout le metagame avec Scarf. U-turn pour garder le momentum." }
    ],
    notes: "Le Pokémon le plus utilisé de l'histoire compétitive. Intimidate + Ground/Flying + U-turn + Stealth Rock = le package parfait. Il fait TOUT ce qu'une équipe a besoin."
  },
  {
    name: "Garchomp",
    types: ["Dragon", "Ground"],
    baseStats: [108, 130, 95, 80, 85, 102],
    tier: "OU",
    role: ["Sweeper Physique", "Hazard Setter", "Wallbreaker"],
    keyAbilities: ["Rough Skin"],
    keyMoves: ["Earthquake", "Outrage", "Dragon Claw", "Swords Dance", "Stealth Rock", "Stone Edge", "Scale Shot"],
    commonSets: [
      { name: "Swords Dance", item: "Life Orb / Lum Berry", ability: "Rough Skin", nature: "Jolly", evs: "252 Atk / 4 SpD / 252 Spe", moves: ["Swords Dance", "Earthquake", "Scale Shot", "Stone Edge"], description: "Le setup sweeper classique. +2 Atk + base 130 + STAB Earthquake = devastation. Jolly pour outspeed les 100 base." },
      { name: "Lead SR", item: "Focus Sash", ability: "Rough Skin", nature: "Jolly", evs: "252 Atk / 4 SpD / 252 Spe", moves: ["Stealth Rock", "Earthquake", "Dragon Claw", "Rock Tomb"], description: "Lead en Hyper Offense. Pose SR, Rough Skin punit les contacts, Sash garantit la survie." }
    ],
    notes: "Le speed tier 102 est parfait — juste au-dessus de 100 base (Salamence, Volcarona). Dragon/Sol est le meilleur STAB combo offensif. Un pilier depuis Gen 4."
  },
  {
    name: "Toxapex",
    types: ["Poison", "Water"],
    baseStats: [50, 63, 152, 53, 142, 35],
    tier: "OU",
    role: ["Physical Wall", "Special Wall", "Status Absorber"],
    keyAbilities: ["Regenerator"],
    keyMoves: ["Scald", "Toxic", "Recover", "Haze", "Toxic Spikes", "Knock Off", "Baneful Bunker"],
    commonSets: [
      { name: "Mur Physique", item: "Rocky Helmet / Black Sludge", ability: "Regenerator", nature: "Bold", evs: "252 HP / 252 Def / 4 SpD", moves: ["Scald", "Recover", "Haze", "Toxic Spikes"], description: "Le mur ultime. 152 Déf + Regenerator = quasi impossible à tuer. Scald brûle les physiques, Haze annule les boosts, Toxic Spikes empoisonne." }
    ],
    notes: "Le Pokémon le plus frustrant à affronter. Regenerator + sa bulk phénoménale signifie qu'il switch in et out sans jamais mourir. La bête noire de tout sweeper physique."
  },
  {
    name: "Dragapult",
    types: ["Dragon", "Ghost"],
    baseStats: [88, 120, 75, 100, 75, 142],
    tier: "OU",
    role: ["Sweeper Physique", "Sweeper Spécial", "Pivot"],
    keyAbilities: ["Infiltrator", "Clear Body"],
    keyMoves: ["Dragon Darts", "Shadow Ball", "Draco Meteor", "U-turn", "Will-O-Wisp", "Thunder Wave"],
    commonSets: [
      { name: "Physique Dragon Dance", item: "Life Orb", ability: "Clear Body", nature: "Adamant", evs: "252 Atk / 4 SpD / 252 Spe", moves: ["Dragon Dance", "Dragon Darts", "Phantom Force", "Sucker Punch"], description: "Setup avec DD puis sweep. 142 base Vitesse = quasi rien ne peut revenge kill après un boost." },
      { name: "Spécial Specs", item: "Choice Specs", ability: "Infiltrator", nature: "Timid", evs: "252 SpA / 4 SpD / 252 Spe", moves: ["Shadow Ball", "Draco Meteor", "Thunderbolt", "U-turn"], description: "Wallbreaker spécial. Infiltrator passe les Substitutes. La flexibilité physique/spécial rend Dragapult imprévisible." }
    ],
    notes: "Sa vitesse de base 142 est absurde. Il peut jouer physique, spécial, ou même support (Will-O-Wisp, T-Wave). L'imprévisibilité est son arme #1."
  },
  {
    name: "Heatran",
    types: ["Fire", "Steel"],
    baseStats: [91, 90, 106, 130, 106, 77],
    tier: "OU (depuis Gen 4)",
    role: ["Special Wall", "Hazard Setter", "Offensive Pivot"],
    keyAbilities: ["Flash Fire"],
    keyMoves: ["Magma Storm", "Flash Cannon", "Earth Power", "Stealth Rock", "Toxic", "Eruption", "Taunt"],
    commonSets: [
      { name: "Tank Spécial", item: "Leftovers / Air Balloon", ability: "Flash Fire", nature: "Calm", evs: "252 HP / 4 SpA / 252 SpD", moves: ["Magma Storm", "Earth Power", "Stealth Rock", "Toxic"], description: "Pose Stealth Rock, piège avec Magma Storm (empêche le switch), Toxic les walls. Flash Fire = immunité Feu = switch-in parfait." },
      { name: "Offensive Specs", item: "Choice Specs", ability: "Flash Fire", nature: "Modest", evs: "252 SpA / 4 SpD / 252 Spe", moves: ["Magma Storm", "Flash Cannon", "Earth Power", "Eruption"], description: "Puissance brute. Magma Storm + Specs est dévastateur. Eruption à PV pleins = 150 puissance + STAB + Specs." }
    ],
    notes: "Feu/Acier est un typing défensif excellent (9 résistances + immunité Poison). Flash Fire ajoute une immunité Feu. Le ciment de toute équipe balanced depuis Gen 4."
  },
  {
    name: "Clefable",
    types: ["Fairy"],
    baseStats: [95, 70, 73, 95, 90, 60],
    tier: "OU",
    role: ["Support", "Setup Sweeper", "Cleric"],
    keyAbilities: ["Magic Guard", "Unaware"],
    keyMoves: ["Moonblast", "Calm Mind", "Soft-Boiled", "Stealth Rock", "Thunder Wave", "Knock Off", "Wish"],
    commonSets: [
      { name: "Calm Mind (Magic Guard)", item: "Life Orb", ability: "Magic Guard", nature: "Modest", evs: "252 HP / 252 SpA / 4 SpD", moves: ["Calm Mind", "Moonblast", "Flamethrower", "Soft-Boiled"], description: "Life Orb sans recul grâce à Magic Guard! Calm Mind setup puis sweep. Pas de dégâts de hazards, poison, météo." },
      { name: "Unaware Wall", item: "Leftovers", ability: "Unaware", nature: "Bold", evs: "252 HP / 252 Def / 4 SpD", moves: ["Moonblast", "Soft-Boiled", "Stealth Rock", "Knock Off"], description: "Unaware ignore les boosts adverses. Le counter ultime aux setup sweepers. Un Swords Dance +6 fait toujours les mêmes dégâts." }
    ],
    notes: "Les deux talents sont excellents mais TRÈS différents. Magic Guard = offensif + pas de chip damage. Unaware = anti-setup défensif. Le teambuilder doit choisir selon les besoins."
  },
  {
    name: "Dragonite",
    types: ["Dragon", "Flying"],
    baseStats: [91, 134, 95, 100, 100, 80],
    tier: "OU",
    role: ["Setup Sweeper", "Wallbreaker", "Bulky Offense"],
    keyAbilities: ["Multiscale"],
    keyMoves: ["Dragon Dance", "Outrage", "Extreme Speed", "Earthquake", "Fire Punch", "Ice Spinner", "Roost"],
    commonSets: [
      { name: "Dragon Dance", item: "Lum Berry / Heavy-Duty Boots", ability: "Multiscale", nature: "Adamant", evs: "252 Atk / 4 SpD / 252 Spe", moves: ["Dragon Dance", "Outrage", "Extreme Speed", "Earthquake"], description: "Le set classique. Multiscale garantit de survivre un coup pour DD. Extreme Speed (+2 priorité) finit les faibles. Lum Berry contre les Will-O-Wisp." },
      { name: "Choice Band", item: "Choice Band", ability: "Multiscale", nature: "Adamant", evs: "252 Atk / 4 SpD / 252 Spe", moves: ["Outrage", "Extreme Speed", "Earthquake", "Fire Punch"], description: "Puissance immédiate sans setup. Band Extreme Speed est un excellent revenge kill. Band Outrage détruit tout ce qui ne résiste pas." }
    ],
    notes: "Multiscale est LE talent qui fait Dragonite. Réduire les dégâts de 50% à PV pleins garantit au moins un tour de setup. Avec Heavy-Duty Boots (pas de chip SR), Multiscale est toujours actif."
  },
  {
    name: "Kingambit",
    types: ["Dark", "Steel"],
    baseStats: [100, 135, 120, 60, 85, 50],
    tier: "OU (Gen 9)",
    role: ["Wallbreaker", "Setup Sweeper", "Wincon"],
    keyAbilities: ["Supreme Overlord", "Defiant"],
    keyMoves: ["Kowtow Cleave", "Iron Head", "Sucker Punch", "Swords Dance", "Low Kick"],
    commonSets: [
      { name: "Swords Dance", item: "Black Glasses / Leftovers", ability: "Supreme Overlord", nature: "Adamant", evs: "252 HP / 252 Atk / 4 SpD", moves: ["Swords Dance", "Kowtow Cleave", "Iron Head", "Sucker Punch"], description: "Le closer ultime de Gen 9. Supreme Overlord booste x1.1 par allié KO (jusqu'à x1.5). En fin de match avec 4-5 alliés KO + Swords Dance = rien ne survit." }
    ],
    notes: "Le Pokémon qui a défini Gen 9 OU. Supreme Overlord + Sucker Punch (priorité Ténèbres) en fin de partie est quasi impossible à gérer. Dark/Steel = excellent typing défensif. Sa lenteur (50 Spe) est compensée par Sucker Punch."
  },
  {
    name: "Gholdengo",
    types: ["Steel", "Ghost"],
    baseStats: [87, 60, 91, 133, 91, 84],
    tier: "OU (Gen 9)",
    role: ["Hazard Protector", "Special Sweeper", "Pivot"],
    keyAbilities: ["Good as Gold"],
    keyMoves: ["Shadow Ball", "Make It Rain", "Nasty Plot", "Recover", "Trick", "Thunder Wave"],
    commonSets: [
      { name: "Nasty Plot", item: "Air Balloon / Leftovers", ability: "Good as Gold", nature: "Timid", evs: "252 SpA / 4 SpD / 252 Spe", moves: ["Nasty Plot", "Shadow Ball", "Make It Rain", "Recover"], description: "Good as Gold = immunité à TOUS les moves de statut (Toxic, Will-O-Wisp, Stealth Rock, Spikes, Thunder Wave, Taunt, TOUT). C'est le meilleur talent de Gen 9." }
    ],
    notes: "Good as Gold est broken. Aucune attaque de statut ne fonctionne. Ça signifie : pas de Stealth Rock contre toi, pas de Toxic, pas de Will-O-Wisp, pas de Haze. Les walls défensifs ne peuvent RIEN lui faire à part attaquer."
  },
  {
    name: "Flutter Mane",
    types: ["Ghost", "Fairy"],
    baseStats: [55, 55, 55, 135, 135, 135],
    tier: "OU/Ubers (Gen 9)",
    role: ["Special Sweeper", "Revenge Killer"],
    keyAbilities: ["Protosynthesis"],
    keyMoves: ["Shadow Ball", "Moonblast", "Mystical Fire", "Thunderbolt", "Calm Mind", "Perish Song"],
    commonSets: [
      { name: "Booster Energy", item: "Booster Energy", ability: "Protosynthesis", nature: "Timid", evs: "252 SpA / 4 SpD / 252 Spe", moves: ["Shadow Ball", "Moonblast", "Mystical Fire", "Thunderbolt"], description: "Protosynthèse active par Booster Energy boost la stat la plus haute (Atq.Spé ou Vitesse). 135/135/135 en SpA/SpD/Spe est absurde. Triple immunité (Normal/Combat/Dragon)." }
    ],
    notes: "Pokémon Paradoxe de Gen 9. Ses stats sont ridiculement min-maxées : 135/135/135 en stats utiles, 55 partout ailleurs. Ghost/Fairy est un typing offensif parfait. A été banni en OU pendant un temps pour être trop fort."
  },
  {
    name: "Great Tusk",
    types: ["Ground", "Fighting"],
    baseStats: [115, 131, 131, 53, 53, 87],
    tier: "OU (Gen 9)",
    role: ["Hazard Removal", "Physical Wall", "Wallbreaker"],
    keyAbilities: ["Protosynthesis"],
    keyMoves: ["Headlong Rush", "Close Combat", "Rapid Spin", "Knock Off", "Ice Spinner", "Stealth Rock"],
    commonSets: [
      { name: "Bulky Spinner", item: "Leftovers / Booster Energy", ability: "Protosynthesis", nature: "Jolly", evs: "252 HP / 4 Atk / 252 Spe", moves: ["Headlong Rush", "Rapid Spin", "Knock Off", "Ice Spinner"], description: "Le meilleur spinner de Gen 9. 115/131/131 en bulk + Rapid Spin (+1 Vitesse) + Knock Off retire les objets adverses. Fait tout." }
    ],
    notes: "Remplace Excadrill comme le spinner #1. Sol/Combat est excellent offensivement. Knock Off est la meilleure utility move du jeu (retire l'objet adverse, dommage!). Protosynthesis sous Soleil le rend encore plus dangereux."
  },
  {
    name: "Incineroar",
    types: ["Fire", "Dark"],
    baseStats: [95, 115, 90, 80, 90, 60],
    tier: "VGC dominant",
    role: ["Support", "Pivot", "Fake Out"],
    keyAbilities: ["Intimidate"],
    keyMoves: ["Fake Out", "Flare Blitz", "Knock Off", "U-turn", "Parting Shot", "Will-O-Wisp", "Snarl"],
    commonSets: [
      { name: "VGC Support", item: "Safety Goggles / Sitrus Berry", ability: "Intimidate", nature: "Careful", evs: "252 HP / 12 Atk / 116 Def / 4 SpD / 124 Spe", moves: ["Fake Out", "Knock Off", "Flare Blitz", "Parting Shot"], description: "LE Pokémon #1 du VGC. Fake Out Turn 1, Intimidate baisse l'Atk adverse, Parting Shot = pivot + baisse stats, Knock Off retire les objets. Le couteau suisse ultime." }
    ],
    notes: "Le roi du VGC depuis Gen 7. Intimidate + Fake Out + Parting Shot = le meilleur package support du jeu en Doubles. Chaque année, les joueurs essaient de ne pas l'utiliser et finissent par le remettre."
  },
];

export const STAT_LABELS = ["PV", "Atq", "Déf", "A.Sp", "D.Sp", "Vit"];
export const STAT_COLORS = ["#ef4444", "#f97316", "#eab308", "#3b82f6", "#22c55e", "#ec4899"];
