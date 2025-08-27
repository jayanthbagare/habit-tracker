export default function Logo({ size = 40, className = "" }) {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Main circle background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #374151 0%, #1f2937 50%, #111827 100%)'
        }}
      />
      
      {/* Progress ring - partial completion */}
      <div 
        className="absolute inset-1 rounded-lg border-2"
        style={{
          borderColor: '#9ca3af transparent transparent #9ca3af',
          transform: 'rotate(-45deg)'
        }}
      />
      
      {/* Inner checkmark */}
      <div className="relative z-10 flex items-center justify-center">
        <svg 
          width={size * 0.4} 
          height={size * 0.4} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      </div>
      
      {/* Subtle shine effect */}
      <div 
        className="absolute inset-1 rounded-lg opacity-20"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, white 40%, transparent 60%)'
        }}
      />
    </div>
  )
}

// Large version for splash screens or headers
export function LogoLarge({ size = 120 }) {
  return (
    <div className="relative">
      <Logo size={size} />
      {/* Animated pulse effect for large version */}
      <div 
        className="absolute inset-0 rounded-xl animate-pulse opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(156,163,175,0.3) 0%, transparent 70%)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
    </div>
  )
}

// App icon version (square, high contrast)
export function AppIcon({ size = 192 }) {
  return (
    <div 
      className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
      style={{ width: size, height: size }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(156,163,175,0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(156,163,175,0.1) 0%, transparent 50%)
            `
          }}
        />
      </div>
      
      {/* Main progress circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="relative"
          style={{ width: size * 0.7, height: size * 0.7 }}
        >
          {/* Background circle */}
          <div 
            className="absolute inset-0 border-4 border-gray-700 rounded-full"
          />
          
          {/* Progress arc (75% complete) */}
          <div 
            className="absolute inset-0 border-4 border-transparent rounded-full"
            style={{
              borderTopColor: '#9ca3af',
              borderRightColor: '#9ca3af',
              borderBottomColor: '#9ca3af',
              transform: 'rotate(-90deg)'
            }}
          />
          
          {/* Center checkmark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              width={size * 0.25} 
              height={size * 0.25} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Corner accent */}
      <div 
        className="absolute top-0 right-0 w-8 h-8"
        style={{
          background: 'linear-gradient(-135deg, rgba(156,163,175,0.6) 0%, transparent 60%)'
        }}
      />
    </div>
  )
}