import { useState } from 'react'
import { ADVANCED_MECHANICS, SPEED_CONTROL_METHODS } from '../data/mechanics'
import { JargonText } from '../components/Tooltip'

const CATEGORIES = ["Tous", "Météo", "Terrain", "Mécanique de Combat", "Doubles/VGC"];

export function MechanicsSection() {
  const [catFilter, setCatFilter] = useState("Tous");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<'mechanics' | 'speed' | 'priority'>('mechanics');

  const filtered = ADVANCED_MECHANICS.filter(m => catFilter === "Tous" || m.category === catFilter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Mécaniques Avancées</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
          Au-delà des bases, le compétitif repose sur des mécaniques profondes : météo, terrains, momentum, prédictions, speed control.
          Maîtriser ces concepts transforme un joueur moyen en joueur compétitif.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'mechanics' as const, label: 'Mécaniques' },
          { id: 'speed' as const, label: 'Speed Control' },
          { id: 'priority' as const, label: 'Ordre de Priorité' },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-3 py-1.5 text-sm rounded font-medium ${view === v.id ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'mechanics' && (
        <>
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-2.5 py-1 text-xs rounded ${catFilter === c ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="grid gap-3">
            {filtered.map(mech => (
              <div key={mech.name}
                className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setExpanded(expanded === mech.name ? null : mech.name)}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">{mech.category}</span>
                    <h4 className="font-semibold text-zinc-100">{mech.nameFr}</h4>
                    <span className="text-xs text-zinc-500">({mech.name})</span>
                    <span className="ml-auto text-xs text-zinc-600">{expanded === mech.name ? '▲' : '▼'}</span>
                  </div>
                  <p className="text-sm text-zinc-400"><JargonText>{mech.description}</JargonText></p>
                </div>
                {expanded === mech.name && (
                  <div className="border-t border-zinc-800 p-4 bg-zinc-900/50 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-yellow-400 uppercase mb-1">Impact Compétitif</p>
                      <p className="text-sm text-zinc-300"><JargonText>{mech.competitiveImpact}</JargonText></p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-400 uppercase mb-1">Exemples concrets</p>
                      <div className="space-y-1">
                        {mech.examples.map((ex, i) => (
                          <p key={i} className="text-xs text-zinc-400 flex gap-2">
                            <span className="text-blue-400/50 shrink-0">▸</span>
                            {ex}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'speed' && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Le speed control détermine qui frappe en premier. C'est la ressource la plus importante du jeu,
            surtout en Doubles/VGC. Voici toutes les méthodes pour contrôler la vitesse.
          </p>
          <div className="grid gap-3">
            {SPEED_CONTROL_METHODS.map(method => (
              <div key={method.name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-semibold text-zinc-100 text-sm">{method.nameFr}</h4>
                  <span className="text-xs text-zinc-500">({method.name})</span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">{method.format}</span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">{method.duration}</span>
                </div>
                <p className="text-sm text-zinc-400 mb-2"><JargonText>{method.effect}</JargonText></p>
                <div className="flex flex-wrap gap-1">
                  {method.keyUsers.map(u => <span key={u} className="text-[10px] bg-red-900/30 text-red-300 px-1.5 py-0.5 rounded">{u}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'priority' && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Chaque action a un niveau de priorité. Le Pokémon le plus rapide agit en premier SEULEMENT au même niveau de priorité.
            Un move +1 priorité battra TOUJOURS un move +0, peu importe la vitesse.
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <h3 className="font-semibold text-zinc-200 mb-3">Échelle de Priorité Complète</h3>
            {[
              { prio: "+5", moves: "Helping Hand", desc: "VGC uniquement. Boost les dégâts du partenaire de 50%." },
              { prio: "+4", moves: "Protect, Detect, King's Shield, Baneful Bunker, Spiky Shield", desc: "Les moves de protection. Bloquent quasi tout." },
              { prio: "+3", moves: "Fake Out, Wide Guard, Quick Guard, Crafty Shield", desc: "Fake Out = flinch garanti Tour 1. Wide Guard bloque les spread moves." },
              { prio: "+2", moves: "Extreme Speed, First Impression, Feint", desc: "Extreme Speed bat les autres priorités. First Impression = Tour 1 seulement." },
              { prio: "+1", moves: "Bullet Punch, Mach Punch, Aqua Jet, Ice Shard, Shadow Sneak, Sucker Punch, Quick Attack, Accelerock, Grassy Glide (terrain), Water Shuriken", desc: "Les priority moves standard. Le pain quotidien du revenge killing." },
              { prio: "0", moves: "TOUTES les attaques normales et moves de statut", desc: "La grande majorité des moves. Ordre déterminé par la Vitesse." },
              { prio: "-1", moves: "Vital Throw", desc: "Rare." },
              { prio: "-2", moves: "—", desc: "—" },
              { prio: "-3", moves: "Focus Punch", desc: "Échoue si touché avant de frapper. Très risqué." },
              { prio: "-5", moves: "Counter, Mirror Coat", desc: "Renvoie les dégâts subis. Doit encaisser le coup d'abord." },
              { prio: "-6", moves: "Teleport, Parting Shot, Whirlwind, Roar, Circle Throw, Dragon Tail", desc: "Slow pivots et phazing. Teleport = pivot parfait car entre en sécurité." },
              { prio: "-7", moves: "Trick Room", desc: "Trick Room a -7 pour que le setter puisse agir AVANT le Trick Room ne s'active." },
            ].map(row => (
              <div key={row.prio} className={`flex gap-3 py-2 border-b border-zinc-800/50 ${row.prio === "0" ? 'bg-zinc-800/20' : ''}`}>
                <span className={`font-mono text-sm w-8 shrink-0 text-right ${+row.prio > 0 ? 'text-green-400' : +row.prio < 0 ? 'text-red-400' : 'text-zinc-500'}`}>
                  {row.prio}
                </span>
                <div className="flex-1">
                  <p className="text-xs text-zinc-200 font-medium">{row.moves}</p>
                  <p className="text-xs text-zinc-500">{row.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-200 mb-2">Prankster (+1 aux moves de statut)</h3>
            <p className="text-sm text-zinc-400">
              Le talent Farceur (Prankster) donne +1 priorité à tous les moves de statut. Thunder Wave, Taunt, Will-O-Wisp
              passent en priorité +1. MAIS : ne fonctionne pas contre les types Ténèbres (immunité ajoutée en Gen 7).
              C'est pourquoi les types Dark sont très valorisés — ils ignorent le Prankster.
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {["Whimsicott", "Grimmsnarl", "Sableye", "Thundurus", "Klefki", "Murkrow"].map(p =>
                <span key={p} className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">{p}</span>
              )}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-200 mb-2">Speed Ties & Turn Order Complet</h3>
            <p className="text-sm text-zinc-400 mb-2">
              L'ordre exact d'un tour Pokémon est :
            </p>
            <div className="text-sm text-zinc-400 space-y-1">
              <p>1. <strong className="text-zinc-200">Mega Evolution / Primal Reversion</strong> (se résout avant les moves)</p>
              <p>2. <strong className="text-zinc-200">Switches</strong> (tous les switchs se résolvent d'abord)</p>
              <p>3. <strong className="text-zinc-200">Moves par priorité</strong> (du + haut au + bas)</p>
              <p>4. <strong className="text-zinc-200">À priorité égale → par Vitesse</strong> (Trick Room inverse)</p>
              <p>5. <strong className="text-zinc-200">Speed tie → aléatoire 50/50</strong></p>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Important : le switch se résout AVANT les attaques. Si tu switches et l'adversaire attaque, le switch-in prend le coup.
              C'est pourquoi prédire les switchs est si crucial.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
