import React, { useState } from "react";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { InputGroup } from "../components/ui/InputGroup.jsx";
import { IChevron } from "../components/ui/Icon.jsx";

export const CarrierOfferView = ({ activeJob, handleProposeOffer, setView, driverProfile }) => {
  const [priceType, setPriceType] = useState('per_km');
  const [pricePerKm, setPricePerKm] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [saving, setSaving] = useState(false);
  if (!activeJob) return null;

  const handleSubmit = async () => {
    setSaving(true);
    try { await handleProposeOffer(activeJob.id, { priceType, pricePerKm, totalPrice }); setView('carrier-home'); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <div className="bg-white px-4 py-4 border-b border-stone-200 sticky top-0 z-10 flex items-center gap-4 shadow-sm">
        <button onClick={() => setView('carrier-home')} className="p-2 hover:bg-stone-100 rounded-full">
          <span className="inline-block rotate-180"><IChevron /></span>
        </button>
        <div>
          <h2 className="text-lg font-bold text-stone-800">Proponer precio</h2>
          <p className="text-xs text-stone-400">Job: {activeJob.quantity} {activeJob.animal} • {activeJob.from} → {activeJob.to}</p>
        </div>
      </div>
      <div className="p-6 flex-1 overflow-y-auto space-y-4">
        <Card className="border-stone-100">
          <div className="p-5 space-y-3">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Tu perfil</p>
            <p className="text-sm text-stone-700 font-semibold">{driverProfile?.name || 'Chofer sin nombre'} • {driverProfile?.truckModel || 'Camión'}</p>
            {driverProfile?.capacity && <p className="text-xs text-stone-500">Capacidad: {driverProfile.capacity} cabezas</p>}
          </div>
        </Card>
        <Card className="border-stone-100">
          <div className="p-5 space-y-4">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Tipo de precio</p>
            <div className="flex gap-2">
              <button className={`flex-1 py-2.5 rounded-xl text-sm font-bold border ${priceType === 'per_km' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-600 border-stone-200'}`}
                onClick={() => setPriceType('per_km')}>Por kilómetro</button>
              <button className={`flex-1 py-2.5 rounded-xl text-sm font-bold border ${priceType === 'total' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-600 border-stone-200'}`}
                onClick={() => setPriceType('total')}>Precio total</button>
            </div>
            {priceType === 'per_km' ? (
              <InputGroup label="Precio por km (UYU)" type="number" placeholder="Ej: 120" value={pricePerKm} onChange={(e) => setPricePerKm(e.target.value)} />
            ) : (
              <InputGroup label="Precio total (UYU)" type="number" placeholder="Ej: 15.000" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} />
            )}
          </div>
        </Card>
        <div className="mt-4 space-y-2">
          <Button full variant="primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Enviando oferta...' : 'Enviar oferta al productor'}
          </Button>
          <Button full variant="outline" onClick={() => setView('carrier-home')}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
};
