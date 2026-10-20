# 🚀 Portal Corporativo de Agilidad ETB - User Story AI Agent
> **Google Enterprise Architecture | Definition of Ready (DoR) • Formato Connextra • Criterios BDD Gherkin • Reglas de Negocio ETB**

Herramienta corporativa interna diseñada para los **Product Owners, Scrum Masters y Líderes Técnicos** de la **Empresa de Telecomunicaciones de Bogotá (ETB S.A. ESP)**. Permite transformar necesidades e ideas de negocio en Historias de Usuario de estándar internacional, listas para el Sprint (*Definition of Ready*), con estimación en Story Points y reglas regulatorias colombianas (DIAN, CRC, SLA, infraestructura GPON).

---

## 📸 Características Principales

1. **Agile Coach Virtual Asistido por IA:**
   - Conectado a la API oficial de **Google Gemini** mediante el SDK `@google/generative-ai` (`gemini-3.8-flash` con modo ultra-rápido de 2 a 4 segundos).
   - Regla estricta de refinamiento: si el requerimiento es ambiguo, realiza un máximo de **2 preguntas aclaratorias** antes de estructurar la historia.
2. **Lienzo Interactivo (Live Canvas estilo Jira / Azure DevOps):**
   - **Formato Connextra:** Bloques destacados para *Como*, *Quiero* y *Para*.
   - **BDD Gherkin:** Escenarios estructurados con etiquetas visuales (*Dado que*, *Cuando*, *Entonces*).
   - **Reglas de Negocio:** Checklist técnico y legal (DIAN facturación electrónica, CRC, SLA, GPON).
   - **Edición Inline:** Posibilidad de ajustar cualquier texto directamente en el lienzo.
3. **Módulo de Exportación Multi-Formato:**
   - 📋 **Copiar Formato Jira / Confluence** (listo para pegar en tickets).
   - 📄 **Descargar Markdown (`.md`)**.
   - 📊 **Exportar CSV con BOM UTF-8 (`\uFEFF`)** para compatibilidad con tildes y caracteres en Microsoft Excel y Jira Import.
   - 📑 **Exportar PDF Oficial Vectorial** con membrete institucional de ETB.
4. **Centro de Entrenamiento del Agente (Training Studio):**
   - Permite a los POs y gerencias personalizar en caliente el System Prompt, el rol y las reglas de negocio del agente sin tener que tocar código.
5. **Modo Oscuro / Claro:**
   - Alternador rápido con persistencia en `localStorage`.
6. **Backlog Local de Sesión:**
   - Historial de historias generadas durante la jornada de trabajo para volver a abrirlas o exportarlas en cualquier momento.

---

## 🛠️ Stack Tecnológico

- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS (Dark Mode habilitado)
- **Iconografía:** Lucide React
- **IA SDK:** `@google/generative-ai` (Google Gemini)
- **Generación PDF:** `jspdf`

---

## 💻 Guía de Instalación y Ejecución Local

### Prerrequisitos
- **Node.js:** Versión 18.x o superior instalada ([Descargar Node.js](https://nodejs.org/)).
- **Git:** Instalado en el equipo ([Descargar Git](https://git-scm.com/)).
- **Gemini API Key:** Clave gratuita obtenida en [Google AI Studio](https://aistudio.google.com/app/apikey).

### Paso 1: Clonar el Repositorio
Abre tu terminal o PowerShell y ejecuta:
```bash
git clone https://github.com/Johandres90/Portal_Coorp_ETB.git
cd Portal_Coorp_ETB
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Configurar la Clave de API
Tienes dos opciones:
- **Opción A (Recomendada en Desarrollo):** Crea un archivo `.env.local` en la raíz del proyecto copiando la plantilla:
  ```bash
  cp .env.example .env.local
  ```
  Abre `.env.local` y pega tu clave:
  ```env
  GEMINI_API_KEY=tu_clave_de_gemini_aqui
  ```
- **Opción B (Desde la Interfaz Web):** Inicia la aplicación y haz clic en el botón superior **"Configurar API Key"** para guardarla de forma segura en tu navegador (`localStorage`).

### Paso 4: Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
Abre tu navegador en:
👉 **`http://localhost:3000`**

---

## ☁️ Guía de Despliegue en la Nube (Vercel Corporativo)

Desplegar el portal en Vercel toma menos de 2 minutos:

### Paso 1: Conectar con Vercel
1. Ingresa a [Vercel](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New..."** → **"Project"**.
3. Selecciona el repositorio **`Johandres90/Portal_Coorp_ETB`** y haz clic en **"Import"**.

### Paso 2: Configurar Variables de Entorno en Vercel
1. En la sección **Environment Variables**, agrega:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `tu_clave_de_google_ai_studio`
2. En **Framework Preset**, deja **Next.js** (detectado automáticamente).

### Paso 3: Desplegar
1. Haz clic en **"Deploy"**.
2. En aproximadamente 60 segundos, Vercel te proporcionará una URL pública segura (ej. `https://portal-coorp-etb.vercel.app`) lista para compartir en presentaciones corporativas.

---

## 🏢 Estándar de Historia de Usuario Oficial ETB

Todas las historias emitidas cumplen la siguiente estructura:
- **Identificador Único:** Código correlativo (ej. `HU-ETB-104`).
- **Estado Inicial:** `READY FOR SPRINT`.
- **Estimación sugerida:** Escala Fibonacci (3, 5, 8, 13 Story Points).
- **Connextra:** `Como [Rol] Quiero [Acción] Para [Beneficio de negocio para ETB]`.
- **Criterios de Aceptación BDD:** Escenarios con `Dado que`, `Cuando` y `Entonces`.
- **Reglas de Negocio:** Validación fiscal DIAN, circular CRC, SLA e integración técnica.

---

*Portal Corporativo de Agilidad ETB S.A. ESP — Confidencial para Uso Interno.*
