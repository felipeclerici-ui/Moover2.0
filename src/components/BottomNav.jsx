import React from "react";

export const BottomNav = ({ view, role, setView }) => {
  const tabs = role === 'producer' ? [
    { id: 'producer-home', label: 'Inicio', icon: '🏠' },
    { id: 'documents', label: 'Docs', icon: '📋' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'map-hub', label: 'Mapa', icon: '🗺️' },
    { id: 'settings', label: 'Más', icon: '⚙️' },
  ] : [
    { id: 'carrier-home', label: 'Inicio', icon: '🏠' },
    { id: 'documents', label: 'Docs', icon: '📋' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'map-hub', label: 'Mapa', icon: '🗺️' },
    { id: 'settings', label: 'Más', icon: '⚙️' },
  ];

  const activeTab = tabs.find(t => t.id === view)?.id
    || (view === 'balanzas' || view === 'establecimientos' ? 'map-hub' : null)
    || (view === 'notifications' || view === 'help' ? 'settings' : null)
    || (view === 'chat-detail' ? 'chat' : null)
    || tabs[0].id;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-2 pb-[env(safe-area-inset-bottom)] z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${isActive ? 'text-emerald-700' : 'text-stone-400'}`}
            >
              <span className={`text-xl mb-0.5 ${isActive ? 'scale-110' : ''} transition-transform`}>{tab.icon}</span>
              <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-700' : 'text-stone-400'}`}>{tab.label}</span>
              {isActive && <div className="w-5 h-0.5 bg-emerald-500 rounded-full mt-0.5"></div>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
