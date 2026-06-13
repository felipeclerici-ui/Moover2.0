import React from "react";
import { Card } from "../components/ui/Card.jsx";
import { IChevron } from "../components/ui/Icon.jsx";

export const ChatListView = ({ chatMessages, jobs, role, myProducerId, myCarrierId, setActiveChatJobId, setView }) => {
  const myJobs = role === 'producer'
    ? jobs.filter(j => j.userId === myProducerId && j.carrierId)
    : jobs.filter(j => j.carrierId === myCarrierId);

  return (
    <div className="min-h-screen bg-stone-100 pb-24">
      <div className="bg-white px-6 pt-12 pb-6 border-b border-stone-200 shadow-sm">
        <h2 className="text-2xl font-black text-stone-800">Mensajes</h2>
        <p className="text-sm text-stone-500 mt-1">Chat con {role === 'producer' ? 'transportistas' : 'productores'}</p>
      </div>

      <div className="px-6 py-6 space-y-3">
        {myJobs.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">💬</span>
            <p className="text-stone-400 font-medium">No hay conversaciones</p>
            <p className="text-stone-400 text-sm mt-1">{role === 'producer' ? 'Cuando un chofer acepte tu flete, podrás chatear aquí' : 'Cuando te asignen un viaje, podrás chatear con el productor'}</p>
          </div>
        ) : myJobs.map(job => {
          const msgs = chatMessages[job.id] || [];
          const lastMsg = msgs[msgs.length - 1];
          const otherName = role === 'producer' ? (job.carrierName || 'Chofer') : 'Productor';

          return (
            <Card key={job.id} onClick={() => { setActiveChatJobId(job.id); setView('chat-detail'); }}>
              <div className="p-4 flex gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  {role === 'producer' ? '🚚' : '🤠'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-stone-800">{otherName}</h4>
                    {lastMsg && (
                      <span className="text-[10px] text-stone-400">
                        {new Date(lastMsg.timestamp).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 truncate">{job.quantity} {job.animal} • {job.from} → {job.to}</p>
                  {lastMsg ? (
                    <p className="text-sm text-stone-600 mt-1 truncate">
                      {lastMsg.sender === (role === 'producer' ? 'producer' : 'carrier') ? 'Tú: ' : ''}{lastMsg.text}
                    </p>
                  ) : (
                    <p className="text-sm text-stone-400 mt-1 italic">Sin mensajes aún</p>
                  )}
                </div>
                <IChevron className="text-stone-400 flex-shrink-0" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
