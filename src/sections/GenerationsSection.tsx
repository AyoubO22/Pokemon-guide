import { useState } from 'react'
import { GENERATIONS } from '../data/generations'
import { JargonText } from '../components/Tooltip'

export function GenerationsSection() {
  const [selectedGen, setSelectedGen] = useState(9);
  const gen = GENERATIONS.find(g => g.num === selectedGen)!;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Les Générations</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
          Chaque génération a introduit des mécaniques qui ont redéfini le jeu compétitif.
          Comprendre l'évolution du metagame t'aide à saisir pourquoi certaines règles existent aujourd'hui.
        </p>
      </div>

      {/* Gen selector */}
      <div className="flex gap-2 flex-wrap">
        {GENERATIONS.map(g => (
          <button
            key={g.num}
            onClick={() => setSelectedGen(g.num)}
            className={`px-3 py-2 rounded text-sm font-medium transition-all ${
              selectedGen === g.num
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="font-bold">Gen {g.num}</span>
            <span className="text-xs ml-1 opacity-70">{g.year}</span>
          </button>
        ))}
      </div>

      {/* Selected gen detail */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-bold text-zinc-100">{gen.name}</h3>
            <span className="text-sm text-zinc-500">({gen.year})</span>
          </div>
          <p className="text-sm text-zinc-400">
            {gen.games} — Région de {gen.region}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            +{gen.newPokemon} nouveaux Pokémon (total: {gen.totalPokemon})
          </p>
        </div>

        {/* Key mechanics */}
        <div>
          <h4 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide mb-2">Mécaniques Clés</h4>
          <div className="space-y-2">
            {gen.keyMechanics.map((m, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-yellow-400/50 text-xs mt-0.5">▸</span>
                <p className="text-sm text-zinc-300">{m}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Meta defining */}
        <div>
          <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-2">Pokémon qui définissent le méta</h4>
          <div className="flex flex-wrap gap-2">
            {gen.metaDefining.map(p => (
              <span key={p} className="text-sm bg-red-900/30 text-red-300 px-3 py-1 rounded">{p}</span>
            ))}
          </div>
        </div>

        {/* Competitive notes */}
        <div>
          <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-2">Analyse Compétitive</h4>
          <p className="text-sm text-zinc-300 leading-relaxed"><JargonText>{gen.competitiveNotes}</JargonText></p>
        </div>
      </div>

      {/* Formats explanation */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="font-semibold text-zinc-200 mb-3">Les Formats Compétitifs</h3>
        <div className="text-sm text-zinc-400 space-y-3">
          <p>
            <strong className="text-zinc-200">Smogon (Singles, fan-made)</strong> — La plus grande communauté compétitive.
            Tiers basés sur l'usage : <strong>Ubers</strong> (les plus forts/bannis), <strong>OU</strong> (OverUsed, le tier principal),
            <strong> UU</strong> (UnderUsed), <strong>RU</strong> (RarelyUsed), <strong>NU</strong> (NeverUsed), <strong>PU</strong>.
            Chaque tier a sa banlist. Un Pokémon trop fort en UU monte en OU. Joué sur <strong>Pokémon Showdown</strong> (simulateur gratuit en ligne).
          </p>
          <p>
            <strong className="text-zinc-200">VGC (Doubles, officiel Nintendo)</strong> — Le format officiel des tournois Pokémon.
            Doubles (2v2), équipe de 6 mais on en choisit 4 par match. Pas de tier Smogon, mais une banlist officielle.
            Dynamax, Mégas et Tera sont autorisés quand ils existent. Les Worlds sont le sommet.
          </p>
          <p>
            <strong className="text-zinc-200">BSS (Battle Stadium Singles)</strong> — Le format Singles officiel Nintendo.
            Équipe de 6, on en choisit 3 par match. Règles de cartouche.
          </p>
          <p>
            <strong className="text-zinc-200">Pokémon Showdown</strong> — pokemonshowdown.com. LE simulateur gratuit.
            Tu peux créer n'importe quelle équipe instantanément et jouer en ladder. C'est là que tout le monde s'entraîne.
            Indispensable pour progresser.
          </p>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="font-semibold text-zinc-200 mb-3">Ressources Essentielles</h3>
        <div className="text-sm text-zinc-400 space-y-2">
          <p><strong className="text-zinc-200">Pokémon Showdown</strong> — Simulateur en ligne gratuit. Crée des teams et joue instantanément.</p>
          <p><strong className="text-zinc-200">Smogon.com</strong> — Analyses détaillées de chaque Pokémon avec sets recommandés.</p>
          <p><strong className="text-zinc-200">Pikalytics.com</strong> — Statistiques d'usage VGC. Quels Pokémon sont joués, quels moves, quels items.</p>
          <p><strong className="text-zinc-200">Bulbapedia</strong> — L'encyclopédie Pokémon pour les données brutes.</p>
          <p><strong className="text-zinc-200">Victory Road (YouTube/Discord)</strong> — Communauté VGC francophone et anglophone.</p>
          <p><strong className="text-zinc-200">Damage Calculator</strong> — calc.pokemonshowdown.com. Calcule les dégâts exacts entre 2 Pokémon.</p>
        </div>
      </div>
    </div>
  );
}
