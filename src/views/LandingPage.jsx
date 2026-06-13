import React from "react";
import { Button } from "../components/ui/Button.jsx";

export const LandingPage = ({ setRole, setView }) => (
  <div className="min-h-screen bg-stone-900 flex flex-col relative overflow-hidden font-sans">
    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
    <div className="relative z-10 flex flex-col h-full p-8 justify-between">
      <div className="mt-12">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-full mb-6 border border-emerald-500/30">
          <span className="text-emerald-300 font-bold text-sm tracking-wide">GANADOGO APP</span>
        </div>
        <h1 className="text-5xl font-black text-white leading-[1.1] mb-6">
          Logística <br />
          <span className="text-emerald-500">Ganadera</span> <br />
          Inteligente.
        </h1>
        <p className="text-stone-400 text-lg max-w-xs">
          Conectá productores con transportistas. Guías, chat, balanzas y más.
        </p>
      </div>
      <div className="space-y-4 mb-8">
        <Button
          full
          className="h-16 text-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 border-none"
          onClick={() => { setRole('producer'); setView('producer-home'); }}
        >
          Soy Productor
        </Button>
        <Button
          full
          variant="outline"
          className="h-16 text-lg border-stone-700 text-stone-300 hover:bg-stone-800"
          onClick={() => { setRole('carrier'); setView('carrier-home'); }}
        >
          Soy Chofer
        </Button>
      </div>
    </div>
  </div>
);
