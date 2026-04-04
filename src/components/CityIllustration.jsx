// Data-driven city illustrations using shared landmark definitions
import { getLandmark } from '../data/cityLandmarks'

const T = (opacity) => `rgba(77,196,168,${opacity})`

function renderElement(el, i) {
  const key = i
  switch (el.type) {
    case 'path': {
      const strokeColor = el.stroke ? T(el.opacity) : 'none'
      const fillColor = el.fill
        ? T(typeof el.fill === 'number' ? el.fill : el.opacity)
        : 'none'
      return (
        <path
          key={key}
          d={el.d}
          stroke={strokeColor}
          strokeWidth={el.width || 1}
          fill={fillColor}
          strokeDasharray={el.dash || undefined}
        />
      )
    }
    case 'rect': {
      const fillColor = el.fill ? T(typeof el.fill === 'number' ? el.fill : el.opacity) : 'none'
      const strokeColor = el.stroke ? T(el.opacity) : 'none'
      const transform = el.transform
        ? `rotate(${el.transform.rotate} ${el.transform.cx} ${el.transform.cy})`
        : undefined
      return (
        <rect
          key={key}
          x={el.x}
          y={el.y}
          width={el.w}
          height={el.h}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={el.stroke ? (el.width || 1) : undefined}
          transform={transform}
        />
      )
    }
    case 'circle': {
      const fillColor = el.fill
        ? T(typeof el.fill === 'number' ? el.fill : el.opacity)
        : 'none'
      const strokeColor = el.stroke ? T(el.opacity) : 'none'
      return (
        <circle
          key={key}
          cx={el.cx}
          cy={el.cy}
          r={el.r}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={el.strokeWidth || (el.stroke ? (el.width || 1) : undefined)}
        />
      )
    }
    case 'ellipse': {
      const fillColor = el.fill ? T(el.opacity) : 'none'
      const strokeColor = el.stroke ? T(el.opacity) : 'none'
      return (
        <ellipse
          key={key}
          cx={el.cx}
          cy={el.cy}
          rx={el.rx}
          ry={el.ry}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={el.strokeWidth || (el.stroke ? (el.width || 1) : undefined)}
        />
      )
    }
    case 'line': {
      return (
        <line
          key={key}
          x1={el.x1}
          y1={el.y1}
          x2={el.x2}
          y2={el.y2}
          stroke={T(el.opacity)}
          strokeWidth={el.width || 1}
        />
      )
    }
    default:
      return null
  }
}

export default function CityIllustration({ city, className = '', style = {} }) {
  const elements = getLandmark(city)
  return (
    <div className={className} style={{ ...style }}>
      <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        {elements.map(renderElement)}
      </svg>
    </div>
  )
}
