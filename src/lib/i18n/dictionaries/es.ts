import type { Dictionary } from "../types";

export const es: Dictionary = {
  meta: {
    title: "THEPIOLO — Sitios Web Profesionales para Empresas | Medellín",
    description:
      "THEPIOLO: sitios web corporativos, landing pages y soluciones digitales para empresas en Medellín. Diseño profesional, precios claros y acompañamiento post-entrega.",
  },
  nav: {
    services: "Servicios",
    work: "Casos",
    plans: "Planes",
    process: "Proceso",
    stack: "Stack",
    contact: "Contacto",
    getInTouch: "Agenda una asesoría gratuita",
  },
  a11y: {
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    menu: "Menú",
    switchLanguage: "Cambiar idioma",
  },
  hero: {
    logoAlt: "THEPIOLO — Sitios web para empresas",
    tagline: "Desarrollo web con enfoque empresarial",
    headlineBefore: "Desarrollamos sitios web",
    headlineHighlight: "profesionales",
    headlineAfter: "y soluciones digitales para empresas.",
    description:
      "Diseñamos y desarrollamos sitios web rápidos, modernos y preparados para representar tu negocio de forma profesional.",
    ctaPrimary: "Agenda una asesoría gratuita",
    ctaSecondary: "Ver planes y precios",
    pills: ["Sitios corporativos", "Landing pages", "Desde $800.000", "Medellín, Colombia"],
  },
  about: {
    label: "Nosotros",
    title: "Sitios web diseñados para transmitir confianza y representar tu negocio",
    description:
      "THEPIOLO ayuda a empresas y emprendedores a tener una presencia digital profesional—clara, confiable y orientada a generar resultados.",
    highlights: [
      {
        title: "Enfoque en tu negocio",
        description:
          "Cada proyecto parte de entender tu empresa, tus clientes y lo que necesitas comunicar.",
      },
      {
        title: "Presencia profesional",
        description:
          "Sitios que transmiten confianza desde el primer segundo—bien presentados, claros y fáciles de usar.",
      },
      {
        title: "Resultados medibles",
        description:
          "Preparados para captar contactos, aparecer en Google y acompañar el crecimiento de tu empresa.",
      },
      {
        title: "Acompañamiento real",
        description:
          "30 días de acompañamiento gratis después de la entrega—no te dejamos solo al lanzar.",
      },
      {
        title: "Precios transparentes",
        description:
          "Planes claros desde el inicio, sin sorpresas—sabes qué incluye y cuánto inviertes.",
      },
    ],
  },
  services: {
    label: "Servicios",
    title: "Lo que tu negocio necesita para crecer online",
    description:
      "Soluciones web pensadas para generar confianza, atraer clientes y representar tu empresa de forma profesional.",
    items: [
      {
        title: "Sitios web corporativos",
        description:
          "Para empresas que necesitan comunicar servicios, experiencia y propuesta de valor con claridad y profesionalismo.",
      },
      {
        title: "Landing pages",
        description:
          "Páginas enfocadas en captar clientes, presentar tu oferta y convertir visitas en contactos reales.",
      },
      {
        title: "Presencia profesional",
        description:
          "Sitios rápidos y modernos que representan tu negocio las 24 horas—adaptados a celular, tablet y computador.",
      },
      {
        title: "Soluciones a medida",
        description:
          "Catálogos, cotizadores, portales y herramientas digitales adaptadas a la operación de tu empresa.",
      },
      {
        title: "Visibilidad en Google",
        description:
          "Sitios preparados para SEO—para que tus clientes te encuentren cuando buscan lo que ofreces.",
      },
      {
        title: "Acompañamiento post-lanzamiento",
        description:
          "30 días de acompañamiento gratis después de la entrega—te apoyamos mientras tu sitio arranca.",
      },
    ],
  },
  plans: {
    label: "Planes",
    title: "Precios claros para tu negocio",
    description:
      "¿Qué hacemos? ¿Cuánto cuesta? Elige el plan que mejor se adapta a la etapa de tu empresa—sin sorpresas.",
    ladderLabel: "Escalera de madurez",
    specLabel: "Comparar planes",
    specFeatureColumn: "Característica",
    priceFrom: "Desde",
    customPrice: "Cotización personalizada",
    checkmark: "✓",
    notApplicable: "—",
    perAgreement: "Según acuerdo",
    viewFeatures: "Ver características",
    closeFeatures: "Cerrar",
    featuresIncluded: "Incluye",
    compareAll: "Comparar todos los planes",
    items: [
      {
        id: "foundation",
        step: "01",
        title: "Foundation",
        price: "$800.000 COP",
        tagline:
          "La base digital para negocios que necesitan una presencia profesional en internet.",
        audience:
          "Ideal para emprendedores, profesionales independientes y negocios que están dando sus primeros pasos en el mundo digital.",
        cta: "Recibir asesoría para empezar",
      },
      {
        id: "business",
        step: "02",
        title: "Business",
        price: "$1.300.000 COP",
        tagline:
          "Una presencia digital corporativa para empresas que necesitan comunicar sus servicios, experiencia y propuesta de valor de manera profesional.",
        audience:
          "Ideal para empresas establecidas que requieren una estructura más completa y escalable.",
        cta: "Asesoría para mi empresa",
        highlighted: true,
      },
      {
        id: "custom",
        step: "03",
        title: "Custom",
        price: "Cotización personalizada",
        tagline:
          "¿Tu proyecto requiere algo más que una página web corporativa? Desarrollamos soluciones adaptadas a las necesidades específicas de tu negocio.",
        audience:
          "Cuéntanos tu idea y construiremos una solución pensada para tu negocio.",
        examplesLabel: "Algunos ejemplos",
        examples: [
          "Catálogos personalizados",
          "Cotizadores",
          "Portales para clientes",
          "Dashboards",
          "Automatizaciones",
          "Integraciones con servicios externos",
          "Herramientas internas",
          "Desarrollo web a medida",
        ],
        cta: "Asesoría sobre proyecto a medida",
      },
    ],
    specRows: [
      {
        label: "Estructura del sitio",
        foundation: "Una sola página",
        business: "Multipágina (hasta 5)",
        custom: "A medida",
      },
      {
        label: "Secciones de contenido",
        foundation: "Hasta 6",
        business: "—",
        custom: "—",
      },
      {
        label: "Diseño personalizado",
        foundation: "✓",
        business: "✓",
        custom: "✓",
      },
      {
        label: "Adaptado a móvil, tablet y desktop",
        foundation: "✓",
        business: "✓",
        custom: "✓",
      },
      {
        label: "Formulario(s) de contacto",
        foundation: "✓",
        business: "✓",
        custom: "✓",
      },
      {
        label: "Botón directo de WhatsApp",
        foundation: "✓",
        business: "✓",
        custom: "✓",
      },
      {
        label: "Preparado para Google (SEO)",
        foundation: "✓",
        business: "✓",
        custom: "✓",
      },
      {
        label: "Medición básica de tráfico",
        foundation: "✓",
        business: "✓",
        custom: "✓",
      },
      {
        label: "Carga rápida y optimizada",
        foundation: "✓",
        business: "✓",
        custom: "✓",
      },
      {
        label: "Publicación y puesta en marcha",
        foundation: "✓",
        business: "✓",
        custom: "✓",
      },
      {
        label: "Acompañamiento post-entrega",
        foundation: "30 días gratis",
        business: "30 días gratis",
        custom: "Según acuerdo",
      },
    ],
  },
  work: {
    label: "Caso de estudio",
    title: "Transport Service Medellín",
    description:
      "Empresa de transporte y turismo en Medellín—un sitio en producción que genera confianza, captura clientes y presenta su servicio de forma profesional.",
    caseStudy: "Caso de Estudio",
    subtitle:
      "Transporte y turismo privado en Medellín — más de 12 tours, reservas 24/7 y presencia bilingüe.",
    body: "Proyecto real para una empresa operando desde 2018: sitio bilingüe con catálogo de tours, reseñas de clientes y experiencia de reserva. Resultado: presencia digital profesional que respalda la operación diaria del negocio.",
    tags: ["Sitio corporativo", "Captación de clientes", "Bilingüe", "En producción", "Turismo"],
    features: [
      "Catálogo de más de 12 tours con páginas dedicadas",
      "Sitio bilingüe (español / inglés) para clientes locales e internacionales",
      "Reseñas, servicios e historia de la empresa visibles desde el inicio",
      "Experiencia de reserva clara—contacto y WhatsApp accesibles",
      "En producción desde 2018 con mantenimiento continuo",
    ],
    stackLabel: "Desarrollado con",
    stack: ["Next.js 15", "next-intl", "Framer Motion", "Tailwind CSS", "Embla Carousel"],
    visitSite: "Ver sitio en vivo",
    visitSiteAria: "Abrir el sitio de Transport Service Medellín en una nueva pestaña",
    visitInstagram: "Instagram",
    visitInstagramAria: "Abrir el Instagram de Transport Service Medellín en una nueva pestaña",
    cta: "Asesoría sobre un proyecto similar",
  },
  process: {
    label: "Proceso",
    title: "De la idea al lanzamiento—sin complicaciones",
    description:
      "Un proceso claro para que sepas qué esperar en cada etapa y cuándo ver resultados.",
    steps: [
      {
        step: "01",
        title: "Conversación inicial",
        description:
          "Entendemos tu negocio, tus clientes y qué necesitas lograr con tu sitio web.",
      },
      {
        step: "02",
        title: "Propuesta y diseño",
        description:
          "Te presentamos la propuesta, el plan ideal y el diseño alineado a tu marca.",
      },
      {
        step: "03",
        title: "Desarrollo",
        description:
          "Construimos tu sitio—rápido, adaptado a todos los dispositivos y listo para captar clientes.",
      },
      {
        step: "04",
        title: "Lanzamiento",
        description:
          "Publicamos tu sitio, configuramos lo necesario y te entregamos todo listo para operar.",
      },
      {
        step: "05",
        title: "Acompañamiento",
        description:
          "30 días de acompañamiento gratis—te apoyamos mientras tu sitio arranca y recibe visitas.",
      },
    ],
  },
  stack: {
    label: "Tecnología",
    title: "Construido con herramientas modernas y confiables",
    description:
      "Usamos tecnología probada para que tu sitio sea rápido, seguro y fácil de mantener a largo plazo.",
    categories: {
      Framework: "Framework",
      UI: "UI",
      Language: "Lenguaje",
      Styling: "Estilos",
      Runtime: "Runtime",
      Database: "Base de datos",
      Deploy: "Deploy",
      Design: "Diseño",
      Motion: "Motion",
      Version: "Versión",
      Infra: "Infra",
      Systems: "Sistemas",
    },
  },
  contact: {
    label: "Contacto",
    title: "¿No sabes qué solución necesita tu negocio?",
    description:
      "Agenda una asesoría gratuita de 15 minutos y revisaremos tu caso para identificar la mejor opción para ti.",
    reassurance: "Sin compromiso. Sin lenguaje técnico.",
    whatsappCta: "Agenda una asesoría gratuita",
    responseTime: "Respondemos en minutos por WhatsApp",
    directLinks: "Otros canales",
  },
  leads: {
    cta: "Agenda una asesoría gratuita",
    floatingLabel: "Asesoría gratuita por WhatsApp con THEPIOLO",
    messages: {
      general:
        "Hola THEPIOLO, vi su sitio web y me gustaría agendar una asesoría gratuita para mi negocio.",
      hero: "Hola THEPIOLO, vi su sitio web y me gustaría agendar una asesoría gratuita.",
      navbar: "Hola THEPIOLO, me gustaría agendar una asesoría gratuita para un sitio web.",
      contact:
        "Hola THEPIOLO, me gustaría agendar una asesoría gratuita de 15 minutos para revisar mi caso y conocer la mejor opción para mi negocio.",
      work: "Hola THEPIOLO, vi su caso de estudio y me gustaría agendar una asesoría gratuita para un proyecto similar.",
      foundation:
        "Hola THEPIOLO, me interesa el plan Foundation. me gustaría agendar una asesoría gratuita.",
      business:
        "Hola THEPIOLO, me interesa el plan Business. me gustaría agendar una asesoría gratuita.",
      custom:
        "Hola THEPIOLO, tengo un proyecto a medida y me gustaría agendar una asesoría gratuita.",
    },
  },
  social: {
    instagram: "Instagram",
    instagramAria: "Seguir a THEPIOLO en Instagram @thepiolo.co",
    whatsapp: "Asesoría por WhatsApp",
    whatsappAria: "Agendar asesoría gratuita con THEPIOLO por WhatsApp",
    email: "Correo",
    emailAria: "Enviar correo a THEPIOLO",
    connect: "Conectar",
  },
  footer: {
    tagline: "Sitios web y soluciones digitales para empresas",
    rights: "Todos los derechos reservados.",
    connect: "Síguenos y contacto",
  },
};
