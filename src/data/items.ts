export interface Item {
  name: string;
  nameFr: string;
  effect: string;
  category: string;
  tier: "S" | "A" | "B" | "C";
}

export const COMPETITIVE_ITEMS: Item[] = [
  // Offensive
  { name: "Choice Band", nameFr: "Bandeau Choix", effect: "x1.5 Attaque mais bloqué sur une seule attaque. Le roi du hit-and-run.", category: "Offensif", tier: "S" },
  { name: "Choice Specs", nameFr: "Lunettes Choix", effect: "x1.5 Atq. Spé mais bloqué sur une attaque. Puissance spéciale brute.", category: "Offensif", tier: "S" },
  { name: "Choice Scarf", nameFr: "Écharpe Choix", effect: "x1.5 Vitesse mais bloqué sur une attaque. Revenge kill et surprise.", category: "Offensif/Vitesse", tier: "S" },
  { name: "Life Orb", nameFr: "Orbe Vie", effect: "x1.3 dégâts mais perd 10% PV par attaque. Flexibilité + puissance.", category: "Offensif", tier: "S" },
  { name: "Expert Belt", nameFr: "Ceinture Pro", effect: "x1.2 sur les coups super efficaces. Pas de recul, bon en bluff.", category: "Offensif", tier: "B" },
  { name: "Assault Vest", nameFr: "Veste de Combat", effect: "x1.5 Déf. Spé mais bloque les attaques de statut. Tank spécial offensif.", category: "Offensif/Défensif", tier: "A" },

  // Defensive
  { name: "Leftovers", nameFr: "Restes", effect: "Récupère 1/16 PV max chaque tour. Le standard des tanks.", category: "Défensif", tier: "S" },
  { name: "Heavy-Duty Boots", nameFr: "Bottes de Sécurité", effect: "Immunité aux entry hazards (Stealth Rock, Spikes...). Indispensable pour switchers.", category: "Défensif", tier: "S" },
  { name: "Rocky Helmet", nameFr: "Casque Brut", effect: "L'attaquant perd 1/6 PV au contact. Punit les attaquants physiques.", category: "Défensif", tier: "A" },
  { name: "Eviolite", nameFr: "Évoluroc", effect: "x1.5 Déf + Déf.Spé pour les Pokémon non évolués. Chansey, Porygon2.", category: "Défensif", tier: "S" },

  // Speed/Priority
  { name: "Focus Sash", nameFr: "Ceinture Force", effect: "Survit un OHKO avec 1 PV (une fois). Leads, sweepers fragiles, setup.", category: "Survie", tier: "S" },
  { name: "Quick Claw", nameFr: "Vive Griffe", effect: "20% de chance d'agir en premier. Trop aléatoire pour le compétitif.", category: "Vitesse", tier: "C" },

  // Berries
  { name: "Sitrus Berry", nameFr: "Baie Sitrus", effect: "Restaure 25% PV quand <50%. Fiable en VGC.", category: "Baie", tier: "A" },
  { name: "Lum Berry", nameFr: "Baie Prine", effect: "Soigne un statut une fois. Anti-Thunder Wave, anti-Will-O-Wisp.", category: "Baie", tier: "A" },

  // Status/Combo
  { name: "Flame Orb", nameFr: "Orbe Flamme", effect: "Brûle le porteur. Active Cran (Guts), empêche poison/paralysie.", category: "Statut", tier: "A" },
  { name: "Toxic Orb", nameFr: "Orbe Toxik", effect: "Empoisonne gravement. Active Pied Véloce (Poison Heal) sur Gliscor.", category: "Statut", tier: "A" },
  { name: "Weakness Policy", nameFr: "Police Faiblesse", effect: "+2 Atq et Atq.Spé quand touché par une attaque super efficace. Setup explosif.", category: "Setup", tier: "A" },
  { name: "Booster Energy", nameFr: "Énergie Booster", effect: "Active les talents Paradoxes (Protosynthèse/Neuroquartz). Gen 9 méta.", category: "Gen 9", tier: "S" },

  // Terrain/Weather
  { name: "Terrain Extender", nameFr: "Prolongeur", effect: "Les terrains durent 8 tours au lieu de 5.", category: "Terrain", tier: "B" },
  { name: "Heat Rock", nameFr: "Roche Chaude", effect: "Le soleil dure 8 tours au lieu de 5.", category: "Météo", tier: "B" },
  { name: "Damp Rock", nameFr: "Roche Humide", effect: "La pluie dure 8 tours au lieu de 5.", category: "Météo", tier: "B" },

  // Utility / Gen 9
  { name: "Safety Goggles", nameFr: "Lunettes Filtre", effect: "Immunité aux attaques poudre (Spore, Sleep Powder) et aux dégâts météo.", category: "Défensif", tier: "A" },
  { name: "Covert Cloak", nameFr: "Cape Furtive", effect: "Bloque les effets secondaires des attaques (flinch, stat drops, etc.). Gen 9.", category: "Défensif", tier: "A" },
  { name: "Clear Amulet", nameFr: "Amulette Claire", effect: "Empêche les baisses de stats par l'adversaire. Bloque Intimidate. Gen 9.", category: "Défensif", tier: "A" },
  { name: "Loaded Dice", nameFr: "Dé Pipé", effect: "Les attaques multi-hit frappent 4-5 fois au lieu de 2-5. Gen 9.", category: "Offensif", tier: "A" },
  { name: "Mental Herb", nameFr: "Herbe Mental", effect: "Soigne Taunt, Encore, Disable, Torment (une fois). Crucial pour les setters TR/Tailwind.", category: "Support", tier: "A" },
  { name: "Air Balloon", nameFr: "Ballon", effect: "Immunité au type Sol jusqu'au premier coup reçu. Élimine une faiblesse clé.", category: "Défensif", tier: "B" },
  { name: "Red Card", nameFr: "Carton Rouge", effect: "Force l'adversaire à switch après avoir frappé (une fois). Disruption.", category: "Défensif", tier: "B" },
  { name: "Shed Shell", nameFr: "Mue", effect: "Permet de switch même si piégé (Shadow Tag, Arena Trap, Magnet Pull).", category: "Défensif", tier: "B" },
  { name: "Throat Spray", nameFr: "Spray Gorge", effect: "+1 Atq. Spé après utilisation d'une attaque sonore. Gen 8+.", category: "Offensif", tier: "B" },
  { name: "Mirror Herb", nameFr: "Herbe Miroir", effect: "Copie les boosts de stats de l'adversaire (une fois). Gen 9.", category: "Support", tier: "B" },
  { name: "White Herb", nameFr: "Herbe Blanche", effect: "Restaure les stats baissées une fois. Combo avec Shell Smash, Close Combat.", category: "Offensif", tier: "B" },
  { name: "Black Sludge", nameFr: "Boue Noire", effect: "Soigne 1/16 PV/tour pour les Poison. Blesse les non-Poison. Leftovers des Poisons.", category: "Défensif", tier: "A" },
];
