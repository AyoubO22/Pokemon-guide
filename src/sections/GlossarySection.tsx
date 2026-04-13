import { useState } from 'react'

interface GlossaryEntry {
  term: string;
  aka?: string;
  definition: string;
  category: string;
}

const GLOSSARY: GlossaryEntry[] = [
  // Basics
  { term: "STAB", aka: "Same Type Attack Bonus", definition: "Bonus de x1.5 quand un Pokémon utilise une attaque de son propre type. Ex: Dracaufeu (Feu) + Lance-Flammes (Feu) = x1.5.", category: "Base" },
  { term: "BST", aka: "Base Stat Total", definition: "La somme des 6 base stats. Un Garchomp a 600 BST. Plus c'est haut, plus le Pokémon est puissant en général.", category: "Base" },
  { term: "OU", aka: "OverUsed", definition: "Le tier principal de Smogon. Les Pokémon les plus utilisés en compétitif. C'est LE format à maîtriser.", category: "Formats" },
  { term: "UU", aka: "UnderUsed", definition: "Tier en dessous de OU. Pokémon moins utilisés mais toujours viables. Souvent plus intéressant que OU.", category: "Formats" },
  { term: "Ubers", definition: "Le tier des Pokémon trop forts pour OU (bannis). Legendaires, Mega-Rayquaza, etc.", category: "Formats" },
  { term: "VGC", aka: "Video Game Championships", definition: "Le format officiel Nintendo. Doubles (2v2), équipe de 6 on choisit 4 par match.", category: "Formats" },
  { term: "Smogon", definition: "La communauté compétitive fan-made qui gère les tiers et les règles pour le Singles.", category: "Formats" },
  { term: "Showdown", aka: "Pokémon Showdown", definition: "Le simulateur en ligne gratuit (pokemonshowdown.com). Tu crées des teams instantanément et joues en ladder.", category: "Formats" },
  { term: "Ladder", definition: "Le classement en ligne. Tu gagnes/perds des points (ELO) à chaque match. Plus tu montes, plus les adversaires sont forts.", category: "Formats" },

  // Gameplay terms
  { term: "OHKO", aka: "One-Hit KO", definition: "Mettre KO en un seul coup. Le but offensif ultime.", category: "Gameplay" },
  { term: "2HKO", aka: "Two-Hit KO", definition: "KO en 2 coups. Encore bien, surtout si tu es plus rapide.", category: "Gameplay" },
  { term: "Check", definition: "Un Pokémon qui peut switch-in et menacer une cible, mais ne la bat pas forcément 100% du temps. Plus fragile qu'un counter.", category: "Gameplay" },
  { term: "Counter", definition: "Un Pokémon qui bat une menace de manière fiable. Switch-in + survit + menace en retour. Hard counter = 100% fiable.", category: "Gameplay" },
  { term: "Sweep", definition: "Quand un Pokémon KO plusieurs adversaires à la suite sans s'arrêter. Le but d'un sweeper.", category: "Gameplay" },
  { term: "Wall", aka: "Mur", definition: "Un Pokémon très défensif qui absorbe les coups. Peut être physique (Skarmory) ou spécial (Blissey).", category: "Gameplay" },
  { term: "Stallbreaker", definition: "Un Pokémon conçu pour battre le stall. Taunt + statuts + attaque décente.", category: "Gameplay" },
  { term: "Glue", aka: "Colle", definition: "Un Pokémon polyvalent qui fait tenir l'équipe ensemble. Landorus-T est le glue ultime.", category: "Gameplay" },
  { term: "Lead", definition: "Le premier Pokémon envoyé. Souvent le poseur de hazards ou le suicide lead.", category: "Gameplay" },
  { term: "Revenge Kill", definition: "Entrer après un KO allié et tuer la menace. Souvent avec un Scarf ou une priority.", category: "Gameplay" },
  { term: "Pivot", definition: "Pokémon qui entre, fait quelque chose d'utile, et sort (U-turn, Volt Switch). Maintient le momentum.", category: "Gameplay" },
  { term: "Wallbreaker", definition: "Pokémon ultra puissant qui casse les murs. Souvent Choice Band/Specs. Ouvre la voie au sweeper.", category: "Gameplay" },
  { term: "Win Condition", aka: "Wincon", definition: "Le plan pour gagner le match. Quel Pokémon va sweep une fois les obstacles éliminés.", category: "Gameplay" },
  { term: "Setup", definition: "Utiliser un move de boost (Swords Dance, Dragon Dance, Calm Mind) avant de sweeper.", category: "Gameplay" },
  { term: "Chip Damage", definition: "Dégâts accumulés : hazards, météo, statuts, Life Orb. S'additionne vite.", category: "Gameplay" },
  { term: "Switch-in", definition: "Envoyer un Pokémon contre une menace. Un 'safe switch-in' survit et menace en retour.", category: "Gameplay" },
  { term: "Sac", aka: "Sacrifice", definition: "Envoyer un Pokémon mourir volontairement pour entrer un autre gratuitement.", category: "Gameplay" },
  { term: "Outspeed", definition: "Être plus rapide que l'adversaire. 'Garchomp outspeeds Volcarona' = Garchomp est plus rapide.", category: "Gameplay" },
  { term: "Speed Creep", definition: "Investir quelques EVs supplémentaires en Vitesse pour outspeed une menace spécifique.", category: "Gameplay" },
  { term: "Bulk", definition: "La capacité à encaisser des coups. PV × Défense ou PV × Déf.Spé. Plus de bulk = plus résistant.", category: "Gameplay" },
  { term: "Nuke", definition: "Attaque extrêmement puissante. 'Band Earthquake is a nuke' = ça fait TRÈS mal.", category: "Gameplay" },
  { term: "Calc", definition: "Damage calculation. Calculer les dégâts exacts. 'Have you calced that?' = 'tu as vérifié les dégâts?'", category: "Gameplay" },
  { term: "Metagame", aka: "Meta", definition: "L'ensemble des stratégies et Pokémon populaires à un moment donné. Le méta évolue constamment.", category: "Gameplay" },

  // Strategy terms
  { term: "Core", definition: "Combo de 2-3 Pokémon avec une synergie forte. Ex: FWG core (Feu/Eau/Plante).", category: "Stratégie" },
  { term: "VoltTurn", definition: "Stratégie basée sur Volt Switch + U-turn pour maintenir le momentum en pivotant sans cesse.", category: "Stratégie" },
  { term: "Hazard Stack", definition: "Accumuler Stealth Rock + Spikes + Toxic Spikes pour des dégâts passifs massifs.", category: "Stratégie" },
  { term: "Hazard Control", definition: "L'équilibre entre poser ses hazards et retirer ceux de l'adversaire. Central dans tout match.", category: "Stratégie" },
  { term: "Cleric", definition: "Pokémon qui soigne les statuts de l'équipe avec Heal Bell ou Aromatherapy.", category: "Stratégie" },
  { term: "Wish Passer", definition: "Pokémon qui utilise Wish pour soigner un partenaire au tour suivant.", category: "Stratégie" },
  { term: "Phaze", aka: "Phazing", definition: "Forcer l'adversaire à switch avec Roar, Whirlwind, Dragon Tail. Anti-setup.", category: "Stratégie" },
  { term: "Trap", aka: "Trapping", definition: "Empêcher l'adversaire de switch. Magnezone piège les Steel, Dugtrio piège tout.", category: "Stratégie" },
  { term: "HO", aka: "Hyper Offense", definition: "6 Pokémon offensifs, pas de wall. Pression constante, fragile.", category: "Stratégie" },
  { term: "Balance", aka: "Balanced", definition: "Mix offense/défense. Le style le plus solide et versatile.", category: "Stratégie" },
  { term: "Stall", definition: "6 Pokémon défensifs. Gagner par épuisement (Toxic, hazards, timer).", category: "Stratégie" },
  { term: "Bulky Offense", aka: "BO", definition: "Pokémon offensifs mais assez résistants pour encaisser un coup et frapper.", category: "Stratégie" },
  { term: "Weather War", definition: "Les deux équipes se battent pour contrôler la météo. Historiquement dominant en Gen 5.", category: "Stratégie" },
  { term: "Trick Room", aka: "TR", definition: "Stratégie qui inverse l'ordre de vitesse. Les lents frappent en premier.", category: "Stratégie" },
  { term: "Tailwind", aka: "TW", definition: "Stratégie qui double la vitesse de l'équipe pendant 4 tours.", category: "Stratégie" },

  // Doubles-specific
  { term: "Spread Move", definition: "Attaque qui touche les 2 adversaires en Doubles (75% puissance). Earthquake, Heat Wave, Rock Slide.", category: "Doubles" },
  { term: "Redirect", definition: "Follow Me / Rage Powder force les attaques single-target sur le redirigeur.", category: "Doubles" },
  { term: "Fake Out", definition: "Flinch garanti Tour 1. Le roi du VGC. Gagne un tour gratuit.", category: "Doubles" },
  { term: "Protecting", definition: "En Doubles, Protect est quasi obligatoire. Scout, stall, survival.", category: "Doubles" },
  { term: "Bring 6 Pick 4", aka: "Team Preview", definition: "Tu montres 6 Pokémon mais n'en choisis que 4 par match. La sélection est un skill.", category: "Doubles" },
  { term: "Focus Fire", definition: "Les deux Pokémon attaquent la même cible pour garantir le KO.", category: "Doubles" },
  { term: "Position", definition: "Avantage numérique et de positionnement. 4v3 avec Tailwind = position dominante.", category: "Doubles" },

  // Items/Abilities shorthand
  { term: "Band", definition: "Choice Band. +50% Attaque, bloqué sur une attaque.", category: "Jargon" },
  { term: "Specs", definition: "Choice Specs. +50% Atq.Spé, bloqué sur une attaque.", category: "Jargon" },
  { term: "Scarf", definition: "Choice Scarf. +50% Vitesse, bloqué sur une attaque.", category: "Jargon" },
  { term: "Orb", definition: "Life Orb. +30% dégâts, -10% PV par attaque.", category: "Jargon" },
  { term: "Boots", aka: "HDB", definition: "Heavy-Duty Boots. Immunité aux hazards.", category: "Jargon" },
  { term: "Helmet", definition: "Rocky Helmet. 1/6 dégâts au contact à l'attaquant.", category: "Jargon" },
  { term: "Sash", definition: "Focus Sash. Survit un OHKO avec 1 PV.", category: "Jargon" },
  { term: "Lefties", definition: "Leftovers/Restes. Soigne 6.25% PV par tour.", category: "Jargon" },
  { term: "Vest", definition: "Assault Vest. +50% Déf.Spé mais bloque les moves de statut.", category: "Jargon" },
  { term: "Knock Off", aka: "Knock", definition: "L'attaque qui retire l'objet adverse. Le move utilitaire le plus important.", category: "Jargon" },
  { term: "Rocks", aka: "SR", definition: "Stealth Rock. Le hazard le plus important du jeu.", category: "Jargon" },
  { term: "Spin", definition: "Rapid Spin. Retire les hazards de son côté.", category: "Jargon" },
  { term: "Defog", definition: "Retire TOUS les hazards des deux côtés.", category: "Jargon" },
  { term: "Regen", definition: "Regenerator. Soigne 33% PV au switch. Le talent pivot par excellence.", category: "Jargon" },
];

const CATEGORIES = ["Tous", "Base", "Formats", "Gameplay", "Stratégie", "Doubles", "Jargon"];

export function GlossarySection() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Tous");

  const filtered = GLOSSARY.filter(g =>
    (catFilter === "Tous" || g.category === catFilter) &&
    (!search || g.term.toLowerCase().includes(search.toLowerCase()) || g.definition.toLowerCase().includes(search.toLowerCase()) || (g.aka && g.aka.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Glossaire Compétitif</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
          Le jargon compétitif Pokémon est dense. Ce glossaire couvre tous les termes que tu verras
          sur Smogon, Pokémon Showdown, et dans les discussions stratégiques. {GLOSSARY.length} termes indexés.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Chercher un terme..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm flex-1 min-w-[200px]"
        />
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2.5 py-1 text-xs rounded ${catFilter === c ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-zinc-500">{filtered.length} résultats</p>

      <div className="grid gap-2">
        {filtered.map(entry => (
          <div key={entry.term} className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-semibold text-sm text-zinc-100">{entry.term}</span>
              {entry.aka && <span className="text-xs text-zinc-500">({entry.aka})</span>}
              <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded ml-auto">{entry.category}</span>
            </div>
            <p className="text-sm text-zinc-400">{entry.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
