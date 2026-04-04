// Minimal SVG city illustrations for card/detail headers
// Each returns a simple iconic silhouette in teal tones

const illustrations = {
  Venice: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Rialto bridge + gondola */}
      <path d="M80 130 Q200 60 320 130" stroke="rgba(77,196,168,0.3)" strokeWidth="2" fill="none" />
      <path d="M100 130 Q200 75 300 130" stroke="rgba(77,196,168,0.15)" strokeWidth="1.5" fill="none" />
      <rect x="170" y="80" width="8" height="50" fill="rgba(77,196,168,0.2)" />
      <rect x="222" y="80" width="8" height="50" fill="rgba(77,196,168,0.2)" />
      {/* Gondola */}
      <path d="M140 140 Q160 132 200 135 Q240 138 250 140" stroke="rgba(77,196,168,0.4)" strokeWidth="2" fill="none" />
      <line x1="195" y1="135" x2="195" y2="118" stroke="rgba(77,196,168,0.3)" strokeWidth="1.5" />
      {/* Water ripples */}
      <path d="M40 150 Q80 145 120 150 Q160 155 200 150 Q240 145 280 150 Q320 155 360 150" stroke="rgba(77,196,168,0.15)" strokeWidth="1" fill="none" />
    </svg>
  ),

  Florence: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Duomo dome */}
      <path d="M160 130 Q160 50 200 35 Q240 50 240 130" stroke="rgba(77,196,168,0.3)" strokeWidth="2" fill="rgba(77,196,168,0.05)" />
      <line x1="200" y1="35" x2="200" y2="20" stroke="rgba(77,196,168,0.3)" strokeWidth="1.5" />
      <circle cx="200" cy="17" r="3" fill="rgba(77,196,168,0.3)" />
      {/* Lantern */}
      <rect x="190" y="28" width="20" height="8" rx="2" fill="rgba(77,196,168,0.15)" />
      {/* Bell tower */}
      <rect x="280" y="50" width="22" height="80" fill="rgba(77,196,168,0.15)" />
      <path d="M278 50 L291 30 L304 50" fill="rgba(77,196,168,0.2)" />
      {/* Arches */}
      <path d="M100 130 Q115 115 130 130" stroke="rgba(77,196,168,0.15)" strokeWidth="1.5" fill="none" />
      <path d="M130 130 Q145 115 160 130" stroke="rgba(77,196,168,0.15)" strokeWidth="1.5" fill="none" />
    </svg>
  ),

  Rome: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Colosseum arches */}
      <path d="M120 130 Q120 60 200 45 Q280 60 280 130" stroke="rgba(77,196,168,0.25)" strokeWidth="2" fill="none" />
      <path d="M140 130 Q140 75 200 63 Q260 75 260 130" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="none" />
      {/* Arches row 1 */}
      <path d="M150 100 Q158 90 166 100" stroke="rgba(77,196,168,0.3)" strokeWidth="1.5" fill="none" />
      <path d="M175 95 Q183 85 191 95" stroke="rgba(77,196,168,0.3)" strokeWidth="1.5" fill="none" />
      <path d="M200 93 Q208 83 216 93" stroke="rgba(77,196,168,0.3)" strokeWidth="1.5" fill="none" />
      <path d="M225 95 Q233 85 241 95" stroke="rgba(77,196,168,0.3)" strokeWidth="1.5" fill="none" />
      {/* Arches row 2 */}
      <path d="M145 120 Q155 108 165 120" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="none" />
      <path d="M172 118 Q182 106 192 118" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="none" />
      <path d="M199 117 Q209 105 219 117" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="none" />
      <path d="M226 118 Q236 106 246 118" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="none" />
    </svg>
  ),

  Amalfi: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cliffside buildings */}
      <rect x="120" y="60" width="25" height="70" fill="rgba(77,196,168,0.15)" />
      <rect x="150" y="75" width="20" height="55" fill="rgba(77,196,168,0.12)" />
      <rect x="175" y="50" width="22" height="80" fill="rgba(77,196,168,0.18)" />
      <rect x="202" y="65" width="18" height="65" fill="rgba(77,196,168,0.13)" />
      <rect x="225" y="80" width="24" height="50" fill="rgba(77,196,168,0.15)" />
      {/* Cliff */}
      <path d="M100 130 Q110 125 120 130 L250 130 Q260 125 270 130" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="none" />
      {/* Water */}
      <path d="M30 145 Q100 138 200 142 Q300 146 370 140" stroke="rgba(77,196,168,0.15)" strokeWidth="1" fill="none" />
      {/* Sun */}
      <circle cx="330" cy="45" r="18" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="rgba(77,196,168,0.05)" />
    </svg>
  ),

  Nice: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Palm tree */}
      <line x1="100" y1="130" x2="105" y2="60" stroke="rgba(77,196,168,0.25)" strokeWidth="3" />
      <path d="M105 60 Q80 40 60 55" stroke="rgba(77,196,168,0.3)" strokeWidth="2" fill="none" />
      <path d="M105 60 Q90 35 75 42" stroke="rgba(77,196,168,0.25)" strokeWidth="2" fill="none" />
      <path d="M105 60 Q120 35 140 45" stroke="rgba(77,196,168,0.3)" strokeWidth="2" fill="none" />
      <path d="M105 60 Q130 40 145 55" stroke="rgba(77,196,168,0.25)" strokeWidth="2" fill="none" />
      {/* Promenade line */}
      <line x1="40" y1="130" x2="360" y2="130" stroke="rgba(77,196,168,0.15)" strokeWidth="1.5" />
      {/* Beach umbrella */}
      <path d="M250 90 Q275 70 300 90" stroke="rgba(77,196,168,0.25)" strokeWidth="2" fill="rgba(77,196,168,0.08)" />
      <line x1="275" y1="90" x2="275" y2="130" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" />
      {/* Waves */}
      <path d="M40 145 Q100 140 160 145 Q220 150 280 145 Q340 140 370 145" stroke="rgba(77,196,168,0.12)" strokeWidth="1" fill="none" />
    </svg>
  ),

  Lyon: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Basilica silhouette */}
      <rect x="160" y="50" width="80" height="80" fill="rgba(77,196,168,0.12)" />
      <path d="M155 50 L200 20 L245 50" fill="rgba(77,196,168,0.15)" />
      {/* Tower */}
      <rect x="190" y="15" width="8" height="35" fill="rgba(77,196,168,0.2)" />
      <circle cx="194" cy="12" r="4" fill="rgba(77,196,168,0.25)" />
      {/* Two rivers */}
      <path d="M40 140 Q120 133 200 138 Q280 143 360 136" stroke="rgba(77,196,168,0.15)" strokeWidth="1" fill="none" />
      <path d="M40 150 Q120 143 200 148 Q280 153 360 146" stroke="rgba(77,196,168,0.12)" strokeWidth="1" fill="none" />
      {/* Hill */}
      <path d="M100 130 Q150 100 200 130" stroke="rgba(77,196,168,0.1)" strokeWidth="1.5" fill="rgba(77,196,168,0.05)" />
    </svg>
  ),

  Paris: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Eiffel Tower */}
      <line x1="200" y1="15" x2="200" y2="25" stroke="rgba(77,196,168,0.4)" strokeWidth="2" />
      <path d="M170 130 L190 70 L200 25 L210 70 L230 130" stroke="rgba(77,196,168,0.3)" strokeWidth="2" fill="none" />
      <line x1="182" y1="90" x2="218" y2="90" stroke="rgba(77,196,168,0.25)" strokeWidth="1.5" />
      <line x1="175" y1="110" x2="225" y2="110" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" />
      {/* Arc shape in distance */}
      <path d="M300 130 Q320 100 340 130" stroke="rgba(77,196,168,0.15)" strokeWidth="1.5" fill="none" />
      {/* Seine */}
      <path d="M40 145 Q120 138 200 143 Q280 148 360 141" stroke="rgba(77,196,168,0.12)" strokeWidth="1" fill="none" />
    </svg>
  ),

  Brussels: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Grand Place tower */}
      <rect x="185" y="40" width="30" height="90" fill="rgba(77,196,168,0.15)" />
      <path d="M183 40 L200 10 L217 40" fill="rgba(77,196,168,0.2)" />
      <line x1="200" y1="10" x2="200" y2="2" stroke="rgba(77,196,168,0.3)" strokeWidth="1.5" />
      {/* Buildings flanking */}
      <rect x="130" y="70" width="50" height="60" fill="rgba(77,196,168,0.1)" />
      <path d="M130 70 L155 55 L180 70" fill="rgba(77,196,168,0.12)" />
      <rect x="220" y="75" width="50" height="55" fill="rgba(77,196,168,0.1)" />
      <path d="M220 75 L245 60 L270 75" fill="rgba(77,196,168,0.12)" />
      {/* Cobblestone hint */}
      <circle cx="170" cy="140" r="1.5" fill="rgba(77,196,168,0.1)" />
      <circle cx="200" cy="142" r="1.5" fill="rgba(77,196,168,0.1)" />
      <circle cx="230" cy="140" r="1.5" fill="rgba(77,196,168,0.1)" />
    </svg>
  ),

  Amsterdam: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Canal houses */}
      <rect x="100" y="60" width="30" height="70" fill="rgba(77,196,168,0.15)" />
      <path d="M100 60 L115 45 L130 60" fill="rgba(77,196,168,0.18)" />
      <rect x="135" y="55" width="28" height="75" fill="rgba(77,196,168,0.12)" />
      <path d="M135 55 Q149 40 163 55" fill="rgba(77,196,168,0.15)" />
      <rect x="168" y="50" width="32" height="80" fill="rgba(77,196,168,0.17)" />
      <path d="M168 50 L184 35 L200 50" fill="rgba(77,196,168,0.2)" />
      <rect x="205" y="58" width="26" height="72" fill="rgba(77,196,168,0.13)" />
      <path d="M205 58 L218 46 L231 58" fill="rgba(77,196,168,0.16)" />
      <rect x="236" y="55" width="30" height="75" fill="rgba(77,196,168,0.14)" />
      <path d="M236 55 Q251 42 266 55" fill="rgba(77,196,168,0.17)" />
      {/* Canal */}
      <path d="M60 140 Q140 133 200 137 Q260 141 340 135" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="none" />
      {/* Bicycle */}
      <circle cx="320" cy="125" r="8" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="none" />
      <circle cx="340" cy="125" r="8" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="none" />
      <path d="M320 125 L330 112 L340 125" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="none" />
    </svg>
  ),

  Berlin: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Brandenburg Gate */}
      <rect x="140" y="70" width="12" height="60" fill="rgba(77,196,168,0.2)" />
      <rect x="165" y="70" width="12" height="60" fill="rgba(77,196,168,0.2)" />
      <rect x="190" y="70" width="12" height="60" fill="rgba(77,196,168,0.2)" />
      <rect x="215" y="70" width="12" height="60" fill="rgba(77,196,168,0.2)" />
      <rect x="240" y="70" width="12" height="60" fill="rgba(77,196,168,0.2)" />
      {/* Top beam */}
      <rect x="135" y="62" width="122" height="10" fill="rgba(77,196,168,0.15)" />
      {/* Quadriga */}
      <rect x="175" y="45" width="50" height="17" fill="rgba(77,196,168,0.12)" />
      <path d="M185 45 L200 30 L215 45" fill="rgba(77,196,168,0.18)" />
      {/* TV Tower in distance */}
      <line x1="330" y1="130" x2="330" y2="30" stroke="rgba(77,196,168,0.15)" strokeWidth="1.5" />
      <circle cx="330" cy="45" r="8" fill="rgba(77,196,168,0.1)" stroke="rgba(77,196,168,0.15)" strokeWidth="1" />
    </svg>
  ),

  Munich: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Frauenkirche twin towers */}
      <rect x="160" y="50" width="25" height="80" fill="rgba(77,196,168,0.15)" />
      <path d="M158 50 Q172 25 187 50" fill="rgba(77,196,168,0.2)" />
      <rect x="215" y="50" width="25" height="80" fill="rgba(77,196,168,0.15)" />
      <path d="M213 50 Q227 25 242 50" fill="rgba(77,196,168,0.2)" />
      {/* Church body */}
      <rect x="185" y="70" width="30" height="60" fill="rgba(77,196,168,0.1)" />
      {/* Alps in background */}
      <path d="M40 130 Q80 95 120 120 Q160 90 200 115 Q240 85 280 110 Q320 90 360 130" stroke="rgba(77,196,168,0.1)" strokeWidth="1.5" fill="rgba(77,196,168,0.03)" />
      {/* Beer garden table */}
      <ellipse cx="330" cy="128" rx="20" ry="5" stroke="rgba(77,196,168,0.15)" strokeWidth="1" fill="none" />
    </svg>
  ),

  Eze: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Medieval hilltop village */}
      <path d="M140 130 Q170 80 200 75 Q230 80 260 130" stroke="rgba(77,196,168,0.15)" strokeWidth="1.5" fill="rgba(77,196,168,0.05)" />
      {/* Stone tower */}
      <rect x="188" y="45" width="24" height="30" fill="rgba(77,196,168,0.18)" />
      <path d="M186 45 L200 30 L214 45" fill="rgba(77,196,168,0.22)" />
      {/* Tiny buildings clustered */}
      <rect x="165" y="72" width="16" height="22" fill="rgba(77,196,168,0.14)" />
      <rect x="184" y="68" width="14" height="18" fill="rgba(77,196,168,0.12)" />
      <rect x="218" y="70" width="18" height="24" fill="rgba(77,196,168,0.15)" />
      {/* Winding path */}
      <path d="M200 100 Q180 110 190 120 Q210 130 200 140" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="none" />
      {/* Mediterranean sea */}
      <path d="M40 150 Q120 144 200 148 Q280 152 360 146" stroke="rgba(77,196,168,0.12)" strokeWidth="1" fill="none" />
    </svg>
  ),

  Monaco: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Casino building */}
      <rect x="155" y="65" width="90" height="65" fill="rgba(77,196,168,0.12)" />
      <path d="M150 65 L200 35 L250 65" fill="rgba(77,196,168,0.15)" />
      {/* Casino dome */}
      <path d="M185 65 Q200 50 215 65" stroke="rgba(77,196,168,0.25)" strokeWidth="1.5" fill="rgba(77,196,168,0.08)" />
      {/* Columns */}
      <rect x="170" y="75" width="5" height="40" fill="rgba(77,196,168,0.18)" />
      <rect x="185" y="75" width="5" height="40" fill="rgba(77,196,168,0.18)" />
      <rect x="210" y="75" width="5" height="40" fill="rgba(77,196,168,0.18)" />
      <rect x="225" y="75" width="5" height="40" fill="rgba(77,196,168,0.18)" />
      {/* Race track curve */}
      <path d="M80 140 Q130 120 180 135 Q230 145 300 130 Q340 125 370 135" stroke="rgba(77,196,168,0.2)" strokeWidth="2" strokeDasharray="8 4" fill="none" />
      {/* Yacht in harbor */}
      <path d="M310 100 L330 100 L340 110 L300 110 Z" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="rgba(77,196,168,0.06)" />
      <line x1="320" y1="100" x2="320" y2="85" stroke="rgba(77,196,168,0.2)" strokeWidth="1" />
    </svg>
  ),

  Geneva: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Jet d'Eau fountain */}
      <path d="M200 130 Q198 80 200 20" stroke="rgba(77,196,168,0.3)" strokeWidth="2.5" fill="none" />
      <path d="M200 20 Q195 15 192 25" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="none" />
      <path d="M200 20 Q205 15 208 25" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="none" />
      {/* Spray mist */}
      <circle cx="195" cy="35" r="2" fill="rgba(77,196,168,0.15)" />
      <circle cx="206" cy="30" r="1.5" fill="rgba(77,196,168,0.12)" />
      <circle cx="193" cy="45" r="1.5" fill="rgba(77,196,168,0.1)" />
      {/* Lake */}
      <path d="M40 135 Q120 128 200 132 Q280 136 360 130" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="none" />
      <path d="M40 145 Q120 138 200 142 Q280 146 360 140" stroke="rgba(77,196,168,0.12)" strokeWidth="1" fill="none" />
      {/* Alps in background */}
      <path d="M60 120 Q100 90 140 115 Q180 85 220 110 Q260 80 300 108 Q330 90 360 120" stroke="rgba(77,196,168,0.1)" strokeWidth="1.5" fill="none" />
    </svg>
  ),

  Antwerp: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cathedral spire */}
      <rect x="188" y="50" width="24" height="80" fill="rgba(77,196,168,0.15)" />
      <path d="M185 50 L200 10 L215 50" fill="rgba(77,196,168,0.2)" />
      <line x1="200" y1="10" x2="200" y2="2" stroke="rgba(77,196,168,0.3)" strokeWidth="1.5" />
      {/* Gothic windows */}
      <path d="M193 65 Q200 58 207 65" stroke="rgba(77,196,168,0.25)" strokeWidth="1" fill="none" />
      <path d="M193 85 Q200 78 207 85" stroke="rgba(77,196,168,0.25)" strokeWidth="1" fill="none" />
      {/* Diamond shape */}
      <path d="M310 70 L325 55 L340 70 L325 85 Z" stroke="rgba(77,196,168,0.25)" strokeWidth="1.5" fill="rgba(77,196,168,0.08)" />
      <path d="M316 70 L325 61 L334 70" stroke="rgba(77,196,168,0.15)" strokeWidth="1" fill="none" />
      {/* Guild houses */}
      <rect x="120" y="80" width="28" height="50" fill="rgba(77,196,168,0.1)" />
      <path d="M118 80 L134 65 L150 80" fill="rgba(77,196,168,0.12)" />
      <rect x="250" y="85" width="25" height="45" fill="rgba(77,196,168,0.1)" />
      <path d="M248 85 L262 72 L277 85" fill="rgba(77,196,168,0.12)" />
    </svg>
  ),

  Rotterdam: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Erasmus Bridge cable-stayed */}
      <path d="M100 130 L200 50 L300 130" stroke="rgba(77,196,168,0.25)" strokeWidth="2" fill="none" />
      {/* Bridge deck */}
      <line x1="60" y1="130" x2="340" y2="130" stroke="rgba(77,196,168,0.2)" strokeWidth="2" />
      {/* Cables */}
      <line x1="200" y1="50" x2="130" y2="130" stroke="rgba(77,196,168,0.12)" strokeWidth="1" />
      <line x1="200" y1="50" x2="160" y2="130" stroke="rgba(77,196,168,0.12)" strokeWidth="1" />
      <line x1="200" y1="50" x2="240" y2="130" stroke="rgba(77,196,168,0.12)" strokeWidth="1" />
      <line x1="200" y1="50" x2="270" y2="130" stroke="rgba(77,196,168,0.12)" strokeWidth="1" />
      {/* Cube houses */}
      <rect x="310" y="80" width="20" height="20" fill="rgba(77,196,168,0.15)" transform="rotate(45 320 90)" />
      <rect x="340" y="80" width="20" height="20" fill="rgba(77,196,168,0.12)" transform="rotate(45 350 90)" />
      {/* Water */}
      <path d="M40 145 Q120 138 200 142 Q280 146 360 140" stroke="rgba(77,196,168,0.12)" strokeWidth="1" fill="none" />
    </svg>
  ),

  Hamburg: ({ className }) => (
    <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Elbphilharmonie */}
      <rect x="155" y="70" width="90" height="60" fill="rgba(77,196,168,0.12)" />
      {/* Wave roof */}
      <path d="M150 70 Q170 45 190 55 Q210 40 230 50 Q250 42 255 70" stroke="rgba(77,196,168,0.25)" strokeWidth="2" fill="rgba(77,196,168,0.08)" />
      {/* Windows grid */}
      <line x1="175" y1="80" x2="175" y2="125" stroke="rgba(77,196,168,0.1)" strokeWidth="0.5" />
      <line x1="200" y1="80" x2="200" y2="125" stroke="rgba(77,196,168,0.1)" strokeWidth="0.5" />
      <line x1="225" y1="80" x2="225" y2="125" stroke="rgba(77,196,168,0.1)" strokeWidth="0.5" />
      {/* Warehouse to the left */}
      <rect x="90" y="90" width="40" height="40" fill="rgba(77,196,168,0.1)" />
      <path d="M88 90 L110 75 L132 90" fill="rgba(77,196,168,0.12)" />
      {/* Ship/harbor */}
      <path d="M280 120 Q300 110 330 115 Q345 118 350 125 L275 125 Z" stroke="rgba(77,196,168,0.18)" strokeWidth="1.5" fill="rgba(77,196,168,0.05)" />
      <line x1="310" y1="115" x2="310" y2="100" stroke="rgba(77,196,168,0.15)" strokeWidth="1" />
      {/* Water */}
      <path d="M40 145 Q120 138 200 142 Q280 146 360 140" stroke="rgba(77,196,168,0.12)" strokeWidth="1" fill="none" />
    </svg>
  ),

}

// Fallback for custom cities
const FallbackIllustration = ({ className }) => (
  <svg viewBox="0 0 400 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="200" cy="70" r="25" stroke="rgba(77,196,168,0.2)" strokeWidth="1.5" fill="rgba(77,196,168,0.05)" />
    <path d="M200 95 L200 130" stroke="rgba(77,196,168,0.15)" strokeWidth="1.5" />
    <path d="M185 45 Q200 30 215 45" stroke="rgba(77,196,168,0.15)" strokeWidth="1.5" fill="none" />
    <path d="M40 145 Q120 138 200 143 Q280 148 360 141" stroke="rgba(77,196,168,0.12)" strokeWidth="1" fill="none" />
  </svg>
)

export default function CityIllustration({ city, className = '', style = {} }) {
  const Illustration = illustrations[city] || FallbackIllustration
  return (
    <div className={className} style={{ ...style }}>
      <Illustration className="" style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
