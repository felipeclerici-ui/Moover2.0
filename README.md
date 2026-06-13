# GanadoGo · Web demo

> **Logística ganadera inteligente para Uruguay.**
> El "Uber" de los fletes de ganado: conecta productores y transportistas en una sola app.

Esta es la versión web (PWA) que se usa como demo interactiva para inversores, socios y feedback temprano de usuarios. No tiene backend: usa `localStorage` para simular persistencia.

---

## 🚀 Cómo correrlo

```bash
npm install
npm run dev      # servidor local en http://localhost:5173
npm run build    # build de producción a /dist
npm run preview  # sirve el build
```

## 🧱 Stack

- **React 19** + Vite
- **Tailwind CSS 3** (mobile-first)
- **PWA** (manifest + service worker)
- **Photon (OpenStreetMap)** para autocompletado de direcciones
- **Google Maps embed** para previsualización de rutas
- `localStorage` para estado (demo, sin backend)

## 📁 Estructura

```
src/
├── App.jsx                 # Orquestador, estado global y handlers
├── main.jsx                # Bootstrap
├── index.css               # Tailwind + reset
├── components/
│   ├── BottomNav.jsx       # Tab bar persistente
│   ├── BookingForm.jsx     # Wizard de 3 pasos (ruta, carga, pago)
│   └── ui/                 # Primitivos reutilizables
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Icon.jsx
│       ├── InputGroup.jsx
│       ├── SelectGroup.jsx
│       └── AddressAutocomplete.jsx
├── views/                  # 15 pantallas (una por archivo)
│   ├── LandingPage.jsx
│   ├── ProducerHome.jsx
│   ├── CarrierHome.jsx
│   ├── DriverProfileView.jsx
│   ├── CarrierOfferView.jsx
│   ├── ProducerOfferView.jsx
│   ├── TrackingView.jsx
│   ├── DocumentsView.jsx
│   ├── ChatListView.jsx
│   ├── ChatDetailView.jsx
│   ├── MapHubView.jsx
│   ├── SettingsView.jsx
│   ├── NotificationsView.jsx
│   ├── HelpView.jsx
│   └── HistoryView.jsx
├── lib/                    # Helpers puros
│   ├── constants.js        # DEPARTMENTS, ANIMAL_TYPES, etc.
│   ├── validation.js       # DICOSE, RUT, guías
│   ├── storage.js          # readJson / writeJson
│   └── pricing.js          # calculatePrice
└── data/                   # Datos de referencia y seeds de demo
    ├── balanzas.js
    ├── establecimientos.js
    └── demoData.js
```

## 🎭 Roles

- **Productor** — Estancia o campo que necesita transportar ganado.
- **Chofer** — Transportista que ofrece fletes y propone precios.

En el landing podés elegir un rol y la app navega al home correspondiente.

## 🐂 Funcionalidades

- Solicitud de flete en 3 pasos (ruta, carga, pago) con autocompletado de direcciones de Uruguay.
- Validación de DICOSE (formato uruguayo).
- Sistema de ofertas (chofer propone, productor acepta o rechaza).
- Tracking con guías sanitarias MGAP, pesajes, confirmación de km.
- Calificación bidireccional (productor califica al chofer en 3 ejes; chofer califica al productor).
- Chat por viaje, gestión de documentos, historial.
- Directorio de **12 balanzas** verificadas y **10 establecimientos** con DICOSE/RUT.

## 🚧 Estado

Esta es una **demo funcional** para validar el producto y el flujo con stakeholders. Los datos no persisten entre dispositivos. Antes de producción se necesita:

1. Backend con auth (Firebase / Supabase).
2. GPS real del chofer durante el viaje.
3. Pagos via Mercado Pago + escrow.
4. Verificación de choferes (licencia, seguro, habilitación CNRT).
5. Migración a app nativa (React Native / Expo).
6. Integración con MGAP para validar guías.

## 📜 Licencia

Propietario — © GanadoGo.
