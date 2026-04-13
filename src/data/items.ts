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
];
