import { useState } from 'react'
import { TYPES, TYPE_COLORS, getDualTypeDefense, NOTABLE_TYPE_COMBOS, TERA_STRATEGIES } from '../data/types'

function TypeBadge({ name, small, onClick }: { name: string; small?: boolean; onClick?: () => void }) {
  const color = TYPE_COLORS[name] || '#888';
  const frName = TYPES.find(t => t.name === name)?.nameFr || name;
  return (
    <span
      onClick={onClick}
      className={`inline-block rounded font-medium text-white cursor-default ${small ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'} ${onClick ? 'cursor-pointer hover:brightness-110' : ''}`}
      style={{ backgroundColor: color }}
    >
      {frName}
    </span>
  );
}

export function TypesSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [dualType1, setDualType1] = useState("Dragon");
  const [dualType2, setDualType2] = useState<string | null>("Flying");
  const [view, setView] = useState<'single' | 'dual' | 'combos' | 'tera'>('single');

  const selectedType = TYPES.find(t => t.name === selected);
  const dualDefense = getDualTypeDefense(dualType1, dualType2);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Système de Types</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
          Le système de types est la base absolue de tout combat Pokémon. 18 types, chacun avec ses forces et faiblesses.
          Les interactions Super Efficace (x2), Pas Très Efficace (x0.5) et Immunité (x0) déterminent chaque décision.
          Un Pokémon bi-type cumule : Dragon/Vol faible à Glace = x4 dégâts!
        </p>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'single' as const, label: 'Mono-Type' },
          { id: 'dual' as const, label: 'Calculateur Bi-Type' },
          { id: 'combos' as const, label: 'Combos Défensifs' },
          { id: 'tera' as const, label: 'Téracristallisation' },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-3 py-1.5 text-sm rounded font-medium transition ${view === v.id ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* STAB explanation */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="font-semibold text-red-400 mb-2">STAB — Same Type Attack Bonus (x1.5)</h3>
        <p className="text-zinc-400 text-sm">
          Un Pokémon Feu utilisant Lance-Flammes (Feu) : 90 × 1.5 = <strong className="text-zinc-200">135</strong> puissance effective.
          Le STAB est le premier multiplicateur à considérer. Le talent <strong className="text-zinc-200">Adaptabilité</strong> pousse le STAB à x2.0.
          En Gen 9, la <strong className="text-zinc-200">Téracristallisation</strong> dans le même type que le STAB existant donne un STAB de x2.0 (ou x2.25 avec Tera + type original).
        </p>
      </div>

      {/* === SINGLE TYPE VIEW === */}
      {view === 'single' && (
        <>
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-3">Sélectionne un type :</h3>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(t => (
                <button
                  key={t.name}
                  onClick={() => setSelected(selected === t.name ? null : t.name)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold text-white transition-all ${selected === t.name ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950 scale-105' : 'opacity-75 hover:opacity-100'}`}
                  style={{ backgroundColor: t.color }}
                >
                  {t.nameFr}
                </button>
              ))}
            </div>
          </div>

          {selectedType && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <TypeBadge name={selectedType.name} />
                <span className="text-lg font-bold">{selectedType.nameFr}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wide">En Attaque (offensif)</h4>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Super Efficace (x2) contre :</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedType.superEffective.length > 0
                        ? selectedType.superEffective.map(t => <TypeBadge key={t} name={t} small />)
                        : <span className="text-xs text-zinc-600 italic">Aucun type</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Pas Très Efficace (x0.5) contre :</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedType.notVeryEffective.length > 0
                        ? selectedType.notVeryEffective.map(t => <TypeBadge key={t} name={t} small />)
                        : <span className="text-xs text-zinc-600 italic">Aucun type</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Aucun Effet (x0) contre :</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedType.noEffect.length > 0
                        ? selectedType.noEffect.map(t => <TypeBadge key={t} name={t} small />)
                        : <span className="text-xs text-zinc-600 italic">Aucun type</span>}
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 rounded p-2 text-xs text-zinc-400">
                    Coverage : touche <strong className="text-zinc-200">{selectedType.superEffective.length}</strong> types en SE,
                    bloqué par <strong className="text-zinc-200">{selectedType.notVeryEffective.length + selectedType.noEffect.length}</strong> types.
                    {selectedType.superEffective.length >= 4 && " Excellent coverage offensif!"}
                    {selectedType.noEffect.length > 0 && " Attention à l'immunité!"}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">En Défense</h4>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Faible (x2) à :</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedType.weakTo.length > 0
                        ? selectedType.weakTo.map(t => <TypeBadge key={t} name={t} small />)
                        : <span className="text-xs text-zinc-600 italic">Aucun type</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Résiste (x0.5) à :</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedType.resistantTo.length > 0
                        ? selectedType.resistantTo.map(t => <TypeBadge key={t} name={t} small />)
                        : <span className="text-xs text-zinc-600 italic">Aucun type</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Immunisé (x0) à :</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedType.immuneTo.length > 0
                        ? selectedType.immuneTo.map(t => <TypeBadge key={t} name={t} small />)
                        : <span className="text-xs text-zinc-600 italic">Aucun type</span>}
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 rounded p-2 text-xs text-zinc-400">
                    Score défensif : <strong className="text-zinc-200">{selectedType.resistantTo.length + selectedType.immuneTo.length}</strong> résist./immun.
                    vs <strong className="text-zinc-200">{selectedType.weakTo.length}</strong> faiblesses.
                    {selectedType.resistantTo.length >= 6 && " Excellent typing défensif!"}
                    {selectedType.weakTo.length >= 4 && " Attention, beaucoup de faiblesses!"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full chart */}
          <button onClick={() => setShowChart(!showChart)} className="text-sm text-red-400 hover:text-red-300 underline">
            {showChart ? "Masquer" : "Afficher"} le tableau complet 18x18
          </button>

          {showChart && (
            <div className="overflow-x-auto">
              <table className="text-[10px] border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="p-1.5 text-zinc-500 text-left text-[9px]">ATQ ↓ / DEF →</th>
                    {TYPES.map(t => (
                      <th key={t.name} className="p-1.5 text-white font-medium" style={{ backgroundColor: t.color }}>{t.nameFr.slice(0,3)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TYPES.map(atk => (
                    <tr key={atk.name}>
                      <td className="p-1.5 font-medium text-white whitespace-nowrap" style={{ backgroundColor: atk.color }}>{atk.nameFr.slice(0,3)}</td>
                      {TYPES.map(def => {
                        let mult = 1;
                        if (atk.superEffective.includes(def.name)) mult = 2;
                        else if (atk.notVeryEffective.includes(def.name)) mult = 0.5;
                        else if (atk.noEffect.includes(def.name)) mult = 0;
                        const bg = mult === 2 ? 'bg-green-900/60 text-green-300' : mult === 0.5 ? 'bg-red-900/40 text-red-400' : mult === 0 ? 'bg-zinc-900 text-zinc-700' : 'text-zinc-600';
                        return <td key={def.name} className={`p-1.5 text-center font-mono ${bg}`}>{mult === 1 ? '·' : mult === 0 ? '0' : mult === 0.5 ? '½' : '2'}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[10px] text-zinc-600 mt-1">Vert = Super Efficace (x2) · Rouge = Pas Très Efficace (x0.5) · 0 = Immunité</p>
            </div>
          )}
        </>
      )}

      {/* === DUAL TYPE CALCULATOR === */}
      {view === 'dual' && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Sélectionne un ou deux types pour voir les faiblesses et résistances combinées. Idéal pour évaluer un typing défensif.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-500 mb-2 block">Type 1</label>
              <div className="flex flex-wrap gap-1.5">
                {TYPES.map(t => (
                  <button key={t.name} onClick={() => setDualType1(t.name)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold text-white transition ${dualType1 === t.name ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-950' : 'opacity-60 hover:opacity-90'}`}
                    style={{ backgroundColor: t.color }}>{t.nameFr}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-2 block">Type 2 (optionnel)</label>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setDualType2(null)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold ${!dualType2 ? 'bg-zinc-600 text-white ring-2 ring-white ring-offset-1 ring-offset-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>Aucun</button>
                {TYPES.filter(t => t.name !== dualType1).map(t => (
                  <button key={t.name} onClick={() => setDualType2(t.name)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold text-white transition ${dualType2 === t.name ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-950' : 'opacity-60 hover:opacity-90'}`}
                    style={{ backgroundColor: t.color }}>{t.nameFr}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <div className="flex gap-2 items-center mb-4">
              <TypeBadge name={dualType1} />
              {dualType2 && <><span className="text-zinc-500">/</span><TypeBadge name={dualType2} /></>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { label: "x4 (Double faiblesse)", mult: 4, color: "text-red-400 bg-red-900/30" },
                { label: "x2 (Faiblesse)", mult: 2, color: "text-orange-400 bg-orange-900/30" },
                { label: "x0.5 (Résistance)", mult: 0.5, color: "text-green-400 bg-green-900/30" },
                { label: "x0.25 (Double résist.)", mult: 0.25, color: "text-emerald-400 bg-emerald-900/30" },
              ].map(group => {
                const matching = TYPES.filter(t => dualDefense[t.name] === group.mult);
                return (
                  <div key={group.mult} className={`rounded-lg p-3 ${group.color.split(' ')[1]}`}>
                    <p className={`text-xs font-medium mb-1.5 ${group.color.split(' ')[0]}`}>{group.label}</p>
                    <div className="flex flex-wrap gap-1">
                      {matching.length > 0 ? matching.map(t => <TypeBadge key={t.name} name={t.name} small />) : <span className="text-xs text-zinc-600">—</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800/50 rounded p-3">
                <p className="text-xs text-zinc-500 mb-1">Immunités (x0)</p>
                <div className="flex flex-wrap gap-1">
                  {TYPES.filter(t => dualDefense[t.name] === 0).length > 0
                    ? TYPES.filter(t => dualDefense[t.name] === 0).map(t => <TypeBadge key={t.name} name={t.name} small />)
                    : <span className="text-xs text-zinc-600">Aucune</span>}
                </div>
              </div>
              <div className="bg-zinc-800/50 rounded p-3">
                <p className="text-xs text-zinc-500 mb-1">Neutre (x1)</p>
                <div className="flex flex-wrap gap-1">
                  {TYPES.filter(t => dualDefense[t.name] === 1).map(t => <TypeBadge key={t.name} name={t.name} small />)}
                </div>
              </div>
            </div>
            {/* Summary */}
            <div className="mt-4 p-3 bg-zinc-800/30 rounded text-xs text-zinc-400 flex gap-6 justify-center">
              <span>Faiblesses: <strong className="text-red-400">{TYPES.filter(t => dualDefense[t.name] > 1).length}</strong></span>
              <span>Résistances: <strong className="text-green-400">{TYPES.filter(t => dualDefense[t.name] > 0 && dualDefense[t.name] < 1).length}</strong></span>
              <span>Immunités: <strong className="text-blue-400">{TYPES.filter(t => dualDefense[t.name] === 0).length}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* === TYPE COMBOS === */}
      {view === 'combos' && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">Les combinaisons de types les plus fortes défensivement en compétitif.</p>
          <div className="grid gap-3">
            {NOTABLE_TYPE_COMBOS.map((combo, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TypeBadge name={combo.types[0]} />
                  <span className="text-zinc-500 text-xs">/</span>
                  <TypeBadge name={combo.types[1]} />
                  <span className="text-xs text-zinc-500 ml-2">{combo.examples}</span>
                  <div className="ml-auto flex gap-2 text-[10px]">
                    <span className="text-green-400">{combo.resistances}R</span>
                    <span className="text-red-400">{combo.weaknesses}W</span>
                    <span className="text-blue-400">{combo.immunities}I</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-400">{combo.strengths}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === TERA TYPES === */}
      {view === 'tera' && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-200 mb-2">Téracristallisation (Gen 9)</h3>
            <p className="text-sm text-zinc-400">
              La Tera change le type de ton Pokémon en combat (1 fois par match). C'est la mécanique de mind-game la plus profonde
              de l'histoire Pokémon. Un Garchomp peut devenir type Fée pour être immunisé aux attaques Dragon qu'on lui envoie.
              Le STAB Tera fonctionne ainsi : si tu Tera dans un type que tu avais déjà → STAB x2.0. Si tu Tera dans un nouveau type → STAB normal x1.5 pour le nouveau type.
            </p>
          </div>
          <div className="grid gap-3">
            {TERA_STRATEGIES.map(tera => (
              <div key={tera.type} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TypeBadge name={tera.type} />
                  <span className="font-semibold text-zinc-200 text-sm">Tera {TYPES.find(t => t.name === tera.type)?.nameFr}</span>
                </div>
                <div className="grid md:grid-cols-2 gap-3 mb-2">
                  <div>
                    <p className="text-xs text-green-400 font-medium mb-0.5">Usage offensif</p>
                    <p className="text-xs text-zinc-400">{tera.offensiveUse}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-400 font-medium mb-0.5">Usage défensif</p>
                    <p className="text-xs text-zinc-400">{tera.defensiveUse}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tera.bestUsers.map(u => <span key={u} className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">{u}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
