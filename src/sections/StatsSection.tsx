import { useState } from 'react'
import { NATURES, STAT_NAMES, STAT_NAMES_FR, COMMON_EV_SPREADS, calculateStat } from '../data/stats'

export function StatsSection() {
  const [calcBase, setCalcBase] = useState(100);
  const [calcIV, setCalcIV] = useState(31);
  const [calcEV, setCalcEV] = useState(252);
  const [calcLevel, setCalcLevel] = useState(100);
  const [calcNature, setCalcNature] = useState(1.0);
  const [calcIsHP, setCalcIsHP] = useState(false);
  const [natureFilter, setNatureFilter] = useState("");

  const finalStat = calculateStat(calcBase, calcIV, calcEV, calcLevel, calcNature, calcIsHP);

  const filteredNatures = NATURES.filter(n =>
    !natureFilter || n.plus === natureFilter || n.minus === natureFilter || (natureFilter === "neutral" && !n.plus)
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Stats, EVs, IVs & Natures</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
          Chaque Pokémon a 6 stats : PV, Attaque, Défense, Atq. Spé., Déf. Spé. et Vitesse.
          La stat finale dépend de la <strong className="text-zinc-200">Base Stat</strong> (fixe par espèce),
          des <strong className="text-zinc-200">IVs</strong> (génétique, 0-31),
          des <strong className="text-zinc-200">EVs</strong> (entraînement, 0-252 par stat, 510 total),
          et de la <strong className="text-zinc-200">Nature</strong> (+10%/-10%).
        </p>
      </div>

      {/* Base Stats explained */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-400 mb-2">Base Stats</h3>
          <p className="text-sm text-zinc-400">
            Fixées pour chaque espèce. Garchomp a 130 en Attaque, Blissey 255 en PV.
            C'est ce qui définit fondamentalement à quoi un Pokémon est bon.
            Rien ne peut changer les base stats.
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-400 mb-2">IVs (Individual Values)</h3>
          <p className="text-sm text-zinc-400">
            0 à 31 par stat. En compétitif, on vise toujours 31 partout (sauf cas spécifiques : 0 en Vitesse pour Trick Room,
            0 en Attaque pour un sweeper spécial afin de réduire les dégâts de confusion).
            Depuis Gen 7, les Hyper Training permettent de simuler des IVs à 31.
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-semibold text-green-400 mb-2">EVs (Effort Values)</h3>
          <p className="text-sm text-zinc-400">
            Max 252 par stat, 510 total (= 2 stats à 252 + 1 stat à 4 reste).
            Au niveau 100 : 4 EVs = +1 point de stat. Donc 252 EVs = +63 points.
            C'est ici que tu personnalises ton Pokémon. Le spread d'EVs est un art en soi.
          </p>
        </div>
      </div>

      {/* EV Optimization */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="font-semibold text-zinc-200 mb-3">EV Spreads compétitifs courants</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMMON_EV_SPREADS.map(spread => (
            <div key={spread.name} className="bg-zinc-800/50 rounded p-3">
              <p className="font-medium text-sm text-zinc-200">{spread.name}</p>
              <p className="text-xs text-zinc-500 mb-2">{spread.description}</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(spread.spread).map(([stat, val]) => (
                  <span key={stat} className="text-[10px] bg-zinc-700 px-1.5 py-0.5 rounded">
                    {stat}: {val}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Natures */}
      <div>
        <h3 className="text-xl font-bold mb-2">Natures</h3>
        <p className="text-zinc-400 text-sm mb-3">
          Chaque nature boost une stat de +10% et réduit une autre de -10%. 5 natures sont neutres.
          En compétitif, la nature est toujours choisie en fonction du rôle du Pokémon.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setNatureFilter("")}
            className={`px-2 py-1 text-xs rounded ${!natureFilter ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
            Toutes
          </button>
          {STAT_NAMES.filter(s => s !== "HP").map((stat, i) => (
            <button key={stat} onClick={() => setNatureFilter(stat)}
              className={`px-2 py-1 text-xs rounded ${natureFilter === stat ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
              {STAT_NAMES_FR[i + 1]}
            </button>
          ))}
          <button onClick={() => setNatureFilter("neutral")}
            className={`px-2 py-1 text-xs rounded ${natureFilter === "neutral" ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
            Neutres
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {filteredNatures.map(n => (
            <div key={n.name} className="bg-zinc-900 border border-zinc-800 rounded p-2">
              <p className="font-medium text-sm">
                {n.nameFr} <span className="text-zinc-500 text-xs">({n.name})</span>
              </p>
              {n.plus ? (
                <div className="text-xs mt-1">
                  <span className="text-green-400">+{n.plus}</span>
                  {" / "}
                  <span className="text-red-400">-{n.minus}</span>
                </div>
              ) : (
                <p className="text-xs text-zinc-600 mt-1">Neutre</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Natures compétitives clés */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="font-semibold text-zinc-200 mb-3">Natures les plus utilisées en compétitif</h3>
        <div className="text-sm text-zinc-400 space-y-2">
          <p><strong className="text-zinc-200">Jolly (+Vit/-Atq.Spé)</strong> — Sweeper physique rapide. Garchomp, Weavile.</p>
          <p><strong className="text-zinc-200">Adamant (+Atq/-Atq.Spé)</strong> — Sweeper physique qui mise sur la puissance.</p>
          <p><strong className="text-zinc-200">Timid (+Vit/-Atq)</strong> — Sweeper spécial rapide. Gengar, Dragapult spécial.</p>
          <p><strong className="text-zinc-200">Modest (+Atq.Spé/-Atq)</strong> — Sweeper spécial puissant. Volcarona.</p>
          <p><strong className="text-zinc-200">Bold (+Déf/-Atq)</strong> — Mur physique. Toxapex, Slowbro.</p>
          <p><strong className="text-zinc-200">Calm (+Déf.Spé/-Atq)</strong> — Mur spécial. Blissey, Clodsire.</p>
          <p><strong className="text-zinc-200">Impish (+Déf/-Atq.Spé)</strong> — Mur physique qui utilise des moves physiques.</p>
          <p><strong className="text-zinc-200">Brave (+Atq/-Vit)</strong> — Trick Room. Puissance max, lenteur voulue.</p>
          <p><strong className="text-zinc-200">Quiet (+Atq.Spé/-Vit)</strong> — Trick Room spécial.</p>
        </div>
      </div>

      {/* Stat Calculator */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
        <h3 className="font-semibold text-zinc-200 mb-4">Calculateur de Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Base Stat</label>
            <input type="number" value={calcBase} onChange={e => setCalcBase(+e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm" min={1} max={255} />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">IV (0-31)</label>
            <input type="number" value={calcIV} onChange={e => setCalcIV(+e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm" min={0} max={31} />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">EV (0-252)</label>
            <input type="number" value={calcEV} onChange={e => setCalcEV(+e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm" min={0} max={252} />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Niveau</label>
            <input type="number" value={calcLevel} onChange={e => setCalcLevel(+e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm" min={1} max={100} />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Nature</label>
            <select value={calcNature} onChange={e => setCalcNature(+e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm">
              <option value={1.1}>+10% (Favorable)</option>
              <option value={1.0}>Neutre</option>
              <option value={0.9}>-10% (Défavorable)</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-zinc-400">
              <input type="checkbox" checked={calcIsHP} onChange={e => setCalcIsHP(e.target.checked)}
                className="rounded bg-zinc-800 border-zinc-700" />
              Stat PV
            </label>
          </div>
        </div>
        <div className="bg-zinc-800 rounded p-4 text-center">
          <p className="text-xs text-zinc-500 mb-1">Stat finale</p>
          <p className="text-3xl font-bold text-red-400">{finalStat}</p>
        </div>
      </div>

      {/* Speed tiers concept */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="font-semibold text-zinc-200 mb-2">Speed Tiers — Le concept crucial</h3>
        <p className="text-sm text-zinc-400 mb-3">
          En compétitif, chaque point de Vitesse compte. On parle de "speed tiers" : des paliers de vitesse que tu dois connaître pour savoir qui frappe en premier.
        </p>
        <div className="text-sm text-zinc-400 space-y-1">
          <p><span className="text-zinc-200 font-mono w-12 inline-block">200</span> — Regieleki base (le plus rapide du jeu)</p>
          <p><span className="text-zinc-200 font-mono w-12 inline-block">150</span> — Electrode, Ninjask</p>
          <p><span className="text-zinc-200 font-mono w-12 inline-block">142</span> — Dragapult (la référence en OU Gen 8-9)</p>
          <p><span className="text-zinc-200 font-mono w-12 inline-block">135</span> — Weavile, Gengar</p>
          <p><span className="text-zinc-200 font-mono w-12 inline-block">130</span> — Tapu Koko, Aerodactyl, Jolteon</p>
          <p><span className="text-zinc-200 font-mono w-12 inline-block">120</span> — Cinderace, Dugtrio</p>
          <p><span className="text-zinc-200 font-mono w-12 inline-block">108</span> — Infernape, Terrakion</p>
          <p><span className="text-zinc-200 font-mono w-12 inline-block">102</span> — Garchomp, Landorus-T (le palier le plus contesté!)</p>
          <p><span className="text-zinc-200 font-mono w-12 inline-block">100</span> — Charizard, Volcarona, Salamence</p>
          <p><span className="text-zinc-200 font-mono w-12 inline-block">95</span>  — Excadrill, Haxorus</p>
          <p><span className="text-zinc-200 font-mono w-12 inline-block">80</span>  — Dragonite, Togekiss, Heatran</p>
        </div>
        <p className="text-xs text-zinc-500 mt-3">
          Astuce : Si ton Pokémon a 102 base Vitesse (Garchomp), tu mets Jolly + 252 EV pour être sûr de dépasser tous les 100 base.
          Mais un Scarf x1.5 sur un 65 base peut dépasser un 130 non-Scarf. Les maths comptent!
        </p>
      </div>
    </div>
  );
}
