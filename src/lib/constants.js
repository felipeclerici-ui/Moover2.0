// --- Constants ---
export const DEPARTMENTS = [
  "Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno",
  "Flores", "Florida", "Lavalleja", "Maldonado", "Montevideo",
  "Paysandú", "Río Negro", "Rivera", "Rocha", "Salto",
  "San José", "Soriano", "Tacuarembó", "Treinta y Tres"
];

export const ANIMAL_TYPES = [
  { id: 'novillos', label: 'Novillos', icon: '🐂', requiresGuide: true },
  { id: 'vacas', label: 'Vacas Inv.', icon: '🐄', requiresGuide: true },
  { id: 'terneros', label: 'Terneros', icon: '🐮', requiresGuide: true },
  { id: 'lanares', label: 'Lanares', icon: '🐑', requiresGuide: true },
  { id: 'equinos', label: 'Equinos', icon: '🐎', requiresGuide: false },
];

export const PAYMENT_METHODS = [
  { id: 'mercadopago', label: 'Mercado Pago' },
  { id: 'transfer', label: 'Transferencia' },
];

export const DOC_TYPES = [
  { id: 'guia_sanitaria', label: 'Guía Sanitaria', icon: '📋', desc: 'Guía MGAP para transporte' },
  { id: 'despacho_tropa', label: 'Despacho de Tropa', icon: '📦', desc: 'Documento de despacho' },
  { id: 'pesada', label: 'Pesada', icon: '⚖️', desc: 'Ticket de pesaje' },
  { id: 'otro', label: 'Otro Documento', icon: '📄', desc: 'Documentación adicional' },
];

export const LS_KEYS = {
  jobs: 'ganadogo_preview_jobs_v1',
  driver: 'ganadogo_preview_driver_v1',
  chat: 'ganadogo_preview_chat_v1',
  documents: 'ganadogo_preview_docs_v1',
  notifications: 'ganadogo_preview_notifs_v1',
  settings: 'ganadogo_preview_settings_v1',
};
