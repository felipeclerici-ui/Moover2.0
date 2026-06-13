import React from "react";
import { Card } from "../components/ui/Card.jsx";

export const NotificationsView = ({ notifications, markNotificationRead, markAllRead, unreadCount }) => (
  <div className="min-h-screen bg-stone-100 pb-24">
    <div className="bg-white px-6 pt-12 pb-6 border-b border-stone-200 shadow-sm flex justify-between items-end">
      <div>
        <h2 className="text-2xl font-black text-stone-800">Notificaciones</h2>
        <p className="text-sm text-stone-500 mt-1">{unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}</p>
      </div>
      {unreadCount > 0 && (
        <button onClick={markAllRead} className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Marcar todo leído</button>
      )}
    </div>
    <div className="px-6 py-6 space-y-3">
      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">🔔</span>
          <p className="text-stone-400 font-medium">No hay notificaciones</p>
        </div>
      ) : notifications.map(n => (
        <Card key={n.id} onClick={() => markNotificationRead(n.id)}
          className={!n.read ? 'border-l-4 border-l-emerald-500' : ''}>
          <div className="p-4 flex gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
              n.type === 'offer' ? 'bg-blue-100' : n.type === 'system' ? 'bg-emerald-100' : 'bg-amber-100'
            }`}>
              {n.type === 'offer' ? '💰' : n.type === 'system' ? '📱' : 'ℹ️'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className={`text-sm ${!n.read ? 'font-bold text-stone-800' : 'font-medium text-stone-600'}`}>{n.title}</h4>
                {!n.read && <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1.5"></div>}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{n.text}</p>
              <p className="text-[10px] text-stone-400 mt-1">
                {new Date(n.timestamp).toLocaleDateString('es-UY', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);
