"use client";

import React from "react";
import {
  KeyRound,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  Sun,
  Moon,
} from "lucide-react";

interface HeaderProps {
  hasApiKey: boolean;
  onOpenKeyModal: () => void;
  onLoadPymeExample: () => void;
  isExampleLoaded: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenTrainingModal: () => void;
  isTrainingCustomized: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  hasApiKey,
  onOpenKeyModal,
  onLoadPymeExample,
  isDarkMode,
  onToggleDarkMode,
  onOpenTrainingModal,
  isTrainingCustomized,
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm transition-colors">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          {/* ETB Official Corporate Logo */}
          <div className="flex items-center space-x-2 bg-white dark:bg-white/95 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <img
              src="/etb-logo.png"
              alt="Logo Oficial ETB Bogotá"
              className="h-8 w-auto object-contain"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                <span>Agile Studio</span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="text-[#00A3E0] font-semibold text-sm sm:text-base">
                  User Story AI Agent
                </span>
              </h1>
              <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 dark:bg-blue-950 text-[#0033A0] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Google Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Definition of Ready (DoR) • Connextra • BDD Gherkin • Reglas de Negocio ETB
            </p>
          </div>
        </div>

        {/* Right Action Buttons & Status */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Gemini API Status Badge */}
          <div
            onClick={onOpenKeyModal}
            className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              hasApiKey
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100"
            }`}
            title="Haz clic para configurar tu API Key de Gemini"
          >
            {hasApiKey ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden md:inline">Gemini Conectada</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                <span className="hidden md:inline">API Key</span>
              </>
            )}
          </div>

          {/* Training Studio Button */}
          <button
            onClick={onOpenTrainingModal}
            type="button"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all shadow-2xs active:scale-[0.98]"
            title="Entrenar o ajustar directrices, rol y reglas de negocio del agente de ETB"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Entrenar Agente</span>
            {isTrainingCustomized && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Directrices personalizadas activas" />
            )}
          </button>

          {/* Load Sample PYME Story Button */}
          <button
            onClick={onLoadPymeExample}
            type="button"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-[#0033A0] dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-all shadow-2xs active:scale-[0.98]"
            title="Carga instantáneamente la historia de usuario oficial de descarga de facturas para clientes PYME"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00A3E0]" />
            <span className="hidden lg:inline">Ejemplo PYME</span>
          </button>

          {/* Config API Key Button */}
          <button
            onClick={onOpenKeyModal}
            type="button"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-2xs active:scale-[0.98]"
            title="Configurar clave API de Gemini"
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">API Key</span>
          </button>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            type="button"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all active:scale-95 shadow-2xs"
            title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
