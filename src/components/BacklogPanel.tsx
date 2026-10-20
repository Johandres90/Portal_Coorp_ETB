"use client";

import React from "react";
import { FolderGit2, Calendar, Eye, Trash2, ArrowUpRight } from "lucide-react";
import { StoredStory, UserStory } from "@/types/story";

interface BacklogPanelProps {
  stories: StoredStory[];
  currentStoryId?: string;
  onSelectStory: (story: UserStory) => void;
  onDeleteStory: (storyId: string) => void;
  onClearAll: () => void;
}

export const BacklogPanel: React.FC<BacklogPanelProps> = ({
  stories,
  currentStoryId,
  onSelectStory,
  onDeleteStory,
  onClearAll,
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      {/* Backlog Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-slate-50 to-blue-50/40 dark:from-slate-900 dark:to-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0033A0] flex items-center justify-center text-white shadow-sm">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Backlog Local de Historias
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Historias refinadas guardadas en sesión ({stories.length})
            </p>
          </div>
        </div>

        {stories.length > 0 && (
          <button
            onClick={onClearAll}
            type="button"
            className="text-[11px] text-rose-600 dark:text-rose-400 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Stories List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {stories.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
            <FolderGit2 className="w-12 h-12 stroke-1 text-slate-300 dark:text-slate-600 mb-3" />
            <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">
              No hay historias en el backlog aún
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">
              Las Historias de Usuario generadas por el Agile Coach se guardarán automáticamente aquí para consultarlas o exportarlas.
            </p>
          </div>
        ) : (
          stories.map((story) => {
            const isSelected = story.id === currentStoryId;

            return (
              <div
                key={story.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-sky-50/80 dark:bg-sky-950/40 border-[#00A3E0] shadow-sm ring-1 ring-[#00A3E0]/30"
                    : "bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#0033A0] dark:text-sky-300 bg-blue-100/80 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200/60 dark:border-blue-900">
                      {story.id}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        story.priority === "Alta"
                          ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900"
                          : story.priority === "Media"
                          ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900"
                          : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900"
                      }`}
                    >
                      {story.priority}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                      {story.storyPoints} SP
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onSelectStory(story)}
                      type="button"
                      className="p-1 text-slate-500 dark:text-slate-400 hover:text-[#0033A0] dark:hover:text-[#00A3E0] rounded hover:bg-white dark:hover:bg-slate-700 transition-colors"
                      title="Ver en Lienzo"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteStory(story.id)}
                      type="button"
                      className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-white dark:hover:bg-slate-700 transition-colors"
                      title="Eliminar del backlog"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4
                  onClick={() => onSelectStory(story)}
                  className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2 cursor-pointer hover:text-[#0033A0] dark:hover:text-[#00A3E0] transition-colors leading-snug"
                >
                  {story.title}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                  Como {story.connextra?.asA}
                </p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-400 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {story.savedAt || "Hoy"}
                  </span>
                  <button
                    onClick={() => onSelectStory(story)}
                    className="text-[#0033A0] dark:text-[#00A3E0] font-semibold hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>Cargar en Canvas</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
