"use client";

import React, { useState, useEffect } from "react";
import { X, Key, ExternalLink, Check, ShieldCheck, Trash2 } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (newKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
}) => {
  const [keyInput, setKeyInput] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setKeyInput(apiKey || "");
  }, [apiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = keyInput
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/[\r\n\t\s]/g, "");
    onSaveKey(cleanKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setKeyInput("");
    onSaveKey("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden transition-all transform scale-100">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0033A0] to-[#002270] p-6 text-white flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
              <Key className="w-5 h-5 text-[#00A3E0]" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Configuración de Gemini API</h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Google Generative AI SDK (gemini-3.8-flash / gemini-flash-latest)
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
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] font-mono text-slate-800 dark:text-slate-100 transition-all"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              La clave se almacena de forma segura en tu navegador (`localStorage`) o en `.env.local`.
            </p>
          </div>

          {/* Quick link to get Google AI Studio Key */}
          <div className="p-3.5 bg-sky-50 dark:bg-slate-800/80 rounded-xl border border-sky-100 dark:border-slate-700 flex items-start space-x-3">
            <ExternalLink className="w-4 h-4 text-[#0033A0] dark:text-[#00A3E0] mt-0.5 shrink-0" />
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-100">¿No tienes una API Key?</span>
              <p className="mt-0.5">
                Genera una clave gratuita en pocos segundos desde{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0033A0] dark:text-[#00A3E0] font-semibold underline hover:opacity-80"
                >
                  Google AI Studio
                </a>
                .
              </p>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            {apiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-medium px-2 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar Clave
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                    <span>¡Guardado!</span>
                  </>
                ) : (
                  <span>Guardar Clave</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
