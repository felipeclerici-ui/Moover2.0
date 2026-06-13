import React, { useState } from "react";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { DOC_TYPES } from "../lib/constants.js";

export const DocumentsView = ({
  documents,
  jobs,
  role,
  myProducerId,
  myCarrierId,
  handleUploadDocument,
  simulatePhotoCapture,
}) => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [docPhotoName, setDocPhotoName] = useState('');

  const myJobs = role === 'producer'
    ? jobs.filter(j => j.userId === myProducerId)
    : jobs.filter(j => j.carrierId === myCarrierId);

  const myDocs = documents.filter(d => myJobs.some(j => j.id === d.jobId));

  const handleSubmit = () => {
    if (!selectedJobId || !selectedDocType) { alert('Seleccioná un viaje y tipo de documento.'); return; }
    handleUploadDocument(selectedJobId, selectedDocType, docDescription, docPhotoName);
    setShowUpload(false); setSelectedJobId(''); setSelectedDocType(''); setDocDescription(''); setDocPhotoName('');
  };

  const getJobLabel = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    return job ? `${job.quantity} ${job.animal} • ${job.from} → ${job.to}` : jobId;
  };

  const getDocIcon = (type) => DOC_TYPES.find(d => d.id === type)?.icon || '📄';
  const getDocLabel = (type) => DOC_TYPES.find(d => d.id === type)?.label || type;

  return (
    <div className="min-h-screen bg-stone-100 pb-24">
      <div className="bg-white px-6 pt-12 pb-6 border-b border-stone-200 shadow-sm">
        <h2 className="text-2xl font-black text-stone-800">Documentos</h2>
        <p className="text-sm text-stone-500 mt-1">Guías, despachos y pesadas de tus viajes</p>
      </div>

      <div className="px-6 py-6 space-y-4">
        <Button full variant="primary" onClick={() => setShowUpload(true)}>📎 Subir Documento</Button>

        {showUpload && (
          <Card className="border-emerald-200 bg-emerald-50/30">
            <div className="p-5 space-y-4">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Nuevo documento</p>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">Viaje</label>
                <select value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full appearance-none bg-white border border-stone-200 rounded-xl py-3.5 pl-4 pr-10 font-medium text-stone-800">
                  <option value="">Seleccionar viaje...</option>
                  {myJobs.map(j => <option key={j.id} value={j.id}>{j.quantity} {j.animal} • {j.from} → {j.to}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">Tipo de documento</label>
                <div className="grid grid-cols-2 gap-2">
                  {DOC_TYPES.map(dt => (
                    <button key={dt.id} onClick={() => setSelectedDocType(dt.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                        selectedDocType === dt.id ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-stone-100 bg-white text-stone-600'
                      }`}>
                      <span className="text-xl">{dt.icon}</span>
                      <div>
                        <p className="text-xs font-bold">{dt.label}</p>
                        <p className="text-[10px] text-stone-400">{dt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <input type="text" placeholder="Descripción (ej: Guía MGAP N° 12345)" value={docDescription}
                onChange={(e) => setDocDescription(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl py-3 px-4 text-sm font-medium" />
              <button onClick={() => simulatePhotoCapture(setDocPhotoName)}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-dashed border-stone-300 rounded-xl py-4 text-stone-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors">
                <span className="text-2xl">📷</span>
                <span className="text-sm font-bold">{docPhotoName || 'Tomar foto o elegir de galería'}</span>
              </button>
              <div className="flex gap-2">
                <Button full variant="primary" onClick={handleSubmit}>Guardar</Button>
                <Button full variant="outline" onClick={() => { setShowUpload(false); setSelectedJobId(''); setSelectedDocType(''); setDocDescription(''); setDocPhotoName(''); }}>Cancelar</Button>
              </div>
            </div>
          </Card>
        )}

        {myDocs.length === 0 && !showUpload ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">📋</span>
            <p className="text-stone-400 font-medium">No hay documentos todavía</p>
            <p className="text-stone-400 text-sm mt-1">Subí guías, despachos y pesadas aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myDocs.map(doc => (
              <Card key={doc.id}>
                <div className="p-4 flex gap-4">
                  <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {getDocIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-stone-800 text-sm">{getDocLabel(doc.type)}</h4>
                      <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-stone-100 text-stone-500">
                        {doc.uploadedBy === 'producer' ? 'Productor' : 'Chofer'}
                      </span>
                    </div>
                    {doc.description && <p className="text-xs text-stone-600 mt-1">{doc.description}</p>}
                    <p className="text-[10px] text-stone-400 mt-1 truncate">{getJobLabel(doc.jobId)}</p>
                    {doc.photoName && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs">📷</span>
                        <p className="text-[10px] text-stone-500 truncate">{doc.photoName}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
