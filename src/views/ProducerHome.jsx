import React from "react";
import { Card } from "../components/ui/Card.jsx";
import { IBell, IChevron, IPlus } from "../components/ui/Icon.jsx";

export const ProducerHome = ({ jobs, myProducerId, setActiveJob, setView, unreadCount }) => (
  <div className="min-h-screen bg-stone-100 pb-24">
    <div className="bg-emerald-900 pt-12 pb-20 px-6 rounded-b-[2.5rem] shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-800 rounded-full flex items-center justify-center text-xl border-2 border-emerald-600">🤠</div>
          <div>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Estancia</p>
            <h2 className="text-white text-xl font-bold">La Cimarrona</h2>
          </div>
        </div>
        <button
          className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-700 transition-colors relative"
          onClick={() => setView('notifications')}
        >
          <IBell className="text-emerald-100" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
          )}
        </button>
      </div>
    </div>

    <div className="px-6 -mt-10 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setView('producer-book')} className="bg-white p-5 rounded-2xl shadow-md flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform h-32">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-700"><IPlus /></div>
          <span className="font-bold text-stone-800 text-sm">Nuevo Flete</span>
        </button>
        <button onClick={() => setView('history')} className="bg-white p-5 rounded-2xl shadow-md flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform h-32">
          <div className="bg-blue-100 p-3 rounded-full text-blue-700">📄</div>
          <span className="font-bold text-stone-800 text-sm">Historial</span>
        </button>
      </div>

      {jobs.filter(j => j.userId === myProducerId && j.offer && !j.producerConfirmed).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-blue-600 font-bold text-xs uppercase tracking-wider ml-1">Ofertas pendientes de revisar</h3>
          <p className="text-sm text-stone-600 ml-1 mb-2">Un chofer propuso precio. Revisá el perfil y aceptá o rechazá.</p>
          {jobs.filter(j => j.userId === myProducerId && j.offer && !j.producerConfirmed).map(job => (
            <Card key={job.id} className="border-2 border-blue-200 bg-blue-50/50"
              onClick={() => { setActiveJob(job); setView('producer-offer'); }}>
              <div className="p-4 flex gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {job.animal === 'lanares' ? '🐑' : '🐂'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-stone-800 truncate">{job.quantity} {job.animal}</h4>
                    <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-blue-200 text-blue-800">Ver oferta</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 truncate">{job.from} → {job.to}</p>
                  <p className="text-sm font-bold text-emerald-700 mt-1">
                    {job.offer?.priceType === 'per_km' ? `${job.offer.pricePerKm} UYU/km` : `${job.offer?.totalPrice} UYU total`}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">Chofer: {job.offer?.carrierName}</p>
                </div>
                <IChevron className="text-blue-600 flex-shrink-0" />
              </div>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h3 className="text-stone-500 font-bold text-xs uppercase tracking-wider mb-3 ml-1">Mis Solicitudes Activas</h3>
        <div className="space-y-3">
          {jobs.filter(j => j.userId === myProducerId).length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-stone-300">
              <p className="text-stone-400 font-medium">No tienes fletes activos</p>
            </div>
          ) : (
            jobs.filter(j => j.userId === myProducerId).map(job => (
              <Card key={job.id}
                onClick={() => {
                  setActiveJob(job);
                  if (job.offer && !job.producerConfirmed) setView('producer-offer');
                  else setView('tracking');
                }}>
                <div className="p-4 flex gap-4">
                  <div className="w-16 h-16 bg-stone-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {job.animal === 'lanares' ? '🐑' : '🐂'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-stone-800 truncate">{job.quantity} {job.animal}</h4>
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                        job.offer && !job.producerConfirmed ? 'bg-blue-100 text-blue-700'
                        : job.status === 'completed' ? 'bg-stone-200 text-stone-600'
                        : job.status === 'in-transit' ? 'bg-sky-100 text-sky-700'
                        : job.status === 'accepted' ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {job.offer && !job.producerConfirmed ? 'Oferta'
                        : job.status === 'completed' ? 'Finalizado'
                        : job.status === 'in-transit' ? 'En ruta'
                        : job.status === 'accepted' ? 'Aceptado'
                        : 'Pendiente'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 truncate">{job.from} → {job.to}</p>
                    <p className="text-xs text-stone-400 mt-2 font-mono">{job.price}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
);
