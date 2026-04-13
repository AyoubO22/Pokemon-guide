export interface TeamRole {
  name: string;
  nameFr: string;
  icon: string;
  description: string;
  examples: string[];
  whatToLookFor: string[];
}

export const TEAM_ROLES: TeamRole[] = [
  {
    name: "Physical Sweeper", nameFr: "Sweeper Physique", icon: "⚔️",
    description: "Attaquant principal physique. Haut Attaque + Vitesse. Son but : détruire l'équipe adverse après que les checks soient affaiblis.",
    examples: ["Garchomp (SD)", "Dragonite (DD)", "Weavile", "Urshifu", "Barraskewda"],
    whatToLookFor: ["Base Attaque ≥ 120 ou talent boost", "Base Vitesse ≥ 95 ou setup/scarf", "Bon coverage (STAB + 2 couvertures)", "Accès à un move de setup ou coverage super efficace"]
  },
  {
    name: "Special Sweeper", nameFr: "Sweeper Spécial", icon: "🔮",
    description: "Équivalent spécial. Haut Atq.Spé + Vitesse. Souvent plus difficile à waller grâce à un meilleur coverage.",
    examples: ["Dragapult", "Volcarona", "Iron Valiant", "Gengar", "Tapu Lele"],
    whatToLookFor: ["Base Atq.Spé ≥ 120", "Coverage varié", "Accès à Nasty Plot/Calm Mind/Quiver Dance"]
  },
  {
    name: "Physical Wall", nameFr: "Mur Physique", icon: "🛡️",
    description: "Tank qui absorbe les attaques physiques. Haut PV + Défense. Souvent avec recovery.",
    examples: ["Skarmory", "Corviknight", "Hippowdon", "Toxapex", "Landorus-T"],
    whatToLookFor: ["Base Défense ≥ 100", "Accès au recovery (Roost, Recover, Slack Off)", "Résistances utiles", "Utility moves (Stealth Rock, Toxic, Will-O-Wisp)"]
  },
  {
    name: "Special Wall", nameFr: "Mur Spécial", icon: "🔰",
    description: "Absorbe les attaques spéciales. Souvent aussi support avec Wish, Heal Bell.",
    examples: ["Blissey/Chansey", "Gastrodon", "Clodsire", "Heatran", "Dondozo"],
    whatToLookFor: ["Base Déf.Spé ≥ 100 ou PV très hauts", "Recovery fiable", "Capacité à punir les switchs (Toxic, Knock Off)"]
  },
  {
    name: "Pivot", nameFr: "Pivot", icon: "🔄",
    description: "Pokémon qui maintient le momentum avec U-turn/Volt Switch. Entre, absorbe un coup ou pose une menace, et sort.",
    examples: ["Landorus-T", "Rotom-Wash", "Scizor", "Tornadus-T", "Slowbro"],
    whatToLookFor: ["U-turn, Volt Switch, Flip Turn ou Teleport", "Bon typing défensif", "Intimidate ou Regenerator = bonus énorme"]
  },
  {
    name: "Lead / Hazard Setter", nameFr: "Lead / Poseur de Pièges", icon: "🪨",
    description: "Premier Pokémon envoyé. Pose Stealth Rock/Spikes et contrôle le début de match.",
    examples: ["Landorus-T", "Garchomp", "Ferrothorn", "Grimmsnarl", "Deoxys-Speed"],
    whatToLookFor: ["Accès à Stealth Rock ou Spikes", "Rapide ou avec Taunt pour empêcher les hazards adverses", "Momentum après avoir posé (U-turn, explosion)"]
  },
  {
    name: "Revenge Killer", nameFr: "Revenge Killer", icon: "💨",
    description: "Pokémon rapide (souvent Scarf) qui entre après un KO pour éliminer la menace. Essentiel comme filet de sécurité.",
    examples: ["Garchomp (Scarf)", "Iron Bundle", "Weavile", "Dragapult"],
    whatToLookFor: ["Vitesse très haute ou Choice Scarf", "Bonne puissance sans setup", "Priority moves = bonus"]
  },
  {
    name: "Wallbreaker", nameFr: "Wallbreaker", icon: "💥",
    description: "Puissance brute pour détruire les walls adverses et ouvrir la voie au sweeper. Souvent Choice Band/Specs.",
    examples: ["Urshifu", "Kartana", "Iron Valiant", "Crawdaunt", "Kyurem"],
    whatToLookFor: ["Attaque ou Atq.Spé extrêmes", "Coverage pour toucher les walls courants", "Pas besoin d'être rapide, juste surpuissant"]
  }
];

export interface ArchetypeInfo {
  name: string;
  nameFr: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  keyPokemon: string[];
}

export const TEAM_ARCHETYPES: ArchetypeInfo[] = [
  {
    name: "Hyper Offense", nameFr: "Hyper Offense",
    description: "6 Pokémon offensifs. Pas de walls. L'idée : frapper si fort et si vite que l'adversaire ne peut pas respirer. Souvent avec un lead suicide (hazards + Taunt) puis des setup sweepers.",
    strengths: ["Pression constante", "Difficile à prédire", "Chaque Pokémon est une menace"],
    weaknesses: ["Fragile aux priority moves", "Vulnérable aux revenge killers", "Une mauvaise prédiction = match perdu"],
    keyPokemon: ["Deoxys-Speed (lead)", "Garchomp", "Volcarona", "Weavile", "Dragonite"]
  },
  {
    name: "Balanced", nameFr: "Équilibré",
    description: "Le style le plus solide. Mélange d'offense et défense. 2-3 Pokémon offensifs + 2-3 défensifs + pivots. L'objectif est d'avoir une réponse à tout.",
    strengths: ["Peu de matchups auto-perdants", "Flexibilité en jeu", "Erreurs moins punies"],
    weaknesses: ["Peut manquer de puissance contre le stall", "Nécessite une bonne connaissance du metagame"],
    keyPokemon: ["Landorus-T", "Heatran", "Clefable", "Dragapult", "Toxapex"]
  },
  {
    name: "Stall", nameFr: "Stall",
    description: "6 Pokémon défensifs. Gagner en fatiguant l'adversaire avec Toxic, hazards, et recovery. Le match dure longtemps mais la victoire est méthodique.",
    strengths: ["Très dur à battre si bien joué", "Pardonne les erreurs", "Contrôle total du rythme"],
    weaknesses: ["Vulnérable aux wallbreakers (Urshifu, Kyurem)", "Taunt détruit le gameplan", "Matchs longs, Timer en compétition"],
    keyPokemon: ["Toxapex", "Blissey", "Corviknight", "Quagsire/Clodsire", "Skarmory"]
  },
  {
    name: "Weather Teams", nameFr: "Équipes Météo",
    description: "Basées sur une condition météo (Pluie, Soleil, Sable, Neige). Un setter auto (Drizzle, Drought...) + des abusers (Swift Swim, Chlorophyll...).",
    strengths: ["Synergie forte", "Vitesse doublée pour les abusers", "Boost de puissance passif"],
    weaknesses: ["Dépendant de la météo (changeable)", "Prévisible", "6 Pokémon doivent profiter de la météo"],
    keyPokemon: ["Pelipper (Pluie)", "Torkoal (Soleil)", "Tyranitar (Sable)", "Ninetales-Alola (Neige)"]
  },
  {
    name: "Trick Room", nameFr: "Distorsion",
    description: "Inverse l'ordre de vitesse. Les Pokémon lents frappent en premier. Très fort en VGC/Doubles.",
    strengths: ["Les Pokémon lents ont souvent des stats énormes", "Surprend les équipes rapides", "Facile à poser en Doubles"],
    weaknesses: ["Limité à 5 tours", "Le setter doit survivre", "Taunt bloque le setup"],
    keyPokemon: ["Dusclops (setter)", "Hatterene (setter+attaquant)", "Torkoal", "Iron Hands", "Ursaluna"]
  }
];
