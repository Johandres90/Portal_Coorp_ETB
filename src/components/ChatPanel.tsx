"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  FileCheck2,
  RefreshCw,
  Zap,
  ArrowRight,
} from "lucide-react";
import { ChatMessage } from "@/types/story";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onSelectQuickPrompt: (prompt: string) => void;
}

const QUICK_PROMPTS = [
  {
    tag: "Facturación Mi ETB",
    icon: "📄",
    prompt:
      "Necesito una historia para que los clientes PYME puedan descargar su factura de fibra óptica directamente desde Mi ETB",
  },
  {
    tag: "Fallas GPON",
    icon: "⚡",
    prompt:
      "Requerimiento para que los clientes residenciales puedan realizar autodiagnóstico y reinicio remoto de su módem ONT GPON desde la app",
  },
  {
    tag: "Portabilidad CRC",
    icon: "📱",
    prompt:
      "Historia de usuario para solicitar portabilidad numérica móvil con validación de código NIP y biométrica según circular CRC",
  },
  {
    tag: "CRM Asesores",
    icon: "🎧",
    prompt:
      "Módulo en CRM para que los asesores de call center consulten cortes masivos e incidencias de fibra óptica por localidad de Bogotá",
  },
];

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onSelectQuickPrompt,
}) => {
  const [inputText, setInputText] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const PROGRESS_STEPS = [
    "Analizando requerimiento y contexto de negocio ETB...",
    "Estructurando formato Connextra (Como / Quiero / Para)...",
    "Redactando escenarios BDD Gherkin y flujos alternos...",
    "Validando reglas de negocio DIAN, CRC y SLA...",
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % PROGRESS_STEPS.length);
      }, 1400);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, loadingStep]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      {/* Chat Sub-Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-slate-50 to-blue-50/40 dark:from-slate-900 dark:to-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0033A0] flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Agile Coach Virtual ETB
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Refinamiento guiado de requerimientos a estándar Ready (DoR)
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100/70 dark:bg-blue-950 text-[#0033A0] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <Sparkles className="w-3 h-3 text-[#00A3E0]" />
          Gemini Ultra-Fast
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-slate-800 text-[#0033A0] dark:text-[#00A3E0] flex items-center justify-center mb-4 border border-sky-100 dark:border-slate-700">
              <Bot className="w-7 h-7 text-[#00A3E0]" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
              ¡Bienvenido al Agile Studio de ETB!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
              Describe una idea de negocio o requerimiento para convertirla en una Historia de Usuario lista para el Sprint, o selecciona una de las sugerencias:
            </p>

            {/* Quick Prompts on Empty State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
              {QUICK_PROMPTS.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectQuickPrompt(qp.prompt)}
                  type="button"
                  className="p-3 text-left bg-slate-50 dark:bg-slate-800/90 hover:bg-sky-50/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-300 rounded-xl transition-all group active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#0033A0] dark:text-sky-400 flex items-center gap-1.5">
                      <span>{qp.icon}</span>
                      <span>{qp.tag}</span>
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#00A3E0] transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-snug">
                    {qp.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user";
            const isClarification = msg.agentData?.type === "clarification";
            const isStoryReady = msg.agentData?.type === "user_story";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-[#0033A0] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? "bg-[#0033A0] text-white rounded-br-none"
                      : isClarification
                      ? "bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-slate-800 dark:text-amber-100 rounded-bl-none"
                      : "bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none"
                  }`}
                >
                  {/* Clarification Callout Header */}
                  {!isUser && isClarification && (
                    <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Preguntas de Refinamiento Ágil</span>
                    </div>
                  )}

                  {/* User Story Ready Success Banner */}
                  {!isUser && isStoryReady && (
                    <div className="flex items-center justify-between gap-1.5 mb-2 pb-2 border-b border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 font-semibold text-xs">
                      <span className="flex items-center gap-1.5">
                        <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>¡Historia de Usuario Generada y Lista!</span>
                      </span>
                      <span className="text-[11px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                        {msg.agentData?.userStory?.id}
                      </span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  <div
                    className={`mt-2 text-[10px] text-right ${
                      isUser
                        ? "text-blue-100"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-700 dark:bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Spinner with Dynamic Step Progression */}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-[#0033A0] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-sky-50/80 dark:bg-slate-800/90 border border-sky-200/90 dark:border-slate-700 rounded-2xl rounded-bl-none p-3.5 text-xs text-slate-700 dark:text-slate-200 space-y-2 min-w-[280px] sm:min-w-[340px] shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0033A0] dark:text-sky-400 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#00A3E0] animate-spin" />
                  <span>Agile Coach en Acción</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-sky-200 dark:border-slate-700">
                  Etapa {loadingStep + 1}/4
                </span>
              </div>

              <p className="text-xs text-slate-800 dark:text-slate-100 font-medium animate-pulse">
                {PROGRESS_STEPS[loadingStep]}
              </p>

              {/* Step indicator bar */}
              <div className="w-full bg-slate-200/80 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#0033A0] to-[#00A3E0] h-full transition-all duration-500 ease-out"
                  style={{ width: `${((loadingStep + 1) / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar (when chat already has messages) */}
      {messages.length > 0 && (
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <Zap className="w-3 h-3 text-[#00A3E0]" /> Sugerencias:
          </span>
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => onSelectQuickPrompt(qp.prompt)}
              type="button"
              className="text-[11px] whitespace-nowrap bg-white dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#0033A0] dark:hover:text-sky-300 border border-slate-200 dark:border-slate-700 hover:border-sky-300 px-2.5 py-1 rounded-full transition-colors shrink-0 shadow-2xs"
            >
              {qp.icon} {qp.tag}
            </button>
          ))}
        </div>
      )}

      {/* Message Input Box */}
      <form
        onSubmit={handleSubmit}
        className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-end gap-2"
      >
        <div className="flex-1 relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe tu idea, requerimiento o responde las preguntas del coach..."
            rows={2}
            disabled={isLoading}
            className="w-full resize-none px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] text-slate-800 dark:text-slate-100 transition-all disabled:opacity-50"
          />
          <div className="text-[10px] text-slate-400 dark:text-slate-500 px-1 mt-0.5 flex justify-between">
            <span>Presiona Enter para enviar • Shift + Enter para salto de línea</span>
            <span>Estándar Definition of Ready ETB</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="h-10 px-4 rounded-xl bg-[#0033A0] hover:bg-[#002270] disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 shrink-0"
        >
          <span>Enviar</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
