import React, { useState } from "react";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { IChevron, INavigation } from "../components/ui/Icon.jsx";
import { animalRequiresGuide } from "../lib/validation.js";

export const TrackingView = ({
  activeJob,
  jobs,
  role,
  myCarrierId,
  myProducerId,
  setView,
  setActiveChatJobId,
  simulatePhotoCapture,
  handleUploadGuides,
  handleStartTrip,
  handleAddWeighing,
  handleProducerConfirmWeighing,
  handleFinishTrip,
  handleProducerConfirmKm,
  handleProducerRate,
  handleDriverRate,
  handleProducerMarkPaid,
  handleDriverConfirmPayment,
}) => {
  const [showFinishForm, setShowFinishForm] = useState(false);
  const [actualKmInput, setActualKmInput] = useState('');
  const [ratingTruck, setRatingTruck] = useState(0);
  const [ratingAnimal, setRatingAnimal] = useState(0);
  const [ratingDriving, setRatingDriving] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [driverRatingScore, setDriverRatingScore] = useState(0);
  const [driverRatingComment, setDriverRatingComment] = useState('');
  const [showGuideUpload, setShowGuideUpload] = useState(false);
  const [guideDescription, setGuideDescription] = useState('');
  const [guidePhotoName, setGuidePhotoName] = useState('');
  const [showWeighingForm, setShowWeighingForm] = useState(false);
  const [weighingKg, setWeighingKg] = useState('');
  const [weighingScaleNumber, setWeighingScaleNumber] = useState('');
  const [weighingPhotoName, setWeighingPhotoName] = useState('');

  const liveJob = activeJob?.id ? (jobs.find(j => j.id === activeJob.id) || activeJob) : activeJob;
  const origin = liveJob?.from ? `${liveJob.from}, Uruguay` : 'Uruguay';
  const destination = liveJob?.to ? `${liveJob.to}, Uruguay` : '';
  const qry = destination ? `${origin} a ${destination}` : origin;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(qry)}&t=&z=6&ie=UTF8&iwloc=&output=embed`;

  const isDriver = role === 'carrier' && liveJob?.carrierId === myCarrierId;
  const isProducer = role === 'producer' && liveJob?.userId === myProducerId;
  const status = liveJob?.status || 'accepted';
  const completed = status === 'completed';

  const handleFinishSubmit = () => {
    const km = actualKmInput.trim();
    if (!km || isNaN(parseFloat(km))) { alert('Ingresa los kilómetros realizados.'); return; }
    handleFinishTrip(liveJob.id, km);
    setShowFinishForm(false);
    setActualKmInput('');
  };

  const handleRatingSubmit = () => {
    if (ratingTruck < 1 || ratingAnimal < 1 || ratingDriving < 1) { alert('Calificá las 3 categorías antes de enviar.'); return; }
    handleProducerRate(liveJob.id, {
      truckCondition: ratingTruck, animalWelfare: ratingAnimal, drivingSkill: ratingDriving,
      average: Math.round(((ratingTruck + ratingAnimal + ratingDriving) / 3) * 10) / 10,
      comment: ratingComment || '',
    });
  };

  const handleDriverRatingSubmit = () => {
    if (driverRatingScore < 1) { alert('Selecciona una puntuación para el productor.'); return; }
    handleDriverRate(liveJob.id, { score: driverRatingScore, comment: driverRatingComment || '' });
  };

  const handleGuideSubmit = () => {
    handleUploadGuides(liveJob.id, { description: guideDescription, photoName: guidePhotoName || null, uploadedAt: Date.now() });
    setShowGuideUpload(false); setGuideDescription(''); setGuidePhotoName('');
  };

  const handleWeighingSubmit = () => {
    if (!weighingKg || isNaN(parseFloat(weighingKg))) { alert('Ingresa los kilogramos del pesaje.'); return; }
    handleAddWeighing(liveJob.id, {
      totalKg: parseFloat(weighingKg), scaleNumber: weighingScaleNumber,
      photoName: weighingPhotoName || null, createdAt: Date.now(),
    });
    setShowWeighingForm(false); setWeighingKg(''); setWeighingScaleNumber(''); setWeighingPhotoName('');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <button onClick={() => setView(role === 'producer' ? 'producer-home' : 'carrier-home')}
          className="bg-white p-3 rounded-full shadow-lg hover:bg-stone-50">
          <span className="inline-block rotate-180"><IChevron /></span>
        </button>
        {liveJob?.carrierId && (
          <button onClick={() => { setActiveChatJobId(liveJob.id); setView('chat-detail'); }}
            className="bg-emerald-600 text-white px-4 py-2.5 rounded-full shadow-lg hover:bg-emerald-700 flex items-center gap-2 font-bold text-sm">
            💬 Chat
          </button>
        )}
      </div>

      {!completed && (
        <div className="px-4 pb-4">
          <div className="w-full h-64 rounded-3xl overflow-hidden border border-stone-200 shadow-md bg-stone-200">
            <iframe title="Ruta del viaje" src={mapSrc} className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      )}

      <div className="mt-auto bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-8 pb-12 flex-1 overflow-y-auto">
        <div className="w-16 h-1.5 bg-stone-200 rounded-full mx-auto mb-8"></div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-stone-800">
              {completed ? 'Viaje Finalizado' : status === 'in-transit' ? 'En Ruta' : 'Aceptado'}
            </h2>
            {!completed && <p className="text-emerald-600 font-bold">Llegada: 14:30 hs</p>}
          </div>
          <div className="text-right">
            <div className="bg-stone-100 px-3 py-1 rounded-lg">
              <span className="text-xs font-bold text-stone-400 uppercase">Estado</span>
              <p className="font-bold text-stone-800">{status === 'completed' ? 'Finalizado' : status === 'in-transit' ? 'En ruta' : 'Aceptado'}</p>
            </div>
          </div>
        </div>

        {/* Driver actions (not completed) */}
        {isDriver && !completed && (
          <div className="mb-6 space-y-3">
            {status === 'accepted' && (
              <>
                {(() => { const guideRequired = animalRequiresGuide(liveJob.animal); const guideMissing = guideRequired && !liveJob.guides?.description; return (
                <Card className={guideMissing ? 'border-red-300 bg-red-50/50' : 'border-stone-200 bg-stone-50'}>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${guideMissing ? 'bg-red-100' : 'bg-amber-100'}`}>📋</div>
                      <div className="flex-1">
                        <p className={`text-xs font-bold uppercase tracking-wider ${guideMissing ? 'text-red-700' : 'text-stone-500'}`}>
                          Guía Sanitaria MGAP {guideRequired ? '(obligatoria)' : '(opcional)'}
                        </p>
                        <p className="text-xs text-stone-500">
                          {guideRequired
                            ? 'Requerida por normativa uruguaya para este tipo de animal.'
                            : 'Adjuntá guía, despacho, etc. si corresponde.'}
                        </p>
                      </div>
                    </div>
                    {liveJob.guides ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600">✓</span>
                          <p className="text-sm font-semibold text-emerald-800">Guía adjuntada</p>
                        </div>
                        {liveJob.guides.description && <p className="text-xs text-stone-600 mt-1">{liveJob.guides.description}</p>}
                        {liveJob.guides.photoName && (
                          <div className="flex items-center gap-2 mt-2 bg-white rounded-lg px-3 py-2 border border-stone-200">
                            <span>📷</span>
                            <p className="text-xs text-stone-600 truncate">{liveJob.guides.photoName}</p>
                          </div>
                        )}
                      </div>
                    ) : !showGuideUpload ? (
                      <Button full variant="secondary" className="border-amber-200 text-amber-800 hover:bg-amber-50"
                        onClick={() => setShowGuideUpload(true)}>📎 Adjuntar guías</Button>
                    ) : (
                      <div className="space-y-3">
                        <input type="text" placeholder="Descripción (ej: Guía MGAP N° 12345)" value={guideDescription}
                          onChange={(e) => setGuideDescription(e.target.value)}
                          className="w-full bg-white border border-stone-200 rounded-xl py-3 px-4 text-sm font-medium" />
                        <button onClick={() => simulatePhotoCapture(setGuidePhotoName)}
                          className="w-full flex items-center justify-center gap-3 bg-stone-100 border-2 border-dashed border-stone-300 rounded-xl py-4 text-stone-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors">
                          <span className="text-2xl">📷</span>
                          <span className="text-sm font-bold">{guidePhotoName || 'Tomar foto o elegir de galería'}</span>
                        </button>
                        <div className="flex gap-2">
                          <Button full variant="primary" onClick={handleGuideSubmit}>Guardar guía</Button>
                          <Button full variant="outline" onClick={() => { setShowGuideUpload(false); setGuideDescription(''); setGuidePhotoName(''); }}>Cancelar</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
                ); })()}
                <Button
                  full
                  variant="primary"
                  className="h-14 text-base"
                  disabled={animalRequiresGuide(liveJob.animal) && !liveJob.guides?.description}
                  onClick={() => handleStartTrip(liveJob.id)}
                >
                  🚚 Iniciar Viaje
                </Button>
                {animalRequiresGuide(liveJob.animal) && !liveJob.guides?.description && (
                  <p className="text-xs text-red-600 text-center">Adjuntá la guía MGAP para poder iniciar el viaje.</p>
                )}
              </>
            )}
            {status === 'in-transit' && (
              <>
                {!liveJob.weighing && !showWeighingForm && (
                  <Button full variant="secondary" className="border-blue-200 text-blue-800 hover:bg-blue-50"
                    onClick={() => setShowWeighingForm(true)}>⚖️ Agregar Pesaje</Button>
                )}
                {showWeighingForm && (
                  <Card className="border-blue-200 bg-blue-50/50">
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">⚖️</div>
                        <div>
                          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Registrar pesaje</p>
                          <p className="text-xs text-stone-400">Ingresá los datos de la balanza</p>
                        </div>
                      </div>
                      <input type="number" placeholder="Peso total (kg)" value={weighingKg} onChange={(e) => setWeighingKg(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl py-3 px-4 font-medium" />
                      <input type="text" placeholder="Número de balanza (ej: BAL-0042)" value={weighingScaleNumber} onChange={(e) => setWeighingScaleNumber(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl py-3 px-4 text-sm font-medium" />
                      <button onClick={() => simulatePhotoCapture(setWeighingPhotoName)}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-dashed border-stone-300 rounded-xl py-4 text-stone-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
                        <span className="text-2xl">📷</span>
                        <span className="text-sm font-bold">{weighingPhotoName || 'Foto del ticket de pesaje'}</span>
                      </button>
                      <div className="flex gap-2">
                        <Button full variant="primary" onClick={handleWeighingSubmit}>Enviar pesaje</Button>
                        <Button full variant="outline" onClick={() => { setShowWeighingForm(false); setWeighingKg(''); setWeighingScaleNumber(''); setWeighingPhotoName(''); }}>Cancelar</Button>
                      </div>
                    </div>
                  </Card>
                )}
                {liveJob.weighing && (
                  <Card className={`${liveJob.weighing.status === 'accepted' ? 'border-emerald-200 bg-emerald-50/30' : liveJob.weighing.status === 'rejected' ? 'border-red-200 bg-red-50/30' : 'border-blue-200 bg-blue-50/30'}`}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>⚖️</span>
                          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pesaje registrado</p>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                          liveJob.weighing.status === 'accepted' ? 'bg-emerald-100 text-emerald-700'
                          : liveJob.weighing.status === 'rejected' ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                        }`}>{liveJob.weighing.status === 'accepted' ? 'Aceptado' : liveJob.weighing.status === 'rejected' ? 'Rechazado' : 'Pendiente'}</span>
                      </div>
                      <p className="text-lg font-black text-stone-800">{liveJob.weighing.totalKg.toLocaleString()} kg</p>
                      {liveJob.weighing.scaleNumber && <p className="text-xs text-stone-500">Balanza: {liveJob.weighing.scaleNumber}</p>}
                      {liveJob.weighing.photoName && (
                        <div className="flex items-center gap-2 mt-2 bg-white rounded-lg px-3 py-2 border border-stone-200">
                          <span>📷</span><p className="text-xs text-stone-600 truncate">{liveJob.weighing.photoName}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
                {liveJob.guides && (
                  <Card className="border-stone-200 bg-stone-50">
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1"><span>📋</span><p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Guía adjuntada</p></div>
                      {liveJob.guides.description && <p className="text-sm text-stone-700">{liveJob.guides.description}</p>}
                      {liveJob.guides.photoName && (
                        <div className="flex items-center gap-2 mt-2 bg-white rounded-lg px-3 py-2 border border-stone-200">
                          <span>📷</span><p className="text-xs text-stone-600 truncate">{liveJob.guides.photoName}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
                {!showFinishForm && (
                  <Button full variant="primary" className="h-14 text-base" onClick={() => setShowFinishForm(true)}>🏁 Finalizar Viaje</Button>
                )}
                {showFinishForm && (
                  <Card className="border-emerald-200 bg-emerald-50/50 p-4">
                    <p className="text-sm font-bold text-stone-700 mb-2">Kilómetros realizados</p>
                    <input type="number" placeholder="Ej: 320" value={actualKmInput} onChange={(e) => setActualKmInput(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl py-3 px-4 font-medium" />
                    <div className="flex gap-2 mt-3">
                      <Button full variant="primary" onClick={handleFinishSubmit}>Confirmar</Button>
                      <Button full variant="outline" onClick={() => { setShowFinishForm(false); setActualKmInput(''); }}>Cancelar</Button>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {/* Producer actions (not completed) */}
        {isProducer && !completed && (
          <div className="mb-6 space-y-3">
            {liveJob.guides && (
              <Card className="border-stone-200 bg-stone-50">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1"><span>📋</span><p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Guía de transporte</p></div>
                  {liveJob.guides.description && <p className="text-sm text-stone-700">{liveJob.guides.description}</p>}
                  {liveJob.guides.photoName && (
                    <div className="flex items-center gap-2 mt-2 bg-white rounded-lg px-3 py-2 border border-stone-200">
                      <span>📷</span><p className="text-xs text-stone-600 truncate">{liveJob.guides.photoName}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}
            {liveJob.weighing && liveJob.weighing.status === 'pending' && (
              <Card className="border-blue-200 bg-blue-50/50">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">⚖️</div>
                    <div>
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Pesaje para revisar</p>
                      <p className="text-xs text-stone-400">El chofer registró un pesaje</p>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-stone-800 mb-1">{liveJob.weighing.totalKg.toLocaleString()} kg</p>
                  {liveJob.weighing.scaleNumber && <p className="text-sm text-stone-500 mb-2">Balanza: {liveJob.weighing.scaleNumber}</p>}
                  {liveJob.weighing.photoName && (
                    <div className="flex items-center gap-2 mb-3 bg-white rounded-lg px-3 py-2 border border-stone-200">
                      <span>📷</span><p className="text-xs text-stone-600 truncate">{liveJob.weighing.photoName}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button full variant="primary" onClick={() => handleProducerConfirmWeighing(liveJob.id, true)}>Aceptar pesaje</Button>
                    <Button full variant="danger" onClick={() => handleProducerConfirmWeighing(liveJob.id, false)}>Rechazar</Button>
                  </div>
                </div>
              </Card>
            )}
            {liveJob.weighing && liveJob.weighing.status === 'accepted' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-center gap-2"><span>⚖️</span><p className="text-sm font-semibold text-emerald-800">Pesaje aceptado: {liveJob.weighing.totalKg.toLocaleString()} kg</p></div>
              </div>
            )}
            {liveJob.weighing && liveJob.weighing.status === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="flex items-center gap-2"><span>⚖️</span><p className="text-sm font-semibold text-red-800">Pesaje rechazado</p></div>
              </div>
            )}
          </div>
        )}

        {/* Producer completed */}
        {isProducer && completed && (
          <div className="space-y-4 mb-6">
            {liveJob.weighing && (
              <Card className={`${liveJob.weighing.status === 'accepted' ? 'border-emerald-200' : liveJob.weighing.status === 'rejected' ? 'border-red-200' : 'border-amber-200'}`}>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span>⚖️</span><p className="text-sm font-bold text-stone-700">Pesaje: {liveJob.weighing.totalKg.toLocaleString()} kg</p></div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                      liveJob.weighing.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : liveJob.weighing.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>{liveJob.weighing.status === 'accepted' ? 'Aceptado' : liveJob.weighing.status === 'rejected' ? 'Rechazado' : 'Pendiente'}</span>
                  </div>
                  {liveJob.weighing.scaleNumber && <p className="text-xs text-stone-500 mt-1">Balanza: {liveJob.weighing.scaleNumber}</p>}
                </div>
              </Card>
            )}
            {!liveJob.producerKmConfirmed ? (
              <Card className="border-stone-100">
                <div className="p-5">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Revisar kilómetros y precio final</p>
                  <p className="text-sm text-stone-700 font-semibold">Km realizados: {liveJob.finalKm} • Precio final: ${Number(liveJob.finalPrice || 0).toLocaleString()} UYU</p>
                  <Button full variant="primary" className="mt-4" onClick={() => handleProducerConfirmKm(liveJob.id)}>Aceptar Km y Precio</Button>
                </div>
              </Card>
            ) : !liveJob.rating ? (
              <Card className="border-stone-100">
                <div className="p-5">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">Calificar al chofer</p>
                  {[
                    { label: 'Estado del Camión', icon: '🚚', value: ratingTruck, setter: setRatingTruck },
                    { label: 'Bienestar Animal', icon: '🐂', value: ratingAnimal, setter: setRatingAnimal },
                    { label: 'Conducción del Chofer', icon: '🧑‍✈️', value: ratingDriving, setter: setRatingDriving },
                  ].map((cat) => (
                    <div key={cat.label} className="mb-4">
                      <div className="flex items-center gap-2 mb-1"><span>{cat.icon}</span><p className="text-sm font-semibold text-stone-700">{cat.label}</p></div>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => (
                          <button key={s} onClick={() => cat.setter(s)} className={`p-1.5 rounded-lg text-xl ${cat.value >= s ? 'text-amber-500' : 'text-stone-300'}`}>★</button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <input type="text" placeholder="Comentario (opcional)" value={ratingComment} onChange={(e) => setRatingComment(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm mb-3" />
                  <Button full variant="primary" onClick={handleRatingSubmit}>Enviar valoración</Button>
                </div>
              </Card>
            ) : liveJob.paymentStatus !== 'producer_marked_paid' && liveJob.paymentStatus !== 'driver_confirmed' ? (
              <Card className="border-stone-100">
                <div className="p-5">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Pago</p>
                  <p className="text-sm text-stone-700 mb-3">Total: ${Number(liveJob.finalPrice || 0).toLocaleString()} UYU</p>
                  <Button full variant="primary" onClick={() => handleProducerMarkPaid(liveJob.id)}>Marcar pago realizado</Button>
                </div>
              </Card>
            ) : liveJob.paymentStatus === 'producer_marked_paid' ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-sm font-semibold text-amber-800">Esperando confirmación del chofer de que recibió el pago.</p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <p className="text-sm font-semibold text-emerald-800">Todo listo. El chofer confirmó el cobro.</p>
              </div>
            )}
          </div>
        )}

        {/* Driver completed */}
        {isDriver && completed && (
          <div className="mb-6 space-y-3">
            {liveJob.weighing && (
              <Card className={`${liveJob.weighing.status === 'accepted' ? 'border-emerald-200' : liveJob.weighing.status === 'rejected' ? 'border-red-200' : 'border-amber-200'}`}>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span>⚖️</span><p className="text-sm font-bold text-stone-700">Pesaje: {liveJob.weighing.totalKg.toLocaleString()} kg</p></div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                      liveJob.weighing.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : liveJob.weighing.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>{liveJob.weighing.status === 'accepted' ? 'Aceptado' : liveJob.weighing.status === 'rejected' ? 'Rechazado' : 'Pendiente'}</span>
                  </div>
                  {liveJob.weighing.scaleNumber && <p className="text-xs text-stone-500 mt-1">Balanza: {liveJob.weighing.scaleNumber}</p>}
                </div>
              </Card>
            )}
            {liveJob.paymentStatus === 'producer_marked_paid' ? (
              <Card className="border-emerald-200 bg-emerald-50/50 p-4">
                <p className="text-sm font-semibold text-stone-700 mb-2">El productor marcó el pago como realizado.</p>
                <Button full variant="primary" onClick={() => handleDriverConfirmPayment(liveJob.id)}>Confirmar que cobré</Button>
              </Card>
            ) : liveJob.paymentStatus === 'driver_confirmed' && !liveJob.driverRating ? (
              <Card className="border-stone-100">
                <div className="p-5">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Calificar al productor</p>
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setDriverRatingScore(s)} className={`p-1.5 rounded-lg text-xl ${driverRatingScore >= s ? 'text-amber-500' : 'text-stone-300'}`}>★</button>
                    ))}
                  </div>
                  <input type="text" placeholder="Comentario (opcional)" value={driverRatingComment} onChange={(e) => setDriverRatingComment(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm mb-3" />
                  <Button full variant="primary" onClick={handleDriverRatingSubmit}>Enviar valoración</Button>
                </div>
              </Card>
            ) : liveJob.paymentStatus === 'driver_confirmed' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <p className="text-sm font-semibold text-emerald-800">Cobro confirmado. Valoración enviada.</p>
              </div>
            ) : (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                <p className="text-sm text-stone-600">Esperando que el productor marque el pago como realizado.</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 items-center bg-stone-50 p-4 rounded-2xl border border-stone-100 mb-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-xl">🤠</div>
          <div>
            <p className="font-bold text-stone-900 text-lg">Chofer Asignado</p>
            <p className="text-stone-500 text-sm">{liveJob?.carrierName || 'Chofer por confirmar'}{liveJob?.carrierTruckModel ? ` • ${liveJob.carrierTruckModel}` : ''}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="bg-green-500 p-2 rounded-full text-white shadow-lg shadow-green-200"><INavigation /></button>
          </div>
        </div>

        {!completed && (
          <Button full variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300">Reportar Problema</Button>
        )}
      </div>
    </div>
  );
};
