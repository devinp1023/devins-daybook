// Shared city landmark definitions
// Coordinate space: 400 x 160 (matching SVG viewBox)
// Color base: rgb(77,196,168) with per-element opacity
//
// Element types:
//   path:    { type:'path', d, stroke, fill, width, opacity, dash }
//   rect:    { type:'rect', x, y, w, h, stroke, fill, opacity, transform }
//   circle:  { type:'circle', cx, cy, r, stroke, fill, opacity, strokeWidth }
//   ellipse: { type:'ellipse', cx, cy, rx, ry, stroke, fill, opacity }
//   line:    { type:'line', x1, y1, x2, y2, opacity, width }

const T = (opacity) => `rgba(77,196,168,${opacity})`

export const LANDMARKS = {
  Venice: [
    { type: 'path', d: 'M80 130 Q200 60 320 130', stroke: true, width: 2, opacity: 0.3 },
    { type: 'path', d: 'M100 130 Q200 75 300 130', stroke: true, width: 1.5, opacity: 0.15 },
    { type: 'rect', x: 170, y: 80, w: 8, h: 50, fill: true, opacity: 0.2 },
    { type: 'rect', x: 222, y: 80, w: 8, h: 50, fill: true, opacity: 0.2 },
    { type: 'path', d: 'M140 140 Q160 132 200 135 Q240 138 250 140', stroke: true, width: 2, opacity: 0.4 },
    { type: 'line', x1: 195, y1: 135, x2: 195, y2: 118, opacity: 0.3, width: 1.5 },
    { type: 'path', d: 'M40 150 Q80 145 120 150 Q160 155 200 150 Q240 145 280 150 Q320 155 360 150', stroke: true, width: 1, opacity: 0.15 },
  ],

  Florence: [
    { type: 'path', d: 'M160 130 Q160 50 200 35 Q240 50 240 130', stroke: true, fill: 0.05, width: 2, opacity: 0.3 },
    { type: 'line', x1: 200, y1: 35, x2: 200, y2: 20, opacity: 0.3, width: 1.5 },
    { type: 'circle', cx: 200, cy: 17, r: 3, fill: true, opacity: 0.3 },
    { type: 'rect', x: 190, y: 28, w: 20, h: 8, fill: true, opacity: 0.15 },
    { type: 'rect', x: 280, y: 50, w: 22, h: 80, fill: true, opacity: 0.15 },
    { type: 'path', d: 'M278 50 L291 30 L304 50', fill: true, opacity: 0.2 },
    { type: 'path', d: 'M100 130 Q115 115 130 130', stroke: true, width: 1.5, opacity: 0.15 },
    { type: 'path', d: 'M130 130 Q145 115 160 130', stroke: true, width: 1.5, opacity: 0.15 },
  ],

  Rome: [
    { type: 'path', d: 'M120 130 Q120 60 200 45 Q280 60 280 130', stroke: true, width: 2, opacity: 0.25 },
    { type: 'path', d: 'M140 130 Q140 75 200 63 Q260 75 260 130', stroke: true, width: 1.5, opacity: 0.2 },
    { type: 'path', d: 'M150 100 Q158 90 166 100', stroke: true, width: 1.5, opacity: 0.3 },
    { type: 'path', d: 'M175 95 Q183 85 191 95', stroke: true, width: 1.5, opacity: 0.3 },
    { type: 'path', d: 'M200 93 Q208 83 216 93', stroke: true, width: 1.5, opacity: 0.3 },
    { type: 'path', d: 'M225 95 Q233 85 241 95', stroke: true, width: 1.5, opacity: 0.3 },
    { type: 'path', d: 'M145 120 Q155 108 165 120', stroke: true, width: 1.5, opacity: 0.2 },
    { type: 'path', d: 'M172 118 Q182 106 192 118', stroke: true, width: 1.5, opacity: 0.2 },
    { type: 'path', d: 'M199 117 Q209 105 219 117', stroke: true, width: 1.5, opacity: 0.2 },
    { type: 'path', d: 'M226 118 Q236 106 246 118', stroke: true, width: 1.5, opacity: 0.2 },
  ],

  Amalfi: [
    { type: 'rect', x: 120, y: 60, w: 25, h: 70, fill: true, opacity: 0.15 },
    { type: 'rect', x: 150, y: 75, w: 20, h: 55, fill: true, opacity: 0.12 },
    { type: 'rect', x: 175, y: 50, w: 22, h: 80, fill: true, opacity: 0.18 },
    { type: 'rect', x: 202, y: 65, w: 18, h: 65, fill: true, opacity: 0.13 },
    { type: 'rect', x: 225, y: 80, w: 24, h: 50, fill: true, opacity: 0.15 },
    { type: 'path', d: 'M100 130 Q110 125 120 130 L250 130 Q260 125 270 130', stroke: true, width: 1.5, opacity: 0.2 },
    { type: 'path', d: 'M30 145 Q100 138 200 142 Q300 146 370 140', stroke: true, width: 1, opacity: 0.15 },
    { type: 'circle', cx: 330, cy: 45, r: 18, stroke: true, fill: 0.05, opacity: 0.2, strokeWidth: 1.5 },
  ],

  Nice: [
    { type: 'line', x1: 100, y1: 130, x2: 105, y2: 60, opacity: 0.25, width: 3 },
    { type: 'path', d: 'M105 60 Q80 40 60 55', stroke: true, width: 2, opacity: 0.3 },
    { type: 'path', d: 'M105 60 Q90 35 75 42', stroke: true, width: 2, opacity: 0.25 },
    { type: 'path', d: 'M105 60 Q120 35 140 45', stroke: true, width: 2, opacity: 0.3 },
    { type: 'path', d: 'M105 60 Q130 40 145 55', stroke: true, width: 2, opacity: 0.25 },
    { type: 'line', x1: 40, y1: 130, x2: 360, y2: 130, opacity: 0.15, width: 1.5 },
    { type: 'path', d: 'M250 90 Q275 70 300 90', stroke: true, fill: 0.08, width: 2, opacity: 0.25 },
    { type: 'line', x1: 275, y1: 90, x2: 275, y2: 130, opacity: 0.2, width: 1.5 },
    { type: 'path', d: 'M40 145 Q100 140 160 145 Q220 150 280 145 Q340 140 370 145', stroke: true, width: 1, opacity: 0.12 },
  ],

  Lyon: [
    { type: 'rect', x: 160, y: 50, w: 80, h: 80, fill: true, opacity: 0.12 },
    { type: 'path', d: 'M155 50 L200 20 L245 50', fill: true, opacity: 0.15 },
    { type: 'rect', x: 190, y: 15, w: 8, h: 35, fill: true, opacity: 0.2 },
    { type: 'circle', cx: 194, cy: 12, r: 4, fill: true, opacity: 0.25 },
    { type: 'path', d: 'M40 140 Q120 133 200 138 Q280 143 360 136', stroke: true, width: 1, opacity: 0.15 },
    { type: 'path', d: 'M40 150 Q120 143 200 148 Q280 153 360 146', stroke: true, width: 1, opacity: 0.12 },
    { type: 'path', d: 'M100 130 Q150 100 200 130', stroke: true, fill: 0.05, width: 1.5, opacity: 0.1 },
  ],

  Paris: [
    { type: 'line', x1: 200, y1: 15, x2: 200, y2: 25, opacity: 0.4, width: 2 },
    { type: 'path', d: 'M170 130 L190 70 L200 25 L210 70 L230 130', stroke: true, width: 2, opacity: 0.3 },
    { type: 'line', x1: 182, y1: 90, x2: 218, y2: 90, opacity: 0.25, width: 1.5 },
    { type: 'line', x1: 175, y1: 110, x2: 225, y2: 110, opacity: 0.2, width: 1.5 },
    { type: 'path', d: 'M300 130 Q320 100 340 130', stroke: true, width: 1.5, opacity: 0.15 },
    { type: 'path', d: 'M40 145 Q120 138 200 143 Q280 148 360 141', stroke: true, width: 1, opacity: 0.12 },
  ],

  Brussels: [
    { type: 'rect', x: 185, y: 40, w: 30, h: 90, fill: true, opacity: 0.15 },
    { type: 'path', d: 'M183 40 L200 10 L217 40', fill: true, opacity: 0.2 },
    { type: 'line', x1: 200, y1: 10, x2: 200, y2: 2, opacity: 0.3, width: 1.5 },
    { type: 'rect', x: 130, y: 70, w: 50, h: 60, fill: true, opacity: 0.1 },
    { type: 'path', d: 'M130 70 L155 55 L180 70', fill: true, opacity: 0.12 },
    { type: 'rect', x: 220, y: 75, w: 50, h: 55, fill: true, opacity: 0.1 },
    { type: 'path', d: 'M220 75 L245 60 L270 75', fill: true, opacity: 0.12 },
    { type: 'circle', cx: 170, cy: 140, r: 1.5, fill: true, opacity: 0.1 },
    { type: 'circle', cx: 200, cy: 142, r: 1.5, fill: true, opacity: 0.1 },
    { type: 'circle', cx: 230, cy: 140, r: 1.5, fill: true, opacity: 0.1 },
  ],

  Amsterdam: [
    { type: 'rect', x: 100, y: 60, w: 30, h: 70, fill: true, opacity: 0.15 },
    { type: 'path', d: 'M100 60 L115 45 L130 60', fill: true, opacity: 0.18 },
    { type: 'rect', x: 135, y: 55, w: 28, h: 75, fill: true, opacity: 0.12 },
    { type: 'path', d: 'M135 55 Q149 40 163 55', fill: true, opacity: 0.15 },
    { type: 'rect', x: 168, y: 50, w: 32, h: 80, fill: true, opacity: 0.17 },
    { type: 'path', d: 'M168 50 L184 35 L200 50', fill: true, opacity: 0.2 },
    { type: 'rect', x: 205, y: 58, w: 26, h: 72, fill: true, opacity: 0.13 },
    { type: 'path', d: 'M205 58 L218 46 L231 58', fill: true, opacity: 0.16 },
    { type: 'rect', x: 236, y: 55, w: 30, h: 75, fill: true, opacity: 0.14 },
    { type: 'path', d: 'M236 55 Q251 42 266 55', fill: true, opacity: 0.17 },
    { type: 'path', d: 'M60 140 Q140 133 200 137 Q260 141 340 135', stroke: true, width: 1.5, opacity: 0.2 },
    { type: 'circle', cx: 320, cy: 125, r: 8, stroke: true, opacity: 0.2, strokeWidth: 1.5 },
    { type: 'circle', cx: 340, cy: 125, r: 8, stroke: true, opacity: 0.2, strokeWidth: 1.5 },
    { type: 'path', d: 'M320 125 L330 112 L340 125', stroke: true, width: 1.5, opacity: 0.2 },
  ],

  Berlin: [
    { type: 'rect', x: 140, y: 70, w: 12, h: 60, fill: true, opacity: 0.2 },
    { type: 'rect', x: 165, y: 70, w: 12, h: 60, fill: true, opacity: 0.2 },
    { type: 'rect', x: 190, y: 70, w: 12, h: 60, fill: true, opacity: 0.2 },
    { type: 'rect', x: 215, y: 70, w: 12, h: 60, fill: true, opacity: 0.2 },
    { type: 'rect', x: 240, y: 70, w: 12, h: 60, fill: true, opacity: 0.2 },
    { type: 'rect', x: 135, y: 62, w: 122, h: 10, fill: true, opacity: 0.15 },
    { type: 'rect', x: 175, y: 45, w: 50, h: 17, fill: true, opacity: 0.12 },
    { type: 'path', d: 'M185 45 L200 30 L215 45', fill: true, opacity: 0.18 },
    { type: 'line', x1: 330, y1: 130, x2: 330, y2: 30, opacity: 0.15, width: 1.5 },
    { type: 'circle', cx: 330, cy: 45, r: 8, fill: 0.1, stroke: true, opacity: 0.15, strokeWidth: 1 },
  ],

  Munich: [
    { type: 'rect', x: 160, y: 50, w: 25, h: 80, fill: true, opacity: 0.15 },
    { type: 'path', d: 'M158 50 Q172 25 187 50', fill: true, opacity: 0.2 },
    { type: 'rect', x: 215, y: 50, w: 25, h: 80, fill: true, opacity: 0.15 },
    { type: 'path', d: 'M213 50 Q227 25 242 50', fill: true, opacity: 0.2 },
    { type: 'rect', x: 185, y: 70, w: 30, h: 60, fill: true, opacity: 0.1 },
    { type: 'path', d: 'M40 130 Q80 95 120 120 Q160 90 200 115 Q240 85 280 110 Q320 90 360 130', stroke: true, fill: 0.03, width: 1.5, opacity: 0.1 },
    { type: 'ellipse', cx: 330, cy: 128, rx: 20, ry: 5, stroke: true, opacity: 0.15, strokeWidth: 1 },
  ],

  Eze: [
    { type: 'path', d: 'M140 130 Q170 80 200 75 Q230 80 260 130', stroke: true, fill: 0.05, width: 1.5, opacity: 0.15 },
    { type: 'rect', x: 188, y: 45, w: 24, h: 30, fill: true, opacity: 0.18 },
    { type: 'path', d: 'M186 45 L200 30 L214 45', fill: true, opacity: 0.22 },
    { type: 'rect', x: 165, y: 72, w: 16, h: 22, fill: true, opacity: 0.14 },
    { type: 'rect', x: 184, y: 68, w: 14, h: 18, fill: true, opacity: 0.12 },
    { type: 'rect', x: 218, y: 70, w: 18, h: 24, fill: true, opacity: 0.15 },
    { type: 'path', d: 'M200 100 Q180 110 190 120 Q210 130 200 140', stroke: true, width: 1.5, opacity: 0.2 },
    { type: 'path', d: 'M40 150 Q120 144 200 148 Q280 152 360 146', stroke: true, width: 1, opacity: 0.12 },
  ],

  Monaco: [
    { type: 'rect', x: 155, y: 65, w: 90, h: 65, fill: true, opacity: 0.12 },
    { type: 'path', d: 'M150 65 L200 35 L250 65', fill: true, opacity: 0.15 },
    { type: 'path', d: 'M185 65 Q200 50 215 65', stroke: true, fill: 0.08, width: 1.5, opacity: 0.25 },
    { type: 'rect', x: 170, y: 75, w: 5, h: 40, fill: true, opacity: 0.18 },
    { type: 'rect', x: 185, y: 75, w: 5, h: 40, fill: true, opacity: 0.18 },
    { type: 'rect', x: 210, y: 75, w: 5, h: 40, fill: true, opacity: 0.18 },
    { type: 'rect', x: 225, y: 75, w: 5, h: 40, fill: true, opacity: 0.18 },
    { type: 'path', d: 'M80 140 Q130 120 180 135 Q230 145 300 130 Q340 125 370 135', stroke: true, width: 2, opacity: 0.2, dash: '8 4' },
    { type: 'path', d: 'M310 100 L330 100 L340 110 L300 110 Z', stroke: true, fill: 0.06, width: 1.5, opacity: 0.2 },
    { type: 'line', x1: 320, y1: 100, x2: 320, y2: 85, opacity: 0.2, width: 1 },
  ],

  Geneva: [
    { type: 'path', d: 'M200 130 Q198 80 200 20', stroke: true, width: 2.5, opacity: 0.3 },
    { type: 'path', d: 'M200 20 Q195 15 192 25', stroke: true, width: 1.5, opacity: 0.2 },
    { type: 'path', d: 'M200 20 Q205 15 208 25', stroke: true, width: 1.5, opacity: 0.2 },
    { type: 'circle', cx: 195, cy: 35, r: 2, fill: true, opacity: 0.15 },
    { type: 'circle', cx: 206, cy: 30, r: 1.5, fill: true, opacity: 0.12 },
    { type: 'circle', cx: 193, cy: 45, r: 1.5, fill: true, opacity: 0.1 },
    { type: 'path', d: 'M40 135 Q120 128 200 132 Q280 136 360 130', stroke: true, width: 1.5, opacity: 0.2 },
    { type: 'path', d: 'M40 145 Q120 138 200 142 Q280 146 360 140', stroke: true, width: 1, opacity: 0.12 },
    { type: 'path', d: 'M60 120 Q100 90 140 115 Q180 85 220 110 Q260 80 300 108 Q330 90 360 120', stroke: true, width: 1.5, opacity: 0.1 },
  ],

  Antwerp: [
    { type: 'rect', x: 188, y: 50, w: 24, h: 80, fill: true, opacity: 0.15 },
    { type: 'path', d: 'M185 50 L200 10 L215 50', fill: true, opacity: 0.2 },
    { type: 'line', x1: 200, y1: 10, x2: 200, y2: 2, opacity: 0.3, width: 1.5 },
    { type: 'path', d: 'M193 65 Q200 58 207 65', stroke: true, width: 1, opacity: 0.25 },
    { type: 'path', d: 'M193 85 Q200 78 207 85', stroke: true, width: 1, opacity: 0.25 },
    { type: 'path', d: 'M310 70 L325 55 L340 70 L325 85 Z', stroke: true, fill: 0.08, width: 1.5, opacity: 0.25 },
    { type: 'path', d: 'M316 70 L325 61 L334 70', stroke: true, width: 1, opacity: 0.15 },
    { type: 'rect', x: 120, y: 80, w: 28, h: 50, fill: true, opacity: 0.1 },
    { type: 'path', d: 'M118 80 L134 65 L150 80', fill: true, opacity: 0.12 },
    { type: 'rect', x: 250, y: 85, w: 25, h: 45, fill: true, opacity: 0.1 },
    { type: 'path', d: 'M248 85 L262 72 L277 85', fill: true, opacity: 0.12 },
  ],

  Rotterdam: [
    { type: 'path', d: 'M100 130 L200 50 L300 130', stroke: true, width: 2, opacity: 0.25 },
    { type: 'line', x1: 60, y1: 130, x2: 340, y2: 130, opacity: 0.2, width: 2 },
    { type: 'line', x1: 200, y1: 50, x2: 130, y2: 130, opacity: 0.12, width: 1 },
    { type: 'line', x1: 200, y1: 50, x2: 160, y2: 130, opacity: 0.12, width: 1 },
    { type: 'line', x1: 200, y1: 50, x2: 240, y2: 130, opacity: 0.12, width: 1 },
    { type: 'line', x1: 200, y1: 50, x2: 270, y2: 130, opacity: 0.12, width: 1 },
    { type: 'rect', x: 310, y: 80, w: 20, h: 20, fill: true, opacity: 0.15, transform: { rotate: 45, cx: 320, cy: 90 } },
    { type: 'rect', x: 340, y: 80, w: 20, h: 20, fill: true, opacity: 0.12, transform: { rotate: 45, cx: 350, cy: 90 } },
    { type: 'path', d: 'M40 145 Q120 138 200 142 Q280 146 360 140', stroke: true, width: 1, opacity: 0.12 },
  ],

  Hamburg: [
    { type: 'rect', x: 155, y: 70, w: 90, h: 60, fill: true, opacity: 0.12 },
    { type: 'path', d: 'M150 70 Q170 45 190 55 Q210 40 230 50 Q250 42 255 70', stroke: true, fill: 0.08, width: 2, opacity: 0.25 },
    { type: 'line', x1: 175, y1: 80, x2: 175, y2: 125, opacity: 0.1, width: 0.5 },
    { type: 'line', x1: 200, y1: 80, x2: 200, y2: 125, opacity: 0.1, width: 0.5 },
    { type: 'line', x1: 225, y1: 80, x2: 225, y2: 125, opacity: 0.1, width: 0.5 },
    { type: 'rect', x: 90, y: 90, w: 40, h: 40, fill: true, opacity: 0.1 },
    { type: 'path', d: 'M88 90 L110 75 L132 90', fill: true, opacity: 0.12 },
    { type: 'path', d: 'M280 120 Q300 110 330 115 Q345 118 350 125 L275 125 Z', stroke: true, fill: 0.05, width: 1.5, opacity: 0.18 },
    { type: 'line', x1: 310, y1: 115, x2: 310, y2: 100, opacity: 0.15, width: 1 },
    { type: 'path', d: 'M40 145 Q120 138 200 142 Q280 146 360 140', stroke: true, width: 1, opacity: 0.12 },
  ],

  Chicago: [
    { type: 'rect', x: 175, y: 20, w: 50, h: 120, fill: true, opacity: 0.15 },
    { type: 'line', x1: 188, y1: 20, x2: 188, y2: -10, opacity: 0.2, width: 1 },
    { type: 'line', x1: 212, y1: 20, x2: 212, y2: -10, opacity: 0.2, width: 1 },
    { type: 'rect', x: 167, y: 60, w: 66, h: 80, fill: true, opacity: 0.1 },
    { type: 'rect', x: 90, y: 70, w: 45, h: 70, fill: true, opacity: 0.1 },
    { type: 'rect', x: 55, y: 80, w: 30, h: 60, fill: true, opacity: 0.08 },
    { type: 'rect', x: 260, y: 50, w: 50, h: 90, fill: true, opacity: 0.1 },
    { type: 'rect', x: 315, y: 70, w: 35, h: 70, fill: true, opacity: 0.08 },
    { type: 'path', d: 'M140 148 Q165 140 200 138 Q235 140 260 148 Q230 146 200 147 Q170 146 140 148', stroke: true, fill: 0.06, width: 1, opacity: 0.15 },
  ],

  _fallback: [
    { type: 'circle', cx: 200, cy: 70, r: 25, stroke: true, fill: 0.05, opacity: 0.2, strokeWidth: 1.5 },
    { type: 'path', d: 'M200 95 L200 130', stroke: true, width: 1.5, opacity: 0.15 },
    { type: 'path', d: 'M185 45 Q200 30 215 45', stroke: true, width: 1.5, opacity: 0.15 },
    { type: 'path', d: 'M40 145 Q120 138 200 143 Q280 148 360 141', stroke: true, width: 1, opacity: 0.12 },
  ],
}

export function getLandmark(city) {
  return LANDMARKS[city] || LANDMARKS._fallback
}

// ─── Canvas 2D Renderer ────────────────────────────────────
// Draws a city landmark onto a canvas context, scaled and positioned
// into a target rectangle. Uses postcard-style coloring (#1a6a58).

function parseSvgPath(d) {
  // Tokenize SVG path d attribute into commands
  const tokens = d.match(/[MmLlQqCcAaZz]|[-+]?[0-9]*\.?[0-9]+/g) || []
  return tokens
}

function replayPath(ctx, d, sx, sy, tx, ty) {
  const tokens = parseSvgPath(d)
  let i = 0
  ctx.beginPath()
  while (i < tokens.length) {
    const cmd = tokens[i]
    switch (cmd) {
      case 'M':
        ctx.moveTo(parseFloat(tokens[i + 1]) * sx + tx, parseFloat(tokens[i + 2]) * sy + ty)
        i += 3
        break
      case 'L':
        ctx.lineTo(parseFloat(tokens[i + 1]) * sx + tx, parseFloat(tokens[i + 2]) * sy + ty)
        i += 3
        break
      case 'Q':
        ctx.quadraticCurveTo(
          parseFloat(tokens[i + 1]) * sx + tx, parseFloat(tokens[i + 2]) * sy + ty,
          parseFloat(tokens[i + 3]) * sx + tx, parseFloat(tokens[i + 4]) * sy + ty
        )
        i += 5
        break
      case 'Z':
        ctx.closePath()
        i += 1
        break
      default:
        i += 1
    }
  }
}

export function drawLandmarkOnCanvas(ctx, city, targetX, targetY, targetW, targetH) {
  const elements = getLandmark(city)
  const sx = targetW / 400
  const sy = targetH / 160

  ctx.save()

  for (const el of elements) {
    ctx.save()
    ctx.globalAlpha = el.opacity || 0.15
    ctx.strokeStyle = '#1a6a58'
    ctx.fillStyle = '#1a6a58'
    ctx.lineWidth = (el.width || 1) * Math.min(sx, sy)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (el.dash) {
      const parts = el.dash.split(' ').map((n) => parseFloat(n) * sx)
      ctx.setLineDash(parts)
    } else {
      ctx.setLineDash([])
    }

    switch (el.type) {
      case 'path': {
        replayPath(ctx, el.d, sx, sy, targetX, targetY)
        if (el.fill) {
          ctx.globalAlpha = typeof el.fill === 'number' ? el.fill : el.opacity
          ctx.fill()
        }
        if (el.stroke) {
          ctx.globalAlpha = el.opacity
          ctx.stroke()
        }
        break
      }
      case 'rect': {
        const rx = el.x * sx + targetX
        const ry = el.y * sy + targetY
        const rw = el.w * sx
        const rh = el.h * sy
        if (el.transform) {
          const tcx = el.transform.cx * sx + targetX
          const tcy = el.transform.cy * sy + targetY
          ctx.translate(tcx, tcy)
          ctx.rotate((el.transform.rotate * Math.PI) / 180)
          ctx.translate(-tcx, -tcy)
        }
        if (el.fill) {
          ctx.fillRect(rx, ry, rw, rh)
        }
        if (el.stroke) {
          ctx.strokeRect(rx, ry, rw, rh)
        }
        break
      }
      case 'circle': {
        const ccx = el.cx * sx + targetX
        const ccy = el.cy * sy + targetY
        const cr = el.r * Math.min(sx, sy)
        if (el.strokeWidth) ctx.lineWidth = el.strokeWidth * Math.min(sx, sy)
        ctx.beginPath()
        ctx.arc(ccx, ccy, cr, 0, Math.PI * 2)
        if (el.fill) {
          const fillOpacity = typeof el.fill === 'number' ? el.fill : el.opacity
          ctx.globalAlpha = fillOpacity
          ctx.fill()
        }
        if (el.stroke) {
          ctx.globalAlpha = el.opacity
          ctx.stroke()
        }
        break
      }
      case 'ellipse': {
        const ecx = el.cx * sx + targetX
        const ecy = el.cy * sy + targetY
        const erx = el.rx * sx
        const ery = el.ry * sy
        if (el.strokeWidth) ctx.lineWidth = el.strokeWidth * Math.min(sx, sy)
        ctx.beginPath()
        ctx.ellipse(ecx, ecy, erx, ery, 0, 0, Math.PI * 2)
        if (el.fill) ctx.fill()
        if (el.stroke) ctx.stroke()
        break
      }
      case 'line': {
        ctx.beginPath()
        ctx.moveTo(el.x1 * sx + targetX, el.y1 * sy + targetY)
        ctx.lineTo(el.x2 * sx + targetX, el.y2 * sy + targetY)
        ctx.stroke()
        break
      }
    }
    ctx.restore()
  }

  ctx.restore()
}
