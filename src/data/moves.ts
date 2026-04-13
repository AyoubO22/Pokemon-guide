export interface MoveCategory {
  name: string;
  nameFr: string;
  description: string;
  moves: CompetitiveMove[];
}

export interface CompetitiveMove {
  name: string;
  nameFr: string;
  type: string;
  category: "Physical" | "Special" | "Status";
  power: number | null;
  accuracy: number | null;
  pp: number;
  effect: string;
  competitiveNotes: string;
}

export const MOVE_CATEGORIES: MoveCategory[] = [
  {
    name: "Entry Hazards", nameFr: "Pièges d'Entrée",
    description: "Les attaques qui posent des pièges sur le terrain adverse. Fondamentaux en compétitif car ils punissent chaque switch. Le contrôle des hazards (poser + retirer) est au cœur du metagame.",
    moves: [
      { name: "Stealth Rock", nameFr: "Piège de Roc", type: "Rock", category: "Status", power: null, accuracy: null, pp: 20, effect: "Inflige des dégâts selon la faiblesse au type Roche à chaque switch-in.", competitiveNotes: "LA move la plus importante du jeu compétitif. Un Charizard perd 50% PV juste en entrant. Change totalement la viabilité de certains Pokémon." },
      { name: "Spikes", nameFr: "Picots", type: "Bug", category: "Status", power: null, accuracy: null, pp: 20, effect: "1 couche = 12.5%, 2 = 16.7%, 3 = 25% aux Pokémon terrestres.", competitiveNotes: "Cumulable 3 fois. Ne touche pas les volants/Lévitation. Combiné avec SR, les switchs deviennent très coûteux." },
      { name: "Toxic Spikes", nameFr: "Pics Toxik", type: "Poison", category: "Status", power: null, accuracy: null, pp: 20, effect: "1 couche = poison, 2 couches = badly poisoned. Retiré si un Poison touche le sol.", competitiveNotes: "Excellent en stall. Les types Poison au sol les absorbent en entrant." },
      { name: "Sticky Web", nameFr: "Toile Gluante", type: "Bug", category: "Status", power: null, accuracy: null, pp: 20, effect: "-1 Vitesse à chaque Pokémon terrestre adverse qui entre.", competitiveNotes: "Speed control passif. Change l'ordre de jeu. Archétype Webs dédié." },
    ]
  },
  {
    name: "Hazard Removal", nameFr: "Retrait des Pièges",
    description: "Retirer les hazards adverses est aussi important que les poser.",
    moves: [
      { name: "Rapid Spin", nameFr: "Tour Rapide", type: "Normal", category: "Physical", power: 50, accuracy: 100, pp: 20, effect: "Retire tous les hazards de son côté + boost Vitesse de +1 (Gen 8+).", competitiveNotes: "Bloqué par les Spectres. Excadrill, Tentacruel sont de bons spinners." },
      { name: "Defog", nameFr: "Anti-Brume", type: "Flying", category: "Status", power: null, accuracy: null, pp: 15, effect: "Retire TOUS les hazards des deux côtés + baisse évasion adverse.", competitiveNotes: "Plus fiable que Rapid Spin car non bloqué par Ghost. Mais retire aussi VOS hazards." },
      { name: "Court Change", nameFr: "Change Éclair", type: "Normal", category: "Status", power: null, accuracy: 100, pp: 10, effect: "Échange les hazards entre les deux côtés.", competitiveNotes: "Niche mais dévastateur. Retourne les SR adverses contre eux." },
    ]
  },
  {
    name: "Priority Moves", nameFr: "Attaques Prioritaires",
    description: "Attaques qui frappent avant le tour normal. Essentielles pour le revenge killing et contre les setup sweepers.",
    moves: [
      { name: "Extreme Speed", nameFr: "Vitesse Extrême", type: "Normal", category: "Physical", power: 80, accuracy: 100, pp: 5, effect: "+2 priorité. Bat les autres priorités (+1).", competitiveNotes: "Le meilleur move prioritaire. Dragonite, Arceus, Lucario." },
      { name: "Bullet Punch", nameFr: "Poing Éclair", type: "Steel", category: "Physical", power: 40, accuracy: 100, pp: 30, effect: "+1 priorité. Type Acier = bon coverage.", competitiveNotes: "Signature de Scizor avec Technician (60 puissance effective)." },
      { name: "Mach Punch", nameFr: "Mach Punch", type: "Fighting", category: "Physical", power: 40, accuracy: 100, pp: 30, effect: "+1 priorité. Type Combat = bon coverage.", competitiveNotes: "Breloom avec Technician, Conkeldurr." },
      { name: "Aqua Jet", nameFr: "Aqua Jet", type: "Water", category: "Physical", power: 40, accuracy: 100, pp: 20, effect: "+1 priorité.", competitiveNotes: "Azumarill avec Huge Power en fait un nuke." },
      { name: "Ice Shard", nameFr: "Éclats Glace", type: "Ice", category: "Physical", power: 40, accuracy: 100, pp: 30, effect: "+1 priorité. Touche les Dragons/Sol/Vol.", competitiveNotes: "Mamoswine, Weavile. Finit les Dragons setup." },
      { name: "Shadow Sneak", nameFr: "Ombre Portée", type: "Ghost", category: "Physical", power: 40, accuracy: 100, pp: 30, effect: "+1 priorité. Type Spectre = coverage unique.", competitiveNotes: "Mimikyu, Aegislash." },
      { name: "Sucker Punch", nameFr: "Coup Bas", type: "Dark", category: "Physical", power: 70, accuracy: 100, pp: 5, effect: "+1 priorité mais échoue si l'adversaire utilise un move de statut.", competitiveNotes: "Le plus puissant des +1. Mind game contre les Status moves." },
      { name: "Fake Out", nameFr: "Bluff", type: "Normal", category: "Physical", power: 40, accuracy: 100, pp: 10, effect: "+3 priorité, fait tressaillir. Fonctionne uniquement au premier tour.", competitiveNotes: "Roi du VGC. Free flinch au Tour 1. Incineroar, Mienshao." },
    ]
  },
  {
    name: "Setup Moves", nameFr: "Moves de Setup",
    description: "Les moves qui boostent vos stats pour sweep. Le setup est le cœur de l'offense en compétitif.",
    moves: [
      { name: "Swords Dance", nameFr: "Danse-Lames", type: "Normal", category: "Status", power: null, accuracy: null, pp: 20, effect: "+2 Attaque.", competitiveNotes: "Le boost offensif physique standard. Un SD + bon coverage = sweep potentiel." },
      { name: "Nasty Plot", nameFr: "Machination", type: "Dark", category: "Status", power: null, accuracy: null, pp: 20, effect: "+2 Atq. Spé.", competitiveNotes: "Équivalent spécial de SD. Togekiss, Hydreigon." },
      { name: "Dragon Dance", nameFr: "Danse Draco", type: "Dragon", category: "Status", power: null, accuracy: null, pp: 20, effect: "+1 Attaque et +1 Vitesse.", competitiveNotes: "Le meilleur setup move. Puissance ET vitesse. Dragonite, Salamence, Gyarados." },
      { name: "Quiver Dance", nameFr: "Papillodanse", type: "Bug", category: "Status", power: null, accuracy: null, pp: 20, effect: "+1 Atq. Spé, +1 Déf. Spé, +1 Vitesse.", competitiveNotes: "Le meilleur setup spécial. Offense + défense. Volcarona est terrifiant avec ça." },
      { name: "Calm Mind", nameFr: "Plénitude", type: "Psychic", category: "Status", power: null, accuracy: null, pp: 20, effect: "+1 Atq. Spé et +1 Déf. Spé.", competitiveNotes: "Setup plus lent mais plus durable. Cresselia, Clefable." },
      { name: "Bulk Up", nameFr: "Gonflette", type: "Fighting", category: "Status", power: null, accuracy: null, pp: 20, effect: "+1 Attaque et +1 Défense.", competitiveNotes: "Équivalent physique de Calm Mind." },
      { name: "Shell Smash", nameFr: "Exuviation", type: "Normal", category: "Status", power: null, accuracy: null, pp: 15, effect: "+2 Atq, Atq.Spé, Vitesse. -1 Déf, Déf.Spé.", competitiveNotes: "Le setup le plus explosif. High risk/reward. Cloyster, Polteageist." },
      { name: "Belly Drum", nameFr: "Cognobidon", type: "Normal", category: "Status", power: null, accuracy: null, pp: 10, effect: "Sacrifie 50% PV pour +6 Attaque (max).", competitiveNotes: "Puissance max instantanée. Azumarill + Aqua Jet, Iron Hands." },
    ]
  },
  {
    name: "Pivoting Moves", nameFr: "Moves de Pivot",
    description: "Attaques qui permettent de switcher après avoir frappé. Le pivoting est une mécanique avancée cruciale.",
    moves: [
      { name: "U-turn", nameFr: "Demi-Tour", type: "Bug", category: "Physical", power: 70, accuracy: 100, pp: 20, effect: "Frappe puis switch. Maintient le momentum.", competitiveNotes: "Le pivot move le plus utilisé. Scizor, Landorus-T." },
      { name: "Volt Switch", nameFr: "Change Éclair", type: "Electric", category: "Special", power: 70, accuracy: 100, pp: 20, effect: "Même chose mais spécial et bloqué par Sol.", competitiveNotes: "Rotom-Wash, Tapu Koko. Attention aux Ground types." },
      { name: "Flip Turn", nameFr: "Revirement", type: "Water", category: "Physical", power: 60, accuracy: 100, pp: 20, effect: "Version Eau de U-turn.", competitiveNotes: "Barraskewda, Palafin." },
      { name: "Teleport", nameFr: "Téléport", type: "Psychic", category: "Status", power: null, accuracy: null, pp: 20, effect: "-6 priorité, switch. Le Pokémon entrant arrive sans prendre de dégâts.", competitiveNotes: "Le slow pivot parfait. Fait entrer un allié en sécurité. Clefable, Slowbro." },
    ]
  },
  {
    name: "Key Coverage Moves", nameFr: "Attaques de Couverture",
    description: "Les attaques offensives les plus importantes en compétitif. Elles complètent les STAB et touchent ce que les types principaux ne couvrent pas.",
    moves: [
      { name: "Knock Off", nameFr: "Sabotage", type: "Dark", category: "Physical", power: 65, accuracy: 100, pp: 20, effect: "Retire l'objet adverse. +50% dégâts si l'adversaire tient un objet (97.5 puissance effective).", competitiveNotes: "La meilleure utility move du jeu. Retirer un objet est dévastateur (pas de Leftovers recovery, pas d'Eviolite bulk). Quasi tous les Pokémon physiques la veulent." },
      { name: "Close Combat", nameFr: "Close Combat", type: "Fighting", category: "Physical", power: 120, accuracy: 100, pp: 5, effect: "-1 Déf, -1 Déf.Spé après utilisation.", competitiveNotes: "La meilleure attaque physique Combat. 120 puissance sans restriction (contrairement aux Choice). Le drawback est acceptable car tu veux KO, pas tanker." },
      { name: "Flamethrower", nameFr: "Lance-Flammes", type: "Fire", category: "Special", power: 90, accuracy: 100, pp: 15, effect: "10% chance de brûlure.", competitiveNotes: "Coverage Feu fiable. Touche les Acier et Plante qui wall beaucoup de types. Préféré à Fire Blast pour la fiabilité (100% vs 85%)." },
      { name: "Ice Beam", nameFr: "Laser Glace", type: "Ice", category: "Special", power: 90, accuracy: 100, pp: 10, effect: "10% chance de gel.", competitiveNotes: "Coverage Glace essentielle. Touche Dragon, Sol, Vol, Plante — les types les plus communs en OU. BoltBeam (Thunderbolt + Ice Beam) est le combo coverage classique." },
      { name: "Thunderbolt", nameFr: "Tonnerre", type: "Electric", category: "Special", power: 90, accuracy: 100, pp: 15, effect: "10% chance de paralysie.", competitiveNotes: "Coverage Électrik standard. Touche Eau et Vol. Combo BoltBeam avec Ice Beam pour une couverture quasi parfaite." },
      { name: "Earthquake", nameFr: "Séisme", type: "Ground", category: "Physical", power: 100, accuracy: 100, pp: 10, effect: "Touche tous les Pokémon adjacents en Doubles.", competitiveNotes: "La meilleure attaque physique non-restrictive. 100 puissance, 100 précision, aucun drawback. Sol est le meilleur type offensif. Attention en Doubles : touche aussi l'allié!" },
      { name: "Stone Edge", nameFr: "Lame de Roc", type: "Rock", category: "Physical", power: 100, accuracy: 80, pp: 5, effect: "Taux de critique élevé.", competitiveNotes: "Le EdgeQuake combo (Stone Edge + Earthquake) a une couverture quasi parfaite. Son problème : 80% précision = miss crucial. Rock Slide préféré en Doubles (spread + flinch)." },
    ]
  },
  {
    name: "Key Status Moves", nameFr: "Attaques de Statut Clés",
    description: "Les attaques de statut qui définissent le metagame compétitif. Elles ne font pas de dégâts mais changent le cours du match.",
    moves: [
      { name: "Toxic", nameFr: "Toxik", type: "Poison", category: "Status", power: null, accuracy: 90, pp: 10, effect: "Empoisonnement grave : dégâts augmentent chaque tour (1/16, 2/16, 3/16...).", competitiveNotes: "La meilleure pression à long terme. Force les switchs car rester = mourir. Essentiel en stall. Les Poison types ont 100% précision." },
      { name: "Will-O-Wisp", nameFr: "Feu Follet", type: "Fire", category: "Status", power: null, accuracy: 85, pp: 15, effect: "Brûle la cible. -50% Attaque physique + dégâts 1/16/tour.", competitiveNotes: "Le meilleur counter aux attaquants physiques. Un Garchomp brûlé est quasi inutile. 85% précision est le seul défaut." },
      { name: "Thunder Wave", nameFr: "Cage Éclair", type: "Electric", category: "Status", power: null, accuracy: 90, pp: 20, effect: "Paralyse la cible. -50% Vitesse + 25% chance de ne pas agir.", competitiveNotes: "Speed control permanent. Transforme les sweepers rapides en cibles lentes. Ne touche pas les types Sol." },
      { name: "Taunt", nameFr: "Provoc", type: "Dark", category: "Status", power: null, accuracy: 100, pp: 20, effect: "Empêche les attaques de statut pendant 3 tours.", competitiveNotes: "Détruit les walls (pas de Recover, Toxic, Stealth Rock). Essentiel en lead pour empêcher les hazards adverses. 100% précision." },
      { name: "Roost", nameFr: "Atterrissage", type: "Flying", category: "Status", power: null, accuracy: null, pp: 5, effect: "Soigne 50% PV max. Perd le type Vol ce tour.", competitiveNotes: "Le recovery des oiseaux. Permet aux Pokémon Vol de tanker indéfiniment. Perdre le type Vol un tour peut être un avantage (pas de faiblesse Glace/Électrik ce tour)." },
      { name: "Recover", nameFr: "Soin", type: "Normal", category: "Status", power: null, accuracy: null, pp: 5, effect: "Soigne 50% PV max.", competitiveNotes: "Recovery fiable sans contrepartie. Souvent la différence entre un bon wall et un excellent wall." },
      { name: "Wish", nameFr: "Voeu", type: "Normal", category: "Status", power: null, accuracy: null, pp: 10, effect: "Soigne 50% PV max du Pokémon en jeu au tour suivant.", competitiveNotes: "Peut soigner un partenaire en switchant! Le montant est basé sur les PV du lanceur — Blissey (255 PV) passe des Wish énormes à ses alliés." },
    ]
  },
];
