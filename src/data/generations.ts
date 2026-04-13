export interface Generation {
  num: number;
  name: string;
  games: string;
  year: string;
  region: string;
  newPokemon: number;
  totalPokemon: number;
  keyMechanics: string[];
  metaDefining: string[];
  competitiveNotes: string;
}

export const GENERATIONS: Generation[] = [
  {
    num: 1, name: "Génération I", games: "Rouge / Bleu / Jaune", year: "1996", region: "Kanto",
    newPokemon: 151, totalPokemon: 151,
    keyMechanics: [
      "Pas de split Physique/Spécial (le type détermine la catégorie)",
      "Pas de talents, pas d'objets tenus, pas de natures",
      "Les types n'ont pas encore Acier, Ténèbres, Fée",
      "La Vitesse affecte le taux de critique",
      "Beaucoup de bugs (Psychic OP car pas de vrai counter)"
    ],
    metaDefining: ["Mewtwo (broken)", "Tauros", "Chansey", "Snorlax", "Alakazam", "Starmie"],
    competitiveNotes: "Le Psychic domine tout. Le seul Bug SE est Pin Missile. Ghost buggé, ne touche pas Psychic. Tauros est le meilleur non-légendaire grâce à Hyper Beam qui ne requiert pas de recharge après un KO."
  },
  {
    num: 2, name: "Génération II", games: "Or / Argent / Cristal", year: "1999", region: "Johto",
    newPokemon: 100, totalPokemon: 251,
    keyMechanics: [
      "Ajout des types Acier et Ténèbres (nerf du Psychic)",
      "Objets tenus introduits (Restes, Baies)",
      "Ajout du Spécial Défense (split du stat Spécial)",
      "Météo introduite (Sunny Day, Rain Dance)",
      "Reproduction et Oeufs, IVs modernisés"
    ],
    metaDefining: ["Snorlax (roi)", "Tyranitar", "Skarmory", "Blissey", "Forretress", "Suicune"],
    competitiveNotes: "L'ère du stall. SkarmBliss (Skarmory + Blissey) est la combo défensive emblématique. Snorlax est le Pokémon le plus dominant de toute l'histoire compétitive. CurseLax est quasi imbattable."
  },
  {
    num: 3, name: "Génération III", games: "Rubis / Saphir / Émeraude / RF/VF", year: "2002", region: "Hoenn",
    newPokemon: 135, totalPokemon: 386,
    keyMechanics: [
      "Talents (Abilities) introduits — révolution!",
      "Natures introduites (+10% stat / -10% stat)",
      "EVs modernes (système actuel)",
      "Combats en Double introduits",
      "Chaque Pokémon a un ou deux talents"
    ],
    metaDefining: ["Salamence", "Metagross", "Tyranitar", "Swampert", "Jirachi", "Gengar"],
    competitiveNotes: "Explosion de diversité. Les talents changent tout (Intimidate, Sand Stream). Le metagame devient beaucoup plus stratégique. ADV OU est considéré comme l'un des meilleurs metagames."
  },
  {
    num: 4, name: "Génération IV", games: "Diamant / Perle / Platine / HG/SS", year: "2006", region: "Sinnoh",
    newPokemon: 107, totalPokemon: 493,
    keyMechanics: [
      "SPLIT PHYSIQUE/SPÉCIAL — chaque attaque est physiquement ou spécialement indépendamment du type!",
      "Attaques physiques Feu, attaques spéciales Combat, etc.",
      "Stealth Rock introduit — change le jeu pour toujours",
      "Choice Scarf, Life Orb, Choice Specs introduits",
      "Wi-Fi battles — compétitif en ligne commence"
    ],
    metaDefining: ["Garchomp", "Heatran", "Rotom-Wash", "Scizor", "Lucario", "Latias/Latios"],
    competitiveNotes: "La révolution. Le split physique/spécial libère des dizaines de Pokémon. Garchomp est si fort qu'il est banni en OU. Scizor avec Bullet Punch + Technician domine. L'âge d'or."
  },
  {
    num: 5, name: "Génération V", games: "Noir / Blanc / N2/B2", year: "2010", region: "Unova",
    newPokemon: 156, totalPokemon: 649,
    keyMechanics: [
      "Talents cachés (Hidden Abilities) — 3ème talent par Pokémon",
      "Gems (joyaux) — boost unique d'un type",
      "Team Preview introduit (on voit l'équipe adverse avant)",
      "Météo permanente (Drizzle/Drought sans limite de tours)",
      "Nouveaux objets: Eviolite, Assault Vest (Gen 6 en réalité)"
    ],
    metaDefining: ["Excadrill", "Ferrothorn", "Landorus-T", "Thundurus", "Keldeo", "Volcarona"],
    competitiveNotes: "L'ère des Weather Wars. Chaque équipe DOIT avoir une stratégie météo. Drizzle + Swift Swim et Sand Rush dominent. BW OU est considéré comme le metagame le plus complexe."
  },
  {
    num: 6, name: "Génération VI", games: "X / Y / ROSA", year: "2013", region: "Kalos",
    newPokemon: 72, totalPokemon: 721,
    keyMechanics: [
      "TYPE FÉE introduit — nerf des Dragons!",
      "Méga-Évolutions — forme temporaire surpuissante",
      "Les types Électrik ne peuvent plus être paralysés",
      "Les types Plante sont immunisés aux poudres",
      "Météo nerfée (5 tours au lieu de permanent)"
    ],
    metaDefining: ["Mega-Kangaskhan", "Mega-Gengar", "Mega-Salamence", "Talonflame", "Aegislash", "Clefable"],
    competitiveNotes: "Les Mégas changent tout. Chaque équipe a UN Méga. Mega-Kangaskhan est brisé en VGC (Parental Bond = double hit). Fairy rééquilibre le jeu. Le metagame est plus offensif."
  },
  {
    num: 7, name: "Génération VII", games: "Soleil / Lune / USUL", year: "2016", region: "Alola",
    newPokemon: 88, totalPokemon: 809,
    keyMechanics: [
      "Z-Moves — attaque ultime unique par combat",
      "Formes régionales d'Alola (ex: Ninetales-Alola = Glace/Fée)",
      "Terrains (Électrique, Psychique, Herbeux, Brumeux)",
      "Ultra-Chimères avec Beast Boost",
      "Paralysie nerfée (50% vitesse au lieu de 75%)"
    ],
    metaDefining: ["Tapu Koko/Lele/Bulu/Fini", "Landorus-T (toujours)", "Magearna", "Toxapex", "Celesteela"],
    competitiveNotes: "L'ère des Tapus. Les terrains deviennent centraux. Tapu Lele + Psychic Terrain empêche les priority. Z-Moves ajoutent une couche de mind game (quel Z-Move a l'adversaire?)."
  },
  {
    num: 8, name: "Génération VIII", games: "Épée / Bouclier", year: "2019", region: "Galar",
    newPokemon: 89, totalPokemon: 898,
    keyMechanics: [
      "Dynamax — triple les PV pendant 3 tours, attaques Max surpuissantes",
      "Pas de Mégas ni Z-Moves",
      "National Dex coupé (Dexit) — pas tous les Pokémon disponibles",
      "Max Moves ont des effets secondaires (météo, terrains, boosts)",
      "Rapid Spin buff (+1 Vitesse)"
    ],
    metaDefining: ["Zacian (VGC)", "Urshifu", "Dragapult", "Toxapex", "Rillaboom", "Landorus-T"],
    competitiveNotes: "Dynamax est EXTRÊMEMENT puissant et banni en Smogon OU (pas en VGC). En VGC, le jeu tourne autour de qui Dynamax et quand. Urshifu ignore Protect, ce qui casse les Doubles."
  },
  {
    num: 9, name: "Génération IX", games: "Écarlate / Violet + DLC", year: "2022", region: "Paldea",
    newPokemon: 120, totalPokemon: 1025,
    keyMechanics: [
      "Téracristallisation — change le type du Pokémon en combat (une fois)",
      "Pokémon Paradoxes avec talents Protosynthèse/Neuroquartz",
      "Booster Energy active les talents Paradoxes",
      "Pas de Dynamax, pas de Mégas, pas de Z-Moves",
      "Open World pour la première fois"
    ],
    metaDefining: ["Flutter Mane", "Iron Bundle", "Gholdengo", "Kingambit", "Great Tusk", "Iron Hands", "Annihilape"],
    competitiveNotes: "La Téracristallisation est la mécanique la plus mind-game de l'histoire. Changer de type en plein combat = imprévisible. Tera Ghost pour dodge Fighting, Tera Water pour couvrir Fire. Le metagame est extrêmement dynamique."
  }
];
