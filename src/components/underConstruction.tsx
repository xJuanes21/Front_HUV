'use client';

import { Construction, Clock, Code } from 'lucide-react';

const UnderConstruction = ({ 
  title = "En Construcción",
  moduleName = "Nueva Funcionalidad",
  className = ""
}) => {
  return (
    <div className={`min-h-[400px] flex items-center justify-center p-6 ${className}`}>
      <div className="max-w-lg mx-auto text-center">
        
        {/* Main Construction Visual */}
        <div className="relative mb-8">
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-6 gap-2 h-40 w-40 mx-auto">
              {Array.from({ length: 24 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-gray-400 rounded-sm animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>

          {/* Central construction icon */}
          <div className="relative z-10 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-600/30 rounded-full animate-pulse"></div>
            <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Construction className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-4 left-8 w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-8 right-6 w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-6 left-6 w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        </div>

        {/* Content Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-xl">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            En desarrollo activo
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
          <p className="text-gray-600 mb-8 text-lg">{moduleName}</p>

          {/* Progress indicators */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span>Desarrollo</span>
              </div>
              <span>En progreso...</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* ETA */}
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>Próximamente disponible</span>
          </div>

        </div>

        {/* Subtle animation dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>

      </div>
    </div>
  );
};

export default UnderConstruction;