import { useState } from 'react'
import { MOVE_CATEGORIES } from '../data/moves'
import { TYPE_COLORS } from '../data/types'
import { JargonText } from '../components/Tooltip'

function TypeBadge({ name }: { name: string }) {
  return (
    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
      style={{ backgroundColor: TYPE_COLORS[name] || '#888' }}>
      {name}
    </span>
  );
}

export function MovesSection() {
  const [openCat, setOpenCat] = useState<string>(MOVE_CATEGORIES[0].name);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Attaques Compétitives</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
          Sur les 900+ attaques du jeu, une poignée dominent le métagame. Ici on couvre les catégories
          stratégiques essentielles : hazards, pivoting, priority, setup. Comprendre ces catégories
          c'est comprendre 80% de la stratégie Pokémon.
        </p>
      </div>

      {/* Physical vs Special vs Status */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-semibold text-orange-400 mb-2">Physique</h3>
          <p className="text-sm text-zinc-400">
            Utilise la stat <strong className="text-zinc-200">Attaque</strong> de l'utilisateur vs la <strong className="text-zinc-200">Défense</strong> de la cible.
            Affecté par la brûlure (-50%). Contact physique = déclenche Rocky Helmet, Flame Body, etc.
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-400 mb-2">Spécial</h3>
          <p className="text-sm text-zinc-400">
            Utilise <strong className="text-zinc-200">Atq. Spé.</strong> vs <strong className="text-zinc-200">Déf. Spé.</strong>
            Pas affecté par la brûlure. Pas de contact (sauf exceptions). Avant Gen 4, le type déterminait la catégorie.
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-semibold text-zinc-400 mb-2">Statut</h3>
          <p className="text-sm text-zinc-400">
            Pas de dégâts directs. Setup, statuts, hazards, recovery. Bloqué par <strong className="text-zinc-200">Taunt</strong>.
            Les moves de statut sont ce qui sépare le jeu compétitif du jeu casual.
          </p>
        </div>
      </div>

      {/* Move damage formula */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="font-semibold text-zinc-200 mb-2">Formule de Dégâts (simplifiée)</h3>
        <p className="text-sm text-zinc-400 mb-2">
          Dégâts = ((2×Niveau/5 + 2) × Puissance × Atq/Déf) / 50 + 2) × Modificateurs
        </p>
        <p className="text-xs text-zinc-500">
          Modificateurs : STAB (×1.5) × Type efficacité (×0.5/1/2/4) × Objet × Talent × Météo × Critique (×1.5) × Random (×0.85-1.0)
        </p>
      </div>

      {/* Category navigation */}
      <div className="flex flex-wrap gap-2">
        {MOVE_CATEGORIES.map(cat => (
          <button
            key={cat.name}
            onClick={() => setOpenCat(cat.name)}
            className={`px-3 py-1.5 text-xs rounded font-medium transition-colors ${
              openCat === cat.name ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {cat.nameFr}
          </button>
        ))}
      </div>

      {/* Selected category */}
      {MOVE_CATEGORIES.filter(c => c.name === openCat).map(cat => (
        <div key={cat.name} className="space-y-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-zinc-200 mb-1">{cat.nameFr}</h3>
            <p className="text-sm text-zinc-400">{cat.description}</p>
          </div>

          <div className="grid gap-3">
            {cat.moves.map(move => (
              <div key={move.name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <TypeBadge name={move.type} />
                  <h4 className="font-semibold text-zinc-100">{move.nameFr}</h4>
                  <span className="text-xs text-zinc-500">({move.name})</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    move.category === 'Physical' ? 'bg-orange-900/40 text-orange-400' :
                    move.category === 'Special' ? 'bg-blue-900/40 text-blue-400' :
                    'bg-zinc-800 text-zinc-500'
                  }`}>
                    {move.category}
                  </span>
                  <div className="ml-auto flex gap-3 text-xs text-zinc-500">
                    {move.power && <span>Puissance: <strong className="text-zinc-300">{move.power}</strong></span>}
                    {move.accuracy && <span>Précision: <strong className="text-zinc-300">{move.accuracy}%</strong></span>}
                    <span>PP: {move.pp}</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 mb-1"><JargonText>{move.effect}</JargonText></p>
                <p className="text-xs text-zinc-500 italic"><JargonText>{move.competitiveNotes}</JargonText></p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Moveset building tips */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="font-semibold text-zinc-200 mb-3">Construire un Moveset — Les Règles</h3>
        <div className="text-sm text-zinc-400 space-y-2">
          <p><strong className="text-zinc-200">4 moves max.</strong> C'est la contrainte fondamentale. Chaque slot est précieux.</p>
          <p><strong className="text-zinc-200">STAB + Coverage.</strong> En général : 1-2 STAB moves + 1-2 coverage moves pour toucher ce qui résiste aux STAB.</p>
          <p><strong className="text-zinc-200">Utility slot.</strong> Le 4ème slot est souvent un move de statut : Stealth Rock, Toxic, Will-O-Wisp, Recover, ou un move de setup.</p>
          <p><strong className="text-zinc-200">Pas de redondance.</strong> 2 moves du même type qui touchent les mêmes cibles = gaspillage d'un slot.</p>
          <p><strong className="text-zinc-200">Pense au metagame.</strong> Ton coverage doit toucher les Pokémon populaires. Si Heatran est partout → Ground coverage. Si Toxapex est partout → Psychic ou Ground.</p>
        </div>
      </div>
    </div>
  );
}
