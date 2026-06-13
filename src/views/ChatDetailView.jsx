import React, { useState, useEffect, useRef } from "react";
import { IChevron } from "../components/ui/Icon.jsx";

export const ChatDetailView = ({ chatMessages, activeChatJobId, jobs, role, handleSendMessage, setView }) => {
  const [msgInput, setMsgInput] = useState('');
  const messagesEndRef = useRef(null);
  const job = jobs.find(j => j.id === activeChatJobId);
  const msgs = chatMessages[activeChatJobId] || [];
  const otherName = role === 'producer' ? (job?.carrierName || 'Chofer') : 'Productor';
  const mySender = role === 'producer' ? 'producer' : 'carrier';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs.length]);

  const send = () => {
    if (!msgInput.trim()) return;
    handleSendMessage(activeChatJobId, msgInput);
    setMsgInput('');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <div className="bg-white px-4 py-4 border-b border-stone-200 sticky top-0 z-10 flex items-center gap-4 shadow-sm">
        <button onClick={() => setView('chat')} className="p-2 hover:bg-stone-100 rounded-full">
          <span className="inline-block rotate-180"><IChevron /></span>
        </button>
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg">
          {role === 'producer' ? '🚚' : '🤠'}
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-stone-800">{otherName}</h2>
          {job && <p className="text-xs text-stone-400">{job.quantity} {job.animal} • {job.from} → {job.to}</p>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {msgs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-400 text-sm">Empezá la conversación</p>
          </div>
        )}
        {msgs.map(msg => {
          const isMine = msg.sender === mySender;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                isMine
                  ? 'bg-emerald-600 text-white rounded-br-md'
                  : 'bg-white text-stone-800 border border-stone-200 rounded-bl-md'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${isMine ? 'text-emerald-200' : 'text-stone-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-stone-200 px-4 py-3 flex gap-3 pb-[env(safe-area-inset-bottom)]">
        <input type="text" value={msgInput} onChange={(e) => setMsgInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Escribí un mensaje..."
          className="flex-1 bg-stone-50 border border-stone-200 rounded-full py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        <button onClick={send} disabled={!msgInput.trim()}
          className="bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:bg-emerald-700 disabled:opacity-40 active:scale-95 transition-all">
          <span className="text-lg">➤</span>
        </button>
      </div>
    </div>
  );
};
