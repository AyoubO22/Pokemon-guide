import { useState } from 'react'
import { STATUS_CONDITIONS, VOLATILE_STATUSES } from '../data/status'
import { JargonText } from '../components/Tooltip'

export function StatusSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Conditions de Statut</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
          Les statuts sont divisés en deux catégories : les <strong className="text-zinc-200">statuts principaux</strong> (un seul à la fois, persistent au switch)
          et les <strong className="text-zinc-200">statuts volatils</strong> (multiples possibles, disparaissent au switch).
          Comprendre quand infliger quel statut et comment s'en protéger est essentiel en compétitif.
        </p>
      </div>

      {/* Primary statuses */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-zinc-200">Statuts Principaux (Non-Volatile)</h3>
        <p className="text-xs text-zinc-500 mb-4">Un seul à la fois. Persistent quand le Pokémon switch. C'est pourquoi brûler un attaquant physique est si puissant — ça reste.</p>
        <div className="grid gap-4">
          {STATUS_CONDITIONS.map(status => (
            <div
              key={status.name}
              className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setExpanded(expanded === status.name ? null : status.name)}
            >
              <div className="p-4 flex items-start gap-3">
                <span className="text-2xl" style={{ color: status.color }}>{status.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-zinc-100">{status.nameFr}</h4>
                    <span className="text-xs text-zinc-500">({status.name})</span>
                    <span className="text-xs ml-auto text-zinc-600">{expanded === status.name ? '▲' : '▼'}</span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: status.color }}>{status.effect}</p>
                </div>
              </div>

              {expanded === status.name && (
                <div className="border-t border-zinc-800 p-4 space-y-3 bg-zinc-900/50">
                  <div>
                    <p className="text-xs font-medium text-zinc-400 uppercase mb-1">Usage compétitif</p>
                    <p className="text-sm text-zinc-300"><JargonText>{status.competitiveUse}</JargonText></p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-400 uppercase mb-1">Moves clés</p>
                    <div className="flex flex-wrap gap-1">
                      {status.keyMoves.map(m => (
                        <span key={m} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">{m}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-400 uppercase mb-1">Contre-mesures</p>
                    <div className="flex flex-wrap gap-1">
                      {status.counters.map(c => (
                        <span key={c} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Volatile statuses */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-zinc-200">Statuts Volatils & Moves de Contrôle</h3>
        <p className="text-xs text-zinc-500 mb-4">Disparaissent au switch. Peuvent se cumuler. Beaucoup sont des moves de contrôle plutôt que des "statuts" classiques.</p>
        <div className="grid md:grid-cols-2 gap-3">
          {VOLATILE_STATUSES.map(vs => (
            <div key={vs.name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-zinc-200 text-sm">{vs.nameFr}</h4>
                <span className="text-xs text-zinc-500">({vs.name})</span>
              </div>
              <p className="text-sm text-zinc-400"><JargonText>{vs.effect}</JargonText></p>
            </div>
          ))}
        </div>
      </div>

      {/* Status strategy */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="font-semibold text-zinc-200 mb-3">Philosophie des Statuts en Compétitif</h3>
        <div className="text-sm text-zinc-400 space-y-3">
          <p>
            <strong className="text-zinc-200">Règle d'or :</strong> Si l'adversaire est un attaquant physique → brûle-le.
            Si c'est un tank/stall → empoisonne-le (Toxic). Si c'est un sweeper rapide → paralyse-le.
            Si c'est une menace immédiate → endors-le.
          </p>
          <p>
            <strong className="text-zinc-200">Status absorbers :</strong> Certains Pokémon VEULENT être statués. Conkeldurr (Guts)
            veut la brûlure. Gliscor (Poison Heal) veut le poison. Restalk sets utilisent le sommeil volontaire.
            Un bon joueur sait qui envoyer pour "absorber" un status avant qu'il touche un allié vulnérable.
          </p>
          <p>
            <strong className="text-zinc-200">Heal Bell / Aromatherapy :</strong> Ces moves soignent TOUS les statuts de l'équipe.
            Un cleric (soigneur d'équipe) comme Blissey ou Clefable peut neutraliser toute la stratégie de statuts adverse.
          </p>
        </div>
      </div>
    </div>
  );
}
