import React, { useState, useEffect, useMemo } from "react";
import { LS_KEYS } from "./lib/constants.js";
import { readJson, writeJson } from "./lib/storage.js";
import { calculatePrice } from "./lib/pricing.js";
import { animalRequiresGuide } from "./lib/validation.js";
import { isDriverVerified } from "./lib/habilitacion.js";
import {
  createDemoJobs,
  createDemoChat,
  createDemoDocuments,
  createDemoNotifications,
  createDemoDriverProfile,
  createEmptyDriverProfile,
} from "./data/demoData.js";

import { BottomNav } from "./components/BottomNav.jsx";
import { BookingForm } from "./components/BookingForm.jsx";

import { LandingPage } from "./views/LandingPage.jsx";
import { ProducerHome } from "./views/ProducerHome.jsx";
import { CarrierHome } from "./views/CarrierHome.jsx";
import { DriverProfileView } from "./views/DriverProfileView.jsx";
import { CarrierOfferView } from "./views/CarrierOfferView.jsx";
import { ProducerOfferView } from "./views/ProducerOfferView.jsx";
import { TrackingView } from "./views/TrackingView.jsx";
import { DocumentsView } from "./views/DocumentsView.jsx";
import { ChatListView } from "./views/ChatListView.jsx";
import { ChatDetailView } from "./views/ChatDetailView.jsx";
import { MapHubView } from "./views/MapHubView.jsx";
import { SettingsView } from "./views/SettingsView.jsx";
import { NotificationsView } from "./views/NotificationsView.jsx";
import { HelpView } from "./views/HelpView.jsx";
import { HistoryView } from "./views/HistoryView.jsx";

function App() {
  const [view, setView] = useState('landing');
  const [role, setRole] = useState(null);
  const [activeJob, setActiveJob] = useState(null);
  const [activeChatJobId, setActiveChatJobId] = useState(null);

  const [jobs, setJobs] = useState(() => {
    const saved = readJson(LS_KEYS.jobs, null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    const seeded = createDemoJobs();
    writeJson(LS_KEYS.jobs, seeded);
    return seeded;
  });

  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    originAddress: '',
    destinationAddress: '',
    originMeta: null,
    destinationMeta: null,
    dicoseOrigin: '',
    dicoseDest: '',
    originAddressDetail: '',
    destinationAddressDetail: '',
    preferredDate: '',
    originInfrastructure: '',
    destinationInfrastructure: '',
    animal: 'novillos',
    quantity: '',
    weight: '',
    paymentMethod: 'transfer'
  });

  const [driverProfile, setDriverProfile] = useState(() => {
    const saved = readJson(LS_KEYS.driver, null);
    if (saved && typeof saved === 'object') {
      // Migración: si existe un perfil viejo sin los campos de habilitación,
      // los completamos vacíos para no romper isDriverVerified.
      return { ...createEmptyDriverProfile(), ...saved };
    }
    const seed = createDemoDriverProfile();
    writeJson(LS_KEYS.driver, seed);
    return seed;
  });

  const [chatMessages, setChatMessages] = useState(() => {
    const saved = readJson(LS_KEYS.chat, null);
    if (saved && typeof saved === 'object') return saved;
    const demo = createDemoChat();
    writeJson(LS_KEYS.chat, demo);
    return demo;
  });

  const [documents, setDocuments] = useState(() => {
    const saved = readJson(LS_KEYS.documents, null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    const demo = createDemoDocuments();
    writeJson(LS_KEYS.documents, demo);
    return demo;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = readJson(LS_KEYS.notifications, null);
    if (saved && Array.isArray(saved)) return saved;
    const demo = createDemoNotifications();
    writeJson(LS_KEYS.notifications, demo);
    return demo;
  });

  const [appSettings, setAppSettings] = useState(() => readJson(LS_KEYS.settings, {
    pushNotifications: true,
    chatNotifications: true,
    darkMode: false,
    language: 'es',
  }));

  useEffect(() => { writeJson(LS_KEYS.jobs, jobs); }, [jobs]);
  useEffect(() => { writeJson(LS_KEYS.driver, driverProfile); }, [driverProfile]);
  useEffect(() => { writeJson(LS_KEYS.chat, chatMessages); }, [chatMessages]);
  useEffect(() => { writeJson(LS_KEYS.documents, documents); }, [documents]);
  useEffect(() => { writeJson(LS_KEYS.notifications, notifications); }, [notifications]);
  useEffect(() => { writeJson(LS_KEYS.settings, appSettings); }, [appSettings]);

  const myProducerId = useMemo(() => 'demo-producer', []);
  const myCarrierId = useMemo(() => 'demo-carrier', []);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  // --- Job Handlers ---
  const handleCreateJob = async () => {
    const { originAddress, destinationAddress, ...rest } = bookingData;
    const newJob = {
      id: `job-${Math.random().toString(16).slice(2)}`,
      userId: myProducerId,
      ...rest,
      from: originAddress,
      to: destinationAddress,
      status: 'pending',
      createdAt: Date.now(),
      price: calculatePrice(bookingData.quantity),
      distance: 'Est. 320km',
      offer: null,
      producerConfirmed: false,
      finalKm: null,
      finalPrice: null,
      rating: null,
      paymentStatus: 'pending',
    };
    setJobs([newJob, ...jobs]);
    setBookingData({
      originAddress: '', destinationAddress: '',
      originMeta: null, destinationMeta: null,
      dicoseOrigin: '', dicoseDest: '',
      originAddressDetail: '', destinationAddressDetail: '', preferredDate: '',
      originInfrastructure: '', destinationInfrastructure: '',
      animal: 'novillos', quantity: '', weight: '', paymentMethod: 'transfer'
    });
    setBookingStep(1);
    setView('producer-home');
  };

  const handleProposeOffer = async (jobId, { priceType, pricePerKm, totalPrice }) => {
    if (!driverProfile?.name?.trim() || !driverProfile?.truckModel?.trim() || !driverProfile?.capacity) {
      alert('Para ofrecer un viaje, primero completa tu perfil de chofer (nombre, modelo de camión y capacidad).');
      setView('driver-profile');
      return;
    }
    const { verified, missing, expired, invalid } = isDriverVerified(driverProfile);
    if (!verified) {
      const parts = [];
      if (missing.length) parts.push(`Falta completar: ${missing.join(', ')}.`);
      if (invalid.length) parts.push(`Formato inválido: ${invalid.join(', ')}.`);
      if (expired.length) parts.push(`Vencido: ${expired.join(', ')}.`);
      alert(
        'Tu perfil no está habilitado para ofertar fletes.\n\n' +
          parts.join('\n') +
          '\n\nCompletá tu habilitación MGAP y libreta profesional para continuar.',
      );
      setView('driver-profile');
      return;
    }
    if (priceType === 'per_km' && !pricePerKm) { alert('Ingresa un precio por kilómetro.'); return; }
    if (priceType === 'total' && !totalPrice) { alert('Ingresa un precio total por el viaje.'); return; }

    const updated = jobs.map((j) => {
      if (j.id !== jobId) return j;
      return {
        ...j,
        offer: {
          carrierId: myCarrierId,
          carrierName: driverProfile.name.trim(),
          carrierTruckModel: driverProfile.truckModel.trim(),
          carrierTruckCapacity: driverProfile.capacity,
          priceType,
          pricePerKm: priceType === 'per_km' ? pricePerKm : null,
          totalPrice: priceType === 'total' ? totalPrice : null,
          createdAt: Date.now(),
        },
      };
    });
    setJobs(updated);
  };

  const handleProducerAcceptOffer = async (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job || !job.offer) return;
    const updated = jobs.map((j) => {
      if (j.id !== jobId) return j;
      return {
        ...j, status: 'accepted', producerConfirmed: true,
        carrierId: j.offer.carrierId, carrierName: j.offer.carrierName,
        carrierTruckModel: j.offer.carrierTruckModel, carrierTruckCapacity: j.offer.carrierTruckCapacity,
      };
    });
    setJobs(updated);
    const nextJob = updated.find(j => j.id === jobId);
    setActiveJob(nextJob);
    setView('tracking');
  };

  const handleProducerRejectOffer = async (jobId) => {
    const updated = jobs.map((j) => {
      if (j.id !== jobId) return j;
      const { offer, ...rest } = j;
      return { ...rest, offer: null, producerConfirmed: false };
    });
    setJobs(updated);
    if (activeJob?.id === jobId) setActiveJob({ ...activeJob, offer: null, producerConfirmed: false });
    setView('producer-home');
  };

  const handleUploadGuides = (jobId, guides) => {
    const updated = jobs.map((j) => (j.id === jobId ? { ...j, guides } : j));
    setJobs(updated);
    setActiveJob(updated.find(j => j.id === jobId));
  };

  const handleStartTrip = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;
    if (animalRequiresGuide(job.animal) && !job.guides?.description) {
      alert('No podés iniciar el viaje sin adjuntar la Guía Sanitaria MGAP (obligatoria para este tipo de animal).');
      return;
    }
    const updated = jobs.map((j) => (j.id === jobId ? { ...j, status: 'in-transit' } : j));
    setJobs(updated);
    setActiveJob(updated.find(j => j.id === jobId));
  };

  const handleAddWeighing = (jobId, weighing) => {
    const updated = jobs.map((j) => (j.id === jobId ? { ...j, weighing: { ...weighing, status: 'pending' } } : j));
    setJobs(updated);
    setActiveJob(updated.find(j => j.id === jobId));
  };

  const handleProducerConfirmWeighing = (jobId, accepted) => {
    const updated = jobs.map((j) => (j.id === jobId ? { ...j, weighing: { ...j.weighing, status: accepted ? 'accepted' : 'rejected' } } : j));
    setJobs(updated);
    setActiveJob(updated.find(j => j.id === jobId));
  };

  const handleFinishTrip = (jobId, actualKm) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job || !job.offer) return;
    const km = parseFloat(actualKm) || 0;
    let finalPrice = job.offer.priceType === 'per_km'
      ? km * (parseFloat(job.offer.pricePerKm) || 0)
      : parseFloat(job.offer.totalPrice) || 0;
    const updated = jobs.map((j) =>
      j.id === jobId ? { ...j, status: 'completed', finalKm: km, finalPrice, driverKmConfirmed: true } : j
    );
    setJobs(updated);
    setActiveJob(updated.find(j => j.id === jobId));
  };

  const handleProducerConfirmKm = (jobId) => {
    const updated = jobs.map((j) => (j.id === jobId ? { ...j, producerKmConfirmed: true } : j));
    setJobs(updated);
    setActiveJob(updated.find(j => j.id === jobId));
  };

  const handleProducerRate = (jobId, ratingData) => {
    const updated = jobs.map((j) => j.id === jobId ? { ...j, rating: ratingData } : j);
    setJobs(updated);
    setActiveJob(updated.find(j => j.id === jobId));
  };

  const handleDriverRate = (jobId, ratingData) => {
    const updated = jobs.map((j) => j.id === jobId ? { ...j, driverRating: ratingData } : j);
    setJobs(updated);
    setActiveJob(updated.find(j => j.id === jobId));
  };

  const handleProducerMarkPaid = (jobId) => {
    const updated = jobs.map((j) => (j.id === jobId ? { ...j, paymentStatus: 'producer_marked_paid' } : j));
    setJobs(updated);
    setActiveJob(updated.find(j => j.id === jobId));
  };

  const handleDriverConfirmPayment = (jobId) => {
    const updated = jobs.map((j) => (j.id === jobId ? { ...j, paymentStatus: 'driver_confirmed' } : j));
    setJobs(updated);
    setActiveJob(updated.find(j => j.id === jobId));
  };

  // --- Chat Handlers ---
  const handleSendMessage = (jobId, text) => {
    if (!text.trim()) return;
    const sender = role === 'producer' ? 'producer' : 'carrier';
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      sender,
      text: text.trim(),
      timestamp: Date.now(),
    };
    setChatMessages(prev => ({
      ...prev,
      [jobId]: [...(prev[jobId] || []), newMsg],
    }));
  };

  // --- Document Handlers ---
  const handleUploadDocument = (jobId, docType, description, photoName) => {
    const newDoc = {
      id: `doc-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      jobId,
      type: docType,
      description,
      photoName: photoName || null,
      uploadedAt: Date.now(),
      uploadedBy: role,
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const simulatePhotoCapture = (setter) => {
    const fakeNames = ['IMG_20260415_143022.jpg', 'photo_pesaje_001.jpg', 'guia_sanitaria.jpg', 'balanza_cert.jpg', 'despacho_tropa.jpg'];
    setter(fakeNames[Math.floor(Math.random() * fakeNames.length)]);
  };

  // --- Notification Handlers ---
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const showBottomNav = [
    'producer-home', 'carrier-home', 'documents', 'chat', 'map-hub',
    'balanzas', 'establecimientos', 'settings', 'notifications', 'help', 'history'
  ].includes(view);

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingPage setRole={setRole} setView={setView} />;
      case 'producer-home':
        return (
          <ProducerHome
            jobs={jobs}
            myProducerId={myProducerId}
            setActiveJob={setActiveJob}
            setView={setView}
            unreadCount={unreadCount}
          />
        );
      case 'producer-book':
        return (
          <BookingForm
            bookingData={bookingData}
            setBookingData={setBookingData}
            bookingStep={bookingStep}
            setBookingStep={setBookingStep}
            setView={setView}
            handleCreateJob={handleCreateJob}
            calculatePrice={calculatePrice}
          />
        );
      case 'carrier-home':
        return (
          <CarrierHome
            jobs={jobs}
            myCarrierId={myCarrierId}
            driverProfile={driverProfile}
            setActiveJob={setActiveJob}
            setView={setView}
            unreadCount={unreadCount}
          />
        );
      case 'driver-profile':
        return (
          <DriverProfileView
            driverProfile={driverProfile}
            setDriverProfile={setDriverProfile}
            setView={setView}
            setJobs={setJobs}
            setChatMessages={setChatMessages}
            setDocuments={setDocuments}
            setNotifications={setNotifications}
          />
        );
      case 'carrier-offer':
        return (
          <CarrierOfferView
            activeJob={activeJob}
            handleProposeOffer={handleProposeOffer}
            setView={setView}
            driverProfile={driverProfile}
          />
        );
      case 'producer-offer':
        return (
          <ProducerOfferView
            activeJob={activeJob}
            jobs={jobs}
            handleProducerAcceptOffer={handleProducerAcceptOffer}
            handleProducerRejectOffer={handleProducerRejectOffer}
            setView={setView}
          />
        );
      case 'tracking':
        return (
          <TrackingView
            activeJob={activeJob}
            jobs={jobs}
            role={role}
            myCarrierId={myCarrierId}
            myProducerId={myProducerId}
            setView={setView}
            setActiveChatJobId={setActiveChatJobId}
            simulatePhotoCapture={simulatePhotoCapture}
            handleUploadGuides={handleUploadGuides}
            handleStartTrip={handleStartTrip}
            handleAddWeighing={handleAddWeighing}
            handleProducerConfirmWeighing={handleProducerConfirmWeighing}
            handleFinishTrip={handleFinishTrip}
            handleProducerConfirmKm={handleProducerConfirmKm}
            handleProducerRate={handleProducerRate}
            handleDriverRate={handleDriverRate}
            handleProducerMarkPaid={handleProducerMarkPaid}
            handleDriverConfirmPayment={handleDriverConfirmPayment}
          />
        );
      case 'documents':
        return (
          <DocumentsView
            documents={documents}
            jobs={jobs}
            role={role}
            myProducerId={myProducerId}
            myCarrierId={myCarrierId}
            handleUploadDocument={handleUploadDocument}
            simulatePhotoCapture={simulatePhotoCapture}
          />
        );
      case 'chat':
        return (
          <ChatListView
            chatMessages={chatMessages}
            jobs={jobs}
            role={role}
            myProducerId={myProducerId}
            myCarrierId={myCarrierId}
            setActiveChatJobId={setActiveChatJobId}
            setView={setView}
          />
        );
      case 'chat-detail':
        return (
          <ChatDetailView
            chatMessages={chatMessages}
            activeChatJobId={activeChatJobId}
            jobs={jobs}
            role={role}
            handleSendMessage={handleSendMessage}
            setView={setView}
          />
        );
      case 'map-hub':
      case 'balanzas':
      case 'establecimientos':
        return <MapHubView setView={setView} />;
      case 'settings':
        return (
          <SettingsView
            role={role}
            appSettings={appSettings}
            setAppSettings={setAppSettings}
            setView={setView}
            setRole={setRole}
            driverProfile={driverProfile}
            unreadCount={unreadCount}
            setActiveJob={setActiveJob}
          />
        );
      case 'notifications':
        return (
          <NotificationsView
            notifications={notifications}
            markNotificationRead={markNotificationRead}
            markAllRead={markAllRead}
            unreadCount={unreadCount}
          />
        );
      case 'help':
        return <HelpView />;
      case 'history':
        return (
          <HistoryView
            jobs={jobs}
            myProducerId={myProducerId}
            myCarrierId={myCarrierId}
            role={role}
            setActiveJob={setActiveJob}
            setView={setView}
          />
        );
      default:
        return <LandingPage setRole={setRole} setView={setView} />;
    }
  };

  return (
    <div className="relative">
      {renderView()}
      {showBottomNav && role && <BottomNav view={view} role={role} setView={setView} />}
    </div>
  );
}

export default App;
