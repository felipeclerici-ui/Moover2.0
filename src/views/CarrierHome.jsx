import React from "react";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { IBell, IUser, IChevron } from "../components/ui/Icon.jsx";
import { isDriverVerified } from "../lib/habilitacion.js";

export const CarrierHome = ({ jobs, myCarrierId, driverProfile, setActiveJob, setView, unreadCount }) => {
  const habStatus = isDriverVerified(driverProfile);
  return (
  <div className="min-h-screen bg-stone-100 pb-24">
    <div className="bg-stone-900 pt-12 pb-24 px-6 rounded-b-[2rem] shadow-xl sticky top-0 z-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-emerald-400">Modo Chofer</h2>
        <div className="flex items-center gap-3">
          <button
            className="bg-stone-800 p-2 rounded-full hover:bg-stone-700 transition-colors relative"
            onClick={() => setView('notifications')}
          >
            <IBell className="text-stone-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
            )}
          </button>
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
        </div>
      </div>
      <p className="text-stone-400 text-sm mt-1">Buscando cargas en todo Uruguay...</p>
    </div>

    <div className="px-4 -mt-16 space-y-4">
      {!habStatus.verified && (
        <Card onClick={() => setView('driver-profile')} className="border-2 border-amber-300 bg-amber-50 cursor-pointer">
          <div className="p-4 flex items-start gap-3">
            <span className="text-2xl">⚠</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">Habilitación pendiente</p>
              <p className="text-sm text-amber-900 mt-1">
                No vas a poder cerrar fletes hasta completar tu habilitación MGAP y libreta profesional.
              </p>
              <p className="text-xs text-amber-700 mt-2 font-medium">Tocá para completar →</p>
            </div>
          </div>
        </Card>
      )}
      <Card onClick={() => setView('driver-profile')} className={`border ${habStatus.verified ? 'border-emerald-100 bg-emerald-50' : 'border-stone-200 bg-white'}`}>
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700"><IUser /></div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Perfil de Chofer</p>
              {habStatus.verified && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full px-2 py-0.5">✓ Habilitado</span>
              )}
            </div>
            <p className="text-sm font-bold text-stone-800">
              {driverProfile?.name || 'Completa tu perfil para que los productores te conozcan.'}
            </p>
            <p className="text-xs text-emerald-900 mt-1">
              {(driverProfile?.truckModel || 'Camión sin especificar')}
              {driverProfile?.capacity ? ` • ${driverProfile.capacity} cabezas` : ''}
            </p>
          </div>
          <IChevron className="text-emerald-600" />
        </div>
      </Card>

      {jobs.filter(j => j.carrierId === myCarrierId).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-stone-500 font-bold text-xs uppercase tracking-wider ml-1">Mis viajes</h3>
          {jobs.filter(j => j.carrierId === myCarrierId).map((job) => (
            <Card key={job.id} className="border-0 shadow-lg" onClick={() => { setActiveJob(job); setView('tracking'); }}>
              <div className="p-4 flex gap-4">
                <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {job.animal === 'lanares' ? '🐑' : '🐂'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-stone-800 truncate">{job.quantity} {job.animal}</h4>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                      job.status === 'completed' ? 'bg-stone-200 text-stone-600' : 'bg-sky-100 text-sky-700'
                    }`}>
                      {job.status === 'completed' ? 'Finalizado' : 'En ruta'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 truncate">{job.from} → {job.to}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <h3 className="text-stone-500 font-bold text-xs uppercase tracking-wider ml-1 mt-4">Cargas disponibles</h3>
      {jobs.filter(j => j.status === 'pending' && !j.offer).map((job) => (
        <Card key={job.id} className="border-0 shadow-lg" onClick={() => { setActiveJob(job); setView('carrier-offer'); }}>
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl bg-stone-50 p-2 rounded-lg">{job.animal === 'lanares' ? '🐑' : '🐂'}</span>
                <div>
                  <h4 className="font-bold text-stone-800 text-lg">{job.quantity} {job.animal}</h4>
                  <p className="text-sm text-stone-500 font-medium">DICOSE: {job.dicoseOrigin}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-emerald-700 text-xl">{job.price}</p>
                <p className="text-[10px] text-stone-400 uppercase font-bold">{job.paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Banco'}</p>
              </div>
            </div>
            <div className="space-y-3 relative pl-2">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-stone-200 border-l border-dashed border-stone-300"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white"></div>
                <p className="text-sm font-semibold text-stone-700">{job.from}</p>
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-2 h-2 rounded-full bg-stone-800 ring-4 ring-white"></div>
                <p className="text-sm font-semibold text-stone-700">{job.to}</p>
              </div>
            </div>
            <Button full className="mt-5 bg-stone-900 text-white hover:bg-black"
              onClick={(e) => { e.stopPropagation(); setActiveJob(job); setView('carrier-offer'); }}>
              Ofrecer Viaje
            </Button>
          </div>
        </Card>
      ))}
      {jobs.filter(j => j.status === 'pending' && !j.offer).length === 0 && (
        <div className="text-center py-12"><p className="text-stone-400">No hay cargas disponibles por ahora.</p></div>
      )}
    </div>
  </div>
  );
};
