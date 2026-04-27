export function Arabesque({ className = '' }) {
  return (
    <svg viewBox="0 0 200 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="30%" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="70%" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="10" y1="20" x2="190" y2="20" stroke="url(#gold-grad)" strokeWidth="0.5" />
      <g fill="currentColor" opacity="0.7">
        <path d="M100,8 C105,8 108,12 108,16 C108,12 112,8 117,8 C112,8 108,4 108,0 C108,4 105,8 100,8Z" transform="translate(-8,4)" />
        <path d="M100,8 C105,8 108,12 108,16 C108,12 112,8 117,8 C112,8 108,4 108,0 C108,4 105,8 100,8Z" transform="translate(-8,4) scale(-1,1) translate(-216,0)" />
        <circle cx="100" cy="20" r="2" />
        <circle cx="70" cy="20" r="1.2" />
        <circle cx="130" cy="20" r="1.2" />
        <circle cx="45" cy="20" r="0.8" />
        <circle cx="155" cy="20" r="0.8" />
      </g>
      <line x1="10" y1="20" x2="190" y2="20" stroke="url(#gold-grad)" strokeWidth="0.5" transform="translate(0,8)" />
    </svg>
  )
}

export function CarpetBorder({ className = '' }) {
  return (
    <svg viewBox="0 0 400 24" className={className} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <pattern id="carpet-pattern" x="0" y="0" width="48" height="24" patternUnits="userSpaceOnUse">
          <path d="M24,2 L28,6 L24,10 L20,6Z" fill="currentColor" opacity="0.3" />
          <path d="M24,14 L28,18 L24,22 L20,18Z" fill="currentColor" opacity="0.15" />
          <path d="M12,8 L16,12 L12,16 L8,12Z" fill="currentColor" opacity="0.2" />
          <path d="M36,8 L40,12 L36,16 L32,12Z" fill="currentColor" opacity="0.2" />
          <circle cx="0" cy="12" r="1.5" fill="currentColor" opacity="0.25" />
          <circle cx="48" cy="12" r="1.5" fill="currentColor" opacity="0.25" />
          <circle cx="24" cy="12" r="1" fill="currentColor" opacity="0.4" />
        </pattern>
      </defs>
      <rect width="400" height="24" fill="url(#carpet-pattern)" />
    </svg>
  )
}

export function Medallion({ className = '', size = 80 }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="med-grad">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="70%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#med-grad)" />
      <g fill="none" stroke="currentColor" opacity="0.3" strokeWidth="0.6">
        <circle cx="40" cy="40" r="30" />
        <circle cx="40" cy="40" r="20" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
          <line
            key={angle}
            x1="40" y1="10" x2="40" y2="20"
            transform={`rotate(${angle} 40 40)`}
          />
        ))}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(angle => (
          <line
            key={angle}
            x1="40" y1="14" x2="40" y2="20"
            transform={`rotate(${angle} 40 40)`}
          />
        ))}
      </g>
      <g fill="currentColor" opacity="0.25">
        {[0, 90, 180, 270].map(angle => (
          <path
            key={angle}
            d="M40,12 C42,16 44,18 40,22 C36,18 38,16 40,12Z"
            transform={`rotate(${angle} 40 40)`}
          />
        ))}
      </g>
      <circle cx="40" cy="40" r="3" fill="currentColor" opacity="0.2" />
    </svg>
  )
}

export function GeometricTile({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="tile-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" />
          <path d="M10,0 L20,10 L10,20 L0,10Z" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
          <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.15" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#tile-pattern)" />
    </svg>
  )
}

export function VerseDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-3">
      <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-gold-500/30 dark:to-gold-400/20" />
      <svg viewBox="0 0 16 16" className="w-3 h-3 text-gold-500/50 dark:text-gold-400/30" fill="currentColor">
        <path d="M8,0 L10,6 L16,8 L10,10 L8,16 L6,10 L0,8 L6,6Z" />
      </svg>
      <div className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-gold-500/30 dark:to-gold-400/20" />
    </div>
  )
}
