"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  BrainCircuit,
  RotateCcw,
  Save,
  Check,
  Sparkles,
  Info,
  Sliders,
} from "lucide-react";
import { DEFAULT_SYSTEM_INSTRUCTION } from "@/utils/defaultPrompt";

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  customInstruction: string;
  onSaveInstruction: (newPrompt: string) => void;
  onResetInstruction: () => void;
}

export const TrainingModal: React.FC<TrainingModalProps> = ({
  isOpen,
  onClose,
  customInstruction,
  onSaveInstruction,
  onResetInstruction,
}) => {
  const [promptText, setPromptText] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setPromptText(customInstruction || DEFAULT_SYSTEM_INSTRUCTION);
  }, [customInstruction, isOpen]);

  if (!isOpen) return null;

  const isCustomized =
    promptText.trim() !== DEFAULT_SYSTEM_INSTRUCTION.trim();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveInstruction(promptText.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    if (
      confirm(
        "¿Deseas restablecer el prompt del agente a las directrices oficiales de ETB?"
      )
    ) {
      setPromptText(DEFAULT_SYSTEM_INSTRUCTION);
      onResetInstruction();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden transition-all">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0033A0] to-[#002270] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
              <BrainCircuit className="w-5 h-5 text-[#00A3E0]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  Entrenamiento y Directrices del Agente
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isCustomized
                      ? "bg-amber-400 text-slate-900"
                      : "bg-emerald-400/90 text-slate-900"
                  }`}
                >
                  {isCustomized ? "Personalizado" : "Oficial ETB"}
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Modifica el rol, formato Connextra, reglas de negocio y preguntas aclaratorias en tiempo real.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col p-5 space-y-4 overflow-hidden">
          {/* Quick Guidance Alert */}
          <div className="p-3.5 bg-sky-50 dark:bg-slate-800/80 rounded-xl border border-sky-100 dark:border-slate-700 flex items-start space-x-3 shrink-0">
            <Info className="w-4 h-4 text-[#0033A0] dark:text-[#00A3E0] mt-0.5 shrink-0" />
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                Ajuste Dinámico de Comportamiento:
              </span>{" "}
              Cualquier cambio aquí se inyecta directamente en las llamadas del SDK de Gemini sin requerir recompilar el proyecto. Puedes añadir normativas particulares de tu gerencia, cambiar los criterios de aceptación o afinar el tono de las respuestas.
            </div>
          </div>

          {/* Textarea for System Prompt */}
          <div className="flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#0033A0] dark:text-[#00A3E0]" />
                <span>System Prompt / Instrucciones de Redacción</span>
              </label>

              <span className="text-[11px] text-slate-400 font-mono">
                {promptText.length} caracteres
              </span>
            </div>

            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={14}
              className="flex-1 w-full p-4 text-xs font-mono leading-relaxed bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] resize-none transition-all"
              placeholder="Ingresa las instrucciones del sistema..."
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-[#0033A0] dark:hover:text-[#00A3E0] font-semibold px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Oficial ETB</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-[#0033A0] hover:bg-[#002270] rounded-xl shadow-md transition-all inline-flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>¡Entrenamiento Guardado!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Guardar Entrenamiento</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
