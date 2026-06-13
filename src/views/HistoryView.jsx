import React from "react";
import { Card } from "../components/ui/Card.jsx";

export const HistoryView = ({ jobs, myProducerId, myCarrierId, role, setActiveJob, setView }) => {
  const myJobs = role === 'producer'
    ? jobs.filter(j => j.userId === myProducerId)
    : jobs.filter(j => j.carrierId === myCarrierId);

  const completedJobs = myJobs.filter(j => j.status === 'completed');
  const activeJobs = myJobs.filter(j => j.status !== 'completed');

  return (
    <div className="min-h-screen bg-stone-100 pb-24">
      <div className="bg-white px-6 pt-12 pb-6 border-b border-stone-200 shadow-sm">
        <h2 className="text-2xl font-black text-stone-800">Historial</h2>
        <p className="text-sm text-stone-500 mt-1">{myJobs.length} viajes en total</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {activeJobs.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3 ml-1">En curso ({activeJobs.length})</h3>
            <div className="space-y-3">
              {activeJobs.map(job => (
                <Card key={job.id} onClick={() => { setActiveJob(job); setView('tracking'); }}>
                  <div className="p-4 flex gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {job.animal === 'lanares' ? '🐑' : '🐂'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-stone-800 text-sm">{job.quantity} {job.animal}</h4>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          job.status === 'in-transit' ? 'bg-sky-100 text-sky-700' : job.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {job.status === 'in-transit' ? 'En ruta' : job.status === 'accepted' ? 'Aceptado' : 'Pendiente'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 truncate">{job.from} → {job.to}</p>
                      <p className="text-xs text-stone-400 mt-1 font-mono">{job.price}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 ml-1">Finalizados ({completedJobs.length})</h3>
          {completedJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-400">No hay viajes finalizados aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedJobs.map(job => (
                <Card key={job.id} onClick={() => { setActiveJob(job); setView('tracking'); }}>
                  <div className="p-4 flex gap-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {job.animal === 'lanares' ? '🐑' : '🐂'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-stone-800 text-sm">{job.quantity} {job.animal}</h4>
                      <p className="text-xs text-stone-500 truncate">{job.from} → {job.to}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-stone-400 font-mono">{job.finalPrice ? `$${Number(job.finalPrice).toLocaleString()} UYU` : job.price}</p>
                        {job.rating && <span className="text-xs text-amber-500">★ {job.rating.average}</span>}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
