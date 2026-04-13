import { useState, useCallback, useMemo } from 'react'

// ============ QUIZ DATA ============

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
}

const TYPE_MATCHUP_QUESTIONS: QuizQuestion[] = [
  { question: "Quel type est super efficace contre Dragon ?", options: ["Dragon", "Normal", "Fire", "Rock"], correct: 0, explanation: "Dragon est super efficace contre Dragon ! C'est aussi pourquoi les types Fairy sont si importants — ils sont immunisés au Dragon.", category: "Types" },
  { question: "Quel type est immunisé aux attaques Electric ?", options: ["Rock", "Grass", "Ground", "Steel"], correct: 2, explanation: "Ground est immunisé à Electric. C'est pourquoi un Ground-type est presque obligatoire dans chaque équipe.", category: "Types" },
  { question: "Fairy est super efficace contre quels types ?", options: ["Dragon, Dark, Fighting", "Dragon, Ghost, Dark", "Fighting, Poison, Dark", "Dragon, Steel, Dark"], correct: 0, explanation: "Fairy bat Dragon, Dark et Fighting. C'est le type le plus fort offensivement et défensivement depuis Gen 6.", category: "Types" },
  { question: "Quel type résiste au combo STAB Fire + Grass ?", options: ["Water", "Dragon", "Fire", "Steel"], correct: 1, explanation: "Dragon résiste à la fois Fire et Grass. C'est une des raisons pour lesquelles les Dragons sont si bons défensivement.", category: "Types" },
  { question: "Combien de types sont super efficaces contre Steel ?", options: ["2", "3", "4", "1"], correct: 1, explanation: "3 types battent Steel : Fire, Fighting et Ground. Malgré cela, Steel reste le meilleur type défensif avec 10 résistances + 1 immunité.", category: "Types" },
  { question: "Quel type est immunisé aux attaques Normal ET Fighting ?", options: ["Steel", "Rock", "Ghost", "Dark"], correct: 2, explanation: "Ghost est immunisé à Normal et Fighting. C'est une double immunité très puissante — les Ghosts sont excellents en compétitif.", category: "Types" },
  { question: "Un Pokémon Water/Ground est faible à quel type ?", options: ["Electric (x4)", "Grass (x4)", "Ice (x2)", "Rock (x2)"], correct: 1, explanation: "Water/Ground a UNE SEULE faiblesse : Grass x4. C'est un des meilleurs typages défensifs du jeu (Swampert, Gastrodon).", category: "Types" },
  { question: "Quel type n'a AUCUNE résistance ni immunité ?", options: ["Normal", "Ice", "Bug", "Poison"], correct: 0, explanation: "Normal n'a aucune résistance et une seule immunité (Ghost). Offensivement il est aussi neutre. C'est le type le plus 'vanille'.", category: "Types" },
  { question: "Poison est super efficace contre quels types ?", options: ["Grass et Bug", "Grass et Fairy", "Fairy et Psychic", "Bug et Fairy"], correct: 1, explanation: "Poison bat Grass et Fairy. Depuis Gen 6, Poison est devenu très utile grâce à la domination de Fairy.", category: "Types" },
  { question: "Stealth Rock inflige combien de dégâts à un Pokémon 4x faible Rock ?", options: ["25%", "50%", "12.5%", "6.25%"], correct: 1, explanation: "50% ! C'est pourquoi Volcarona (Bug/Fire, 4x Rock) DOIT porter Heavy-Duty Boots. Sans ça, il perd la moitié de ses PV en entrant.", category: "Types" },
  { question: "Un Fire/Flying type comme Charizard est faible à combien de types différents ?", options: ["3", "4", "5", "6"], correct: 2, explanation: "Fire/Flying est faible à Water, Electric, Rock x2 (faiblesse double!) et Ice. C'est un tapage défensif très faible. Rock x4 en particulier.", category: "Types" },
  { question: "Quel dual-type résiste à 11 types ?", options: ["Steel/Flying", "Steel/Water", "Steel/Fairy", "Ghost/Steel"], correct: 0, explanation: "Steel/Flying résiste à Normal, Flying, Rock, Bug, Steel, Grass, Psychic, Dragon et Fairy. Une résistance phénoménale !  Corviknight en est l'exemple classique.", category: "Types" },
  { question: "Un Pokémon Ice/Rock a combien de faiblesses au total ?", options: ["3", "5", "6", "4"], correct: 1, explanation: "Ice/Rock est faible à Fire, Water, Grass, Fighting x2 et Steel. Soit 5 types différents, dont 1 x2. C'est un terrible tapage défensif.", category: "Types" },
  { question: "Ground est immunisé à quel type ?", options: ["Electric", "Poison", "Rock", "Water"], correct: 0, explanation: "Ground est immunisé à Electric. C'est fondamental — les Ground-types sont les checks naturels des attaquants électriques.", category: "Types" },
  { question: "Water/Fairy type est faible à quel type rare ?", options: ["Electric", "Grass", "Poison", "Dark"], correct: 1, explanation: "Water/Fairy a Grass en faiblesse x2. C'est une faiblesse importante pour Azumarill et Primarina (ex: Rillaboom est un counter).", category: "Types" },
];

const ITEM_QUESTIONS: QuizQuestion[] = [
  { question: "Quel est l'inconvénient des Choice items (Band/Specs/Scarf) ?", options: ["Perte de PV chaque tour", "Bloqué sur une seule attaque", "Ne peut pas switch", "Perd l'objet après un coup"], correct: 1, explanation: "Tu es bloqué sur la première attaque choisie jusqu'au switch. Le mind game : prédire quelle attaque l'adversaire va lock.", category: "Objets" },
  { question: "Life Orb donne combien de boost de dégâts ?", options: ["+50%", "+30%", "+20%", "+10%"], correct: 1, explanation: "+30% de dégâts mais -10% PV à chaque attaque. Le compromis parfait entre puissance et flexibilité.", category: "Objets" },
  { question: "Quel objet annule les dégâts des entry hazards ?", options: ["Leftovers", "Focus Sash", "Heavy-Duty Boots", "Air Balloon"], correct: 2, explanation: "Heavy-Duty Boots ignore Stealth Rock, Spikes et Toxic Spikes. Indispensable pour les Pokémon faibles à Rock.", category: "Objets" },
  { question: "Eviolite booste quelles stats et pour quels Pokémon ?", options: ["Atq + Vitesse, tous", "Déf + Déf.Spé (+50%), non fully evolved", "Toutes stats, NFE", "Déf + Déf.Spé (+50%), tous"], correct: 1, explanation: "+50% Défense et Déf.Spé, mais SEULEMENT pour les Pokémon pas encore complètement évolués. Chansey + Eviolite > Blissey.", category: "Objets" },
  { question: "Quel combo objet + talent donne +30% dégâts SANS recul ?", options: ["Choice Band + Huge Power", "Life Orb + Magic Guard", "Assault Vest + Guts", "Life Orb + Sheer Force"], correct: 1, explanation: "Life Orb + Magic Guard = +30% dégâts sans le recul de 10%. Aussi valable avec Sheer Force (sur les moves avec effets secondaires).", category: "Objets" },
  { question: "Weakness Policy s'active quand ?", options: ["Quand tu subis un coup critique", "Quand tu tombes sous 50% PV", "Quand tu subis une attaque super efficace", "Quand tu changes de type"], correct: 2, explanation: "+2 Attaque et +2 Atq.Spé après une attaque super efficace. Souvent combiné avec un Pokémon bulk qui peut survivre le SE.", category: "Objets" },
  { question: "Focus Sash permet de survivre à quoi ?", options: ["Toute attaque pendant 3 tours", "Un OHKO quand les PV sont pleins", "Deux coups consécutifs", "Les attaques critiques"], correct: 1, explanation: "Survit à n'importe quel OHKO avec 1 PV restant, une seule fois, et seulement à PV pleins. C'est pourquoi les hazards la cassent.", category: "Objets" },
  { question: "Leftovers récupère combien de PV par tour ?", options: ["12.5%", "6.25%", "10%", "3.125%"], correct: 1, explanation: "6.25% par tour. Ça paraît peu mais sur 10 tours c'est 62.5% récupérés. L'objet par défaut des tanks et walls.", category: "Objets" },
  { question: "Assault Vest booste quelles stats ?", options: ["Atq + Déf", "Déf.Spé (+40%)", "Vitesse + Déf", "Atq.Spé + Déf.Spé"], correct: 1, explanation: "+40% Déf.Spé mais interdiction d'utiliser les moves de statut. Parfait pour les walls spéciaux qui veulent counter les attaquants spéciaux.", category: "Objets" },
  { question: "Lum Berry est utilisé pour quoi ?", options: ["Boost l'Atq une fois", "Soigner un statut en début de combat", "Boost la résistance au Dark", "Augmenter la puissance de STAB"], correct: 1, explanation: "Lum Berry soigne tout statut (brûlure, paralysie, etc.) une fois. Utile contre les spammeurs de status comme Toxapex.", category: "Objets" },
  { question: "Air Balloon ne s'active que si ?", options: ["Le Pokémon est Ground-type", "Le Pokémon est au sol", "Le Pokémon utilise Tailwind", "C'est immédiat à l'entrée"], correct: 1, explanation: "Air Balloon immunise au Ground-type tant qu'il est actif. Elle se brise quand tu es touché. Donc un Heatran avec Air Balloon n'a pas peur du Ground.", category: "Objets" },
];

const ABILITY_QUESTIONS: QuizQuestion[] = [
  { question: "Que fait le talent Intimidate à l'entrée en jeu ?", options: ["Boost sa propre Attaque", "Baisse l'Attaque adverse de 1 cran", "Baisse la Vitesse adverse", "Force l'adversaire à switch"], correct: 1, explanation: "Intimidate baisse l'Attaque de tous les adversaires d'un cran à l'entrée. En Doubles/VGC, c'est encore plus fort car ça affecte les deux adversaires.", category: "Talents" },
  { question: "Regenerator récupère combien de PV au switch ?", options: ["25%", "50%", "33%", "16%"], correct: 2, explanation: "33% des PV max en switchant. Le talent le plus impactant du compétitif moderne. Slowbro, Toxapex, Tornadus-T en sont les stars.", category: "Talents" },
  { question: "Prankster donne +1 priorité à quels moves ?", options: ["Tous les moves", "Les moves physiques", "Les moves de statut", "Les moves spéciaux"], correct: 2, explanation: "Moves de statut uniquement. Thunder Wave, Taunt, Will-O-Wisp en priorité. MAIS immunité des types Dark depuis Gen 7.", category: "Talents" },
  { question: "Quel talent double l'Attaque du Pokémon ?", options: ["Huge Power / Pure Power", "Guts", "Technician", "Speed Boost"], correct: 0, explanation: "Huge Power et Pure Power doublent l'Attaque. C'est ce qui rend Azumarill et Medicham compétitifs malgré des stats d'Attaque moyennes.", category: "Talents" },
  { question: "Magic Guard protège contre quoi ?", options: ["Les attaques critiques", "Tous les dégâts indirects", "Les changements de stats", "Les conditions de statut"], correct: 1, explanation: "Pas de dégâts de météo, poison, brûlure, hazards, Life Orb, Leech Seed... Le combo Magic Guard + Life Orb est légendaire.", category: "Talents" },
  { question: "Drizzle fait quoi à l'entrée ?", options: ["Baisse la Vitesse adverse", "Invoque la pluie", "Invoque le soleil", "Pose Stealth Rock"], correct: 1, explanation: "Drizzle invoque la pluie automatiquement. Active Swift Swim, booste Water x1.5, affaiblit Fire x0.5. Pelipper est le setter #1.", category: "Talents" },
  { question: "Quel talent ignore les changements de stats de l'adversaire ?", options: ["Unaware", "Magic Guard", "Intimidate", "Clear Body"], correct: 0, explanation: "Unaware ignore les boosts offensifs et défensifs adverses. C'est le counter parfait aux setup sweepers. Clefable, Dondozo, Quagsire.", category: "Talents" },
  { question: "Guts s'active comment ?", options: ["En encaissant un coup critique", "Quand le Pokémon a un statut (brûlure, poison...)", "À chaque tour automatiquement", "Quand les PV sont sous 33%"], correct: 1, explanation: "+50% Attaque quand statué. La brûlure ne réduit plus l'Attaque avec Guts. Flame Orb + Guts = +50% Atq garanti tour 1.", category: "Talents" },
  { question: "Speed Boost fait quoi en compétitif ?", options: ["Double la Vitesse du Pokémon", "+1 Vitesse chaque tour", "Garantit l'avantage Priorité", "Booste uniquement en météo"], correct: 1, explanation: "+1 Vitesse chaque tour. Blaziken avec Speed Boost peut sweeper entire teams. Nerfé en Doubles car Protect stall la boost.", category: "Talents" },
  { question: "Protean/Adaptability booste quoi ?", options: ["Les défenses", "Les attaques physiques", "La puissance STAB (+20%)", "Toutes les stats également"], correct: 2, explanation: "Protean change le type du Pokémon en matching celui du move utilisé, activant STAB. Greninja Protean abuse ça pour avoir STAB sur tous ses moves.", category: "Talents" },
];


const STRATEGY_QUESTIONS: QuizQuestion[] = [
  { question: "Quelle est la différence entre un 'check' et un 'counter' ?", options: ["Aucune différence", "Check = fiable, Counter = situationnel", "Check = situationnel, Counter = fiable", "Check = offensif, Counter = défensif"], correct: 2, explanation: "Un counter bat la menace de manière fiable à chaque fois. Un check peut la menacer mais pas toujours (dépend du move, du set...).", category: "Stratégie" },
  { question: "Que signifie 'momentum' en compétitif ?", options: ["La vitesse d'un Pokémon", "L'avantage positionnel — contrôler l'échange", "Le nombre de KO", "Le nombre de boosts"], correct: 1, explanation: "Le momentum c'est le contrôle du rythme. Le joueur avec le momentum force l'adversaire à réagir. VoltTurn est la stratégie de momentum par excellence.", category: "Stratégie" },
  { question: "En teambuilding, le 'FWG core' fait référence à quoi ?", options: ["Fire/Water/Grass", "Fighting/Water/Ground", "Flying/Water/Ghost", "Fire/Wind/Ground"], correct: 0, explanation: "Fire/Water/Grass — la trinité défensive. Chaque type résiste aux faiblesses des deux autres. Un classique depuis Gen 1.", category: "Stratégie" },
  { question: "Pourquoi Stealth Rock est-il le hazard le plus important ?", options: ["Il fait le plus de dégâts", "Les dégâts varient selon la faiblesse Rock", "Il empoisonne", "Il baisse la Vitesse"], correct: 1, explanation: "SR inflige 6.25% à 50% selon la faiblesse/résistance Rock. Beaucoup de menaces (Volcarona, Charizard, Dragonite) sont faibles Rock.", category: "Stratégie" },
  { question: "Qu'est-ce qu'un 'wallbreaker' ?", options: ["Un Pokémon très rapide", "Un Pokémon ultra puissant qui détruit les walls", "Un Pokémon qui pose des hazards", "Un Pokémon qui utilise Taunt"], correct: 1, explanation: "Un wallbreaker est si puissant qu'il 2HKO même les walls les plus résistants. Souvent Choice Band/Specs. Ils ouvrent la voie au sweeper.", category: "Stratégie" },
  { question: "Trick Room inverse l'ordre de vitesse pendant combien de tours ?", options: ["3 tours", "5 tours", "8 tours", "Permanent"], correct: 1, explanation: "5 tours (incluant le tour d'activation). Pendant ces tours, le Pokémon le plus LENT agit en premier. Fondamental en VGC.", category: "Stratégie" },
  { question: "Pourquoi les types Dark sont-ils si valorisés en compétitif ?", options: ["Ils ont les meilleures stats", "Immunité Ghost + immunité Prankster", "Ils résistent à tous les types", "Ils sont les plus rapides"], correct: 1, explanation: "Immunité Ghost (utile contre Shadow Ball, Astral Barrage) + immunité Prankster (les moves de statut prioritaires ne marchent pas). Double protection.", category: "Stratégie" },
  { question: "Que fait Knock Off en plus des dégâts ?", options: ["Empoisonne la cible", "Retire l'objet de la cible", "Baisse la Défense de la cible", "Endort la cible"], correct: 1, explanation: "Retire l'objet adverse + 97.5 puissance (au lieu de 65) si l'adversaire tient un objet. Un des moves les plus influents du jeu.", category: "Stratégie" },
  { question: "Quand un Pokémon 'set up', que fait-il ?", options: ["Il pose des hazards", "Il utilise un move de boost (Swords Dance, etc.)", "Il switch", "Il utilise Protect"], correct: 1, explanation: "Setup = utiliser un move de boost comme Swords Dance (+2 Atq), Dragon Dance (+1 Atq/Vit), Calm Mind (+1 Atq.Spé/Déf.Spé) avant de sweeper.", category: "Stratégie" },
  { question: "En Doubles/VGC, Protect est fondamental parce que...", options: ["Il bloque les hazards", "Il permet de scout, protéger le partenaire, et gagner un tour", "Il booste les stats", "Il soigne le Pokémon"], correct: 1, explanation: "Protect en Doubles : scout les moves adverses, protège pendant que le partenaire élimine la menace, stall la météo/Tailwind/TR. 80%+ des sets VGC ont Protect.", category: "Stratégie" },
  { question: "Quel est le rôle d'un 'hazard setter' ?", options: ["Attaquer rapidement", "Poser Stealth Rock/Spikes au début du combat", "Mur défensif", "Contrôler la météo"], correct: 1, explanation: "Hazard setter pose les hazards (Stealth Rock, Spikes) au début pour affaiblir les Pokémon adverses à l'entrée. Fondamental pour créer les conditions de win.", category: "Stratégie" },
  { question: "Comment calculer si une attaque 2HKO un adversaire ?", options: ["Dégâts > 50% PV", "Dégâts > 40% PV", "Dégâts > 25% PV", "C'est impossible sans tools"], correct: 0, explanation: "Si une attaque inflige > 50% des PV max, c'est guaranteed 2HKO (2 coups pour KO). Important pour les damage calcs en VGC.", category: "Stratégie" },
  { question: "Quel est le 'win condition' le plus courant en format Stall ?", options: ["Sweeper rapide", "Whirlwind/Roar cycler les boosts", "Poison + Toxic Spikes", "Offensive hyperaggressive"], correct: 1, explanation: "Les stall teams utilisent Whirlwind/Roar pour forcer les switchs, annulant les boosts setup. Aussi Toxic damage accumule graduellement.", category: "Stratégie" },
  { question: "Pourquoi VoltTurn est-il dominant ?", options: ["Les types Electric et Bug sont OP", "Permet de switch sans coûter un tour (Volt Switch, U-turn)", "Double la Vitesse", "Crée l'immunité aux hazards"], correct: 1, explanation: "Volt Switch et U-turn permettent de switcher ET d'attaquer dans le même tour. Le momentum absolu — tu restes actif.", category: "Stratégie" },
  { question: "Qu'est-ce qu'une 'Pivot' en compétitif ?", options: ["Une Pokémon qui peut boost les stats", "Un move qui permet de switch en gardant le momentum (U-turn, Volt Switch)", "Une équipe défensive", "Une stratégie de sweep"], correct: 1, explanation: "Un pivot c'est un move (comme U-turn) qui te permet d'attaquer ET de switcher sans gaspiller un tour. Fondamental pour le momentum.", category: "Stratégie" },
  { question: "Pourquoi certains Pokémon utilisent Trick Room en Setup ?", options: ["Pour booster les stats", "Parce qu'ils sont trop lents et veulent reverser la Vitesse", "Pour bloquer les moves de statut", "Pour annuler les weaknesses"], correct: 1, explanation: "Trick Room boost les Pokémon LENTS. Si tu es plus lent que l'adversaire en TR, tu agis d'abord. Fréquent en VGC avec les sweepers lents.", category: "Stratégie" },
];

const DOUBLES_QUESTIONS: QuizQuestion[] = [
  { question: "En Doubles, un spread move perd combien de puissance ?", options: ["50%", "25%", "33%", "Il garde 100%"], correct: 1, explanation: "Un spread move (touchant les 2 adversaires) perd 25% de sa puissance en Doubles (garde 75%). Earthquake, Heat Wave, Dazzling Gleam...", category: "Doubles" },
  { question: "Que fait Fake Out en compétitif ?", options: ["Double les dégâts", "Flinch garanti, priorité +3, Tour 1 uniquement", "Endort la cible", "OHKO garanti"], correct: 1, explanation: "Fake Out = flinch garanti, +3 priorité, mais uniquement au premier tour d'entrée. Permet de neutraliser un adversaire pendant que le partenaire agit.", category: "Doubles" },
  { question: "Follow Me/Rage Powder fait quoi ?", options: ["Force les attaques adverses sur l'utilisateur", "Double la Vitesse du partenaire", "Protège toute l'équipe", "Empoisonne les adversaires"], correct: 0, explanation: "Redirige toutes les attaques single-target adverses vers l'utilisateur. Protège le partenaire qui peut setup ou attaquer librement. Amoonguss est le roi.", category: "Doubles" },
  { question: "Tailwind dure combien de tours ?", options: ["3 tours", "4 tours", "5 tours", "8 tours"], correct: 1, explanation: "4 tours (incluant le tour d'activation). Double la Vitesse de toute l'équipe. C'est la méthode de speed control la plus fiable en VGC.", category: "Doubles" },
  { question: "Pourquoi Incineroar est-il le Pokémon le plus utilisé de l'histoire du VGC ?", options: ["Ses stats sont les meilleures", "Intimidate + Fake Out + pivot moves + bulk", "Son type Fire/Dark est unique", "Il a le meilleur move de setup"], correct: 1, explanation: "Intimidate à l'entrée + Fake Out Tour 1 + U-turn pour pivoter + bonne bulk. Il fait tout ce qu'un support VGC doit faire.", category: "Doubles" },
];

const SITUATIONS_QUESTIONS: QuizQuestion[] = [
  { question: "L'adversaire a un Volcarona à +1. Tu as Toxapex et Tyranitar en back. Qui envoies-tu ?", options: ["Toxapex (Water/Poison)", "Tyranitar (Rock/Dark)", "C'est un 50/50", "Ça ne change rien"], correct: 1, explanation: "Tyranitar ! Rock-type STAB counter Volcarona (Bug/Fire, 4x faible Rock). Toxapex ne peut pas le 2HKO. C'est crucial en VGC.", category: "Situations" },
  { question: "Ton adversaire lead avec Whimsicott en VGC. Quel est le meilleur play Tour 1 ?", options: ["Setup avec Dragon Dance", "Attaquer de suite", "Switch vers un Ground-type", "Poser une priorité"], correct: 2, explanation: "Whimsicott fast Taunt/Tailwind lead. Switch immédiat vers Ground pour bloquer Taunt et contrer avec STAB. Landorus-T est le counter parfait.", category: "Situations" },
  { question: "Tu as 1 Pokémon à 10% PV, il a Stealth Rock en jeu. Tu switchs sur quoi ?", options: ["N'importe quoi", "Un Pokémon avec Heavy-Duty Boots", "Un Pokémon résistant à Rock", "Toujours le même Pokémon"], correct: 1, explanation: "Heavy-Duty Boots annule la moitié des dégâts de Stealth Rock. Crucial quand tu vas switcher un faible Pokémon. Sans ça, il prend 50% ou 25% dégâts.", category: "Situations" },
  { question: "Tu es lead avec Choice Band Garchomp vs Incineroar. Quoi faire ?", options: ["Earthquake immédiatement", "Switch au Setup sweeper", "Earthquake puis switch au prochain tour", "Attendre le switch adverse"], correct: 0, explanation: "EQ OHKO l'Incineroar (250 Atq/Garchomp vs 95 Déf/Incineroar). C'est un free kill. Lock pas grave car tu as momentum.", category: "Situations" },
  { question: "L'adversaire a Calm Mind Clefable. Tu as Specs Dark Pulse user. Y aller ou switch ?", options: ["Y aller (neutral hit)", "Switch absolument", "Protect et stall", "Utiliser un move de statut"], correct: 1, explanation: "Clefable en Calm Mind se renforce à +1 Atq.Spé/Déf.Spé. Ton Dark Pulse fait dégâts mais elle survit et devient plus forte. Switch vers un Ground-type ou stealth rock poser.", category: "Situations" },
  { question: "Matchup: Ton Water/Ground vs leur Electric/Flying. Qui gagne ?", options: ["Toi (Water/Ground)", "L'adversaire (Electric/Flying)", "C'est neutre", "Dépend des moves"], correct: 0, explanation: "Water/Ground résiste à Electric x2 et vole Ground-type (l'immunity Electric!). L'Electric/Flying ne peut PAS utiliser Ground attack. STAB Water beat Flying x2.", category: "Situations" },
  { question: "Tu mènes 5-6 en équipe mais ton dernier Pokémon est faible. Stratégie ?", options: ["Attaquer agressif", "Stall avec Protect/Recover", "Switch rapidement", "Utiliser tous les items en priorité"], correct: 1, explanation: "5-6 avantage c'est énorme. Stall et utilise Recover/Protect pour gagner du temps. Force l'adversaire à dépenser des items/ressources. C'est du gestion de momentum.", category: "Situations" },
  { question: "L'ennemi 'scoute' ton Pokémon avec Fake Out VGC. C'est quel rôle adversaire ?", options: ["Attaquant pur", "Support Fake Out user (souvent Incineroar)", "Sweeper rapide", "Defensive wall"], correct: 1, explanation: "Fake Out = Pokémon support VGC. Il va Fake Out, puis Taunt/Intimidate/pivot. Attends-toi à Incineroar ou Hitmontop. Plan tes switches.", category: "Situations" },
  { question: "Hazards posés (SR + Spikes 2x). Tu domines le tempo. Finish ou switch safe ?", options: ["Attaquer continuellement", "Switch ET stall pour force des entries = plus de dégâts", "Ignorer les hazards", "Poser plus d'hazards"], correct: 1, explanation: "Avec momentum, forcer des switches accumule hazard dégâts. Chaque entry = 6.25-25% dégâts. Switch safe, force switches adverses, accumule chip jusqu'au OHKO.", category: "Situations" },
  { question: "Ennemi triple threat: Volcarona lead, Garchomp mid, Urshifu back. Tu lead Landorus-T. Play?", options: ["EQ le Volcarona", "Switch à Rotom-W", "Use Stealth Rock immédiatement", "Bulk up et setup"], correct: 2, explanation: "Lead Landorus-T = hazard setter classique. Stealth Rock TOUR 1. Cela weakens Volcarona de 50% (x4 Rock), hurt Urshifu. Momentum de hazard > direct attack.", category: "Situations" },
  { question: "VGC: Partner KO'd Tour 3. Tu as 2 Pokémon, ennemi aussi. Qui gagne ?", options: ["Toi (avantage numérique invisible)", "L'ennemi", "C'est 50/50", "Dépend de la vitesse"], correct: 0, explanation: "Actuellement c'est 2v2 mais en Doubles tu joues 2 Pokémon à la fois. Après un KO l'ennemi aussi perd 1. C'est toujours pairs. L'avantage vient de momentum/items/boosts.", category: "Situations" },
  { question: "Tu as +2 Swords Dance Dragonite, ennemi a Clefable. Attaquer ou switch ?", options: ["Dragon Dance (switch out)", "Earthquake (si Ground-type)", "Outrage direct (risqué)", "Switch pour setup plus"], correct: 2, explanation: "Swords Dance Dragonite à +2 Atq + STAB Outrage = insane dégâts. Clefable tank mais pas ce boost. Risk lock mais tu 2HKO. Agressif = right play ici.", category: "Situations" },
];

const CALCULS_QUESTIONS: QuizQuestion[] = [
  { question: "Une attaque fait 85% dégâts. Combien de tours pour OHKO l'adversaire ?", options: ["1 coup", "2 coups", "3 coups", "OHKO garanti"], correct: 1, explanation: "85% > 50% donc c'est 2HKO guaranteed. OHKO = 100%+ dégâts. 2HKO = 51-99%. 3HKO = 34-50%.", category: "Calculs" },
  { question: "Ton Pokémon a 300 PV, subit 72% dégâts. Il lui reste combien ?", options: ["86 PV", "84 PV", "78 PV", "96 PV"], correct: 1, explanation: "300 * (1 - 0.72) = 300 * 0.28 = 84 PV. Important: damage ranges sont 85-100% généralement, so 72% c'est bas roll.", category: "Calculs" },
  { question: "Stealth Rock vs 4x faible: 25% dégâts ou 50% ?", options: ["25% (standard)", "50% (x4)", "12.5% (x2)", "C'est variable"], correct: 1, explanation: "Stealth Rock = (150 * faiblesse/200). Pour 4x = 50%. Pour 2x = 25%. Pour neutre = 12.5%. Pour 0.5x = 6.25%.", category: "Calculs" },
  { question: "Ennemi a 200 PV. Attaque A fait 118 dégâts max, Attaque B 122. Quoi choisir ?", options: ["Attaque A (118)", "Attaque B (122)", "Pareils (tous les deux OHKO)", "Dépend du roll"], correct: 2, explanation: "200 PV / 150 = 0.75. 118 et 122 sont tous deux > 100 PV. Les deux 2HKO. Choix: puissance brute ou effet secondaire.", category: "Calculs" },
  { question: "Dégâts base: 90. Tu as +1 Atq, ennemi a -1 Déf. Multiplicateur total ?", options: ["1.5x (1.5 * 1.0)", "2.0x (1.5 * 1.5)", "2.25x (1.5 * 1.5)", "1.75x"], correct: 2, explanation: "+1 Atq = x1.5. -1 Déf = x1.5. Total = 1.5 * 1.5 = 2.25x les dégâts de base. Math critique en damage calc.", category: "Calculs" },
];


const ALL_QUESTIONS = [...TYPE_MATCHUP_QUESTIONS, ...ITEM_QUESTIONS, ...ABILITY_QUESTIONS, ...STRATEGY_QUESTIONS, ...DOUBLES_QUESTIONS, ...SITUATIONS_QUESTIONS, ...CALCULS_QUESTIONS];

const QUIZ_CATEGORIES = ["Tous", "Types", "Objets", "Talents", "Stratégie", "Doubles", "Situations", "Calculs"];

// ============ COMPONENT ============

export function QuizSection() {
  const [mode, setMode] = useState<'menu' | 'quiz' | 'results'>('menu');
  const [category, setCategory] = useState("Tous");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<{ question: string; correct: boolean; explanation: string }[]>([]);
  const [questionCount, setQuestionCount] = useState(10);

  const availableCount = useMemo(() => {
    if (category === "Tous") return ALL_QUESTIONS.length;
    return ALL_QUESTIONS.filter(q => q.category === category).length;
  }, [category]);

  const startQuiz = useCallback(() => {
    let pool = category === "Tous" ? [...ALL_QUESTIONS] : ALL_QUESTIONS.filter(q => q.category === category);
    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    // Also shuffle options for each question
    const shuffled = pool.slice(0, questionCount).map(q => {
      const indices = q.options.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return {
        ...q,
        options: indices.map(i => q.options[i]),
        correct: indices.indexOf(q.correct),
      };
    });
    setQuestions(shuffled);
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
    setAnswers([]);
    setMode('quiz');
  }, [category, questionCount]);

  const handleAnswer = useCallback((idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === questions[currentQ].correct;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, {
      question: questions[currentQ].question,
      correct: isCorrect,
      explanation: questions[currentQ].explanation,
    }]);
  }, [answered, questions, currentQ]);

  const nextQuestion = useCallback(() => {
    if (currentQ + 1 >= questions.length) {
      setMode('results');
    } else {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  }, [currentQ, questions.length]);

  const getScoreColor = (pct: number) => {
    if (pct >= 90) return 'text-yellow-400';
    if (pct >= 70) return 'text-green-400';
    if (pct >= 50) return 'text-blue-400';
    return 'text-red-400';
  };

  const getScoreMessage = (pct: number) => {
    if (pct >= 90) return "Incroyable ! Tu es prêt pour la Ladder !";
    if (pct >= 70) return "Solide ! Encore quelques révisions et tu maîtriseras tout.";
    if (pct >= 50) return "Pas mal ! Continue à explorer le guide pour progresser.";
    return "C'est un début ! Relis les sections du guide et réessaie.";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Quiz Compétitif</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
          Teste tes connaissances en stratégie Pokémon compétitive. Chaque question a une explication
          détaillée pour t'aider à apprendre. <strong className="text-zinc-200">{ALL_QUESTIONS.length} questions</strong> couvrant
          les types, objets, talents, stratégies, situations VGC, calculs et le format Doubles.
        </p>
      </div>

      {/* MENU */}
      {mode === 'menu' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-5">
            <h3 className="font-semibold text-zinc-200 text-lg">Configuration du Quiz</h3>

            {/* Category picker */}
            <div>
              <p className="text-xs text-zinc-500 uppercase mb-2">Catégorie</p>
              <div className="flex flex-wrap gap-2">
                {QUIZ_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 text-sm rounded font-medium transition-colors ${
                      category === cat ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-1">{availableCount} questions disponibles</p>
            </div>

            {/* Question count */}
            <div>
              <p className="text-xs text-zinc-500 uppercase mb-2">Nombre de questions</p>
              <div className="flex gap-2">
                {[5, 10, 15, 20].filter(n => n <= availableCount).map(n => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`px-3 py-1.5 text-sm rounded font-medium ${
                      questionCount === n ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                {availableCount > 0 && (
                  <button
                    onClick={() => setQuestionCount(availableCount)}
                    className={`px-3 py-1.5 text-sm rounded font-medium ${
                      questionCount === availableCount ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    Tout ({availableCount})
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Lancer le Quiz
            </button>
          </div>

          {/* Category previews */}
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { cat: "Types", count: TYPE_MATCHUP_QUESTIONS.length, desc: "Efficacités, immunités, typages défensifs", color: "text-green-400" },
              { cat: "Objets", count: ITEM_QUESTIONS.length, desc: "Choice items, Life Orb, Boots, combos", color: "text-blue-400" },
              { cat: "Talents", count: ABILITY_QUESTIONS.length, desc: "Intimidate, Regenerator, Magic Guard...", color: "text-yellow-400" },
              { cat: "Stratégie", count: STRATEGY_QUESTIONS.length, desc: "Hazards, momentum, teambuilding, roles", color: "text-red-400" },
              { cat: "Doubles", count: DOUBLES_QUESTIONS.length, desc: "VGC, spread moves, Fake Out, Tailwind", color: "text-purple-400" },
              { cat: "Situations", count: SITUATIONS_QUESTIONS.length, desc: "Matchups en jeu, décisions tactiques VGC", color: "text-cyan-400" },
              { cat: "Calculs", count: CALCULS_QUESTIONS.length, desc: "Damage calc, OHKO thresholds, maths", color: "text-orange-400" },
            ].map(c => (
              <div key={c.cat} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-semibold ${c.color}`}>{c.cat}</h4>
                  <span className="text-xs text-zinc-600">{c.count}Q</span>
                </div>
                <p className="text-xs text-zinc-500">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUIZ */}
      {mode === 'quiz' && questions.length > 0 && (
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-red-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentQ + (answered ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-zinc-500 shrink-0">
              {currentQ + 1}/{questions.length} · Score: {score}/{currentQ + (answered ? 1 : 0)}
            </span>
          </div>

          {/* Question card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">{questions[currentQ].category}</span>
              <span className="text-xs text-zinc-600">Question {currentQ + 1}</span>
            </div>

            <h3 className="text-lg font-semibold text-zinc-100 mb-5">{questions[currentQ].question}</h3>

            <div className="grid gap-3">
              {questions[currentQ].options.map((opt, i) => {
                let btnClass = "bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-200";
                if (answered) {
                  if (i === questions[currentQ].correct) {
                    btnClass = "bg-green-900/30 border border-green-600 text-green-300";
                  } else if (i === selected && i !== questions[currentQ].correct) {
                    btnClass = "bg-red-900/30 border border-red-600 text-red-300";
                  } else {
                    btnClass = "bg-zinc-800/50 border border-zinc-800 text-zinc-600";
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                    className={`w-full text-left p-4 rounded-lg transition-all text-sm font-medium ${btnClass} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span className="text-xs text-zinc-500 mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {answered && (
              <div className={`mt-5 p-4 rounded-lg border ${
                selected === questions[currentQ].correct
                  ? 'bg-green-900/10 border-green-800'
                  : 'bg-red-900/10 border-red-800'
              }`}>
                <p className={`text-sm font-semibold mb-1 ${
                  selected === questions[currentQ].correct ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selected === questions[currentQ].correct ? "Correct !" : "Incorrect"}
                </p>
                <p className="text-sm text-zinc-300">{questions[currentQ].explanation}</p>
              </div>
            )}

            {/* Next button */}
            {answered && (
              <button
                onClick={nextQuestion}
                className="mt-4 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                {currentQ + 1 >= questions.length ? "Voir les résultats" : "Question suivante"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {mode === 'results' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
            <p className="text-zinc-500 text-sm mb-2">Résultat</p>
            <p className={`text-6xl font-bold ${getScoreColor(score / questions.length * 100)}`}>
              {score}/{questions.length}
            </p>
            <p className="text-2xl text-zinc-400 mt-1">{Math.round(score / questions.length * 100)}%</p>
            <p className={`text-sm mt-3 ${getScoreColor(score / questions.length * 100)}`}>
              {getScoreMessage(score / questions.length * 100)}
            </p>
          </div>

          {/* Review */}
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-200">Récapitulatif</h3>
            {answers.map((a, i) => (
              <div key={i} className={`bg-zinc-900 border rounded-lg p-4 ${a.correct ? 'border-green-800/50' : 'border-red-800/50'}`}>
                <div className="flex items-start gap-2">
                  <span className={`text-sm mt-0.5 ${a.correct ? 'text-green-400' : 'text-red-400'}`}>
                    {a.correct ? '✓' : '✗'}
                  </span>
                  <div>
                    <p className="text-sm text-zinc-200 font-medium">{a.question}</p>
                    <p className="text-xs text-zinc-500 mt-1">{a.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => { setMode('menu'); }}
              className="flex-1 py-2.5 bg-zinc-800 text-zinc-300 font-medium rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Retour au menu
            </button>
            <button
              onClick={startQuiz}
              className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Rejouer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
