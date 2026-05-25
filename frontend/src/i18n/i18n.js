import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      // Nav & Hero
      welcome: "Uma ponte para um novo começo",
      subtitle: "Conectamos refugiados a organizações que oferecem suporte em saúde, assistência jurídica, abrigo e serviços sociais. Encontre ajuda ou ofereça seus serviços.",
      btnRefugee: "Sou Refugiado →",
      btnOng: "Sou uma Organização",
      btnAdmin: "Painel Admin",
      statsTitle: "Impacto da Plataforma",
      satisfaction: "Taxa de satisfação",
      respTime: "Tempo médio de resposta",
      cost: "Gratuito",
      languages: "Idiomas suportados",
      
      // Seções e Serviços
      servicesTitle: "Nossos Serviços",
      servicesSubtitle: "Tipos de auxílio disponíveis",
      active: "Ativo",
      serviceDesc: "Acesso a suporte especializado e atendimento humanitário imediato para você e seus familiares.",
      
      // Formulários
      portalRefugee: "Portal do Refugiado",
      formTitle: "Formulário de Cadastro",
      formSubtitle: "Preencha todas as informações para que possamos ajudá-lo melhor.",
      fullName: "Nome Completo *",
      nationality: "Nacionalidade *",
      birthDate: "Data de Nascimento *",
      gender: "Gênero",
      docId: "Número de Documento de Identificação *",
      famMembers: "Número de Familiares",
      phone: "Número de Telefone",
      streetSituation: "Sim, estou em situação de rua",
      streetLabel: "Situação de rua?",
      state: "Estado",
      city: "Cidade",
      address: "Endereço Completo",
      needsTitle: "Necessidades Críticas (Marque todas que precisa):",
      situationDesc: "Descreva sua Situação Atual",
      btnSubmitRefugee: "Enviar Cadastro de Refugiado"
    }
  },
  en: {
    translation: {
      welcome: "A bridge to a new beginning",
      subtitle: "We connect refugees with organizations providing health, legal, shelter, and social services support. Find help or offer your services.",
      btnRefugee: "I am a Refugee →",
      btnOng: "I am an Organization",
      btnAdmin: "Admin Panel",
      statsTitle: "Platform Impact",
      satisfaction: "Satisfaction rate",
      respTime: "Average response time",
      cost: "Free of charge",
      languages: "Supported languages",
      
      servicesTitle: "Our Services",
      servicesSubtitle: "Available types of aid",
      active: "Active",
      serviceDesc: "Access to specialized support and immediate humanitarian assistance for you and your family.",
      
      portalRefugee: "Refugee Portal",
      formTitle: "Registration Form",
      formSubtitle: "Fill in all the information so we can better assist you.",
      fullName: "Full Name *",
      nationality: "Nationality *",
      birthDate: "Date of Birth *",
      gender: "Gender",
      docId: "Identification Document Number *",
      famMembers: "Number of Family Members",
      phone: "Phone Number",
      streetSituation: "Yes, I am experiencing homelessness",
      streetLabel: "Homeless?",
      state: "State",
      city: "City",
      address: "Full Address",
      needsTitle: "Critical Needs (Check all that apply):",
      situationDesc: "Describe your Current Situation",
      btnSubmitRefugee: "Submit Refugee Registration"
    }
  },
  es: {
    translation: {
      welcome: "Un puente hacia un nuevo comienzo",
      subtitle: "Conectamos a refugiados con organizaciones que ofrecen apoyo en salud, asistencia jurídica, vivienda y servicios sociales. Encuentre ayuda u ofrezca sus servicios.",
      btnRefugee: "Soy Refugiado →",
      btnOng: "Soy una Organización",
      btnAdmin: "Panel de Admin",
      statsTitle: "Impacto de la Plataforma",
      satisfaction: "Tasa de satisfacción",
      respTime: "Tiempo promedio de respuesta",
      cost: "Gratuito",
      languages: "Idiomas soportados",
      
      servicesTitle: "Nuestros Servicios",
      servicesSubtitle: "Tipos de ayuda disponibles",
      active: "Activo",
      serviceDesc: "Acceso a apoyo especializado y atención humanitaria inmediata para usted y su familia.",
      
      portalRefugee: "Portal del Refugiado",
      formTitle: "Formulario de Registro",
      formSubtitle: "Complete toda la información para que podamos ayudarle mejor.",
      fullName: "Nombre Completo *",
      nationality: "Nacionalidad *",
      birthDate: "Fecha de Nacimiento *",
      gender: "Género",
      docId: "Número de Documento de Identificación *",
      famMembers: "Número de Familiares",
      phone: "Número de Teléfono",
      streetSituation: "Sí, me encuentro en situación de calle",
      streetLabel: "¿Situación de calle?",
      state: "Estado",
      city: "Ciudad",
      address: "Dirección Completa",
      needsTitle: "Necesidades Críticas (Marque todas las que necesite):",
      situationDesc: "Describa su Situación Actual",
      btnSubmitRefugee: "Enviar Registro de Refugiado"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;