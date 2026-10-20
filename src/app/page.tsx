"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { TrainingModal } from "@/components/TrainingModal";
import { ChatPanel } from "@/components/ChatPanel";
import { BacklogPanel } from "@/components/BacklogPanel";
import { StoryCanvas } from "@/components/StoryCanvas";
import { ChatMessage, UserStory, StoredStory, AgentResponse } from "@/types/story";
import { SAMPLE_PYME_STORY } from "@/utils/sampleStory";
import { DEFAULT_SYSTEM_INSTRUCTION } from "@/utils/defaultPrompt";
import { MessageSquare, FolderGit2, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const [apiKey, setApiKey] = useState<string>("");
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"chat" | "backlog">("chat");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Custom Prompt / Training State
  const [customInstruction, setCustomInstruction] = useState<string>("");

  // Stories and Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeStory, setActiveStory] = useState<UserStory | null>(null);
  const [backlog, setBacklog] = useState<StoredStory[]>([]);
  const [isExampleLoaded, setIsExampleLoaded] = useState<boolean>(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      // Dark mode initialization
      const storedTheme = localStorage.getItem("etb_theme");
      if (storedTheme === "dark") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
      }

      // API Key
      const storedKey = localStorage.getItem("GEMINI_API_KEY") || "";
      setApiKey(storedKey);

      // Custom training prompt
      const storedInstruction = localStorage.getItem("etb_agent_custom_prompt") || "";
      setCustomInstruction(storedInstruction);

      // Backlog
      const storedBacklog = localStorage.getItem("etb_stories_backlog");
      if (storedBacklog) {
        const parsed = JSON.parse(storedBacklog);
        if (Array.isArray(parsed)) {
          setBacklog(parsed);
          if (parsed.length > 0 && !activeStory) {
            setActiveStory(parsed[0]);
          }
        }
      }
    } catch (e) {
      console.warn("No se pudo leer de localStorage:", e);
    }
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("etb_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("etb_theme", "light");
      }
      return next;
    });
  };

  // Show temporary toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Save API Key
  const handleSaveApiKey = (newKey: string) => {
    setApiKey(newKey);
    try {
      localStorage.setItem("GEMINI_API_KEY", newKey);
      triggerToast("API Key de Gemini actualizada con éxito");
    } catch (e) {
      console.error(e);
    }
  };

  // Save Custom Instruction (Training)
  const handleSaveInstruction = (newPrompt: string) => {
    setCustomInstruction(newPrompt);
    try {
      localStorage.setItem("etb_agent_custom_prompt", newPrompt);
      triggerToast("Directrices y entrenamiento del Agente guardados");
    } catch (e) {
      console.error(e);
    }
  };

  // Reset Custom Instruction to ETB Default
  const handleResetInstruction = () => {
    setCustomInstruction("");
    try {
      localStorage.removeItem("etb_agent_custom_prompt");
      triggerToast("Restablecido al estándar oficial de ETB");
    } catch (e) {
      console.error(e);
    }
  };

  // Save or update story in backlog
  const saveStoryToBacklog = (story: UserStory) => {
    setBacklog((prev) => {
      const now = new Date().toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const existingIdx = prev.findIndex((s) => s.id === story.id);
      let updated: StoredStory[];

      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = { ...story, savedAt: prev[existingIdx].savedAt || now };
      } else {
        const newStored: StoredStory = { ...story, savedAt: now };
        updated = [newStored, ...prev];
      }

      try {
        localStorage.setItem("etb_stories_backlog", JSON.stringify(updated));
      } catch (e) {
        console.warn("Error guardando en localStorage:", e);
      }
      return updated;
    });
  };

  // Load Official PYME Example Story
  const handleLoadPymeExample = () => {
    setActiveStory(SAMPLE_PYME_STORY);
    setIsExampleLoaded(true);
    saveStoryToBacklog(SAMPLE_PYME_STORY);

    const exampleMessage: ChatMessage = {
      id: "sample-" + Date.now(),
      role: "assistant",
      content:
        "He cargado el caso oficial: 'Descarga de Factura Electrónica de Fibra Óptica PYME en Portal Mi ETB'. Esta historia cumple 100% con el estándar Definition of Ready (DoR), cuenta con 3 escenarios BDD Gherkin y reglas fiscales DIAN. Puedes visualizarla, editarla o exportarla en el panel derecho.",
      timestamp: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      agentData: {
        type: "user_story",
        message: "Caso oficial PYME cargado.",
        userStory: SAMPLE_PYME_STORY,
      },
    };

    setMessages((prev) => [...prev, exampleMessage]);
    triggerToast("Ejemplo oficial PYME cargado en el Lienzo");
  };

  // Send message to Gemini Agent API
  const handleSendMessage = async (userPrompt: string) => {
    const timestamp = new Date().toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: userPrompt,
      timestamp,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const payloadMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
          apiKey: apiKey.trim(),
          customInstruction: customInstruction || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al comunicarse con el Agente de IA.");
      }

      const agentResponse = data as AgentResponse;

      const assistantMessage: ChatMessage = {
        id: "asst-" + Date.now(),
        role: "assistant",
        content: agentResponse.message,
        timestamp: new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        agentData: agentResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (agentResponse.type === "user_story" && agentResponse.userStory) {
        setActiveStory(agentResponse.userStory);
        saveStoryToBacklog(agentResponse.userStory);
        triggerToast(`Historia ${agentResponse.userStory.id} generada y lista para el Sprint!`);
      }
    } catch (err: any) {
      console.error("Error en comunicación con agente:", err);
      const errorMessage: ChatMessage = {
        id: "err-" + Date.now(),
        role: "assistant",
        content: `⚠️ ${err.message || "Ocurrió un error inesperado al procesar la solicitud."}`,
        timestamp: new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);

      if (err.message?.includes("API Key")) {
        setIsKeyModalOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Delete single story from backlog
  const handleDeleteStory = (storyId: string) => {
    setBacklog((prev) => {
      const updated = prev.filter((s) => s.id !== storyId);
      try {
        localStorage.setItem("etb_stories_backlog", JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });

    if (activeStory?.id === storyId) {
      const remaining = backlog.filter((s) => s.id !== storyId);
      setActiveStory(remaining.length > 0 ? remaining[0] : null);
    }
    triggerToast("Historia eliminada del backlog");
  };

  // Clear entire backlog
  const handleClearBacklog = () => {
    if (confirm("¿Estás seguro de vaciar el backlog local?")) {
      setBacklog([]);
      try {
        localStorage.removeItem("etb_stories_backlog");
      } catch (e) {
        console.warn(e);
      }
      triggerToast("Backlog local vaciado");
    }
  };

  // Update story from Canvas
  const handleUpdateActiveStory = (updated: UserStory) => {
    setActiveStory(updated);
    saveStoryToBacklog(updated);
    triggerToast("Cambios guardados en la historia de usuario");
  };

  const isTrainingCustomized = Boolean(
    customInstruction &&
      customInstruction.trim() !== DEFAULT_SYSTEM_INSTRUCTION.trim()
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <Header
        hasApiKey={Boolean(apiKey) || true}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onLoadPymeExample={handleLoadPymeExample}
        isExampleLoaded={isExampleLoaded}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenTrainingModal={() => setIsTrainingModalOpen(true)}
        isTrainingCustomized={isTrainingCustomized}
      />

      {/* Main Split-Screen Content */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col">
        {/* Mobile Tab Switcher */}
        <div className="lg:hidden flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl mb-3">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "chat"
                ? "bg-white dark:bg-slate-900 text-[#0033A0] dark:text-[#00A3E0] shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat con Agile Coach</span>
          </button>
          <button
            onClick={() => setActiveTab("backlog")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "backlog"
                ? "bg-white dark:bg-slate-900 text-[#0033A0] dark:text-[#00A3E0] shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Backlog ({backlog.length})</span>
          </button>
        </div>

        {/* Desktop Split-Screen Grid: 45% Left (Chat/Backlog Tabs) | 55% Right (Live Canvas) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[calc(100vh-6.5rem)]">
          {/* Left Panel (45% -> 5 cols of 12) */}
          <div className="lg:col-span-5 flex flex-col h-full min-h-[500px]">
            {/* Desktop Tabs Bar */}
            <div className="hidden lg:flex items-center space-x-2 mb-3">
              <button
                onClick={() => setActiveTab("chat")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                  activeTab === "chat"
                    ? "bg-[#0033A0] text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Consola del Agile Coach</span>
              </button>

              <button
                onClick={() => setActiveTab("backlog")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                  activeTab === "backlog"
                    ? "bg-[#0033A0] text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Backlog Local ({backlog.length})</span>
              </button>
            </div>

            {/* Left Panel Content */}
            <div className="flex-1 h-[calc(100%-2.75rem)]">
              {activeTab === "chat" ? (
                <ChatPanel
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  onSelectQuickPrompt={handleSendMessage}
                />
              ) : (
                <BacklogPanel
                  stories={backlog}
                  currentStoryId={activeStory?.id}
                  onSelectStory={(s) => {
                    setActiveStory(s);
                    triggerToast(`Cargada ${s.id} en el lienzo`);
                  }}
                  onDeleteStory={handleDeleteStory}
                  onClearAll={handleClearBacklog}
                />
              )}
            </div>
          </div>

          {/* Right Panel (55% -> 7 cols of 12) - Live Canvas */}
          <div className="lg:col-span-7 flex flex-col h-full min-h-[550px]">
            <StoryCanvas
              story={activeStory}
              onUpdateStory={handleUpdateActiveStory}
              onLoadExample={handleLoadPymeExample}
            />
          </div>
        </div>
      </main>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 dark:border-slate-200 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />

      {/* Agent Training / System Prompt Modal */}
      <TrainingModal
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
        customInstruction={customInstruction}
        onSaveInstruction={handleSaveInstruction}
        onResetInstruction={handleResetInstruction}
      />
    </div>
  );
}
