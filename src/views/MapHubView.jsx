import React, { useState } from "react";
import { Card } from "../components/ui/Card.jsx";
import { BALANZAS_DATA } from "../data/balanzas.js";
import { ESTABLECIMIENTOS_DATA } from "../data/establecimientos.js";

const BalanzasContent = () => {
  const [search, setSearch] = useState('');
  const [selectedBalanza, setSelectedBalanza] = useState(null);

  const filtered = BALANZAS_DATA.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.department.toLowerCase().includes(search.toLowerCase()) ||
    b.address.toLowerCase().includes(search.toLowerCase())
  );

  const mapQuery = selectedBalanza
    ? `${selectedBalanza.name}, ${selectedBalanza.department}, Uruguay`
    : 'balanzas ganado Uruguay';
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=${selectedBalanza ? 12 : 6}&output=embed`;

  return (
    <div className="px-6 py-4 space-y-4">
      <div className="w-full h-52 rounded-2xl overflow-hidden border border-stone-200 shadow-md bg-stone-200">
        <iframe title="Mapa de balanzas" src={mapSrc} className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>

      <div className="relative">
        <span className="absolute left-4 top-3.5 text-stone-400">🔍</span>
        <input type="text" placeholder="Buscar balanza o departamento..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-stone-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>

      <p className="text-xs text-stone-400 font-bold uppercase tracking-wider ml-1">{filtered.length} balanzas encontradas</p>

      <div className="space-y-3">
        {filtered.map(b => (
          <Card key={b.id} onClick={() => setSelectedBalanza(selectedBalanza?.id === b.id ? null : b)}
            className={selectedBalanza?.id === b.id ? 'border-2 border-emerald-500 ring-1 ring-emerald-200' : ''}>
            <div className="p-4 flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">⚖️</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-stone-800 text-sm">{b.name}</h4>
                <p className="text-xs text-stone-500 mt-0.5">{b.address}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{b.department}</span>
                  {b.phone && <span className="text-xs text-stone-400">📞 {b.phone}</span>}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const EstablecimientosContent = () => {
  const [search, setSearch] = useState('');
  const [selectedEst, setSelectedEst] = useState(null);

  const filtered = ESTABLECIMIENTOS_DATA.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.dicose.includes(search) ||
    e.rut.includes(search) ||
    e.department.toLowerCase().includes(search.toLowerCase()) ||
    e.owner.toLowerCase().includes(search.toLowerCase())
  );

  const mapQuery = selectedEst
    ? `${selectedEst.address}, Uruguay`
    : 'establecimientos rurales Uruguay';
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=${selectedEst ? 12 : 6}&output=embed`;

  return (
    <div className="px-6 py-4 space-y-4">
      <div className="w-full h-52 rounded-2xl overflow-hidden border border-stone-200 shadow-md bg-stone-200">
        <iframe title="Mapa de establecimientos" src={mapSrc} className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>

      <div className="relative">
        <span className="absolute left-4 top-3.5 text-stone-400">🔍</span>
        <input type="text" placeholder="Buscar por nombre, DICOSE o RUT..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-stone-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>

      <p className="text-xs text-stone-400 font-bold uppercase tracking-wider ml-1">{filtered.length} establecimientos</p>

      <div className="space-y-3">
        {filtered.map(e => (
          <Card key={e.id} onClick={() => setSelectedEst(selectedEst?.id === e.id ? null : e)}
            className={selectedEst?.id === e.id ? 'border-2 border-emerald-500 ring-1 ring-emerald-200' : ''}>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-stone-800 text-sm">{e.name}</h4>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{e.type}</span>
              </div>
              <p className="text-xs text-stone-500">{e.address}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5">
                  <p className="text-[10px] text-stone-400 font-bold uppercase">DICOSE</p>
                  <p className="text-sm font-mono font-bold text-stone-800">{e.dicose}</p>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5">
                  <p className="text-[10px] text-stone-400 font-bold uppercase">RUT</p>
                  <p className="text-sm font-mono font-bold text-stone-800">{e.rut}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{e.department}</span>
                <span className="text-xs text-stone-400">👤 {e.owner}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const MapHubView = () => {
  const [tab, setTab] = useState('balanzas');

  return (
    <div className="min-h-screen bg-stone-100 pb-24">
      <div className="bg-white px-6 pt-12 pb-4 border-b border-stone-200 shadow-sm">
        <h2 className="text-2xl font-black text-stone-800">Mapa</h2>
        <p className="text-sm text-stone-500 mt-1">Balanzas y establecimientos en Uruguay</p>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setTab('balanzas')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${tab === 'balanzas' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-600 border-stone-200'}`}>
            ⚖️ Balanzas
          </button>
          <button onClick={() => setTab('establecimientos')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${tab === 'establecimientos' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-600 border-stone-200'}`}>
            🏠 Establecimientos
          </button>
        </div>
      </div>

      {tab === 'balanzas' ? <BalanzasContent /> : <EstablecimientosContent />}
    </div>
  );
};
