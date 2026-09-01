# Skills Guide & Agent Directive — Matt Pocock's Skills

Denna fil instruerar alla AI-agenter som arbetar i detta projekt om hur man hittar och använder de installerade **Matt Pocock-skillsen**.

---

## ⚠️ VIKTIGT DIREKTIV TILL ALLA AGENTER (CRITICAL INSTRUCTION)

När användaren:
* Skriver ett snabbkommando (t.ex. `/wayfinder`, `/improve-codebase-architecture`, `/codebase-design`, `/grill-me`, `/domain-modeling`, `/to-spec`, `/tdd` etc.), eller
* Ber dig köra, planera eller granska något enligt en specifik skill eller metodik:

> **DU SKA:**
> 1. Omedelbart läsa in motsvarande `SKILL.md`-fil från skill-katalogen:
>    `~/.agents/skills/<skill-namn>/SKILL.md`  
>    *(Windows absolut sökväg: `C:\Users\rooki\.agents\skills\<skill-namn>\SKILL.md`)*
> 2. Följa instruktionerna i den filen steg för steg och använda dess specifika vokabulär och processer.
>
> **DU SKA ALDRIG:**
> * Gissa eller improvisera en egen process.
> * Leta upp slumpmässiga externa artiklar eller irrelevanta filer i kodbasen och hitta på en arkitektur efter dem.
> * Avvika från metodiken som definieras i skill-filen.

---

## 📂 Sökväg till alla Skills

Alla skills ligger installerade lokalt i:
* **Relativ sökväg**: `~/.agents/skills/`
* **Windows absolut sökväg**: `C:\Users\rooki\.agents\skills\`

Varje skill har sin egen mapp med en huvudfil: `~/.agents/skills/<namn>/SKILL.md`.

---

## 🧭 Katalog över tillgängliga Skills

### 1. Arkitektur & Kodbasdesign
| Skill | Sökväg | Syfte & Användning |
| :--- | :--- | :--- |
| **`improve-codebase-architecture`** | `~/.agents/skills/improve-codebase-architecture/SKILL.md` | Skannar kodbasen efter arkitekturfriktion/grunda moduler. Genererar en **visuell HTML-rapport** i temp-mappen med Mermaid-diagram (före/efter) och leder en diskussion om refaktorering. |
| **`codebase-design`** | `~/.agents/skills/codebase-design/SKILL.md` | Vokabulär och principer för djupa moduler (*Deep Modules*, *Small Interfaces*, *Seams*, *Adapters*, *Locality*, *Leverage*). |
| **`domain-modeling`** | `~/.agents/skills/domain-modeling/SKILL.md` | Skapar och underhåller `CONTEXT.md` (domänordlista) och ADRs (`docs/adr/`). |
| **`setup-ts-deep-modules`** | `~/.agents/skills/setup-ts-deep-modules/SKILL.md` | Konfigurerar TypeScript för ren modul- och skarv-arkitektur. |

### 2. Projektplanering & Kartläggning
| Skill | Sökväg | Syfte & Användning |
| :--- | :--- | :--- |
| **`wayfinder`** | `~/.agents/skills/wayfinder/SKILL.md` | Kartlägger stora, komplexa initiativ i en delad karta (`wayfinder:map`) med beslutstickets och hanterar "Fog of War". |
| **`to-spec`** | `~/.agents/skills/to-spec/SKILL.md` | Skriver en detaljerad och rigorös teknisk specifikation innan kodning. |
| **`implement-spec`** | `~/.agents/skills/implement-spec/SKILL.md` | Implementerar en funktion strikt utifrån en godkänd specifikation. |
| **`to-tickets`** | `~/.agents/skills/to-tickets/SKILL.md` | Bryter ner en specifikation eller plan i exekverbara tickets. |
| **`writing-shape`** | `~/.agents/skills/writing-shape/SKILL.md` | Sätter formen och avgränsningarna för ett projekt (*Shape Up*-stil). |

### 3. Interaktiv Granskning & Alignment ("Grilling")
| Skill | Sökväg | Syfte & Användning |
| :--- | :--- | :--- |
| **`grill-me`** / **`grilling`** | `~/.agents/skills/grilling/SKILL.md` | Intervjuar användaren med skarpa, djupgående frågor för att låsa fast krav och designbeslut. |
| **`grill-with-docs`** | `~/.agents/skills/grill-with-docs/SKILL.md` | Grillar användaren med stöd av extern eller lokal dokumentation. |
| **`wizard`** | `~/.agents/skills/wizard/SKILL.md` | Guidar användaren interaktivt steg-för-steg genom komplexa val. |
| **`wait-what`** | `~/.agents/skills/wait-what/SKILL.md` | Utmanar antaganden och reder ut förvirring eller motsägelser. |

### 4. Implementation, Test & Felsökning
| Skill | Sökväg | Syfte & Användning |
| :--- | :--- | :--- |
| **`tdd`** | `~/.agents/skills/tdd/SKILL.md` | Strikt testdriven utveckling (Red-Green-Refactor). |
| **`diagnosing-bugs`** | `~/.agents/skills/diagnosing-bugs/SKILL.md` | Systematisk felsökning och isolering av buggar utan gissningar. |
| **`code-review`** | `~/.agents/skills/code-review/SKILL.md` | Grundlig granskning av kodändringar mot projektets standarder. |
| **`resolving-merge-conflicts`**| `~/.agents/skills/resolving-merge-conflicts/SKILL.md` | Hanterar och löser merge-konflikter säkert. |

### 5. Research & Prototyper
| Skill | Sökväg | Syfte & Användning |
| :--- | :--- | :--- |
| **`prototype`** | `~/.agents/skills/prototype/SKILL.md` | Bygger snabba, kasserbara prototyper för att validera UI/logik innan beslut tas. |
| **`research`** | `~/.agents/skills/research/SKILL.md` | Genomför djup bakgrundsresearch i dokumentation och API:er. |
| **`find-skills`** | `~/.agents/skills/find-skills/SKILL.md` | Söker och installerar nya agent-skills från ekosystemet via `npx skills`. |

---

## 🛠️ Exempel på hur agenten ska agera

### Scenario: Användaren säger "Kör en arkitekturgranskning" eller `/improve-codebase-architecture`
1. Agenten anropar sitt läs-verktyg på `C:\Users\rooki\.agents\skills\improve-codebase-architecture\SKILL.md`.
2. Agenten noterar instruktionen att även läsa `codebase-design\SKILL.md` för vokabulären.
3. Agenten undersöker kodbasen, identifierar hot spots och grunda moduler.
4. Agenten genererar den visuella HTML-filen `architecture-review-<timestamp>.html` i `%TEMP%` med Tailwind & Mermaid.
5. Agenten öppnar filen för användaren och presenterar förslagen.
