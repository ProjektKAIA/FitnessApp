Projekt-Anweisungen
Arbeitsweise
Antworte auf Deutsch
Schreib nicht mehr als nötig – keine Erklärungen wenn nicht gefragt
Orientiere dich am Projektwissen für Code-Inhalte
Arbeite minimal-invasiv nach Best Practice / Industriestandard
Lass nichts weg, erfinde nichts – befolge die Anweisungen exakt
Kontrolliere deinen Code selbst auf Korrektheit
Schau selbst im Projektwissen nach, frag nicht ob Code existiert
Schreibe immer die Dateipfade in den Code
Code Consistency Rules
Naming
Variables/Functions: camelCase
Components: PascalCase
Constants: SCREAMING_SNAKE_CASE
Booleans: Prefix is , has , should , can
Dateien: PascalCase.tsx (Components), kebab-case.ts (Utils)
Imports
Immer Alias-Paths ( @components, @hooks , @utils ) – keine relativen Paths ( ../../ )
Reihenfolge: React → Third-Party → Internal → Types → Styles
Leerzeile zwischen Import-Gruppen
Component-Struktur
typescript
// 1. Imports // 1. Imports
// 2. Interface // 2. Interface
interface interface Props Props { {} }
// 3. Component // 3. Component
export export const const ComponentName ComponentName = = ( ({ { } }: : Props Props) ) => => { {
// Hooks // Hooks
// Derived State // Derived State
// Effects // Effects
// Handlers // Handlers
// Return // Return
} }; ;
// 4. Styles (wenn StyleSheet) // 4. Styles (wenn StyleSheet)
// 5. Type-Exports am Ende // 5. Type-Exports am Ende
export export type type { { Props Props as as ComponentNameProps ComponentNameProps } }; ;
State Management
Lokaler UI-State: useState
Komplexer lokaler State: useReducer
Globaler State: Zustand Store
Server State: TanStack Query
Styling
Ein Ansatz pro Projekt (Tailwind/NativeWind ODER StyleSheet.create)
Keine hardcoded Werte – immer Theme (colors, spacing, typography)
Keine Inline-Styles außer dynamische Werte
TypeScript
Kein any – verwende unknown wenn nötig
interface für Props und Object Shapes
type für Unions und Mapped Types
Types zentral oder am Component-Ende exportieren
Error Handling
typescript
try try { {
const const result result = = await await apiCall apiCall( () ); ;
return return { { success success: : true true, , data data: : result result } }; ;
} } catch catch ( (error error) ) { {
console console. .error error( ('[Context]:' '[Context]:', , error error) ); ;
return return { { success success: : false false, , error error: : getErrorMessage getErrorMessage( (error error) ) } }; ;
} }
File-Organisation
Business-Logik gehört in Stores/Hooks – nicht in UI-Components
Utils sind pure functions
Jeder Ordner hat eine index.ts für Re-Exports
Bei Unklarheiten
Frag nach statt zu raten. Halte dich an bestehende Patterns im Projektwissen.