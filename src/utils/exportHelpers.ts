import { UserStory } from "@/types/story";
import jsPDF from "jspdf";

/**
 * Genera el texto en formato compatible con el editor de Jira y Confluence
 */
export function formatJiraMarkup(story: UserStory): string {
  const gherkinBlocks = story.acceptanceCriteria
    .map(
      (ac, index) =>
        `h4. Escenario ${index + 1}: ${ac.scenario}\n* *Dado que* ${ac.given}\n* *Cuando* ${ac.when}\n* *Entonces* ${ac.then}`
    )
    .join("\n\n");

  const rulesList = story.businessRules
    .map((rule) => `# ${rule}`)
    .join("\n");

  return `h2. [${story.id}] ${story.title}

*Estado:* READY FOR SPRINT | *Prioridad:* ${story.priority} | *Story Points:* ${story.storyPoints} SP

----
h3. 1. Descripción del Requerimiento (Connextra)
* *Como:* ${story.connextra.asA}
* *Quiero:* ${story.connextra.iWant}
* *Para:* ${story.connextra.soThat}

----
h3. 2. Criterios de Aceptación (BDD - Gherkin)
${gherkinBlocks}

----
h3. 3. Reglas de Negocio y Normativa (ETB / DIAN / CRC)
${rulesList}

----
_Generado por ETB Agile Studio - Agente Experto en Metodología Ágil_`;
}

/**
 * Genera el documento en formato Markdown estándar (.md)
 */
export function formatMarkdown(story: UserStory): string {
  const gherkinMarkdown = story.acceptanceCriteria
    .map(
      (ac, index) =>
        `#### Escenario ${index + 1}: ${ac.scenario}
\`\`\`gherkin
Dado que ${ac.given}
Cuando ${ac.when}
Entonces ${ac.then}
\`\`\``
    )
    .join("\n\n");

  const rulesMarkdown = story.businessRules
    .map((rule) => `- [x] ${rule}`)
    .join("\n");

  return `# [${story.id}] ${story.title}

> **Estado:** \`READY FOR SPRINT\` | **Prioridad:** **${story.priority}** | **Story Points:** **${story.storyPoints}**

---

### 1. Descripción (Formato Connextra)
- **Como** ${story.connextra.asA}
- **Quiero** ${story.connextra.iWant}
- **Para** ${story.connextra.soThat}

---

### 2. Criterios de Aceptación (BDD Gherkin)
${gherkinMarkdown}

---

### 3. Reglas de Negocio y Normativa (ETB / DIAN / CRC)
${rulesMarkdown}

---
*Documento emitido conforme al estándar Definition of Ready (DoR) de la Empresa de Telecomunicaciones de Bogotá (ETB).*
`;
}

/**
 * Copia texto al portapapeles con fallback seguro
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Error al copiar al portapapeles:", err);
    return false;
  }
}

/**
 * Descarga un archivo de texto en el navegador
 */
function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Descarga la historia en formato Markdown (.md)
 */
export function downloadMarkdownFile(story: UserStory) {
  const mdContent = formatMarkdown(story);
  const fileName = `${story.id || "HU-ETB"}_historia_usuario.md`;
  downloadFile(mdContent, fileName, "text/markdown;charset=utf-8;");
}

/**
 * Descarga la historia en formato CSV para Jira / Excel con BOM UTF-8
 */
export function downloadCsvFile(story: UserStory) {
  const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;

  const description = `Como ${story.connextra.asA}\nQuiero ${story.connextra.iWant}\nPara ${story.connextra.soThat}`;
  const acceptanceCriteria = story.acceptanceCriteria
    .map(
      (ac, i) =>
        `Escenario ${i + 1}: ${ac.scenario}\nDado que ${ac.given}\nCuando ${ac.when}\nEntonces ${ac.then}`
    )
    .join("\n\n");
  const businessRules = story.businessRules.join("\n");

  const headers = [
    "Issue Key",
    "Summary",
    "Issue Type",
    "Priority",
    "Story Points",
    "Status",
    "Description (Connextra)",
    "Acceptance Criteria (BDD)",
    "Business Rules",
  ];

  const row = [
    escapeCsv(story.id),
    escapeCsv(story.title),
    escapeCsv("Story"),
    escapeCsv(story.priority),
    escapeCsv(String(story.storyPoints)),
    escapeCsv("Ready for Sprint"),
    escapeCsv(description),
    escapeCsv(acceptanceCriteria),
    escapeCsv(businessRules),
  ];

  // BOM \uFEFF to enforce UTF-8 in Microsoft Excel on Windows
  const csvContent = "\uFEFF" + headers.join(",") + "\n" + row.join(",");
  const fileName = `${story.id || "HU-ETB"}_jira_import.csv`;
  downloadFile(csvContent, fileName, "text/csv;charset=utf-8;");
}

/**
 * Genera y descarga un PDF corporativo con membrete oficial de ETB
 */
export function downloadPdfFile(story: UserStory) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner ETB Blue (#0033A0)
  doc.setFillColor(0, 51, 160);
  doc.rect(0, 0, pageWidth, 28, "F");

  // Cyan decorative accent bar (#00A3E0)
  doc.setFillColor(0, 163, 224);
  doc.rect(0, 28, pageWidth, 3, "F");

  // ETB Brand Title in white
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("EMPRESA DE TELECOMUNICACIONES DE BOGOTÁ - ETB S.A. ESP", margin, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("PORTAL CORPORATIVO DE AGILIDAD | DEFINITION OF READY (DoR)", margin, 18);
  doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString("es-CO")}`, pageWidth - margin - 45, 18);

  let y = 38;

  // Metadata Card Header
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, "FD");

  // Story ID Badge
  doc.setFillColor(0, 51, 160);
  doc.roundedRect(margin + 4, y + 4, 30, 7, 1.5, 1.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(story.id, margin + 6, y + 8.8);

  // Status Badge
  doc.setFillColor(16, 185, 129); // Emerald Green
  doc.roundedRect(margin + 37, y + 4, 36, 7, 1.5, 1.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("READY FOR SPRINT", margin + 39, y + 8.8);

  // Priority & Story Points
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(
    `Prioridad: ${story.priority}   |   Estimación: ${story.storyPoints} Story Points`,
    pageWidth - margin - 75,
    y + 8.8
  );

  // Story Title
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const titleLines = doc.splitTextToSize(story.title, contentWidth - 8);
  doc.text(titleLines, margin + 4, y + 17);

  y += 28;

  // Section 1: Connextra
  doc.setFillColor(232, 240, 254);
  doc.roundedRect(margin, y, contentWidth, 7, 1, 1, "F");
  doc.setTextColor(0, 51, 160);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("1. DESCRIPCIÓN DEL REQUERIMIENTO (FORMATO CONNEXTRA)", margin + 3, y + 5);

  y += 10;

  const renderConnextraRow = (label: string, value: string, badgeBg: number[]) => {
    doc.setFillColor(badgeBg[0], badgeBg[1], badgeBg[2]);
    doc.roundedRect(margin, y, 20, 6, 1, 1, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(label, margin + 3, y + 4.2);

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const textLines = doc.splitTextToSize(value, contentWidth - 25);
    doc.text(textLines, margin + 23, y + 4.2);
    y += Math.max(7, textLines.length * 4.5 + 2);
  };

  renderConnextraRow("COMO", story.connextra.asA, [0, 51, 160]);
  renderConnextraRow("QUIERO", story.connextra.iWant, [0, 163, 224]);
  renderConnextraRow("PARA", story.connextra.soThat, [15, 157, 88]);

  y += 3;

  // Section 2: Criterios de Aceptación (BDD Gherkin)
  doc.setFillColor(232, 240, 254);
  doc.roundedRect(margin, y, contentWidth, 7, 1, 1, "F");
  doc.setTextColor(0, 51, 160);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("2. CRITERIOS DE ACEPTACIÓN (BDD - GHERKIN)", margin + 3, y + 5);

  y += 10;

  story.acceptanceCriteria.forEach((ac, idx) => {
    // Check if new page is needed
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 18;
    }

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 6, 1, 1, "FD");
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(`Escenario ${idx + 1}: ${ac.scenario}`, margin + 3, y + 4.2);

    y += 8;

    const renderGherkinLine = (keyword: string, text: string) => {
      doc.setTextColor(0, 51, 160);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(keyword, margin + 4, y);

      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const valLines = doc.splitTextToSize(text, contentWidth - 30);
      doc.text(valLines, margin + 26, y);
      y += Math.max(5, valLines.length * 4 + 1);
    };

    renderGherkinLine("Dado que", ac.given);
    renderGherkinLine("Cuando", ac.when);
    renderGherkinLine("Entonces", ac.then);
    y += 2;
  });

  y += 2;

  // Section 3: Reglas de Negocio
  if (y > pageHeight - 45) {
    doc.addPage();
    y = 18;
  }

  doc.setFillColor(232, 240, 254);
  doc.roundedRect(margin, y, contentWidth, 7, 1, 1, "F");
  doc.setTextColor(0, 51, 160);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("3. REGLAS DE NEGOCIO Y NORMATIVA TÉCNICA (ETB / DIAN / CRC)", margin + 3, y + 5);

  y += 10;

  story.businessRules.forEach((rule, idx) => {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 18;
    }

    doc.setFillColor(0, 51, 160);
    doc.circle(margin + 3, y - 1, 1.2, "F");

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const ruleLines = doc.splitTextToSize(rule, contentWidth - 10);
    doc.text(ruleLines, margin + 7, y);
    y += Math.max(5, ruleLines.length * 3.8 + 2);
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      "ETB Agile Studio | Confidencial - Uso Interno Exclusivo de ETB S.A. ESP",
      margin,
      pageHeight - 7
    );
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 20, pageHeight - 7);
  }

  const fileName = `${story.id || "HU-ETB"}_oficial_etb.pdf`;
  doc.save(fileName);
}
