import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TypesSection } from './sections/TypesSection'
import { StatsSection } from './sections/StatsSection'
import { AbilitiesSection } from './sections/AbilitiesSection'
import { ItemsSection } from './sections/ItemsSection'
import { StatusSection } from './sections/StatusSection'
import { MovesSection } from './sections/MovesSection'
import { TeamSection } from './sections/TeamSection'
import { GenerationsSection } from './sections/GenerationsSection'
import { DamageCalcSection } from './sections/DamageCalcSection'
import { MechanicsSection } from './sections/MechanicsSection'
import { PokedexSection } from './sections/PokedexSection'
import { GlossarySection } from './sections/GlossarySection'
import { MoveExplorerSection } from './sections/MoveExplorerSection'
import { QuizSection } from './sections/QuizSection'
import { TeamBuilderSection } from './sections/TeamBuilderSection'

const NAV_ITEMS = [
  { id: "types", label: "Types", icon: "◆" },
  { id: "stats", label: "Stats", icon: "▲" },
  { id: "abilities", label: "Talents", icon: "★" },
  { id: "items", label: "Objets", icon: "●" },
  { id: "status", label: "Statuts", icon: "◎" },
  { id: "moves", label: "Attaques", icon: "→" },
  { id: "movedb", label: "Moves DB", icon: "⚡" },
  { id: "mechanics", label: "Mécaniques", icon: "⚙" },
  { id: "pokedex", label: "Pokédex", icon: "◉" },
  { id: "team", label: "Teambuilding", icon: "◈" },
  { id: "builder", label: "Builder", icon: "🔧" },
  { id: "calc", label: "Calculateur", icon: "⊕" },
  { id: "gens", label: "Générations", icon: "∞" },
  { id: "glossary", label: "Glossaire", icon: "A" },
  { id: "quiz", label: "Quiz", icon: "?" },
];

type Theme = 'dark' | 'light';
type FontSize = 'sm' | 'base' | 'lg';

function App() {
  const [activeTab, setActiveTab] = useState("types");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [fontSize, setFontSize] = useState<FontSize>('base');
  const [showSettings, setShowSettings] = useState(false);

  // Apply theme via data-attribute on <html> — CSS overrides target this
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Apply font scale on <html> so all rem-based Tailwind sizes cascade
  useEffect(() => {
    const sizeMap: Record<FontSize, string> = { sm: '14px', base: '16px', lg: '18px' };
    document.documentElement.style.fontSize = sizeMap[fontSize];
  }, [fontSize]);

  const bgMain = theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900';
  const bgHeader = theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white/90 border-zinc-200';
  const bgNav = theme === 'dark' ? 'bg-zinc-950/95 border-zinc-800' : 'bg-zinc-50/95 border-zinc-200';
  const textMuted = theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500';
  const btnInactive = theme === 'dark' ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-700';

  return (
    <div className={`min-h-screen ${bgMain}`} data-theme={theme}>
      {/* Header */}
      <header className={`border-b ${bgHeader} backdrop-blur-sm sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-red-900/30 shrink-0">P</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-lg font-semibold tracking-tight truncate">Pokémon Compétitif — Encyclopédie</h1>
            <p className={`text-[10px] sm:text-xs ${textMuted} hidden sm:block`}>Gen 1-9 · Singles & Doubles/VGC · 15 sections interactives</p>
          </div>

          {/* Settings button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 sm:p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'} transition-colors`}
            title="Paramètres"
          >
            <span className="text-sm">⚙️</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-1.5 rounded-lg ${theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'} transition-colors`}
          >
            <span className="text-lg">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Settings dropdown */}
        {showSettings && (
          <div className={`absolute right-2 sm:right-4 top-full mt-1 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200'} border rounded-lg shadow-xl z-[60] p-4 w-64`}>
            <h4 className="font-semibold text-sm mb-3">Paramètres</h4>

            {/* Theme toggle */}
            <div className="mb-3">
              <p className={`text-xs ${textMuted} mb-1.5`}>Thème</p>
              <div className="flex gap-1">
                <button onClick={() => setTheme('dark')}
                  className={`flex-1 px-3 py-1.5 text-xs rounded font-medium ${theme === 'dark' ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                  Sombre
                </button>
                <button onClick={() => setTheme('light')}
                  className={`flex-1 px-3 py-1.5 text-xs rounded font-medium ${theme === 'light' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  Clair
                </button>
              </div>
            </div>

            {/* Font size */}
            <div>
              <p className={`text-xs ${textMuted} mb-1.5`}>Taille du texte</p>
              <div className="flex gap-1">
                {(['sm', 'base', 'lg'] as FontSize[]).map(s => (
                  <button key={s} onClick={() => setFontSize(s)}
                    className={`flex-1 px-2 py-1.5 text-xs rounded font-medium ${fontSize === s ? 'bg-red-600 text-white' : `${theme === 'dark' ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'}`}`}>
                    {s === 'sm' ? 'Petit' : s === 'base' ? 'Normal' : 'Grand'}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setShowSettings(false)}
              className={`mt-3 w-full text-xs ${textMuted} hover:underline`}>Fermer</button>
          </div>
        )}
      </header>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setMobileMenuOpen(false); }} className="max-w-7xl mx-auto">
        {/* Desktop Navigation */}
        <div className={`sticky top-[49px] sm:top-[57px] z-40 ${bgNav} backdrop-blur-sm border-b hidden md:block`}>
          <TabsList className="w-full h-auto bg-transparent p-0 flex overflow-x-auto gap-0 scrollbar-hide">
            {NAV_ITEMS.map(item => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className={`flex-shrink-0 px-2 lg:px-3 py-3 rounded-none border-b-2 border-transparent text-[12px] lg:text-[13px] font-medium
                  data-[state=active]:border-red-500 data-[state=active]:text-zinc-100 data-[state=active]:bg-transparent
                  ${btnInactive} transition-colors bg-transparent`}
              >
                <span className="mr-1 text-xs opacity-60">{item.icon}</span>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className={`fixed inset-0 top-[49px] z-40 md:hidden`}>
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <div className={`relative ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white'} border-b ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'} max-h-[70vh] overflow-y-auto`}>
              <div className="grid grid-cols-3 gap-1 p-3">
                {NAV_ITEMS.map(item => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg text-xs font-medium transition-colors
                      ${activeTab === item.id
                        ? 'bg-red-600 text-white'
                        : `${theme === 'dark' ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`
                      }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </TabsTrigger>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile bottom tab indicator */}
        <div className={`md:hidden sticky top-[49px] z-30 ${bgNav} backdrop-blur-sm border-b px-3 py-2 flex items-center justify-between`}>
          <button onClick={() => setMobileMenuOpen(true)} className="flex items-center gap-2">
            <span className="text-sm opacity-60">{NAV_ITEMS.find(n => n.id === activeTab)?.icon}</span>
            <span className="text-sm font-medium">{NAV_ITEMS.find(n => n.id === activeTab)?.label}</span>
            <span className={`text-xs ${textMuted}`}>▼</span>
          </button>
          <span className={`text-[10px] ${textMuted}`}>
            {NAV_ITEMS.findIndex(n => n.id === activeTab) + 1}/{NAV_ITEMS.length}
          </span>
        </div>

        {/* Content */}
        <main className="px-3 sm:px-4 py-4 sm:py-6">
          <TabsContent value="types"><TypesSection /></TabsContent>
          <TabsContent value="stats"><StatsSection /></TabsContent>
          <TabsContent value="abilities"><AbilitiesSection /></TabsContent>
          <TabsContent value="items"><ItemsSection /></TabsContent>
          <TabsContent value="status"><StatusSection /></TabsContent>
          <TabsContent value="moves"><MovesSection /></TabsContent>
          <TabsContent value="movedb"><MoveExplorerSection /></TabsContent>
          <TabsContent value="mechanics"><MechanicsSection /></TabsContent>
          <TabsContent value="pokedex"><PokedexSection /></TabsContent>
          <TabsContent value="team"><TeamSection /></TabsContent>
          <TabsContent value="builder"><TeamBuilderSection /></TabsContent>
          <TabsContent value="calc"><DamageCalcSection /></TabsContent>
          <TabsContent value="gens"><GenerationsSection /></TabsContent>
          <TabsContent value="glossary"><GlossarySection /></TabsContent>
          <TabsContent value="quiz"><QuizSection /></TabsContent>
        </main>
      </Tabs>

      {/* Footer */}
      <footer className={`border-t ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'} py-4 px-4 text-center text-xs ${textMuted} mt-8`}>
        Pokémon est une marque de The Pokémon Company. Ce guide est un outil éducatif non-officiel.
        Données basées sur Smogon, Bulbapedia, PokéAPI et Pokémon Showdown.
      </footer>

      {/* Click outside settings to close */}
      {showSettings && <div className="fixed inset-0 z-[55]" onClick={() => setShowSettings(false)} />}
    </div>
  )
}

export default App
