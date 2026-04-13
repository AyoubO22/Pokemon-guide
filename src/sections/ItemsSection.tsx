import { useState } from 'react'
import { COMPETITIVE_ITEMS } from '../data/items'
import { JargonText } from '../components/Tooltip'

const TIER_COLORS = { S: 'text-yellow-400 bg-yellow-400/10', A: 'text-blue-400 bg-blue-400/10', B: 'text-green-400 bg-green-400/10', C: 'text-zinc-400 bg-zinc-400/10' };
// Categories are derived dynamically from data

export function ItemsSection() {
  const [catFilter, setCatFilter] = useState("Tous");
  const filtered = COMPETITIVE_ITEMS.filter(i => catFilter === "Tous" || i.category === catFilter);

  const uniqueCats = ["Tous", ...Array.from(new Set(COMPETITIVE_ITEMS.map(i => i.category)))];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Objets Compétitifs</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
          Chaque Pokémon tient UN objet. Le choix de l'objet est aussi important que le moveset.
          En compétitif, tu ne verras quasiment que les objets listés ici — les 99% du métagame.
          La règle d'or : <strong className="text-zinc-200">pas deux Pokémon avec le même objet</strong> dans une équipe (Item Clause en VGC).
        </p>
      </div>

      {/* Choice items explained */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="font-semibold text-red-400 mb-2">Les Choice Items — Le concept à maîtriser</h3>
        <p className="text-sm text-zinc-400">
          Band (+50% Atq), Specs (+50% Atq.Spé) et Scarf (+50% Vitesse) sont les objets les plus impactants du jeu.
          Le trade-off : tu es <strong className="text-zinc-200">bloqué sur la première attaque choisie</strong> jusqu'à ce que tu switches.
          Cela crée un mind game fondamental : l'adversaire doit prédire quelle attaque tu vas lock, et toi tu dois
          prédire son switch. C'est le cœur du jeu compétitif en singles. Astuce : Trick/Switcheroo peut donner ton Choice item
          à l'adversaire pour le bloquer.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1 mb-2">
        {uniqueCats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-2.5 py-1 text-xs rounded ${catFilter === c ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid gap-3">
        {filtered.map(item => (
          <div key={item.name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex gap-4 items-start">
            <span className={`text-xs font-bold px-2 py-1 rounded shrink-0 ${TIER_COLORS[item.tier]}`}>
              {item.tier}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-zinc-100">{item.nameFr}</h4>
                <span className="text-xs text-zinc-500">({item.name})</span>
                <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">{item.category}</span>
              </div>
              <p className="text-sm text-zinc-400 mt-1"><JargonText>{item.effect}</JargonText></p>
            </div>
          </div>
        ))}
      </div>

      {/* Item combos */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="font-semibold text-zinc-200 mb-3">Combos Objet + Talent/Move emblématiques</h3>
        <div className="text-sm text-zinc-400 space-y-2">
          <p><strong className="text-zinc-200">Life Orb + Magic Guard</strong> — +30% dégâts SANS le recul de 10%. Alakazam, Clefable. Probablement le combo le plus fort.</p>
          <p><strong className="text-zinc-200">Life Orb + Sheer Force</strong> — Même principe. Les moves avec effets secondaires n'ont pas le recul. Nidoking.</p>
          <p><strong className="text-zinc-200">Flame Orb + Guts</strong> — La brûlure active +50% Attaque et empêche les autres statuts. Conkeldurr, Heracross.</p>
          <p><strong className="text-zinc-200">Toxic Orb + Poison Heal</strong> — Gliscor récupère 12.5% PV/tour au lieu de perdre des PV. Tank immortel.</p>
          <p><strong className="text-zinc-200">Eviolite + NFE Pokémon</strong> — Chansey (+ Eviolite) a une meilleure bulk spéciale que Blissey. Porygon2 est un tank monstre.</p>
          <p><strong className="text-zinc-200">Heavy-Duty Boots + Volcarona</strong> — Sans les boots, Volcarona perd 50% PV avec SR (4x faible Roche). Avec = viable.</p>
          <p><strong className="text-zinc-200">Weakness Policy + Bulk</strong> — Un Pokémon résistant qui survit un SE prend +2/+2. Dracovish, Dragonite avec Multiscale.</p>
        </div>
      </div>
    </div>
  );
}
