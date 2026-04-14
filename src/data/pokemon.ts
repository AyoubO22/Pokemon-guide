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
  format?: "VGC" | "Smogon OU" | "Any";
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
      { name: "VGC Support", item: "Safety Goggles / Sitrus Berry", ability: "Intimidate", nature: "Careful", evs: "252 HP / 12 Atk / 116 Def / 4 SpD / 124 Spe", moves: ["Fake Out", "Knock Off", "Flare Blitz", "Parting Shot"], description: "LE Pokémon #1 du VGC. Fake Out Turn 1, Intimidate baisse l'Atk adverse, Parting Shot = pivot + baisse stats, Knock Off retire les objets. Le couteau suisse ultime.", format: "VGC" }
    ],
    notes: "Le roi du VGC depuis Gen 7. Intimidate + Fake Out + Parting Shot = le meilleur package support du jeu en Doubles. Chaque année, les joueurs essaient de ne pas l'utiliser et finissent par le remettre."
  },
  {
    name: "Tyranitar",
    types: ["Rock", "Dark"],
    baseStats: [100, 134, 110, 95, 100, 61],
    tier: "OU (depuis Gen 2)",
    role: ["Special Wall", "Wallbreaker", "Hazard Setter", "Weather Setter"],
    keyAbilities: ["Sand Stream"],
    keyMoves: ["Stone Edge", "Crunch", "Stealth Rock", "Ice Punch", "Earthquake", "Dragon Dance", "Fire Punch"],
    commonSets: [
      { name: "Tank Spécial (Sable)", item: "Leftovers / Smooth Rock", ability: "Sand Stream", nature: "Careful", evs: "252 HP / 4 Atk / 252 SpD", moves: ["Stealth Rock", "Stone Edge", "Crunch", "Earthquake"], description: "Sand Stream booste sa Déf.Spé de 50% (type Roche). Avec invest SpD + sable, il tanke des Focus Blasts. Pose SR et met la pression." },
      { name: "Dragon Dance", item: "Lum Berry / Life Orb", ability: "Sand Stream", nature: "Jolly", evs: "252 Atk / 4 SpD / 252 Spe", moves: ["Dragon Dance", "Stone Edge", "Crunch", "Ice Punch"], description: "Setup sweeper surprise. Après un DD, sa puissance brute est phénoménale. Lum Berry contre Will-O-Wisp." }
    ],
    notes: "Un des Pokémon les plus polyvalents de l'histoire. Sand Stream pose la tempête de sable automatiquement, ce qui boost sa Déf.Spé effective de 50%. Il peut jouer offensif, défensif ou support selon le set."
  },
  {
    name: "Ferrothorn",
    types: ["Grass", "Steel"],
    baseStats: [74, 94, 131, 54, 116, 20],
    tier: "OU (depuis Gen 5)",
    role: ["Physical Wall", "Hazard Setter", "Entry Hazard Stack"],
    keyAbilities: ["Iron Barbs"],
    keyMoves: ["Stealth Rock", "Spikes", "Leech Seed", "Power Whip", "Knock Off", "Gyro Ball", "Thunder Wave", "Protect"],
    commonSets: [
      { name: "Hazard Setter", item: "Leftovers / Rocky Helmet", ability: "Iron Barbs", nature: "Relaxed", evs: "252 HP / 252 Def / 4 SpD", moves: ["Stealth Rock", "Spikes", "Leech Seed", "Power Whip"], description: "Le meilleur poseur de hazards. SR + Spikes en un seul Pokémon. Iron Barbs + Rocky Helmet = 29% de dégâts à chaque contact. Leech Seed pour du recovery passif." },
      { name: "Specially Defensive", item: "Leftovers", ability: "Iron Barbs", nature: "Sassy", evs: "252 HP / 4 Def / 252 SpD", moves: ["Spikes", "Leech Seed", "Knock Off", "Protect"], description: "Invest SpD pour tanker les Water-types et Electric-types. Knock Off retire les objets adverses. Protect scoute et gagne du Leech Seed healing." }
    ],
    notes: "Plante/Acier est un des meilleurs typings défensifs : 9 résistances + immunité Poison. Sa lenteur extrême (20 Spe) est un avantage sous Trick Room ou avec Gyro Ball. Vulnérable au Feu x4 mais tout le reste galère à le tuer."
  },
  {
    name: "Corviknight",
    types: ["Flying", "Steel"],
    baseStats: [98, 87, 105, 53, 85, 67],
    tier: "OU (Gen 8-9)",
    role: ["Physical Wall", "Hazard Removal", "Pivot"],
    keyAbilities: ["Pressure", "Mirror Armor"],
    keyMoves: ["Roost", "Defog", "U-turn", "Body Press", "Brave Bird", "Iron Head", "Bulk Up"],
    commonSets: [
      { name: "Défog Pivot", item: "Rocky Helmet / Leftovers", ability: "Pressure", nature: "Impish", evs: "252 HP / 252 Def / 4 SpD", moves: ["Roost", "Defog", "U-turn", "Body Press"], description: "Le mur physique + hazard removal parfait. Roost pour la longévité, Defog retire les hazards, U-turn maintient le momentum, Body Press utilise sa Défense élevée." },
      { name: "Bulk Up", item: "Leftovers", ability: "Mirror Armor", nature: "Impish", evs: "252 HP / 252 Def / 4 SpD", moves: ["Bulk Up", "Body Press", "Roost", "Iron Head"], description: "Setup défensif. Bulk Up boost Atk et Def. Body Press scale avec la Défense boostée. Mirror Armor renvoie les baisses de stats (Intimidate!)." }
    ],
    notes: "Le successeur spirituel de Skarmory. Vol/Acier = excellent typing défensif. Seules faiblesses : Feu et Électrik. Il peut Defog, pivot avec U-turn, tanker indéfiniment avec Roost. Un must en balanced."
  },
  {
    name: "Weavile",
    types: ["Dark", "Ice"],
    baseStats: [70, 120, 65, 45, 85, 125],
    tier: "OU",
    role: ["Revenge Killer", "Wallbreaker"],
    keyAbilities: ["Pressure"],
    keyMoves: ["Triple Axel", "Knock Off", "Ice Shard", "Low Kick", "Swords Dance", "Ice Punch"],
    commonSets: [
      { name: "Swords Dance", item: "Heavy-Duty Boots / Life Orb", ability: "Pressure", nature: "Jolly", evs: "252 Atk / 4 SpD / 252 Spe", moves: ["Swords Dance", "Triple Axel", "Knock Off", "Ice Shard"], description: "Setup rapide. Base 125 Spe signifie qu'il outspeed presque tout sans Scarf. Knock Off est la meilleure utility move. Ice Shard finit les affaiblis." },
      { name: "Choice Band", item: "Choice Band", ability: "Pressure", nature: "Jolly", evs: "252 Atk / 4 SpD / 252 Spe", moves: ["Triple Axel", "Knock Off", "Low Kick", "Ice Shard"], description: "Puissance immédiate. Band Knock Off fait mal à tout ce qui switch in. Triple Axel touche les Grass, Dragon, Ground, Flying." }
    ],
    notes: "L'un des meilleurs revenge killers du jeu. 125 Spe + Knock Off + Ice Shard couvre tout. Glace/Ténèbres est offensivement excellent mais défensivement fragile. Joue avec les Heavy-Duty Boots pour éviter le chip damage de Stealth Rock."
  },
  {
    name: "Volcarona",
    types: ["Bug", "Fire"],
    baseStats: [85, 60, 65, 135, 105, 100],
    tier: "OU",
    role: ["Special Sweeper", "Setup Sweeper", "Late-Game Cleaner"],
    keyAbilities: ["Flame Body"],
    keyMoves: ["Quiver Dance", "Flamethrower", "Bug Buzz", "Giga Drain", "Psychic", "Roost", "Hurricane"],
    commonSets: [
      { name: "Quiver Dance", item: "Heavy-Duty Boots", ability: "Flame Body", nature: "Timid", evs: "252 SpA / 4 SpD / 252 Spe", moves: ["Quiver Dance", "Flamethrower", "Bug Buzz", "Giga Drain"], description: "Le sweeper spécial ultime. Quiver Dance boost SpA, SpD ET Spe. Après un QD, quasi rien ne peut le revenge kill ou le tanker. Heavy-Duty Boots OBLIGATOIRE (x4 faiblesse Rock = 50% de SR)." },
      { name: "Bulky QD", item: "Heavy-Duty Boots", ability: "Flame Body", nature: "Timid", evs: "252 HP / 160 SpA / 96 Spe", moves: ["Quiver Dance", "Flamethrower", "Giga Drain", "Roost"], description: "Version plus tanky. Roost + QD SpD boost = très difficile à tuer côté spécial. Giga Drain soigne en attaquant." }
    ],
    notes: "Quiver Dance est le meilleur move de setup spécial et Volcarona est son meilleur utilisateur. Son SEUL problème : x4 faiblesse Stealth Rock (perd 50% PV en entrant). Heavy-Duty Boots est non-négociable. Si les hazards sont retirés, Volcarona sweep des parties entières."
  },
  {
    name: "Scizor",
    types: ["Bug", "Steel"],
    baseStats: [70, 130, 100, 55, 80, 65],
    tier: "OU (depuis Gen 2)",
    role: ["Priority Attacker", "Pivot", "Revenge Killer", "Setup Sweeper"],
    keyAbilities: ["Technician"],
    keyMoves: ["Bullet Punch", "U-turn", "Swords Dance", "Knock Off", "Superpower", "Roost", "Defog"],
    commonSets: [
      { name: "Swords Dance + Priority", item: "Life Orb / Leftovers", ability: "Technician", nature: "Adamant", evs: "252 HP / 252 Atk / 4 SpD", moves: ["Swords Dance", "Bullet Punch", "Knock Off", "Superpower"], description: "+2 Bullet Punch avec Technician + STAB = puissance monstrueuse avec priorité +1. Touche presque tout de manière neutre entre Steel/Dark/Fighting." },
      { name: "Pivot Défensif", item: "Heavy-Duty Boots / Rocky Helmet", ability: "Technician", nature: "Impish", evs: "252 HP / 252 Def / 4 SpD", moves: ["U-turn", "Bullet Punch", "Knock Off", "Roost"], description: "U-turn pivot avec d'excellentes résistances. Roost assure la longévité. Bullet Punch revenge kill en urgence." }
    ],
    notes: "Technician Bullet Punch est iconique : 40 puissance base devient 90 (Technician x1.5, STAB x1.5) avec priorité +1. Bug/Acier n'a qu'une seule faiblesse (Feu x4) mais 8 résistances + immunité Poison. Le pivot offensif par excellence depuis 20 ans."
  },
  {
    name: "Rotom-Wash",
    types: ["Electric", "Water"],
    baseStats: [50, 65, 107, 105, 107, 86],
    tier: "OU (depuis Gen 4)",
    role: ["Pivot", "Special Wall", "Utility"],
    keyAbilities: ["Levitate"],
    keyMoves: ["Volt Switch", "Hydro Pump", "Will-O-Wisp", "Pain Split", "Trick", "Thunder Wave", "Defog"],
    commonSets: [
      { name: "Pivot Défensif", item: "Leftovers", ability: "Levitate", nature: "Bold", evs: "252 HP / 252 Def / 4 SpA", moves: ["Volt Switch", "Hydro Pump", "Will-O-Wisp", "Pain Split"], description: "Le pivot ultime. Eau/Électrik + Lévitation = UNE seule faiblesse (Plante). Volt Switch maintient le momentum, Will-O-Wisp stoppe les physiques, Pain Split soigne." },
      { name: "Choice Specs", item: "Choice Specs", ability: "Levitate", nature: "Modest", evs: "252 SpA / 4 SpD / 252 Spe", moves: ["Volt Switch", "Hydro Pump", "Thunderbolt", "Trick"], description: "Offensif surprise. Specs Hydro Pump fait très mal. Trick donne les Specs à un wall pour le cripple." }
    ],
    notes: "Eau + Électrik + Lévitation donne une seule faiblesse : Plante. C'est le defensive typing le plus efficient du jeu. Volt Switch en fait un excellent pivot. Peut burn, pivot, et tanker. Le Pokémon 'glue' par excellence."
  },
  {
    name: "Blissey",
    types: ["Normal"],
    baseStats: [255, 10, 10, 75, 135, 55],
    tier: "OU",
    role: ["Special Wall", "Cleric", "Wish Passer"],
    keyAbilities: ["Natural Cure"],
    keyMoves: ["Soft-Boiled", "Toxic", "Seismic Toss", "Stealth Rock", "Thunder Wave", "Aromatherapy", "Wish", "Teleport"],
    commonSets: [
      { name: "Mur Spécial", item: "Heavy-Duty Boots", ability: "Natural Cure", nature: "Bold", evs: "252 HP / 252 Def / 4 SpD", moves: ["Soft-Boiled", "Seismic Toss", "Toxic", "Stealth Rock"], description: "Le mur spécial absolu. 255 PV + 135 Déf.Spé = RIEN de spécial ne passe. Seismic Toss inflige toujours 100 dégâts fixes. Toxic pressure les switchs." },
      { name: "Wish Support", item: "Heavy-Duty Boots", ability: "Natural Cure", nature: "Bold", evs: "252 HP / 252 Def / 4 SpD", moves: ["Wish", "Protect", "Seismic Toss", "Aromatherapy"], description: "Wish passe des PV énormes aux partenaires (base 255 PV!). Aromatherapy soigne les statuts de toute l'équipe. Le cleric parfait." }
    ],
    notes: "Le mur spécial ultime depuis Gen 2. 255 PV est le maximum absolu. Natural Cure soigne les statuts en switchant. Seismic Toss est son STAB de fait (100 dégâts fixes). Wish passé aux alliés = support incomparable."
  },
  {
    name: "Amoonguss",
    types: ["Grass", "Poison"],
    baseStats: [114, 85, 70, 85, 80, 30],
    tier: "VGC dominant / OU",
    role: ["Support", "Redirector", "Pivot"],
    keyAbilities: ["Regenerator"],
    keyMoves: ["Spore", "Rage Powder", "Pollen Puff", "Protect", "Clear Smog", "Sludge Bomb"],
    commonSets: [
      { name: "Support VGC", item: "Rocky Helmet / Sitrus Berry", ability: "Regenerator", nature: "Relaxed", evs: "252 HP / 156 Def / 100 SpD", moves: ["Spore", "Rage Powder", "Pollen Puff", "Protect"], description: "Le redirector par excellence. Rage Powder attire les attaques, Spore endort (100% prio), Pollen Puff soigne les alliés. Un monstre en Doubles.", format: "VGC" }
    ],
    notes: "Amoonguss est l'un des meilleurs Pokémon de support de tous les temps en VGC. Sa lenteur est parfaite pour Trick Room."
  },
  {
    name: "Rillaboom",
    types: ["Grass"],
    baseStats: [100, 125, 90, 60, 70, 85],
    tier: "VGC / OU",
    role: ["Priority Attacker", "Terrain Setter", "Pivot"],
    keyAbilities: ["Grassy Surge"],
    keyMoves: ["Grassy Glide", "Wood Hammer", "U-turn", "Fake Out", "Knock Off"],
    commonSets: [
      { name: "Pivot Offensif VGC", item: "Assault Vest", ability: "Grassy Surge", nature: "Adamant", evs: "252 HP / 252 Atk / 4 SpD", moves: ["Fake Out", "Grassy Glide", "U-turn", "Wood Hammer"], description: "Pose le Grassy Terrain, tape à priorité avec Grassy Glide, et Fake Out. Assault Vest compense sa SpD moyenne.", format: "VGC" }
    ],
    notes: "Grassy Surge + Grassy Glide lui donne l'une des meilleures attaques prioritaires du jeu."
  },
  {
    name: "Urshifu-Rapid-Strike",
    types: ["Fighting", "Water"],
    baseStats: [100, 130, 100, 63, 60, 97],
    tier: "OU / VGC",
    role: ["Wallbreaker", "Setup Sweeper"],
    keyAbilities: ["Unseen Fist"],
    keyMoves: ["Surging Strikes", "Close Combat", "Aqua Jet", "U-turn", "Swords Dance"],
    commonSets: [
      { name: "Choice Scarf", item: "Choice Scarf", ability: "Unseen Fist", nature: "Jolly", evs: "252 Atk / 4 Def / 252 Spe", moves: ["Surging Strikes", "Close Combat", "U-turn", "Aqua Jet"], description: "Frappe à travers les Protect grâce à Unseen Fist. Surging Strikes crite toujours 3 fois, ignorant les baisses d'attaque et les boosts de défense adverses.", format: "Smogon OU" }
    ],
    notes: "La pire menace pour les walls défensifs car ses attaques ignorent Protect (en VGC) et crittent à chaque fois."
  },
  {
    name: "Iron Hands",
    types: ["Fighting", "Electric"],
    baseStats: [154, 140, 108, 50, 68, 50],
    tier: "VGC dominant / UU",
    role: ["Bulky Attacker", "Trick Room Sweeper"],
    keyAbilities: ["Quark Drive"],
    keyMoves: ["Fake Out", "Drain Punch", "Wild Charge", "Heavy Slam", "Swords Dance", "Volt Switch"],
    commonSets: [
      { name: "Assault Vest VGC", item: "Assault Vest", ability: "Quark Drive", nature: "Adamant", evs: "248 HP / 252 Atk / 8 SpD", moves: ["Fake Out", "Drain Punch", "Wild Charge", "Heavy Slam"], description: "Tank colossal en VGC. Absorbe les coups Spéciaux avec l'AV, tape incroyablement fort et se soigne avec Drain Punch.", format: "VGC" }
    ],
    notes: "Un des rois du VGC récent. Son bulk de base [154/108/68] avec Assault Vest le rend presque impossible à OHKO."
  },
  {
    name: "Ogerpon-Wellspring",
    types: ["Grass", "Water"],
    baseStats: [80, 120, 84, 60, 96, 110],
    tier: "OU / VGC",
    role: ["Setup Sweeper", "Wallbreaker", "Redirector (VGC)"],
    keyAbilities: ["Water Absorb"],
    keyMoves: ["Ivy Cudgel", "Horn Leech", "Swords Dance", "Spiky Shield", "Follow Me"],
    commonSets: [
      { name: "Swords Dance (OU)", item: "Wellspring Mask", ability: "Water Absorb", nature: "Jolly", evs: "252 Atk / 4 SpD / 252 Spe", moves: ["Swords Dance", "Ivy Cudgel", "Horn Leech", "Knock Off"], description: "Water Absorb empêche les switch sur des moves Eau, puis SD et sweep. Ivy Cudgel Eau a un taux de crit élevé.", format: "Smogon OU" },
      { name: "Support (VGC)", item: "Wellspring Mask", ability: "Water Absorb", nature: "Jolly", evs: "252 HP / 4 Atk / 252 Spe", moves: ["Follow Me", "Spiky Shield", "Ivy Cudgel", "Horn Leech"], description: "Redirection clé avec Follow Me pour protéger ses alliés. Masque Puits lui donne un boost en Def Spéciale lors du Terastal.", format: "VGC" }
    ],
    notes: "Pression incroyable en VGC et OU. Son attaque signature Ivy Cudgel (Eau) fait de lourds dégâts et sa versatilité de redirection la rend très utile."
  },
  {
    name: "Iron Valiant",
    types: ["Fairy", "Fighting"],
    baseStats: [74, 130, 90, 120, 60, 116],
    tier: "OU (S tier Gen 9)",
    role: ["Sweeper Mixte", "Wallbreaker", "Revenge Killer"],
    keyAbilities: ["Quark Drive"],
    keyMoves: ["Close Combat", "Moonblast", "Spirit Break", "Shadow Ball", "Swords Dance", "Calm Mind", "Encore"],
    commonSets: [
      { name: "Choice Scarf", item: "Choice Scarf", ability: "Quark Drive", nature: "Jolly", evs: "4 HP / 252 Atk / 252 Spe", moves: ["Close Combat", "Spirit Break", "Shadow Ball", "Encore"], description: "Revenge killer ultime. Quark Drive sous Electric Terrain booste sa vitesse déjà folle. Encore piège les setup moves adverses.", format: "Smogon OU" },
      { name: "Swords Dance", item: "Booster Energy", ability: "Quark Drive", nature: "Jolly", evs: "4 HP / 252 Atk / 252 Spe", moves: ["Swords Dance", "Close Combat", "Spirit Break", "Shadow Ball"], description: "Booster Energy active Quark Drive sans terrain. À +2 et avec la couverture Fighting/Fairy/Ghost, très peu de choses survivent.", format: "Smogon OU" }
    ],
    notes: "Un des Pokémon les plus menaçants de Gen 9. Ses stats mixtes (130 Atk / 120 SpA / 116 Spe) lui permettent de jouer physique, spécial ou mixte. Fairy/Fighting est un typage offensif exceptionnel."
  },
  {
    name: "Roaring Moon",
    types: ["Dragon", "Dark"],
    baseStats: [105, 139, 71, 55, 71, 119],
    tier: "OU (S tier Gen 9)",
    role: ["Setup Sweeper", "Wallbreaker", "Revenge Killer"],
    keyAbilities: ["Protosynthesis"],
    keyMoves: ["Acrobatics", "Dragon Dance", "Knock Off", "Earthquake", "Iron Head", "Crunch"],
    commonSets: [
      { name: "Dragon Dance", item: "Booster Energy", ability: "Protosynthesis", nature: "Jolly", evs: "4 HP / 252 Atk / 252 Spe", moves: ["Dragon Dance", "Acrobatics", "Knock Off", "Earthquake"], description: "Un des sweepers les plus redoutables. Booster Energy active Protosynthesis sur l'Attaque. DD+Acrobatics sans item dévaste. Dragon/Dark couvre tout.", format: "Smogon OU" }
    ],
    notes: "Roaring Moon est la contrepartie paradoxale de Salamence. 139 Atk et 119 Spe en font une menace de premier plan. Acrobatics sans item après Booster Energy atteint 110 de puissance STAB."
  },
  {
    name: "Gliscor",
    types: ["Ground", "Flying"],
    baseStats: [75, 95, 125, 45, 75, 95],
    tier: "OU (staple depuis Gen 4)",
    role: ["Pivot Défensif", "Hazard Setter", "Stallbreaker"],
    keyAbilities: ["Poison Heal"],
    keyMoves: ["Earthquake", "U-turn", "Stealth Rock", "Toxic", "Protect", "Knock Off", "Facade"],
    commonSets: [
      { name: "Poison Heal Défensif", item: "Toxic Orb", ability: "Poison Heal", nature: "Impish", evs: "244 HP / 8 Atk / 236 Def / 20 Spe", moves: ["Earthquake", "U-turn", "Stealth Rock", "Knock Off"], description: "Toxic Orb s'active, Poison Heal soigne 12.5% par tour. Pratiquement impossible à poisonner ou brûler. Pivot défensif avec une régénération permanente.", format: "Smogon OU" }
    ],
    notes: "Gliscor est le stallbreaker et pivot défensif parfait. Son immunité aux statuts via Poison Heal, sa résistance aux hazards et sa capacité à utiliser U-turn en font un indispensable depuis des années."
  },
  {
    name: "Ting-Lu",
    types: ["Dark", "Ground"],
    baseStats: [155, 110, 125, 55, 80, 45],
    tier: "OU",
    role: ["Hazard Setter", "Wall Physique", "Tank"],
    keyAbilities: ["Vessel of Ruin"],
    keyMoves: ["Stealth Rock", "Spikes", "Earthquake", "Ruination", "Whirlwind", "Knock Off"],
    commonSets: [
      { name: "Hazard Setter Défensif", item: "Leftovers", ability: "Vessel of Ruin", nature: "Impish", evs: "252 HP / 252 Def / 4 SpD", moves: ["Stealth Rock", "Spikes", "Earthquake", "Whirlwind"], description: "Vessel of Ruin réduit l'Atq.Spé de tous les adversaires présents de 25%. Bulk de 155/125 lui permet de poser les deux types de hazards et phazer avec Whirlwind.", format: "Smogon OU" }
    ],
    notes: "Le Pokémon avec le plus gros HP de Gen 9 (155). Vessel of Ruin affaiblit passif tous les attaquants spéciaux. Sa combinaison SR+Spikes en fait le meilleur setter de hazards du métagame Gen 9."
  },
  {
    name: "Skeledirge",
    types: ["Fire", "Ghost"],
    baseStats: [104, 75, 100, 110, 75, 66],
    tier: "OU",
    role: ["Wall Offensif", "Stallbreaker", "Pivot"],
    keyAbilities: ["Unaware"],
    keyMoves: ["Torch Song", "Shadow Ball", "Slack Off", "Will-O-Wisp", "Hex", "Encore"],
    commonSets: [
      { name: "Unaware Wall", item: "Leftovers", ability: "Unaware", nature: "Bold", evs: "252 HP / 252 Def / 4 SpA", moves: ["Torch Song", "Slack Off", "Will-O-Wisp", "Shadow Ball"], description: "Unaware ignore les boosts adverses. Torch Song booste sa propre SpA à chaque coup. Le counter parfait des setup sweepers. Slack Off pour la régénération.", format: "Smogon OU" }
    ],
    notes: "Skeledirge est le counter de setup par excellence avec Unaware. Ses résistances Fire/Ghost lui permettent de bloquer de nombreuses menaces et de répondre avec Torch Song (boost +1 SpA garanti)."
  },
  {
    name: "Darkrai",
    types: ["Dark"],
    baseStats: [70, 90, 90, 135, 90, 125],
    tier: "OU",
    role: ["Wallbreaker", "Sweeper Spécial", "Stallbreaker"],
    keyAbilities: ["Bad Dreams"],
    keyMoves: ["Dark Void", "Dark Pulse", "Sludge Bomb", "Nasty Plot", "Focus Blast", "Ice Beam"],
    commonSets: [
      { name: "Nasty Plot", item: "Life Orb", ability: "Bad Dreams", nature: "Timid", evs: "4 HP / 252 SpA / 252 Spe", moves: ["Dark Void", "Dark Pulse", "Sludge Bomb", "Nasty Plot"], description: "Dark Void à 80% endort un adversaire (Sleep Clause permet 1 max). NP booste SpA à +2. 135 SpA de base + Life Orb + NP = OHKO sur presque tout.", format: "Smogon OU" }
    ],
    notes: "Darkrai est une menace unique grâce à Dark Void (move signature à 80% de précision). Bad Dreams inflige 12.5% de dégâts par tour à la cible endormie. Combiné à NP, il peut sweeper des équipes entières."
  },
  {
    name: "Kyurem",
    types: ["Dragon", "Ice"],
    baseStats: [125, 130, 90, 130, 90, 95],
    tier: "OU",
    role: ["Wallbreaker", "Setup Sweeper", "Breaker Mixte"],
    keyAbilities: ["Pressure"],
    keyMoves: ["Freeze-Dry", "Dragon Claw", "Earth Power", "Blizzard", "Substitute", "Roost"],
    commonSets: [
      { name: "SubRoost Spécial", item: "Leftovers", ability: "Pressure", nature: "Timid", evs: "4 HP / 252 SpA / 252 Spe", moves: ["Freeze-Dry", "Earth Power", "Dragon Claw", "Roost"], description: "Freeze-Dry est unique — super efficace contre l'Eau. 130 SpA avec 4 types de couverture. Roost pour durer. Quasi incounterarable sans un acier rapide.", format: "Smogon OU" }
    ],
    notes: "Kyurem est le wallbreaker le plus redouté de Gen 9 OU. Freeze-Dry super efficace contre l'Eau, Earth Power pour les Aciers, Dragon Claw pour les Dragons. 130/130 offensif avec 125 PV — aucun point faible."
  },
  {
    name: "Meowscarada",
    types: ["Grass", "Dark"],
    baseStats: [76, 110, 70, 81, 70, 123],
    tier: "OU",
    role: ["Sweeper Physique", "Revenge Killer", "Wallbreaker"],
    keyAbilities: ["Protean", "Overgrow"],
    keyMoves: ["Flower Trick", "Knock Off", "U-turn", "Play Rough", "Sucker Punch", "Spikes"],
    commonSets: [
      { name: "Choice Band", item: "Choice Band", ability: "Protean", nature: "Jolly", evs: "4 HP / 252 Atk / 252 Spe", moves: ["Flower Trick", "Knock Off", "U-turn", "Play Rough"], description: "Flower Trick crite TOUJOURS et ignore les changements de stats/terrain. Avec CB et Protean, c'est STAB + 1.5x + crit. Knock Off et U-turn pour le momentum.", format: "Smogon OU" }
    ],
    notes: "La vitesse 123 en fait un des starters les plus rapides du jeu. Flower Trick est une attaque brisée — guaranteed crit ignore les Minimize, Cotton Guard, etc. Protean lui donne le STAB sur tous ses moves."
  },
  {
    name: "Iron Moth",
    types: ["Fire", "Poison"],
    baseStats: [80, 70, 60, 140, 110, 110],
    tier: "OU",
    role: ["Sweeper Spécial", "Wallbreaker"],
    keyAbilities: ["Quark Drive"],
    keyMoves: ["Fiery Dance", "Sludge Wave", "Energy Ball", "Morning Sun", "Agility"],
    commonSets: [
      { name: "Booster Energy Offensif", item: "Booster Energy", ability: "Quark Drive", nature: "Timid", evs: "4 HP / 252 SpA / 252 Spe", moves: ["Fiery Dance", "Sludge Wave", "Energy Ball", "Morning Sun"], description: "Booster Energy booste SpA à 140+boost. Fiery Dance a 50% de chance de +1 SpA supplémentaire. Fire/Poison/Grass couvre énormément.", format: "Smogon OU" }
    ],
    notes: "La Volcarona paradoxale de Gen 9. 140 SpA est l'un des plus hauts du jeu. Fiery Dance peut snowball en accumulant des boosts. Résistance à 10 types incluant Fairy et Poison."
  },
  {
    name: "Tornadus-Therian",
    types: ["Flying"],
    baseStats: [79, 100, 80, 110, 90, 121],
    tier: "OU / VGC",
    role: ["Pivot Offensif", "Stallbreaker", "Wallbreaker"],
    keyAbilities: ["Regenerator"],
    keyMoves: ["Hurricane", "Heat Wave", "Knock Off", "U-turn", "Nasty Plot", "Tailwind"],
    commonSets: [
      { name: "Pivot Regenerator", item: "Heavy-Duty Boots", ability: "Regenerator", nature: "Timid", evs: "4 HP / 252 SpA / 252 Spe", moves: ["Hurricane", "Heat Wave", "Knock Off", "U-turn"], description: "Regenerator + Boots = Pokémon qui ne meurt jamais. Hurricane en Pluie a 100% précision. U-turn pour le momentum sans perdre de PV. Un des pivots les plus efficaces.", format: "Smogon OU" },
      { name: "Tailwind Support (VGC)", item: "Rocky Helmet", ability: "Regenerator", nature: "Timid", evs: "252 HP / 4 SpA / 252 Spe", moves: ["Tailwind", "Hurricane", "Heat Wave", "Knock Off"], description: "Speed control en VGC avec Tailwind. Regenerator le rend difficile à éliminer. Knock Off retire les items adverses.", format: "VGC" }
    ],
    notes: "Tornadus-T est l'un des meilleurs pivots du jeu depuis Gen 5. Regenerator + HDB le rend pratiquement impossible à chip. Hurricane à 30% confusion est parmi les attaques les plus dangereuses."
  },
  {
    name: "Gouging Fire",
    types: ["Fire", "Dragon"],
    baseStats: [105, 115, 121, 65, 93, 91],
    tier: "OU",
    role: ["Wall Physique", "Setup Sweeper", "Pivot"],
    keyAbilities: ["Protosynthesis"],
    keyMoves: ["Dragon Dance", "Flare Blitz", "Outrage", "Earthquake", "Morning Sun", "Lava Plume"],
    commonSets: [
      { name: "Dragon Dance", item: "Booster Energy", ability: "Protosynthesis", nature: "Adamant", evs: "252 HP / 252 Atk / 4 Spe", moves: ["Dragon Dance", "Flare Blitz", "Outrage", "Earthquake"], description: "Tank qui setup. 105/121 lui permet d'absorber des coups avant de DD. Booster Energy active Protosynthesis sur l'Attaque. Fire/Dragon STAB dévastate après DD.", format: "Smogon OU" }
    ],
    notes: "Le paradoxe d'Entei avec le stats colossal de 105/121. Résistance clé au Feu et au Sol. Morning Sun lui permet de se soigner en dehors du Soleil. Menace entre wall et sweeper."
  },
  {
    name: "Raging Bolt",
    types: ["Electric", "Dragon"],
    baseStats: [125, 73, 91, 137, 89, 75],
    tier: "OU",
    role: ["Wallbreaker Spécial", "Tank Offensif"],
    keyAbilities: ["Protosynthesis"],
    keyMoves: ["Thunderclap", "Dragon Pulse", "Thunderbolt", "Calm Mind", "Volt Switch", "Tera Blast"],
    commonSets: [
      { name: "Calm Mind", item: "Booster Energy", ability: "Protosynthesis", nature: "Modest", evs: "252 HP / 252 SpA / 4 SpD", moves: ["Thunderclap", "Dragon Pulse", "Calm Mind", "Volt Switch"], description: "Thunderclap est une attaque Électrique prioritaire +1. Avec CM, il devient un tank offensif redoutable. 137 SpA + Booster Energy + CM = quasi instopped.", format: "Smogon OU" }
    ],
    notes: "Raging Bolt a Thunderclap, l'unique attaque Électrique à priorité +1. Cela lui permet de revenge killer les sweepers rapides. 125 HP et 137 SpA pour un ratio offensif/défensif excellent."
  },
  {
    name: "Calyrex-Shadow",
    types: ["Psychic", "Ghost"],
    baseStats: [100, 85, 80, 165, 100, 150],
    tier: "Ubers / VGC Restricted",
    role: ["Sweeper Spécial", "Revenge Killer", "Breaker"],
    keyAbilities: ["As One (Spectrier)"],
    keyMoves: ["Astral Barrage", "Shadow Ball", "Psyshock", "Nasty Plot", "Trick Room"],
    commonSets: [
      { name: "Sweeper Offensif (VGC)", item: "Choice Specs", ability: "As One", nature: "Timid", evs: "4 HP / 252 SpA / 252 Spe", moves: ["Astral Barrage", "Shadow Ball", "Psyshock", "Trick Room"], description: "165 SpA + 150 Vit + As One (booste SpA à chaque KO) = le Pokémon le plus dominant des formats Restricted. Astral Barrage (spread) dévaste les Doubles.", format: "VGC" }
    ],
    notes: "Calyrex-Shadow est considéré comme le Pokémon Restricted le plus puissant jamais créé. As One accumule des boosts de SpA à chaque KO. 165 SpA de base avec 150 de Vitesse — quasi impossible à outspeed et à stopper."
  },
  {
    name: "Terapagos",
    types: ["Normal"],
    baseStats: [90, 65, 85, 65, 85, 60],
    tier: "VGC (Regulation H+)",
    role: ["Tank Spécial", "Setup", "Win Condition"],
    keyAbilities: ["Tera Shift", "Teraform Zero"],
    keyMoves: ["Tera Starstorm", "Earth Power", "Calm Mind", "Protect", "Dazzling Gleam"],
    commonSets: [
      { name: "Terastal Offensif (VGC)", item: "Leftovers", ability: "Tera Shift", nature: "Modest", evs: "252 HP / 252 SpA / 4 SpD", moves: ["Tera Starstorm", "Earth Power", "Calm Mind", "Protect"], description: "Devient Terapagos-Terastal au combat (95/105/110/105/110/85). Tera Starstorm est un spread move unique qui ignore Protect en Doubles. Teraform Zero annule la météo et les terrains.", format: "VGC" }
    ],
    notes: "La mascotte de Gen 9. Teraform Zero est un talent unique qui annule météo et terrain en devenant Stellar. Tera Starstorm ignore Protect en Doubles, ce qui en fait une menace incontournable en VGC Regulation H."
  },
  {
    name: "Enamorus-Therian",
    types: ["Fairy", "Flying"],
    baseStats: [74, 115, 70, 135, 80, 106],
    tier: "OU / VGC",
    role: ["Sweeper Spécial", "Wallbreaker", "Support VGC"],
    keyAbilities: ["Overcoat"],
    keyMoves: ["Moonblast", "Heat Wave", "Earth Power", "Calm Mind", "Tailwind", "Follow Me"],
    commonSets: [
      { name: "Nasty Plot Offensif", item: "Life Orb", ability: "Overcoat", nature: "Timid", evs: "4 HP / 252 SpA / 252 Spe", moves: ["Moonblast", "Heat Wave", "Earth Power", "Calm Mind"], description: "135 SpA avec Fairy/Feu/Sol en couverture. Overcoat l'immunise aux poudres et grêle. Après CM, presque rien ne peut l'arrêter.", format: "Smogon OU" },
      { name: "Support VGC", item: "Covert Cloak", ability: "Overcoat", nature: "Timid", evs: "252 HP / 4 SpA / 252 Spe", moves: ["Moonblast", "Heat Wave", "Tailwind", "Follow Me"], description: "Pose le Tailwind et redirige les attaques avec Follow Me. Covert Cloak ignore les effets secondaires des attaques adverses.", format: "VGC" }
    ],
    notes: "Enamorus-T combine des stats offensives de 115/135 avec un typage Fairy/Vol excellent. Overcoat la rend immunisée aux poudres (Spore, Sleep Powder) — un avantage clé contre Amoonguss en VGC."
  }
];

export const STAT_LABELS = ["PV", "Atq", "Déf", "A.Sp", "D.Sp", "Vit"];
export const STAT_COLORS = ["#ef4444", "#f97316", "#eab308", "#3b82f6", "#22c55e", "#ec4899"];
