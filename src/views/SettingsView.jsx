import React from "react";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { IChevron } from "../components/ui/Icon.jsx";

export const SettingsView = ({ role, appSettings, setAppSettings, setView, setRole, driverProfile, unreadCount, setActiveJob }) => (
  <div className="min-h-screen bg-stone-100 pb-24">
    <div className="bg-white px-6 pt-12 pb-6 border-b border-stone-200 shadow-sm">
      <h2 className="text-2xl font-black text-stone-800">Configuración</h2>
      <p className="text-sm text-stone-500 mt-1">Ajustes de tu cuenta y la aplicación</p>
    </div>

    <div className="px-6 py-6 space-y-4">
      <Card>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">
              {role === 'producer' ? '🤠' : '🚚'}
            </div>
            <div>
              <p className="font-bold text-stone-800 text-lg">
                {role === 'producer' ? 'Estancia La Cimarrona' : (driverProfile?.name || 'Chofer')}
              </p>
              <p className="text-sm text-stone-500">{role === 'producer' ? 'Productor' : 'Transportista'}</p>
            </div>
          </div>
          {role === 'carrier' && (
            <Button full variant="secondary" onClick={() => setView('driver-profile')}>Editar perfil de chofer</Button>
          )}
        </div>
      </Card>

      <Card>
        <div className="divide-y divide-stone-100">
          <button onClick={() => setView('notifications')} className="w-full p-4 flex items-center gap-4 hover:bg-stone-50 transition-colors">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">🔔</div>
            <div className="flex-1 text-left">
              <p className="font-bold text-stone-800 text-sm">Notificaciones</p>
              <p className="text-xs text-stone-400">{unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}</p>
            </div>
            <IChevron className="text-stone-400" />
          </button>
          <button onClick={() => setView('help')} className="w-full p-4 flex items-center gap-4 hover:bg-stone-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">❓</div>
            <div className="flex-1 text-left">
              <p className="font-bold text-stone-800 text-sm">Ayuda y Soporte</p>
              <p className="text-xs text-stone-400">Preguntas frecuentes y contacto</p>
            </div>
            <IChevron className="text-stone-400" />
          </button>
          <button onClick={() => setView('history')} className="w-full p-4 flex items-center gap-4 hover:bg-stone-50 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">📄</div>
            <div className="flex-1 text-left">
              <p className="font-bold text-stone-800 text-sm">Historial de Viajes</p>
              <p className="text-xs text-stone-400">Todos tus fletes anteriores</p>
            </div>
            <IChevron className="text-stone-400" />
          </button>
        </div>
      </Card>

      <Card>
        <div className="p-5 space-y-4">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Preferencias</p>
          {[
            { key: 'pushNotifications', label: 'Notificaciones push', desc: 'Alertas de ofertas y viajes' },
            { key: 'chatNotifications', label: 'Notificaciones de chat', desc: 'Nuevos mensajes' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-stone-700">{item.label}</p>
                <p className="text-xs text-stone-400">{item.desc}</p>
              </div>
              <button onClick={() => setAppSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`w-12 h-7 rounded-full transition-colors ${appSettings[item.key] ? 'bg-emerald-500' : 'bg-stone-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${appSettings[item.key] ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="p-5 space-y-3">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Acerca de</p>
          <div className="flex justify-between"><span className="text-sm text-stone-600">Versión</span><span className="text-sm font-bold text-stone-800">1.0.0 (Preview)</span></div>
          <div className="flex justify-between"><span className="text-sm text-stone-600">Plataforma</span><span className="text-sm font-bold text-stone-800">iOS / Android</span></div>
        </div>
      </Card>

      <Button full variant="outline" className="border-red-200 text-red-600 hover:bg-red-50"
        onClick={() => { setRole(null); setView('landing'); setActiveJob(null); }}>
        Cerrar sesión
      </Button>
    </div>
  </div>
);
