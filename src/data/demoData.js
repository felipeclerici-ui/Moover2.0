import { calculatePrice } from "../lib/pricing.js";

// Helper para vencimientos de docs del chofer demo
const isoInDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export function createDemoJobs() {
  return [
    {
      id: 'job-1',
      userId: 'demo-producer',
      from: 'Durazno',
      to: 'Montevideo',
      dicoseOrigin: '05.345.678', // est-1 La Cimarrona, Durazno
      dicoseDest: '10.666.666',   // est-8 Frigorífico Modelo, Montevideo
      animal: 'novillos',
      quantity: '22',
      weight: '320',
      paymentMethod: 'transfer',
      status: 'pending',
      createdAt: Date.now(),
      price: calculatePrice(22),
      distance: 'Est. 320km',
    },
    {
      id: 'job-2',
      userId: 'demo-producer',
      from: 'Rocha',
      to: 'Canelones',
      dicoseOrigin: '14.555.555', // est-7 Los Ceibos, Rocha
      dicoseDest: '02.222.222',   // est-3 Las Piedras, Canelones
      animal: 'lanares',
      quantity: '60',
      weight: '45',
      paymentMethod: 'mercadopago',
      status: 'pending',
      createdAt: Date.now(),
      price: calculatePrice(60),
      distance: 'Est. 210km',
    }
  ];
}

export function createDemoDriverProfile() {
  return {
    name: 'Transporte El Gaucho',
    phone: '099 555 123',
    truckModel: 'Scania R420',
    capacity: '32',
    licensePlate: 'STC 4521',
    dicoseTransportista: '13.999.001',
    mgapHabNumber: 'MGAP-T-4521',
    mgapHabExpiry: isoInDays(180),
    licenseExpiry: isoInDays(365),
  };
}

export function createEmptyDriverProfile() {
  return {
    name: '',
    phone: '',
    truckModel: '',
    capacity: '',
    licensePlate: '',
    dicoseTransportista: '',
    mgapHabNumber: '',
    mgapHabExpiry: '',
    licenseExpiry: '',
  };
}

export function createDemoChat() {
  return {
    'job-1': [
      { id: 'msg-demo-1', sender: 'carrier', text: 'Buen día, vi la carga de 22 novillos Durazno-Montevideo. ¿Tiene embarcadero?', timestamp: Date.now() - 3600000 },
      { id: 'msg-demo-2', sender: 'producer', text: 'Sí, embarcadero completo. ¿Para cuándo podrías?', timestamp: Date.now() - 3500000 },
      { id: 'msg-demo-3', sender: 'carrier', text: 'Podría el jueves a primera hora. Tengo un Scania con capacidad para 30 cabezas.', timestamp: Date.now() - 3400000 },
    ]
  };
}

export function createDemoNotifications() {
  return [
    { id: 'n-1', type: 'offer', jobId: 'job-1', title: 'Nueva oferta recibida', text: 'Un chofer propuso precio para tu flete Durazno → Montevideo', timestamp: Date.now() - 1800000, read: false },
    { id: 'n-2', type: 'system', title: 'Bienvenido a GanadoGo', text: 'Tu cuenta está lista. Empezá a solicitar fletes o buscar cargas.', timestamp: Date.now() - 86400000, read: true },
    { id: 'n-3', type: 'info', title: 'Nuevas balanzas agregadas', text: 'Se agregaron 3 nuevas balanzas verificadas en el mapa.', timestamp: Date.now() - 172800000, read: true },
  ];
}

export function createDemoDocuments() {
  return [
    { id: 'doc-1', jobId: 'job-1', type: 'guia_sanitaria', description: 'Guía MGAP N° 54321', photoName: 'guia_mgap_54321.jpg', uploadedAt: Date.now() - 86400000, uploadedBy: 'carrier' },
    { id: 'doc-2', jobId: 'job-1', type: 'despacho_tropa', description: 'Despacho 22 novillos Durazno', photoName: 'despacho_001.jpg', uploadedAt: Date.now() - 82800000, uploadedBy: 'producer' },
  ];
}
