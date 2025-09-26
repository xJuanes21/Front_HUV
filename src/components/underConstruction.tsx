'use client';

const UnderConstruction = ({ 
  title = "Página en Construcción",
  subtitle = "Estamos trabajando en esta funcionalidad",
  moduleName = "Sistema MIS - HUV",
  estimatedDate = "Próximamente disponible"
}) => {
  return (
    <div className="min-h-[600px] flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Construction Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            {/* Main construction cone */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
            
            {/* Floating tools */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
              </svg>
            </div>
            
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center animate-ping">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Progress bars animation */}
          <div className="space-y-2 max-w-md mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{width: '45%'}}></div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 rounded-full animate-pulse" style={{width: '78%', animationDelay: '0.5s'}}></div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full animate-pulse" style={{width: '23%', animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-3">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {moduleName}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
            <p className="text-lg text-gray-600">{subtitle}</p>
          </div>

          {/* Features Coming Soon */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Interfaz Intuitiva</h3>
              <p className="text-xs text-gray-600 mt-1">Diseño optimizado para el personal médico</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Alta Seguridad</h3>
              <p className="text-xs text-gray-600 mt-1">Cumple estándares hospitalarios</p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Tiempo Real</h3>
              <p className="text-xs text-gray-600 mt-1">Actualizaciones instantáneas</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">Progreso del desarrollo:</div>
              <div className="font-semibold text-gray-900">67%</div>
            </div>
            <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 to-red-600 rounded-full transition-all duration-1000 ease-out" style={{width: '67%'}}></div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">{estimatedDate}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              Volver
            </button>
            
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 16.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
              Notificarme
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              ¿Necesitas esta funcionalidad urgentemente?{' '}
              <a href="mailto:soporte@huv.gov.co" className="text-blue-600 hover:text-blue-700 font-medium">
                Contacta a soporte técnico
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;