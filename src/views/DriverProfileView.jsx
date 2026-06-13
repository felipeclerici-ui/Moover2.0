import React, { useState, useEffect, useMemo } from "react";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { InputGroup } from "../components/ui/InputGroup.jsx";
import { IChevron, IUser, ITruck, IDoc } from "../components/ui/Icon.jsx";
import { LS_KEYS } from "../lib/constants.js";
import { writeJson } from "../lib/storage.js";
import { isValidDicose } from "../lib/dicose.js";
import { isDriverVerified } from "../lib/habilitacion.js";
import { todayISO } from "../lib/dateRules.js";
import {
  createDemoJobs,
  createDemoChat,
  createDemoDocuments,
  createDemoNotifications,
  createDemoDriverProfile,
} from "../data/demoData.js";

const HabilitacionBadge = ({ status }) => {
  if (status.verified) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        ✓ Habilitado
      </span>
    );
  }
  const issues =
    status.missing.length + status.expired.length + status.invalid.length;
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
      ⚠ Pendiente · {issues} pendiente{issues === 1 ? "" : "s"}
    </span>
  );
};

export const DriverProfileView = ({
  driverProfile,
  setDriverProfile,
  setView,
  setJobs,
  setChatMessages,
  setDocuments,
  setNotifications,
}) => {
  const [form, setForm] = useState({
    name: driverProfile?.name || "",
    phone: driverProfile?.phone || "",
    truckModel: driverProfile?.truckModel || "",
    capacity: driverProfile?.capacity || "",
    licensePlate: driverProfile?.licensePlate || "",
    dicoseTransportista: driverProfile?.dicoseTransportista || "",
    mgapHabNumber: driverProfile?.mgapHabNumber || "",
    mgapHabExpiry: driverProfile?.mgapHabExpiry || "",
    licenseExpiry: driverProfile?.licenseExpiry || "",
  });

  useEffect(() => {
    setForm({
      name: driverProfile?.name || "",
      phone: driverProfile?.phone || "",
      truckModel: driverProfile?.truckModel || "",
      capacity: driverProfile?.capacity || "",
      licensePlate: driverProfile?.licensePlate || "",
      dicoseTransportista: driverProfile?.dicoseTransportista || "",
      mgapHabNumber: driverProfile?.mgapHabNumber || "",
      mgapHabExpiry: driverProfile?.mgapHabExpiry || "",
      licenseExpiry: driverProfile?.licenseExpiry || "",
    });
  }, [driverProfile]);

  // Status en vivo sobre el form (no sobre lo persistido) para feedback inmediato.
  const liveStatus = useMemo(() => isDriverVerified(form), [form]);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = () => {
    if (!form.name.trim() || !form.truckModel.trim() || !form.capacity) {
      alert("Completá al menos: nombre, modelo del camión y capacidad aproximada.");
      return;
    }
    if (form.dicoseTransportista && !isValidDicose(form.dicoseTransportista)) {
      alert("El DICOSE Transportista tiene un formato inválido (7–8 dígitos).");
      return;
    }
    setDriverProfile({ ...driverProfile, ...form });
    if (liveStatus.expired.length) {
      alert(
        "Perfil guardado, pero tenés documentación vencida: " +
          liveStatus.expired.join(", ") +
          ". Actualizalo para poder ofertar fletes.",
      );
    }
    setView("carrier-home");
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <div className="bg-white px-4 py-4 border-b border-stone-200 sticky top-0 z-10 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => setView("carrier-home")}
          className="p-2 hover:bg-stone-100 rounded-full"
        >
          <span className="inline-block rotate-180">
            <IChevron />
          </span>
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-stone-800">Perfil de Chofer</h2>
          <p className="text-xs text-stone-400">Habilitaciones, camión y datos de contacto</p>
        </div>
        <HabilitacionBadge status={liveStatus} />
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-4">
        {/* Identidad */}
        <Card className="border-stone-100">
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                <IUser />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Identidad</p>
                <p className="text-sm text-stone-600">Se muestra a productores al aceptar un viaje.</p>
              </div>
            </div>
            <InputGroup label="Nombre o Razón Social" value={form.name} onChange={handleChange("name")} placeholder="Ej: Transporte El Gaucho" />
            <InputGroup label="Teléfono de Contacto" value={form.phone} onChange={handleChange("phone")} placeholder="Ej: 099 123 456" />
          </div>
        </Card>

        {/* Habilitación */}
        <Card className="border-stone-100">
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700">
                <IDoc />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Habilitación</p>
                <p className="text-sm text-stone-600">Documentación MGAP y libreta profesional. Obligatorio para ofertar.</p>
              </div>
            </div>
            <InputGroup
              label="DICOSE Transportista"
              value={form.dicoseTransportista}
              onChange={handleChange("dicoseTransportista")}
              placeholder="Ej: 13.999.001"
              invalid={!!form.dicoseTransportista && !isValidDicose(form.dicoseTransportista)}
              hint={
                form.dicoseTransportista && !isValidDicose(form.dicoseTransportista)
                  ? "Formato inválido (7–8 dígitos, ej: 13.999.001)"
                  : null
              }
            />
            <InputGroup
              label="N° Habilitación MGAP"
              value={form.mgapHabNumber}
              onChange={handleChange("mgapHabNumber")}
              placeholder="Ej: MGAP-T-4521"
            />
            <InputGroup
              label="Vencimiento Habilitación MGAP"
              type="date"
              value={form.mgapHabExpiry}
              onChange={handleChange("mgapHabExpiry")}
              min={todayISO()}
              invalid={!!form.mgapHabExpiry && form.mgapHabExpiry < todayISO()}
              hint={
                form.mgapHabExpiry && form.mgapHabExpiry < todayISO()
                  ? "Habilitación MGAP vencida"
                  : null
              }
            />
            <InputGroup
              label="Vencimiento Libreta Profesional"
              type="date"
              value={form.licenseExpiry}
              onChange={handleChange("licenseExpiry")}
              min={todayISO()}
              invalid={!!form.licenseExpiry && form.licenseExpiry < todayISO()}
              hint={
                form.licenseExpiry && form.licenseExpiry < todayISO()
                  ? "Libreta profesional vencida"
                  : null
              }
            />

            {!liveStatus.verified && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2 text-xs text-amber-900">
                <p className="font-bold mb-1">Tu perfil aún no está habilitado:</p>
                {liveStatus.missing.length > 0 && (
                  <p>• Falta completar: {liveStatus.missing.join(", ")}.</p>
                )}
                {liveStatus.invalid.length > 0 && (
                  <p>• Formato inválido: {liveStatus.invalid.join(", ")}.</p>
                )}
                {liveStatus.expired.length > 0 && (
                  <p>• Vencido: {liveStatus.expired.join(", ")}.</p>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Camión */}
        <Card className="border-stone-100">
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-emerald-400">
                <ITruck />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Camión</p>
                <p className="text-sm text-stone-600">Ayuda al matcheo por capacidad.</p>
              </div>
            </div>
            <InputGroup label="Modelo del Camión" value={form.truckModel} onChange={handleChange("truckModel")} placeholder="Ej: Scania R420" />
            <InputGroup label="Capacidad Aproximada (cabezas)" type="number" value={form.capacity} onChange={handleChange("capacity")} placeholder="Ej: 30" />
            <InputGroup label="Matrícula" value={form.licensePlate} onChange={handleChange("licensePlate")} placeholder="Ej: ABC 1234" />
          </div>
        </Card>

        <Button full variant="primary" onClick={handleSave}>Guardar Perfil</Button>
        <Button
          full
          variant="outline"
          className="border-stone-200 text-stone-600"
          onClick={() => {
            if (confirm("¿Resetear demo data (jobs + perfil)?")) {
              const seeded = createDemoJobs();
              setJobs(seeded);
              writeJson(LS_KEYS.jobs, seeded);
              const demoDriver = createDemoDriverProfile();
              setDriverProfile(demoDriver);
              writeJson(LS_KEYS.driver, demoDriver);
              const demoChat = createDemoChat();
              setChatMessages(demoChat);
              writeJson(LS_KEYS.chat, demoChat);
              const demoDocs = createDemoDocuments();
              setDocuments(demoDocs);
              writeJson(LS_KEYS.documents, demoDocs);
              const demoNotifs = createDemoNotifications();
              setNotifications(demoNotifs);
              writeJson(LS_KEYS.notifications, demoNotifs);
            }
          }}
        >
          Reset demo data
        </Button>
      </div>
    </div>
  );
};
