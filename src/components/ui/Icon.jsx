import React from "react";

// --- Tiny icon placeholders ---
export const Icon = ({ children, className = "" }) => (
  <span className={`inline-flex items-center justify-center ${className}`}>{children}</span>
);

export const ITruck = (p) => <Icon {...p}>🚚</Icon>;
export const IMapPin = (p) => <Icon {...p}>📍</Icon>;
export const INavigation = (p) => <Icon {...p}>🧭</Icon>;
export const IUser = (p) => <Icon {...p}>👤</Icon>;
export const IMenu = (p) => <Icon {...p}>≡</Icon>;
export const IChevron = (p) => <Icon {...p}>›</Icon>;
export const IPlus = (p) => <Icon {...p}>＋</Icon>;
export const IChat = (p) => <Icon {...p}>💬</Icon>;
export const IDoc = (p) => <Icon {...p}>📋</Icon>;
export const IScale = (p) => <Icon {...p}>⚖️</Icon>;
export const IBell = (p) => <Icon {...p}>🔔</Icon>;
export const IGear = (p) => <Icon {...p}>⚙️</Icon>;
export const ISearch = (p) => <Icon {...p}>🔍</Icon>;
export const IHome = (p) => <Icon {...p}>🏠</Icon>;
export const IMap = (p) => <Icon {...p}>🗺️</Icon>;

export default Icon;
