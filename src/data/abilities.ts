export interface Ability {
  name: string;
  nameFr: string;
  effect: string;
  tier: "S" | "A" | "B" | "C";
  category: string;
}

export const KEY_ABILITIES: Ability[] = [
  // S Tier
  { name: "Intimidate", nameFr: "Intimidation", effect: "Baisse l'Attaque adverse d'un cran à l'entrée. Dominant en VGC (doubles).", tier: "S", category: "Support" },
  { name: "Drizzle", nameFr: "Crachin", effect: "Invoque la pluie en entrant. Active les combos Swift Swim et boost les attaques Eau.", tier: "S", category: "Météo" },
  { name: "Drought", nameFr: "Sécheresse", effect: "Invoque le soleil en entrant. Boost Feu, active Chlorophylle.", tier: "S", category: "Météo" },
  { name: "Sand Stream", nameFr: "Sable Volant", effect: "Invoque la tempête de sable. Boost Déf.Spé des Roche de 50%.", tier: "S", category: "Météo" },
  { name: "Snow Warning", nameFr: "Alerte Neige", effect: "Invoque la grêle/neige. Active Blizzard 100% précision.", tier: "A", category: "Météo" },
  { name: "Levitate", nameFr: "Lévitation", effect: "Immunité au type Sol. Élimine une faiblesse majeure pour beaucoup.", tier: "S", category: "Défensif" },
  { name: "Magic Bounce", nameFr: "Miroir Magik", effect: "Renvoie les attaques de statut. Bloque Stealth Rock, Toxic, etc.", tier: "S", category: "Défensif" },
  { name: "Multiscale", nameFr: "Multiécaille", effect: "Réduit les dégâts de 50% quand PV pleins. Signature de Lugia/Dragonite.", tier: "S", category: "Défensif" },
  { name: "Protean", nameFr: "Protéen", effect: "Change le type du Pokémon selon l'attaque utilisée. STAB sur tout.", tier: "S", category: "Offensif" },
  { name: "Huge Power", nameFr: "Force Pure", effect: "Double l'Attaque. Rend des Pokémon moyens terrifiants (Azumarill, Mawile).", tier: "S", category: "Offensif" },
  { name: "Speed Boost", nameFr: "Turbo", effect: "+1 Vitesse chaque tour. Snowball offensif garanti (Blaziken, Ninjask).", tier: "S", category: "Offensif" },

  // A Tier
  { name: "Sturdy", nameFr: "Fermeté", effect: "Survit à un OHKO avec 1 PV si PV pleins. Focus Sash intégré.", tier: "A", category: "Défensif" },
  { name: "Regenerator", nameFr: "Régé-Force", effect: "Récupère 1/3 des PV max en switchant. Incroyable en pivot/cycle.", tier: "S", category: "Défensif" },
  { name: "Prankster", nameFr: "Farceur", effect: "Les attaques de statut ont +1 priorité. Thunder Wave, Taunt avant tout.", tier: "A", category: "Support" },
  { name: "Mold Breaker", nameFr: "Brise Moule", effect: "Ignore le talent adverse. Frappe les Lévitation avec Séisme.", tier: "A", category: "Offensif" },
  { name: "Technician", nameFr: "Technicien", effect: "Boost de 50% les attaques de puissance ≤60. Bullet Punch, Mach Punch.", tier: "A", category: "Offensif" },
  { name: "Adaptability", nameFr: "Adaptabilité", effect: "Le STAB passe de x1.5 à x2.0. Puissance brute énorme.", tier: "A", category: "Offensif" },
  { name: "Flash Fire", nameFr: "Torche", effect: "Immunité Feu + boost les attaques Feu si touché par une attaque Feu.", tier: "A", category: "Défensif" },
  { name: "Guts", nameFr: "Cran", effect: "+50% Attaque si statut (brûlure, poison, etc.). Combo avec Orbe Flamme.", tier: "A", category: "Offensif" },
  { name: "Marvel Scale", nameFr: "Écaille Spé.", effect: "+50% Défense si statut. Défensif et combo avec Repos.", tier: "B", category: "Défensif" },
  { name: "Unaware", nameFr: "Inconscient", effect: "Ignore les changements de stats adverses. Counter anti-setup.", tier: "A", category: "Défensif" },
  { name: "Magic Guard", nameFr: "Garde Magik", effect: "Pas de dégâts indirects (météo, poison, entry hazards). Life Orb sans recul.", tier: "S", category: "Défensif" },

  // B Tier
  { name: "Flame Body", nameFr: "Corps Ardent", effect: "30% de brûler l'attaquant au contact. Punit les Physical sweepers.", tier: "B", category: "Défensif" },
  { name: "Static", nameFr: "Statik", effect: "30% de paralyser l'attaquant au contact.", tier: "B", category: "Défensif" },
  { name: "Poison Point", nameFr: "Point Poison", effect: "30% d'empoisonner l'attaquant au contact.", tier: "C", category: "Défensif" },
  { name: "Swift Swim", nameFr: "Glissade", effect: "Double la Vitesse sous la pluie. Combo avec Drizzle.", tier: "A", category: "Météo" },
  { name: "Chlorophyll", nameFr: "Chlorophylle", effect: "Double la Vitesse au soleil. Combo avec Drought.", tier: "A", category: "Météo" },
  { name: "Sand Rush", nameFr: "Baigne Sable", effect: "Double la Vitesse en tempête de sable.", tier: "A", category: "Météo" },
  { name: "Slush Rush", nameFr: "Chasse-Neige", effect: "Double la Vitesse sous la grêle/neige.", tier: "B", category: "Météo" },
  { name: "Contrary", nameFr: "Contestation", effect: "Inverse les changements de stats. Leaf Storm = +2 Atq.Spé!", tier: "A", category: "Offensif" },
  { name: "Sheer Force", nameFr: "Sans Limite", effect: "+30% dégâts mais supprime les effets secondaires. Combo Life Orb.", tier: "A", category: "Offensif" },

  // Gen 9 signature
  { name: "Good as Gold", nameFr: "Corps en Or", effect: "Immunité totale aux attaques de statut (Toxic, Will-O-Wisp, Stealth Rock, Taunt, Thunder Wave).", tier: "S", category: "Défensif" },
  { name: "Supreme Overlord", nameFr: "Commandant Suprême", effect: "+10% dégâts par allié KO (max +50%). Plus fort en fin de partie.", tier: "S", category: "Offensif" },
  { name: "Protosynthesis", nameFr: "Protosynthèse", effect: "Boost la stat la plus haute de 30% (50% si Vitesse) sous le Soleil ou avec Booster Energy.", tier: "S", category: "Offensif" },
  { name: "Quark Drive", nameFr: "Neuroquartz", effect: "Boost la stat la plus haute de 30% (50% si Vitesse) sous Champ Électrifié ou avec Booster Energy.", tier: "S", category: "Offensif" },

  // Additional competitive staples
  { name: "Moxie", nameFr: "Impudence", effect: "+1 Attaque après chaque KO. Snowball physique, chaque KO rend le suivant plus facile.", tier: "A", category: "Offensif" },
  { name: "Poison Heal", nameFr: "Soin Poison", effect: "Soigne 1/8 PV par tour si empoisonné au lieu de perdre des PV. Combo Toxic Orb.", tier: "S", category: "Défensif" },
  { name: "Serene Grace", nameFr: "Sérénité", effect: "Double les taux d'effets secondaires. Air Slash 60% flinch, Iron Head 60% flinch.", tier: "A", category: "Offensif" },
  { name: "Natural Cure", nameFr: "Médic Nature", effect: "Soigne tous les statuts en switchant. Parfait pour les pivots défensifs.", tier: "A", category: "Défensif" },
  { name: "Beast Boost", nameFr: "Boost Chimère", effect: "+1 à la stat la plus haute après chaque KO. Version universelle de Moxie.", tier: "A", category: "Offensif" },
  { name: "Tinted Lens", nameFr: "Lentille Teintée", effect: "Les attaques 'pas très efficaces' font des dégâts normaux. Élimine les résistances.", tier: "A", category: "Offensif" },
  { name: "Unseen Fist", nameFr: "Poing Invisible", effect: "Les attaques de contact traversent Protect/Detect. Signature d'Urshifu.", tier: "S", category: "Offensif" },
  { name: "Mirror Armor", nameFr: "Armure Miroir", effect: "Renvoie les baisses de stats à l'attaquant. Contre Intimidate, Sticky Web.", tier: "A", category: "Défensif" },
];
