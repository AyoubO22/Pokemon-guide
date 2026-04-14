import { useState, useRef } from 'react'

// Centralized glossary for tooltips — all competitive jargon in one place
const JARGON: Record<string, string> = {
  // Core
  "STAB": "Same Type Attack Bonus — x1.5 dégâts quand un Pokémon utilise une attaque de son propre type",
  "BST": "Base Stat Total — la somme des 6 stats de base d'un Pokémon",
  "EV": "Effort Value — points d'entraînement (0-252 par stat, 510 total). 4 EVs = +1 stat au niv.100",
  "EVs": "Effort Values — points d'entraînement (0-252 par stat, 510 total). 4 EVs = +1 stat au niv.100",
  "IV": "Individual Value — valeur génétique (0-31). En compétitif on vise 31 partout",
  "IVs": "Individual Values — valeurs génétiques (0-31). En compétitif on vise 31 partout",
  "HA": "Hidden Ability — talent caché, souvent le meilleur. Obtenu via Raid ou Ability Patch",

  // Formats
  "OU": "OverUsed — le tier principal de Smogon, les Pokémon les plus joués",
  "UU": "UnderUsed — tier en dessous de OU, Pokémon moins courants mais viables",
  "Ubers": "Le tier des Pokémon trop forts pour OU (bannis). Légendaires etc.",
  "VGC": "Video Game Championships — le format officiel Nintendo en Doubles (2v2)",
  "Smogon": "Communauté fan qui gère les tiers et règles du compétitif Singles",
  "Showdown": "Pokémon Showdown — simulateur en ligne gratuit pour le compétitif",
  "Ladder": "Classement en ligne. Tu gagnes/perds des points ELO à chaque match",

  // Gameplay
  "OHKO": "One-Hit KO — mettre KO en un seul coup",
  "2HKO": "Two-Hit KO — mettre KO en deux coups",
  "3HKO": "Three-Hit KO — mettre KO en trois coups",
  "check": "Pokémon qui peut switch-in et menacer une cible, mais pas 100% fiable",
  "counter": "Pokémon qui bat une menace de manière fiable à chaque fois",
  "sweep": "Quand un Pokémon KO plusieurs adversaires à la suite sans s'arrêter",
  "sweeper": "Pokémon offensif rapide et puissant dont le but est de sweep",
  "wall": "Pokémon très défensif qui absorbe les coups. Physique ou spécial",
  "tank": "Pokémon résistant qui peut aussi frapper. Entre sweeper et wall",
  "pivot": "Pokémon qui entre, agit, et sort (U-turn/Volt Switch). Maintient le momentum",
  "lead": "Premier Pokémon envoyé au combat. Souvent poseur de hazards",
  "revenge kill": "Entrer après un KO allié pour éliminer la menace adverse",
  "wallbreaker": "Pokémon ultra puissant qui détruit les walls. Souvent Choice Band/Specs",
  "wincon": "Win Condition — le plan pour gagner. Quel Pokémon va sweep en fin de match",
  "win condition": "Le plan pour gagner le match. Quel Pokémon va sweep une fois les obstacles retirés",
  "setup": "Utiliser un move de boost (Swords Dance, Dragon Dance) avant de sweeper",
  "chip damage": "Dégâts accumulés petit à petit : hazards, météo, statuts, Life Orb",
  "switch-in": "Envoyer un Pokémon face à une menace. Un 'safe switch-in' survit et menace",
  "outspeed": "Être plus rapide que l'adversaire et agir en premier",
  "speed tier": "Palier de vitesse. Savoir qui outspeed qui est fondamental",
  "speed creep": "Investir quelques EVs en Vitesse pour outspeed une menace spécifique",
  "bulk": "Capacité à encaisser des coups. PV × Défense ou PV × Déf.Spé",
  "metagame": "L'ensemble des stratégies et Pokémon populaires du moment. Évolue constamment",
  "meta": "L'ensemble des stratégies et Pokémon populaires du moment",
  "coverage": "Attaques de types différents du STAB pour toucher plus de cibles",
  "spread": "Répartition des EVs entre les stats. Ex: 252 Atk / 252 Spe / 4 HP",
  "cleric": "Pokémon qui soigne les statuts de l'équipe (Heal Bell, Aromatherapy)",
  "spinner": "Pokémon qui utilise Rapid Spin pour retirer les hazards",
  "defogger": "Pokémon qui utilise Defog pour retirer les hazards",

  // Stratégie
  "core": "Combo de 2-3 Pokémon avec une forte synergie défensive ou offensive",
  "VoltTurn": "Stratégie de pivot avec Volt Switch + U-turn en boucle",
  "hazards": "Pièges d'entrée : Stealth Rock, Spikes, Toxic Spikes, Sticky Web",
  "entry hazards": "Pièges posés sur le terrain qui infligent des dégâts/effets à chaque switch-in",
  "Stealth Rock": "Piège de Roc — inflige des dégâts selon la faiblesse Roche à chaque entrée",
  "SR": "Stealth Rock — le hazard le plus important du jeu compétitif",
  "Spikes": "Picots — hazard au sol, cumulable 3 fois (12.5%/16.7%/25%)",
  "Toxic Spikes": "Pics Toxik — empoisonne les Pokémon qui entrent au sol",
  "Sticky Web": "Toile Gluante — baisse la Vitesse des adversaires qui entrent",
  "phaze": "Forcer l'adversaire à switch avec Roar, Whirlwind, Dragon Tail",
  "HO": "Hyper Offense — 6 Pokémon offensifs, pas de wall",
  "stall": "Style défensif — gagner par épuisement (Toxic, hazards, recovery)",
  "Trick Room": "Distorsion — inverse l'ordre de vitesse pendant 5 tours",
  "Tailwind": "Vent Arrière — double la Vitesse de l'équipe pendant 4 tours",

  // Items shorthand
  "Band": "Choice Band — +50% Attaque mais bloqué sur une seule attaque",
  "Choice Band": "Bandeau Choix — +50% Attaque mais bloqué sur une seule attaque",
  "Specs": "Choice Specs — +50% Atq.Spé mais bloqué sur une attaque",
  "Choice Specs": "Lunettes Choix — +50% Atq.Spé mais bloqué sur une attaque",
  "Scarf": "Choice Scarf — +50% Vitesse mais bloqué sur une attaque",
  "Choice Scarf": "Écharpe Choix — +50% Vitesse mais bloqué sur une attaque",
  "Life Orb": "Orbe Vie — +30% dégâts mais perd 10% PV par attaque",
  "Leftovers": "Restes — récupère 6.25% PV par tour",
  "Focus Sash": "Ceinture Force — survit un OHKO avec 1 PV (une fois)",
  "Boots": "Heavy-Duty Boots — immunité aux entry hazards",
  "Heavy-Duty Boots": "Bottes de Sécurité — immunité aux entry hazards (SR, Spikes...)",
  "Rocky Helmet": "Casque Brut — l'attaquant perd 1/6 PV au contact",
  "Eviolite": "Évoluroc — +50% Déf et Déf.Spé pour les Pokémon non entièrement évolués",
  "Assault Vest": "Veste de Combat — +50% Déf.Spé mais bloque les moves de statut",
  "Weakness Policy": "Police Faiblesse — +2 Atq et Atq.Spé après un coup super efficace",
  "Booster Energy": "Active les talents Paradoxes (Protosynthèse/Neuroquartz). Gen 9",

  // Abilities shorthand
  "Intimidate": "Intimidation — baisse l'Attaque adverse d'un cran à l'entrée",
  "Regenerator": "Régé-Force — récupère 33% PV max en switchant. Le talent pivot #1",
  "Regen": "Regenerator — récupère 33% PV max en switchant",
  "Multiscale": "Multiécaille — réduit les dégâts de 50% quand PV pleins",
  "Magic Guard": "Garde Magik — pas de dégâts indirects (météo, poison, hazards, Life Orb)",
  "Protean": "Change le type du Pokémon selon l'attaque utilisée. STAB sur tout",
  "Huge Power": "Force Pure — double l'Attaque. Rend des Pokémon moyens terrifiants",
  "Speed Boost": "Turbo — +1 Vitesse chaque tour automatiquement",
  "Prankster": "Farceur — les moves de statut ont +1 priorité. Ne marche pas sur Dark",
  "Unaware": "Inconscient — ignore les changements de stats adverses",
  "Drizzle": "Crachin — invoque la pluie en entrant sur le terrain",
  "Drought": "Sécheresse — invoque le soleil en entrant sur le terrain",
  "Sand Stream": "Sable Volant — invoque la tempête de sable en entrant",
  "Swift Swim": "Glissade — double la Vitesse sous la pluie",
  "Chlorophyll": "Chlorophylle — double la Vitesse au soleil",
  "Sand Rush": "Baigne Sable — double la Vitesse en tempête de sable",
  "Guts": "Cran — +50% Attaque si statué (brûlure, poison, etc.)",
  "Technician": "Technicien — +50% puissance sur les moves de 60 ou moins",

  // Moves shorthand
  "U-turn": "Demi-Tour — frappe puis switch. Le pivot move physique #1",
  "Volt Switch": "Change Éclair — version spéciale Électrik de U-turn. Bloqué par Sol",
  "Knock Off": "Sabotage — retire l'objet adverse + 97.5 puissance si objet présent",
  "Rapid Spin": "Tour Rapide — retire les hazards de son côté + boost Vitesse",
  "Defog": "Anti-Brume — retire TOUS les hazards des deux côtés",
  "Swords Dance": "Danse-Lames — +2 Attaque. Le setup physique standard",
  "Dragon Dance": "Danse Draco — +1 Attaque et +1 Vitesse. Le meilleur setup move",
  "Calm Mind": "Plénitude — +1 Atq.Spé et +1 Déf.Spé",
  "Nasty Plot": "Machination — +2 Atq.Spé. Le setup spécial #1",
  "Quiver Dance": "Papillodanse — +1 Atq.Spé, +1 Déf.Spé, +1 Vitesse",
  "Shell Smash": "Exuviation — +2 Atq, Atq.Spé, Vitesse / -1 Déf, Déf.Spé",
  "Scald": "Ébullition — 80 puissance Eau + 30% brûlure. Le move wall #1",
  "Toxic": "Empoisonnement grave qui augmente les dégâts chaque tour",
  "Will-O-Wisp": "Feu Follet — brûle la cible. Réduit son Attaque de 50%",
  "Thunder Wave": "Cage Éclair — paralyse la cible. -50% Vitesse + 25% skip",
  "Protect": "Abri — bloque toute attaque ce tour. Fondamental en Doubles/VGC",
  "Fake Out": "Bluff — flinch garanti Tour 1. +3 priorité. Roi du VGC",
  "Extreme Speed": "Vitesse Extrême — +2 priorité. Le meilleur move prioritaire",
  "Sucker Punch": "Coup Bas — +1 priorité mais échoue si l'adversaire utilise un statut",
  "Taunt": "Provoc — empêche les moves de statut pendant 3 tours",
  "Encore": "Force à répéter la dernière attaque pendant 3 tours",

  // Doubles
  "spread move": "Attaque qui touche les 2 adversaires en Doubles (75% puissance)",
  "redirect": "Follow Me/Rage Powder — force les attaques sur le redirigeur",

  // Gen mechanics
  "Tera": "Téracristallisation — change le type du Pokémon en combat (1 fois/match). Gen 9",
  "Téracristallisation": "Change le type du Pokémon en plein combat. 1 fois par match. Gen 9",
  "Dynamax": "Triple les PV pendant 3 tours + moves Max surpuissants. Gen 8",
  "Mega Evolution": "Méga-Évolution — forme temporaire surpuissante. 1 par équipe. Gen 6-7",
  "Z-Move": "Attaque ultime unique par combat. Gen 7",
};

type TooltipPos = { x: number; y: number; above: boolean } | null;

function calcTooltipPos(ref: React.RefObject<HTMLSpanElement>): TooltipPos {
  if (!ref.current) return null;
  const rect = ref.current.getBoundingClientRect();
  const above = rect.top > 140;
  return {
    x: rect.left + rect.width / 2,
    y: above ? rect.top - 6 : rect.bottom + 6,
    above,
  };
}

// Tooltip component — wrap any text and it auto-detects jargon
interface TooltipProps {
  children: string;
  className?: string;
}

export function JargonText({ children, className = "" }: TooltipProps) {
  // Build regex from all jargon keys, longest first to avoid partial matches
  const keys = Object.keys(JARGON).sort((a, b) => b.length - a.length);
  const regex = new RegExp(`\\b(${keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');

  const parts: (string | { term: string; match: string })[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(children)) !== null) {
    if (match.index > lastIndex) {
      parts.push(children.slice(lastIndex, match.index));
    }
    parts.push({ term: match[0], match: match[0] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < children.length) {
    parts.push(children.slice(lastIndex));
  }

  return (
    <span className={className}>
      {parts.map((part, i) =>
        typeof part === 'string' ? (
          <span key={i}>{part}</span>
        ) : (
          <JargonTooltip key={i} term={part.term} display={part.match} />
        )
      )}
    </span>
  );
}

// Individual tooltip — uses position:fixed to avoid clipping by overflow:hidden parents
function JargonTooltip({ term, display }: { term: string; display: string }) {
  const [pos, setPos] = useState<TooltipPos>(null);
  const ref = useRef<HTMLSpanElement>(null);

  const definition = JARGON[term] || JARGON[term.toLowerCase()] || JARGON[term.charAt(0).toUpperCase() + term.slice(1)] || "";

  if (!definition) return <span>{display}</span>;

  const tooltipWidth = 256; // w-64
  const safeLeft = pos ? Math.min(Math.max(pos.x - tooltipWidth / 2, 8), window.innerWidth - tooltipWidth - 8) : 0;

  return (
    <span
      ref={ref}
      className="inline-block"
      onMouseEnter={() => setPos(calcTooltipPos(ref))}
      onMouseLeave={() => setPos(null)}
      onTouchStart={() => setPos(p => p ? null : calcTooltipPos(ref))}
    >
      <span className="border-b border-dotted border-zinc-500 text-zinc-200 cursor-help">
        {display}
      </span>
      {pos && (
        <span
          className="fixed z-[9999] w-64 px-3 py-2 rounded-lg shadow-xl bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 leading-relaxed pointer-events-none"
          style={{
            left: safeLeft,
            top: pos.above ? pos.y : pos.y,
            transform: pos.above ? 'translateY(-100%)' : 'none',
          }}
        >
          <span className="font-semibold text-zinc-100 block mb-0.5">{term}</span>
          {definition}
        </span>
      )}
    </span>
  );
}

// Simple standalone tooltip for manual use — uses position:fixed to avoid clipping
export function Tip({ term, children }: { term: string; children?: React.ReactNode }) {
  const definition = JARGON[term] || JARGON[term.toLowerCase()] || "";
  const [pos, setPos] = useState<TooltipPos>(null);
  const ref = useRef<HTMLSpanElement>(null);

  const tooltipWidth = 240; // w-60
  const safeLeft = pos ? Math.min(Math.max(pos.x - tooltipWidth / 2, 8), window.innerWidth - tooltipWidth - 8) : 0;

  return (
    <span
      ref={ref}
      className="inline-block"
      onMouseEnter={() => setPos(calcTooltipPos(ref))}
      onMouseLeave={() => setPos(null)}
    >
      <span className="border-b border-dotted border-zinc-500 text-zinc-200 cursor-help">
        {children || term}
      </span>
      {pos && definition && (
        <span
          className="fixed z-[9999] w-60 px-3 py-2 rounded-lg shadow-xl bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 leading-relaxed pointer-events-none"
          style={{
            left: safeLeft,
            top: pos.y,
            transform: pos.above ? 'translateY(-100%)' : 'none',
          }}
        >
          <span className="font-semibold text-zinc-100 block mb-0.5">{term}</span>
          {definition}
        </span>
      )}
    </span>
  );
}

export { JARGON };
