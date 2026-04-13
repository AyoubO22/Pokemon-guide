import { useState } from 'react'
import { TEAM_ROLES, TEAM_ARCHETYPES } from '../data/teambuilding'
import { JargonText } from '../components/Tooltip'

export function TeamSection() {
  const [view, setView] = useState<'roles' | 'archetypes' | 'checklist'>('roles');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Teambuilding</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
          Construire une équipe compétitive, c'est assembler 6 Pokémon qui couvrent mutuellement
          leurs faiblesses et remplissent des rôles complémentaires. C'est un puzzle stratégique.
        </p>
      </div>

      <div className="flex gap-2">
        {[
          { id: 'roles' as const, label: 'Rôles' },
          { id: 'archetypes' as const, label: 'Archétypes' },
          { id: 'checklist' as const, label: 'Checklist' },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-3 py-1.5 text-sm rounded font-medium ${view === v.id ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'roles' && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Chaque Pokémon dans ton équipe a un rôle. Un bon teambuilder commence par identifier quel rôle il manque.
          </p>
          <div className="grid gap-4">
            {TEAM_ROLES.map(role => (
              <div key={role.name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{role.icon}</span>
                  <h3 className="font-semibold text-zinc-100">{role.nameFr}</h3>
                  <span className="text-xs text-zinc-500">({role.name})</span>
                </div>
                <p className="text-sm text-zinc-400 mb-3"><JargonText>{role.description}</JargonText></p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {role.examples.map(ex => (
                    <span key={ex} className="text-xs bg-red-900/30 text-red-300 px-2 py-0.5 rounded">{ex}</span>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Ce qu'il faut chercher :</p>
                  <div className="text-xs text-zinc-400 space-y-0.5">
                    {role.whatToLookFor.map((tip, i) => (
                      <p key={i}>• {tip}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'archetypes' && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Les archétypes sont des philosophies d'équipe. Chaque archétype a sa propre façon de gagner et ses propres faiblesses.
          </p>
          <div className="grid gap-4">
            {TEAM_ARCHETYPES.map(arch => (
              <div key={arch.name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-zinc-100 mb-1">{arch.nameFr}</h3>
                <p className="text-sm text-zinc-400 mb-4"><JargonText>{arch.description}</JargonText></p>

                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs font-medium text-green-400 uppercase mb-1">Forces</p>
                    <div className="text-xs text-zinc-400 space-y-0.5">
                      {arch.strengths.map((s, i) => <p key={i}>+ {s}</p>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-red-400 uppercase mb-1">Faiblesses</p>
                    <div className="text-xs text-zinc-400 space-y-0.5">
                      {arch.weaknesses.map((w, i) => <p key={i}>- {w}</p>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-blue-400 uppercase mb-1">Pokémon clés</p>
                    <div className="flex flex-wrap gap-1">
                      {arch.keyPokemon.map(p => (
                        <span key={p} className="text-xs bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'checklist' && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Avant de jouer ton équipe en ladder, vérifie cette checklist. Si tu coches tout, ton équipe est solide.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
            <h3 className="font-semibold text-zinc-200">Checklist du Teambuilder</h3>

            {[
              { title: "Hazard control", desc: "As-tu un poseur de Stealth Rock ET un moyen de retirer les hazards adverses (Defog/Rapid Spin) ?" },
              { title: "Speed control", desc: "As-tu au moins un Pokémon plus rapide que les menaces du metagame ? (Scarf, priority, ou base 100+)" },
              { title: "Couverture typique", desc: "Peux-tu toucher chaque type en super efficace ? Pas de type qui te mure complètement ?" },
              { title: "Équilibre physique/spécial", desc: "As-tu des attaquants physiques ET spéciaux ? Sinon un mur peut tout bloquer." },
              { title: "Gestion des menaces", desc: "Pour chaque top threat du metagame, as-tu un check (Pokémon qui peut entrer et le menacer) ?" },
              { title: "Win condition claire", desc: "Comment gagnes-tu ? Quel Pokémon est ton sweeper principal quand l'équipe adverse est affaiblie ?" },
              { title: "Résistance aux statuts", desc: "As-tu un moyen de gérer Toxic stall ? Un status absorber ou un cleric ?" },
              { title: "Switch-ins", desc: "Chaque Pokémon a-t-il au moins 1-2 switchs sûrs dans l'équipe ? Personne ne doit être coincé." },
              { title: "Synergie défensive", desc: "Les faiblesses d'un Pokémon sont-elles couvertes par les résistances d'un autre ? (FWG core, etc.)" },
              { title: "Pas de faiblesse commune x4", desc: "Si 3+ de tes Pokémon sont faibles au même type, c'est un problème." },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-6 h-6 shrink-0 rounded border border-zinc-700 flex items-center justify-center text-xs text-zinc-600 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">{item.title}</p>
                  <p className="text-xs text-zinc-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Cores */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-200 mb-3">Cores Classiques (combos de 2-3 Pokémon)</h3>
            <div className="text-sm text-zinc-400 space-y-2">
              <p><strong className="text-zinc-200">FWG (Feu/Eau/Plante)</strong> — La trinité défensive. Chacun résiste aux faiblesses des autres. Ex: Heatran + Toxapex + Ferrothorn.</p>
              <p><strong className="text-zinc-200">Dragon + Steel + Fairy</strong> — Le triangle offensif parfait en Gen 6+. Les 3 se couvrent mutuellement.</p>
              <p><strong className="text-zinc-200">Regenerator Core</strong> — 2-3 Pokémon Regenerator qui pivotent sans fin. Ex: Slowbro + Tornadus-T + Tangrowth. Quasi impossible à user.</p>
              <p><strong className="text-zinc-200">VoltTurn</strong> — 2+ Pokémon avec Volt Switch/U-turn. Maintient le momentum constant. L'adversaire ne peut jamais se poser.</p>
              <p><strong className="text-zinc-200">Weather + Abuser</strong> — Pelipper + Barraskewda (Rain). Torkoal + Venusaur (Sun). Le setter active le talent de l'abuser.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
