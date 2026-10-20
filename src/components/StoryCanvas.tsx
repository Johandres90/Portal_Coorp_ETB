"use client";

import React, { useState } from "react";
import {
  FileText,
  Copy,
  Download,
  FileSpreadsheet,
  Check,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Hash,
  Layers,
  Edit3,
  Save,
  Info,
} from "lucide-react";
import { UserStory } from "@/types/story";
import {
  formatJiraMarkup,
  copyToClipboard,
  downloadMarkdownFile,
  downloadCsvFile,
  downloadPdfFile,
} from "@/utils/exportHelpers";

interface StoryCanvasProps {
  story: UserStory | null;
  onUpdateStory?: (updated: UserStory) => void;
  onLoadExample: () => void;
}

export const StoryCanvas: React.FC<StoryCanvasProps> = ({
  story,
  onUpdateStory,
  onLoadExample,
}) => {
  const [copiedJira, setCopiedJira] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<UserStory | null>(null);

  const handleCopyJira = async () => {
    if (!story) return;
    const markup = formatJiraMarkup(story);
    const ok = await copyToClipboard(markup);
    if (ok) {
      setCopiedJira(true);
      setTimeout(() => setCopiedJira(false), 2000);
    }
  };

  const startEditing = () => {
    if (!story) return;
    setEditFormData(JSON.parse(JSON.stringify(story)));
    setIsEditing(true);
  };

  const saveEditing = () => {
    if (editFormData && onUpdateStory) {
      onUpdateStory(editFormData);
    }
    setIsEditing(false);
  };

  if (!story) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center shadow-sm transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-slate-800 text-[#0033A0] dark:text-[#00A3E0] flex items-center justify-center mb-4 border border-sky-100 dark:border-slate-700 shadow-sm">
          <FileText className="w-8 h-8 text-[#00A3E0]" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
          Lienzo de Historia de Usuario (Live Canvas)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-6">
          El Agente de IA de ETB estructurará aquí el requerimiento final en formato
          <strong className="text-slate-700 dark:text-slate-300"> Connextra</strong>, con criterios de aceptación
          <strong className="text-slate-700 dark:text-slate-300"> BDD Gherkin</strong> y reglas técnicas conforme al
          estándar<strong className="text-[#0033A0] dark:text-[#00A3E0]"> Definition of Ready (DoR)</strong>.
        </p>

        <button
          onClick={onLoadExample}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#0033A0] hover:bg-[#002270] text-white shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-[#00A3E0]" />
          <span>Ver Ejemplo Oficial: Factura Fibra PYME</span>
        </button>
      </div>
    );
  }

  const activeStory = isEditing && editFormData ? editFormData : story;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      {/* Top Action Header with Export Buttons */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50/40 dark:from-slate-900 dark:to-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#0033A0] flex items-center justify-center text-white shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-extrabold text-[#0033A0] dark:text-sky-300 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                {activeStory.id}
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 hidden sm:inline">
                Lienzo Oficial Jira / Azure DevOps
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
              Cumple con el estándar Definition of Ready (DoR) de ETB
            </p>
          </div>
        </div>

        {/* 4 Multi-Format Export Buttons + Edit Mode */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          {/* Edit / Save Toggle */}
          {isEditing ? (
            <button
              onClick={saveEditing}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar</span>
            </button>
          ) : (
            <button
              onClick={startEditing}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-all"
              title="Editar los campos de la historia"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Editar</span>
            </button>
          )}

          {/* 1. Copiar Jira */}
          <button
            onClick={handleCopyJira}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0033A0] hover:bg-[#002270] text-white shadow-sm transition-all active:scale-95"
            title="Copiar en formato de texto enriquecido para Jira o Confluence"
          >
            {copiedJira ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#00A3E0]" />
                <span className="hidden sm:inline">Copiar Jira</span>
                <span className="sm:hidden">Jira</span>
              </>
            )}
          </button>

          {/* 2. Descargar Markdown */}
          <button
            onClick={() => downloadMarkdownFile(activeStory)}
            type="button"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-all"
            title="Descargar archivo .md"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>.md</span>
          </button>

          {/* 3. Exportar CSV con BOM UTF-8 */}
          <button
            onClick={() => downloadCsvFile(activeStory)}
            type="button"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-all"
            title="Exportar archivo CSV con BOM UTF-8 para Excel y Jira"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>CSV</span>
          </button>

          {/* 4. Exportar PDF Corporativo ETB */}
          <button
            onClick={() => downloadPdfFile(activeStory)}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#0033A0] to-[#00A3E0] hover:opacity-95 text-white shadow-sm transition-all active:scale-95"
            title="Exportar reporte PDF oficial con membrete corporativo ETB"
          >
            <FileText className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">PDF Oficial</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* Main Story Canvas Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
        {/* Story Metadata & Title Card */}
        <div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center flex-wrap gap-2">
              {/* ID Badge */}
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-extrabold bg-[#0033A0] text-white shadow-xs">
                {activeStory.id}
              </span>

              {/* Ready for Sprint Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 animate-pulse-subtle">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                READY FOR SPRINT
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Priority */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                <span className="text-slate-400">Prioridad:</span>
                {isEditing ? (
                  <select
                    value={activeStory.priority}
                    onChange={(e) =>
                      setEditFormData({
                        ...activeStory,
                        priority: e.target.value as any,
                      })
                    }
                    className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                ) : (
                  <span
                    className={`font-bold ${
                      activeStory.priority === "Alta"
                        ? "text-rose-600 dark:text-rose-400"
                        : activeStory.priority === "Media"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {activeStory.priority}
                  </span>
                )}
              </div>

              {/* Story Points */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                <Hash className="w-3.5 h-3.5 text-[#00A3E0]" />
                <span className="text-slate-400">Puntos:</span>
                {isEditing ? (
                  <select
                    value={activeStory.storyPoints}
                    onChange={(e) =>
                      setEditFormData({
                        ...activeStory,
                        storyPoints: Number(e.target.value),
                      })
                    }
                    className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    <option value={3}>3 SP</option>
                    <option value={5}>5 SP</option>
                    <option value={8}>8 SP</option>
                    <option value={13}>13 SP</option>
                  </select>
                ) : (
                  <span className="font-extrabold text-[#0033A0] dark:text-[#00A3E0]">
                    {activeStory.storyPoints} SP
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          {isEditing ? (
            <input
              type="text"
              value={activeStory.title}
              onChange={(e) =>
                setEditFormData({
                  ...activeStory,
                  title: e.target.value,
                })
              }
              className="w-full text-base sm:text-lg font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#00A3E0]"
            />
          ) : (
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              {activeStory.title}
            </h2>
          )}
        </div>

        {/* 1. Bloque Connextra */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0033A0] dark:text-sky-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#0033A0] dark:bg-sky-400" />
            <h3>1. Descripción de Necesidad (Formato Connextra)</h3>
          </div>

          <div className="bg-gradient-to-br from-blue-50/70 via-sky-50/40 to-white dark:from-slate-800/90 dark:via-slate-850 dark:to-slate-900 rounded-2xl p-5 border border-blue-200/80 dark:border-slate-700 shadow-xs space-y-4">
            {/* Como (As a) */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2.5">
              <span className="inline-flex items-center justify-center w-20 px-2 py-1 rounded-md text-[11px] font-extrabold bg-[#0033A0] text-white shrink-0 shadow-2xs">
                COMO
              </span>
              <div className="flex-1">
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={activeStory.connextra.asA}
                    onChange={(e) =>
                      setEditFormData({
                        ...activeStory,
                        connextra: { ...activeStory.connextra, asA: e.target.value },
                      })
                    }
                    className="w-full text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#00A3E0]"
                  />
                ) : (
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {activeStory.connextra.asA}
                  </p>
                )}
              </div>
            </div>

            {/* Quiero (I want) */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2.5">
              <span className="inline-flex items-center justify-center w-20 px-2 py-1 rounded-md text-[11px] font-extrabold bg-[#00A3E0] text-white shrink-0 shadow-2xs">
                QUIERO
              </span>
              <div className="flex-1">
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={activeStory.connextra.iWant}
                    onChange={(e) =>
                      setEditFormData({
                        ...activeStory,
                        connextra: { ...activeStory.connextra, iWant: e.target.value },
                      })
                    }
                    className="w-full text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#00A3E0]"
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeStory.connextra.iWant}
                  </p>
                )}
              </div>
            </div>

            {/* Para (So that) */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2.5">
              <span className="inline-flex items-center justify-center w-20 px-2 py-1 rounded-md text-[11px] font-extrabold bg-emerald-600 text-white shrink-0 shadow-2xs">
                PARA
              </span>
              <div className="flex-1">
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={activeStory.connextra.soThat}
                    onChange={(e) =>
                      setEditFormData({
                        ...activeStory,
                        connextra: { ...activeStory.connextra, soThat: e.target.value },
                      })
                    }
                    className="w-full text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#00A3E0]"
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {activeStory.connextra.soThat}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Bloque Criterios de Aceptación (BDD Gherkin) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0033A0] dark:text-sky-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#00A3E0]" />
              <h3>2. Criterios de Aceptación (BDD - Gherkin)</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              {activeStory.acceptanceCriteria.length} Escenarios
            </span>
          </div>

          <div className="space-y-3.5">
            {activeStory.acceptanceCriteria.map((ac, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs transition-colors"
              >
                {/* Scenario Header */}
                <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-200 dark:border-slate-700">
                  <span className="w-5 h-5 rounded-full bg-[#0033A0] text-white text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Escenario: {ac.scenario}
                  </span>
                </div>

                {/* Gherkin Steps */}
                <div className="space-y-2 text-xs sm:text-sm">
                  {/* Given */}
                  <div className="flex items-start gap-2.5">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-[#0033A0] dark:text-blue-300 w-18 text-center shrink-0 border border-blue-200/60 dark:border-blue-900">
                      Dado que
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
                      {ac.given}
                    </p>
                  </div>

                  {/* When */}
                  <div className="flex items-start gap-2.5">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 w-18 text-center shrink-0 border border-amber-200/60 dark:border-amber-900">
                      Cuando
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
                      {ac.when}
                    </p>
                  </div>

                  {/* Then */}
                  <div className="flex items-start gap-2.5">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 w-18 text-center shrink-0 border border-emerald-200/60 dark:border-emerald-900">
                      Entonces
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed flex-1 font-medium">
                      {ac.then}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Bloque Reglas de Negocio y Normativa */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0033A0] dark:text-sky-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-slate-700 dark:bg-slate-400" />
            <h3>3. Reglas de Negocio & Restricciones Técnicas (ETB / DIAN / CRC)</h3>
          </div>

          <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2.5">
            {activeStory.businessRules.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed flex-1">{rule}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Note */}
        <div className="p-4 bg-sky-50/60 dark:bg-slate-800/60 rounded-xl border border-sky-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#00A3E0]" />
            Historia lista para ser importada directamente en el Backlog de Sprint en Jira o Azure DevOps.
          </span>
          <span className="font-mono text-slate-400 dark:text-slate-500">ETB-DOR-v2.5</span>
        </div>
      </div>
    </div>
  );
};
