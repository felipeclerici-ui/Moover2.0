import React from "react";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { IChevron } from "../components/ui/Icon.jsx";

export const ProducerOfferView = ({ activeJob, jobs, handleProducerAcceptOffer, handleProducerRejectOffer, setView }) => {
  const liveJob = activeJob?.id ? (jobs.find(j => j.id === activeJob.id) || activeJob) : activeJob;
  if (!liveJob || !liveJob.offer) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center">
        <p className="text-stone-400">No hay oferta seleccionada.</p>
        <Button className="mt-4" onClick={() => setView('producer-home')}>Volver</Button>
      </div>
    );
  }
  const { offer } = liveJob;
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <div className="bg-white px-4 py-4 border-b border-stone-200 sticky top-0 z-10 flex items-center gap-4 shadow-sm">
        <button onClick={() => setView('producer-home')} className="p-2 hover:bg-stone-100 rounded-full">
          <span className="inline-block rotate-180"><IChevron /></span>
        </button>
        <div>
          <h2 className="text-lg font-bold text-stone-800">Revisar oferta del chofer</h2>
          <p className="text-xs text-stone-400">{liveJob.quantity} {liveJob.animal} • {liveJob.from} → {liveJob.to}</p>
        </div>
      </div>
      <div className="p-6 flex-1 overflow-y-auto space-y-4">
        <Card className="border-stone-100">
          <div className="p-5 space-y-2">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Perfil del chofer</p>
            <p className="font-bold text-stone-900 text-base">{offer.carrierName}</p>
            <p className="text-sm text-stone-600">{offer.carrierTruckModel || 'Camión'}{offer.carrierTruckCapacity ? ` • ${offer.carrierTruckCapacity} cabezas` : ''}</p>
          </div>
        </Card>
        <Card className="border-stone-100">
          <div className="p-5 space-y-2">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Precio propuesto</p>
            {offer.priceType === 'per_km'
              ? <p className="text-lg font-black text-emerald-700">{offer.pricePerKm} UYU/km</p>
              : <p className="text-lg font-black text-emerald-700">{offer.totalPrice} UYU total</p>
            }
            <p className="text-xs text-stone-500 mt-2">Método de pago: {liveJob.paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Transferencia bancaria'}</p>
          </div>
        </Card>
        <Card className="border-stone-100">
          <div className="p-5 space-y-1">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Detalle del viaje</p>
            <p className="text-sm text-stone-700">Origen: {liveJob.from} ({liveJob.dicoseOrigin})</p>
            {liveJob.originAddressDetail && <p className="text-xs text-stone-500">{liveJob.originAddressDetail}</p>}
            <p className="text-sm text-stone-700 mt-2">Destino: {liveJob.to} ({liveJob.dicoseDest})</p>
            {liveJob.destinationAddressDetail && <p className="text-xs text-stone-500">{liveJob.destinationAddressDetail}</p>}
            {liveJob.preferredDate && <p className="text-xs text-stone-500 mt-2">Fecha preferida: {liveJob.preferredDate}</p>}
          </div>
        </Card>
        <div className="mt-4 space-y-2">
          <Button full variant="primary" onClick={() => handleProducerAcceptOffer(liveJob.id)}>Aceptar flete y precio</Button>
          <Button full variant="outline" className="border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => handleProducerRejectOffer(liveJob.id)}>Rechazar oferta</Button>
        </div>
      </div>
    </div>
  );
};
