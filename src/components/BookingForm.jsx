import React from "react";
import { AddressAutocomplete } from "./ui/AddressAutocomplete.jsx";
import { InputGroup } from "./ui/InputGroup.jsx";
import { SelectGroup } from "./ui/SelectGroup.jsx";
import { Button } from "./ui/Button.jsx";
import { IChevron, IMapPin } from "./ui/Icon.jsx";
import { ANIMAL_TYPES, PAYMENT_METHODS } from "../lib/constants.js";
import { animalRequiresGuide } from "../lib/validation.js";
import {
  isValidDicose,
  getDicoseDepartment,
  getEstablecimientoByDicose,
} from "../lib/dicose.js";
import { isValidAddressMeta } from "../lib/addressMeta.js";
import {
  todayISO,
  maxDateISO,
  validatePreferredDate,
  dateRuleMessage,
} from "../lib/dateRules.js";

// Panel de feedback para un DICOSE (verde si establecimiento, gris si solo dept,
// rojo si hay mismatch contra la dirección).
const DicoseFeedback = ({ dicose, addressMeta, label }) => {
  if (!dicose) return null;
  if (!isValidDicose(dicose)) {
    return (
      <p className="text-xs text-red-600 mt-2 mb-2 ml-1">
        Formato DICOSE inválido (7–8 dígitos, ej: 05.345.678)
      </p>
    );
  }
  const est = getEstablecimientoByDicose(dicose);
  const dept = est?.department || getDicoseDepartment(dicose);
  if (!dept) {
    return (
      <p className="text-xs text-amber-700 mt-2 mb-2 ml-1">
        Prefijo de departamento no reconocido. Verificá el DICOSE.
      </p>
    );
  }
  const addrDept = addressMeta?.department || null;
  const mismatch = addrDept && addrDept.toLowerCase() !== dept.toLowerCase();

  return (
    <div className="mt-2 mb-3 -mt-2">
      {est ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-start gap-2">
          <span className="text-emerald-600 mt-0.5">✓</span>
          <div className="text-xs flex-1">
            <p className="font-bold text-emerald-900">{est.name}</p>
            <p className="text-emerald-700">{dept} · {est.type}</p>
          </div>
        </div>
      ) : (
        <div className="bg-stone-100 border border-stone-200 rounded-lg px-3 py-2 flex items-center gap-2">
          <span className="text-stone-500">📍</span>
          <p className="text-xs text-stone-700">
            Departamento detectado: <span className="font-bold">{dept}</span>
          </p>
        </div>
      )}
      {mismatch && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2 flex items-start gap-2">
          <span className="text-red-600 mt-0.5">⚠</span>
          <p className="text-xs text-red-800">
            El DICOSE de {label.toLowerCase()} corresponde a <b>{dept}</b> pero la
            dirección está en <b>{addrDept}</b>. Verificá que coincidan.
          </p>
        </div>
      )}
    </div>
  );
};

// True si el DICOSE tiene mismatch contra la dirección. Usado para gating.
const hasDicoseMismatch = (dicose, addressMeta) => {
  if (!dicose || !isValidDicose(dicose)) return false;
  const est = getEstablecimientoByDicose(dicose);
  const dept = est?.department || getDicoseDepartment(dicose);
  if (!dept) return false;
  const addrDept = addressMeta?.department || null;
  return !!(addrDept && addrDept.toLowerCase() !== dept.toLowerCase());
};

export const BookingForm = ({
  bookingData,
  setBookingData,
  bookingStep,
  setBookingStep,
  setView,
  handleCreateJob,
  calculatePrice,
}) => {
  const dateValidation = validatePreferredDate(bookingData.preferredDate);
  const originMismatch = hasDicoseMismatch(
    bookingData.dicoseOrigin,
    bookingData.originMeta,
  );
  const destMismatch = hasDicoseMismatch(
    bookingData.dicoseDest,
    bookingData.destinationMeta,
  );

  const step1Disabled =
    !bookingData.originAddress ||
    !bookingData.destinationAddress ||
    !isValidAddressMeta(bookingData.originMeta) ||
    !isValidAddressMeta(bookingData.destinationMeta) ||
    !isValidDicose(bookingData.dicoseOrigin) ||
    !isValidDicose(bookingData.dicoseDest) ||
    !bookingData.dicoseOrigin ||
    !bookingData.dicoseDest ||
    originMismatch ||
    destMismatch ||
    !dateValidation.valid;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <div className="bg-white px-4 py-4 border-b border-stone-200 sticky top-0 z-10 flex items-center gap-4 shadow-sm">
        <button onClick={() => setView('producer-home')} className="p-2 hover:bg-stone-100 rounded-full">
          <span className="inline-block rotate-180"><IChevron /></span>
        </button>
        <div>
          <h2 className="text-lg font-bold text-stone-800">Solicitar Flete</h2>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3].map(step => (
              <div key={step} className={`h-1.5 w-8 rounded-full ${bookingStep >= step ? 'bg-emerald-500' : 'bg-stone-200'}`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {bookingStep === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h3 className="text-xl font-bold text-stone-800">¿De dónde a dónde?</h3>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
              <AddressAutocomplete
                label="¿Dónde salís?"
                placeholder="Escribí dirección o localidad (ej: Montevideo, Durazno...)"
                icon={<IMapPin />}
                value={bookingData.originAddress}
                meta={bookingData.originMeta}
                onChange={(e) => setBookingData(prev => ({ ...prev, originAddress: e.target.value }))}
                onSelect={(meta) => setBookingData(prev => ({ ...prev, originMeta: meta }))}
              />
              <AddressAutocomplete
                label="¿A dónde vas?"
                placeholder="Escribí dirección o localidad (ej: Colonia, Paysandú...)"
                icon={<IMapPin />}
                value={bookingData.destinationAddress}
                meta={bookingData.destinationMeta}
                onChange={(e) => setBookingData(prev => ({ ...prev, destinationAddress: e.target.value }))}
                onSelect={(meta) => setBookingData(prev => ({ ...prev, destinationMeta: meta }))}
              />
              {(bookingData.originAddress || bookingData.destinationAddress) && (
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Vista previa del recorrido</p>
                  <div className="w-full h-56 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                    <iframe
                      title="Ruta del viaje"
                      src={bookingData.originAddress && bookingData.destinationAddress
                        ? `https://maps.google.com/maps?saddr=${encodeURIComponent(bookingData.originAddress + ', Uruguay')}&daddr=${encodeURIComponent(bookingData.destinationAddress + ', Uruguay')}&output=embed`
                        : `https://maps.google.com/maps?q=${encodeURIComponent((bookingData.originAddress || bookingData.destinationAddress) + ', Uruguay')}&output=embed`}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              )}
              <div>
                <InputGroup
                  label="DICOSE Origen"
                  placeholder="Ej: 05.345.678"
                  value={bookingData.dicoseOrigin}
                  onChange={(e) => setBookingData(prev => ({ ...prev, dicoseOrigin: e.target.value }))}
                />
                <DicoseFeedback
                  dicose={bookingData.dicoseOrigin}
                  addressMeta={bookingData.originMeta}
                  label="Origen"
                />
              </div>
              <div>
                <InputGroup
                  label="DICOSE Destino"
                  placeholder="Ej: 10.666.666"
                  value={bookingData.dicoseDest}
                  onChange={(e) => setBookingData(prev => ({ ...prev, dicoseDest: e.target.value }))}
                />
                <DicoseFeedback
                  dicose={bookingData.dicoseDest}
                  addressMeta={bookingData.destinationMeta}
                  label="Destino"
                />
              </div>
              <InputGroup
                label="Detalle de Origen (opcional)"
                placeholder="Referencia, km, entrada al campo..."
                value={bookingData.originAddressDetail}
                onChange={(e) => setBookingData(prev => ({ ...prev, originAddressDetail: e.target.value }))}
              />
              <InputGroup
                label="Detalle de Destino (opcional)"
                placeholder="Referencia, km, embarcadero, etc."
                value={bookingData.destinationAddressDetail}
                onChange={(e) => setBookingData(prev => ({ ...prev, destinationAddressDetail: e.target.value }))}
              />
              <InputGroup
                label="Fecha Preferida (opcional)"
                type="date"
                value={bookingData.preferredDate}
                onChange={(e) => setBookingData(prev => ({ ...prev, preferredDate: e.target.value }))}
                min={todayISO()}
                max={maxDateISO(60)}
                invalid={!dateValidation.valid}
                hint={!dateValidation.valid ? dateRuleMessage(dateValidation.reason) : null}
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-3">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">
                Infraestructura (opcional)
              </p>
              <SelectGroup
                label="Infraestructura en Origen"
                options={['Embarcadero disponible', 'Sin embarcadero']}
                value={bookingData.originInfrastructure}
                onChange={(e) => setBookingData(prev => ({ ...prev, originInfrastructure: e.target.value }))}
              />
              <SelectGroup
                label="Infraestructura en Destino"
                options={['Embarcadero disponible', 'Sin embarcadero']}
                value={bookingData.destinationInfrastructure}
                onChange={(e) => setBookingData(prev => ({ ...prev, destinationInfrastructure: e.target.value }))}
              />
            </div>
            <Button full onClick={() => setBookingStep(2)} disabled={step1Disabled}>Siguiente</Button>
          </div>
        )}

        {bookingStep === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h3 className="text-xl font-bold text-stone-800">Detalles de la Carga</h3>
            <div className="grid grid-cols-2 gap-3">
              {ANIMAL_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setBookingData(prev => ({ ...prev, animal: type.id }))}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${bookingData.animal === type.id
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 ring-1 ring-emerald-500'
                      : 'border-stone-100 bg-white text-stone-500 hover:border-stone-200'
                    }`}
                >
                  <span className="text-3xl mb-2">{type.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wide">{type.label}</span>
                </button>
              ))}
            </div>
            {animalRequiresGuide(bookingData.animal) ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <span className="text-xl">📋</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-amber-900">Guía Sanitaria MGAP obligatoria</p>
                  <p className="text-xs text-amber-800 mt-1">
                    Por normativa uruguaya, el transporte de {ANIMAL_TYPES.find(a => a.id === bookingData.animal)?.label.toLowerCase()} requiere guía MGAP.
                    El chofer deberá adjuntarla antes de iniciar el viaje.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex gap-3">
                <span className="text-xl">ℹ️</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-stone-700">Sin guía MGAP</p>
                  <p className="text-xs text-stone-600 mt-1">
                    Los equinos no requieren guía sanitaria MGAP estándar. Consultá documentación específica según el caso.
                  </p>
                </div>
              </div>
            )}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <InputGroup
                label="Cantidad de Cabezas"
                type="number"
                placeholder="0"
                value={bookingData.quantity}
                onChange={(e) => setBookingData(prev => ({ ...prev, quantity: e.target.value }))}
              />
              <InputGroup
                label="Peso Promedio (kg/animal)"
                type="number"
                placeholder="0"
                value={bookingData.weight}
                onChange={(e) => setBookingData(prev => ({ ...prev, weight: e.target.value }))}
              />
            </div>
            <Button full onClick={() => setBookingStep(3)} disabled={!bookingData.quantity}>Continuar al Pago</Button>
          </div>
        )}

        {bookingStep === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h3 className="text-xl font-bold text-stone-800">Pago y Confirmación</h3>
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Método de Pago</label>
              {PAYMENT_METHODS.map((method) => {
                const isSelected = bookingData.paymentMethod === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: method.id }))}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? `border-emerald-500 bg-emerald-50` : 'border-stone-100 bg-white hover:border-stone-200'}`}
                  >
                    <div className={`p-2 rounded-full bg-white shadow-sm text-emerald-700`}>
                      💳
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${isSelected ? 'text-stone-900' : 'text-stone-600'}`}>{method.label}</p>
                      <p className="text-xs text-stone-400">
                        {method.id === 'mercadopago' ? 'Tarjetas, QR, Efectivo' : 'BROU, Santander, Itaú'}
                      </p>
                    </div>
                    {isSelected && <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">✓</div>}
                  </div>
                );
              })}
            </div>
            <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-xl mt-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-stone-400 font-medium">Total Estimado</span>
                <span className="text-3xl font-bold">{calculatePrice(bookingData.quantity)}</span>
              </div>
              <div className="h-px bg-stone-700 my-4"></div>
              <div className="text-sm text-stone-400 space-y-1">
                <p>• {bookingData.quantity} {bookingData.animal}</p>
                <p>• {bookingData.originAddress} → {bookingData.destinationAddress}</p>
                <p>• Pago vía {bookingData.paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Transferencia'}</p>
              </div>
            </div>
            <Button full variant="primary" onClick={handleCreateJob}>
              Confirmar Pedido
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
