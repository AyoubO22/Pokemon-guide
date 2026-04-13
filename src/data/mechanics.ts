export interface MechanicDetail {
  name: string;
  nameFr: string;
  category: string;
  description: string;
  competitiveImpact: string;
  examples: string[];
}

export const ADVANCED_MECHANICS: MechanicDetail[] = [
  // Weather
  {
    name: "Rain", nameFr: "Pluie", category: "Météo",
    description: "Boost Eau x1.5, nerf Feu x0.5. Thunder et Hurricane ont 100% précision. Empêche Synthesis de soigner pleinement.",
    competitiveImpact: "Archétype Rain très puissant. Swift Swim double la Vitesse. Pelipper (Drizzle) + Barraskewda/Kingdra. Les équipes Rain dominent par la vitesse et la pression offensive.",
    examples: ["Pelipper + Barraskewda = base 136 Vitesse doublée + STAB Eau boosté", "Thunder 100% accuracy = Zapdos devient terrrifiant", "Damp Rock pour 8 tours de pluie"]
  },
  {
    name: "Sun", nameFr: "Soleil", category: "Météo",
    description: "Boost Feu x1.5, nerf Eau x0.5. Chlorophyll double la Vitesse. Lance-Soleil skip le tour de charge. Morning Sun soigne 66%.",
    competitiveImpact: "Sun teams sont plus offensives que Rain. Torkoal (Drought) + Venusaur (Chlorophyll). En VGC, le soleil booste aussi les attaques de Cherrim avec Flower Gift.",
    examples: ["Torkoal + Venusaur (Chlorophyll) en VGC", "Charizard sous Soleil = Flamethrower surpuissant", "Eruption Torkoal à PV pleins = 150 puissance + STAB + Sun"]
  },
  {
    name: "Sand", nameFr: "Tempête de Sable", category: "Météo",
    description: "Dégâts 1/16 par tour (sauf Roche/Sol/Acier). Boost Déf.Spé des types Roche de 50%! Sand Rush double la Vitesse.",
    competitiveImpact: "Le boost de 50% Déf.Spé est souvent oublié mais énorme. Tyranitar passe de bon à excellent. Excadrill (Sand Rush) est un des meilleurs sweepers physiques de l'histoire.",
    examples: ["Tyranitar (Sand Stream) + Excadrill (Sand Rush) = combo iconique", "Le sable buff Déf.Spé de Tyranitar le rend quasi spécialement indestructible", "Hippowdon = setter alternatif plus défensif"]
  },
  {
    name: "Snow/Hail", nameFr: "Neige/Grêle", category: "Météo",
    description: "Gen 3-8 : Grêle, dégâts 1/16 (sauf Glace). Blizzard 100% précision. Gen 9 : Neige, boost Déf des types Glace de 50%.",
    competitiveImpact: "Historiquement le plus faible. En Gen 9, le buff de Défense rend les Glace plus viables. Aurora Veil (dure 5 tours, réduit tous les dégâts) nécessite la neige.",
    examples: ["Ninetales-Alola (Snow Warning) + Aurora Veil = protection d'équipe", "Slush Rush Beartic/Arctozolt sous neige", "Blizzard 100% accuracy + Freeze chance"]
  },

  // Terrains
  {
    name: "Electric Terrain", nameFr: "Champ Électrifié", category: "Terrain",
    description: "Boost Électrik x1.3 pour les Pokémon au sol. Empêche le sommeil pour les Pokémon au sol. Dure 5 tours.",
    competitiveImpact: "Tapu Koko le pose automatiquement. Empêche Spore, Sleep Powder, Yawn. Le boost x1.3 rend Rising Voltage (130 puissance doublée à 260 sur le terrain!) dévastateur.",
    examples: ["Tapu Koko = setter automatique", "Bloque totalement les stratégies Sleep", "Pincurchin (Electric Surge) = setter alternatif"]
  },
  {
    name: "Psychic Terrain", nameFr: "Champ Psychique", category: "Terrain",
    description: "Boost Psy x1.3 pour les Pokémon au sol. BLOQUE les moves de priorité contre les Pokémon au sol!",
    competitiveImpact: "Tapu Lele le pose. Le blocage de la priorité est ÉNORME — pas de Bullet Punch, Mach Punch, Aqua Jet, Sucker Punch, Extreme Speed. Les sweepers rapides adorent ça.",
    examples: ["Tapu Lele empêche toute revenge kill par priorité", "Expanding Force (80 → 120 + touche les 2 en Doubles)", "Les Pokémon lévitants ne bénéficient PAS du boost"]
  },
  {
    name: "Grassy Terrain", nameFr: "Champ Herbu", category: "Terrain",
    description: "Boost Plante x1.3. Soigne 1/16 PV par tour (au sol). Réduit les dégâts de Earthquake/Bulldoze/Magnitude de 50%.",
    competitiveImpact: "Tapu Bulu / Rillaboom (Grassy Surge). Le soin passif est excellent pour les tanks. La réduction d'Earthquake change le metagame car EQ est la meilleure coverage physique.",
    examples: ["Rillaboom Grassy Glide = priorité Plante STAB + terrain boost", "Soigne 6.25% par tour = mini Leftovers pour toute l'équipe au sol", "Nerf Earthquake protège les partenaires en Doubles"]
  },
  {
    name: "Misty Terrain", nameFr: "Champ Brumeux", category: "Terrain",
    description: "Réduit dégâts Dragon x0.5 pour les Pokémon au sol. Empêche tous les statuts pour les Pokémon au sol.",
    competitiveImpact: "Tapu Fini le pose. L'immunité aux statuts est incroyable — pas de Toxic, pas de Will-O-Wisp, pas de Thunder Wave. Nerf Dragon est un bonus.",
    examples: ["Tapu Fini protège toute l'équipe des statuts", "Contre totalement les équipes Toxic stall", "Misty Explosion (puissance doublée sur le terrain)"]
  },

  // Battle mechanics
  {
    name: "Switching", nameFr: "Switch / Pivot", category: "Mécanique de Combat",
    description: "Changer de Pokémon est l'action la plus importante du jeu. Coûte un tour mais repositionne l'avantage.",
    competitiveImpact: "Le jeu compétitif Pokémon EST un jeu de switchs. 70% des tours impliquent au moins un switch. Prédire le switch adverse est la compétence #1.",
    examples: ["Double switch : tu prédis le switch adverse et envoies directement le counter", "Sac switch : tu envoies un Pokémon non essentiel pour mourir et entrer gratuitement", "Pivot moves (U-turn, Volt Switch) permettent de switch ET frapper"]
  },
  {
    name: "Predictions", nameFr: "Prédictions", category: "Mécanique de Combat",
    description: "Anticiper l'action adverse. Rester ou switch ? Attaquer ou setup ? Quelle attaque ? C'est le poker Pokémon.",
    competitiveImpact: "Le skill gap entre joueurs se mesure en qualité de prédictions. Un débutant joue réactif (je vois un Garchomp, j'envoie mon type Glace). Un pro anticipe (il va switch son Garchomp, je vais U-turn pour garder le momentum).",
    examples: ["Hard predict : tu attaques le switch-in prévu plutôt que ce qui est en face", "Safe play : tu choisis l'option la moins risquée (pivot, attaque neutre)", "50/50 : situation où 2 options sont viables et le résultat dépend du read"]
  },
  {
    name: "Momentum", nameFr: "Momentum", category: "Mécanique de Combat",
    description: "Le contrôle du rythme. Avoir le momentum = forcer l'adversaire à réagir à tes menaces.",
    competitiveImpact: "Le pivot cycle est la meilleure façon de maintenir le momentum. U-turn + Volt Switch en boucle, chaque entrée met une pression. Perdre le momentum = l'adversaire setup ou pose des hazards.",
    examples: ["VoltTurn : Rotom-W Volt Switch → Landorus-T U-turn → cycle", "Entry hazards + pivoting = chip damage constant", "Losing momentum : être forcé de switch défensivement sans frapper"]
  },
  {
    name: "Win Condition", nameFr: "Condition de Victoire", category: "Mécanique de Combat",
    description: "Le plan pour gagner. Quel Pokémon va sweep une fois les obstacles retirés ? C'est ta win con.",
    competitiveImpact: "Chaque équipe doit avoir une win condition claire. Affaiblir les checks de ton sweeper principal → setup → sweep. Le mid-game est consacré à créer les conditions pour ta win con.",
    examples: ["Affaiblir Toxapex et Corviknight pour que Garchomp SD puisse sweep", "Poser Toxic Spikes pour que le stall adverse s'effondre", "En Doubles : éliminer l'Intimidate adverse pour que ton attaquant physique domine"]
  },

  // Doubles-specific
  {
    name: "Protect in Doubles", nameFr: "Abri en Doubles", category: "Doubles/VGC",
    description: "En Doubles, Protect est sur quasi TOUS les Pokémon. Il permet de scout, stall, et protéger un allié.",
    competitiveImpact: "Protect est le move le plus important en VGC. Sans Protect, tu te fais focus et KO en 1 tour. Il permet aussi de gagner un tour pour les effets (météo, Tailwind, Trick Room).",
    examples: ["Protect + partenaire KO la menace = tu survis et gagnes en numérique", "Protect pour stall Trick Room (5 tours)", "Fake Out + Protect le partenaire = setup gratuit"]
  },
  {
    name: "Spread Moves", nameFr: "Attaques de Zone", category: "Doubles/VGC",
    description: "En Doubles, certaines attaques touchent les 2 adversaires (Earthquake, Heat Wave, Rock Slide) mais font 75% de dégâts.",
    competitiveImpact: "Les spread moves sont hyper efficaces en Doubles car tu touches 2 cibles. Earthquake est dangereux car il touche aussi ton allié (sauf Lévitation/Vol). Rock Slide + Serene Grace = 60% flinch.",
    examples: ["Earthquake touche les 2 adversaires + ton partenaire (attention!)", "Heat Wave = attaque spread spéciale premium", "Protect ton partenaire pendant que tu Earthquake"]
  },
  {
    name: "Speed Control", nameFr: "Contrôle de Vitesse", category: "Doubles/VGC",
    description: "En Doubles, la vitesse relative est encore plus importante. Tailwind, Trick Room, Icy Wind, Electroweb sont cruciaux.",
    competitiveImpact: "Le joueur qui contrôle la vitesse contrôle le match. Tailwind (+100% Vitesse 4 tours) ou Trick Room (inverse, 5 tours) définissent qui frappe en premier. Les meilleurs VGC teams ont toujours un plan de speed control.",
    examples: ["Tailwind Tornadus → tout ton équipe outspeed", "Trick Room Dusclops → tes tanks lents frappent en premier", "Icy Wind baisse la Vitesse des 2 adversaires = speed control immédiat"]
  },
  {
    name: "Redirection", nameFr: "Redirection", category: "Doubles/VGC",
    description: "Follow Me / Rage Powder forcent l'adversaire à attaquer le redirigeur au lieu de son partenaire.",
    competitiveImpact: "La redirection protège un sweeper fragile pendant le setup. Amoonguss (Rage Powder + Regenerator) est le roi de la redirection en VGC.",
    examples: ["Amoonguss Rage Powder + partenaire Dragon Dance = setup gratuit", "Follow Me Togekiss protège ton Coalossal", "Lightning Rod redirige les attaques Électrik"]
  },
];

export interface SpeedControlMethod {
  name: string;
  nameFr: string;
  effect: string;
  duration: string;
  format: string;
  keyUsers: string[];
}

export const SPEED_CONTROL_METHODS: SpeedControlMethod[] = [
  { name: "Choice Scarf", nameFr: "Écharpe Choix", effect: "+50% Vitesse, bloqué sur une attaque", duration: "Permanent (tant que tenu)", format: "Singles + Doubles", keyUsers: ["Garchomp", "Landorus-T", "Iron Bundle"] },
  { name: "Tailwind", nameFr: "Vent Arrière", effect: "+100% Vitesse de toute l'équipe", duration: "4 tours", format: "Surtout Doubles/VGC", keyUsers: ["Tornadus", "Whimsicott", "Talonflame"] },
  { name: "Trick Room", nameFr: "Distorsion", effect: "Inverse l'ordre de vitesse (les lents vont en premier)", duration: "5 tours", format: "Doubles surtout, Singles aussi", keyUsers: ["Dusclops", "Hatterene", "Porygon2", "Cresselia"] },
  { name: "Thunder Wave", nameFr: "Cage Éclair", effect: "-50% Vitesse cible + 25% chance skip tour", duration: "Permanent", format: "Singles surtout", keyUsers: ["Thundurus", "Klefki", "Grimmsnarl"] },
  { name: "Icy Wind", nameFr: "Vent Glacé", effect: "-1 Vitesse aux 2 adversaires", duration: "Permanent (stat drop)", format: "Doubles/VGC", keyUsers: ["Suicune", "Cresselia", "Pelipper"] },
  { name: "Electroweb", nameFr: "Toile Électrik", effect: "-1 Vitesse aux 2 adversaires", duration: "Permanent (stat drop)", format: "Doubles/VGC", keyUsers: ["Regieleki", "Araquanid"] },
  { name: "Dragon Dance", nameFr: "Danse Draco", effect: "+1 Attaque +1 Vitesse", duration: "Permanent (boost)", format: "Singles + Doubles", keyUsers: ["Dragonite", "Salamence", "Gyarados", "Baxcalibur"] },
  { name: "Quiver Dance", nameFr: "Papillodanse", effect: "+1 Atq.Spé +1 Déf.Spé +1 Vitesse", duration: "Permanent (boost)", format: "Singles surtout", keyUsers: ["Volcarona", "Ribombee", "Lilligant-Hisui"] },
  { name: "Sticky Web", nameFr: "Toile Gluante", effect: "-1 Vitesse aux adversaires qui entrent", duration: "Toute la partie (hazard)", format: "Singles surtout", keyUsers: ["Ribombee (lead)", "Araquanid", "Shuckle"] },
  { name: "Unburden", nameFr: "Délestage", effect: "Double la Vitesse quand l'objet est consommé", duration: "Permanent", format: "Singles + Doubles", keyUsers: ["Hawlucha", "Slurpuff", "Sceptile"] },
];
