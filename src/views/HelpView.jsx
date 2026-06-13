import React from "react";
import { Card } from "../components/ui/Card.jsx";

export const HelpView = () => (
  <div className="min-h-screen bg-stone-100 pb-24">
    <div className="bg-white px-6 pt-12 pb-6 border-b border-stone-200 shadow-sm">
      <h2 className="text-2xl font-black text-stone-800">Ayuda y Soporte</h2>
      <p className="text-sm text-stone-500 mt-1">Preguntas frecuentes y contacto</p>
    </div>
    <div className="px-6 py-6 space-y-4">
      {[
        { q: '¿Cómo solicito un flete?', a: 'Desde la pantalla de inicio, tocá "Nuevo Flete" y seguí los 3 pasos: ruta, carga y pago.' },
        { q: '¿Cómo subo las guías sanitarias?', a: 'Podés subirlas desde la sección Documentos o directamente en el seguimiento del viaje antes de iniciar.' },
        { q: '¿Dónde veo las balanzas cercanas?', a: 'En la pestaña Mapa encontrás todas las balanzas verificadas de Uruguay con dirección y teléfono.' },
        { q: '¿Cómo funciona el chat?', a: 'Una vez que un chofer es asignado a tu viaje, se habilita el chat directo entre ambas partes.' },
        { q: '¿Qué es el número DICOSE?', a: 'Es el identificador oficial del establecimiento rural asignado por DICOSE (División Contralor de Semovientes).' },
        { q: '¿Cómo funciona el pesaje?', a: 'El chofer registra el peso en una balanza durante el viaje. El productor debe aceptar o rechazar el pesaje registrado.' },
      ].map((faq, i) => (
        <Card key={i}>
          <div className="p-4">
            <p className="font-bold text-stone-800 text-sm mb-2">{faq.q}</p>
            <p className="text-sm text-stone-600">{faq.a}</p>
          </div>
        </Card>
      ))}

      <Card className="border-emerald-200 bg-emerald-50/50">
        <div className="p-5 text-center">
          <span className="text-3xl block mb-2">📧</span>
          <p className="font-bold text-stone-800">¿Necesitás más ayuda?</p>
          <p className="text-sm text-stone-600 mt-1">Escribinos a <span className="font-bold text-emerald-700">soporte@ganadogo.com.uy</span></p>
          <p className="text-sm text-stone-600 mt-1">o llamá al <span className="font-bold text-emerald-700">0800 4262</span></p>
        </div>
      </Card>
    </div>
  </div>
);
