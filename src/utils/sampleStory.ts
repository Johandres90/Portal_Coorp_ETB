import { UserStory } from "@/types/story";

export const SAMPLE_PYME_STORY: UserStory = {
  id: "HU-ETB-104",
  title: "Descarga de Factura Electrónica de Fibra Óptica PYME en Portal Mi ETB",
  priority: "Alta",
  storyPoints: 5,
  status: "READY FOR SPRINT",
  connextra: {
    asA: "Representante legal o Administrador de cuenta PYME de ETB",
    iWant:
      "Descargar en formato PDF y XML la factura electrónica de mis servicios de fibra óptica empresarial directamente desde el módulo de facturación del portal Mi ETB",
    soThat:
      "Pueda tramitar los soportes contables y la deducción tributaria ante la DIAN dentro de las fechas límites sin requerir radicación telefónica ni atención presencial",
  },
  acceptanceCriteria: [
    {
      scenario: "Descarga exitosa de factura electrónica del mes en curso",
      given:
        "El cliente PYME ha iniciado sesión en el portal Mi ETB y cuenta con al menos un enlace de fibra óptica activo con factura emitida",
      when:
        "Ingresa al menú 'Mis Facturas', selecciona el periodo fiscal correspondiente y hace clic en 'Descargar PDF + XML'",
      then:
        "El sistema genera y descarga un archivo comprimido .ZIP con la factura en PDF con QR DIAN y el archivo XML validado por el CUFE en menos de 3 segundos",
    },
    {
      scenario: "Intento de descarga con factura en proceso de emisión o validación DIAN",
      given:
        "La factura del periodo está en ciclo de corte y validación previa ante la DIAN",
      when:
        "El usuario presiona el botón 'Descargar Factura'",
      then:
        "El portal muestra un aviso informativo: 'Su factura se encuentra en validación fiscal DIAN. Estará disponible en un plazo máximo de 24 horas' y permite registrar un correo para notificación automática",
    },
    {
      scenario: "Consulta de histórico de facturación de los últimos 24 meses",
      given:
        "El usuario PYME requiere conciliar cierres contables de vigencias anteriores",
      when:
        "Filtra por rango de años en el historial de facturación",
      then:
        "El sistema despliega el listado cronológico de comprobantes fiscales con opción de descarga individual o masiva de hasta 12 periodos consecutivos",
    },
  ],
  businessRules: [
    "Cumplimiento Resolución DIAN 000042 de facturación electrónica con validación previa y Código Único de Factura Electrónica (CUFE).",
    "Validación estricta de Roles y Permisos (RBAC): Únicamente usuarios con rol 'Administrador' o 'Contable' pueden ver y descargar documentos fiscales.",
    "Tiempos de respuesta (SLA): La generación del archivo firmado digitalmente no debe superar los 3.5 segundos bajo conexión estándar de 50 Mbps.",
    "Disponibilidad histórica: Garantizar el almacenamiento y descarga de comprobantes de facturación de hasta 5 años conforme a la regulación del Estatuto Tributario colombiano.",
    "Integración directa con el ERP corporativo de ETB (SAP/Billing) y motor de firma digital avalado por la ONAC.",
  ],
};
