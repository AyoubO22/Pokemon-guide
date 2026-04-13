import { useState } from 'react'
import { KEY_ABILITIES } from '../data/abilities'
import { JargonText } from '../components/Tooltip'

const TIER_COLORS = { S: 'text-yellow-400 bg-yellow-400/10', A: 'text-blue-400 bg-blue-400/10', B: 'text-green-400 bg-green-400/10', C: 'text-zinc-400 bg-zinc-400/10' };
const CATEGORIES = ["Tous", "Offensif", "Défensif", "Support", "Météo"];

export function AbilitiesSection() {
  const [catFilter, setCatFilter] = useState("Tous");
  const [tierFilter, setTierFilter] = useState<string>("Tous");

  const filtered = KEY_ABILITIES.filter(a =>
    (catFilter === "Tous" || a.category === catFilter) &&
    (tierFilter === "Tous" || a.tier === tierFilter)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Talents (Abilities)</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
          Introduits en Gen 3, les talents sont des capacités passives qui changent radicalement le gameplay.
          Chaque Pokémon a 1-2 talents normaux + 1 talent caché (Hidden Ability, plus rare).
          Le talent peut faire la différence entre un Pokémon viable et un Pokémon inutilisable.
        </p>
      </div>

      {/* Key concepts */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-semibold text-zinc-200 mb-2">Talent Normal vs Talent Caché</h3>
          <p className="text-sm text-zinc-400">
            Chaque Pokémon a accès à 1 ou 2 talents normaux + 1 talent caché (HA). Le HA est souvent le meilleur
            (ex: Blaziken avec Speed Boost, Ditto avec Impostor). On l'obtient via Raid, reproduction ou Ability Patch (Gen 8+).
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-semibold text-zinc-200 mb-2">Ability Patch & Ability Capsule</h3>
          <p className="text-sm text-zinc-400">
            <strong>Capsule</strong> : switch entre les 2 talents normaux. <strong>Patch</strong> : donne le talent caché
            (Gen 8+, très rare). Avec ces deux objets, tu as accès à tous les talents de ton Pokémon.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2.5 py-1 text-xs rounded ${catFilter === c ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-1 ml-2">
          {["Tous", "S", "A", "B", "C"].map(t => (
            <button key={t} onClick={() => setTierFilter(t)}
              className={`px-2.5 py-1 text-xs rounded font-bold ${tierFilter === t ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Abilities list */}
      <div className="grid gap-3">
        {filtered.map(ability => (
          <div key={ability.name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex gap-4 items-start">
            <span className={`text-xs font-bold px-2 py-1 rounded shrink-0 ${TIER_COLORS[ability.tier]}`}>
              {ability.tier}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-zinc-100">{ability.nameFr}</h4>
                <span className="text-xs text-zinc-500">({ability.name})</span>
                <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">{ability.category}</span>
              </div>
              <p className="text-sm text-zinc-400 mt-1"><JargonText>{ability.effect}</JargonText></p>
            </div>
          </div>
        ))}
      </div>

      {/* Meta-shaping abilities */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="font-semibold text-zinc-200 mb-3">Talents qui définissent le métagame</h3>
        <div className="text-sm text-zinc-400 space-y-3">
          <p>
            <strong className="text-zinc-200">Regenerator</strong> est probablement le talent le plus impactant du jeu compétitif moderne.
            Récupérer 33% PV juste en switchant transforme un pivot en mur quasi immortel. Slowbro, Toxapex, Tornadus-T
            sont tous des piliers grâce à ce talent.
          </p>
          <p>
            <strong className="text-zinc-200">Intimidate</strong> est roi en VGC (Doubles). Baisser l'Attaque adverse en entrant
            affecte le calcul de dégâts de tout le champ de bataille. Landorus-T et Incineroar sont les Pokémon les plus utilisés
            de l'histoire du VGC grâce à ce talent.
          </p>
          <p>
            <strong className="text-zinc-200">Les weather setters</strong> (Drizzle, Drought, Sand Stream) créent des archétypes
            d'équipe entiers. Un seul talent qui change la météo en entrant définit le tempo de tout le match.
          </p>
        </div>
      </div>
    </div>
  );
}
