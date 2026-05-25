import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      welcome: "Conectando Esperança à Assistência Global",
      subtitle: "Uma plataforma segura para apoiar refugiados e conectar organizações humanitárias em todo o mundo.",
      btnRefugee: "Buscar Ajuda (Sou Refugiado)",
      btnOng: "Quero Ajudar (Cadastrar ONG)",
      btnAdmin: "Painel Admin",
      statsTitle: "Impacto da Plataforma",
      satisfaction: "Satisfação",
      respTime: "Tempo de Resposta",
      cost: "Custo",
      languages: "Idiomas"
    }
  },
  en: {
    translation: {
      welcome: "Connecting Hope to Global Assistance",
      subtitle: "A secure platform to support refugees and connect humanitarian organizations worldwide.",
      btnRefugee: "Seek Help (I am a Refugee)",
      btnOng: "Want to Help (Register NGO)",
      btnAdmin: "Admin Panel",
      statsTitle: "Platform Impact",
      satisfaction: "Satisfaction",
      respTime: "Response Time",
      cost: "Cost",
      languages: "Languages"
    }
  },
  es: {
    translation: {
      welcome: "Conectando Esperanza con la Asistencia Global",
      subtitle: "Una plataforma segura para apoyar a los refugiados y conectar organizações humanitarias en todo el mundo.",
      btnRefugee: "Buscar Ayuda (Soy Refugiado)",
      btnOng: "Quiero Ayjudar (Registrar ONG)",
      btnAdmin: "Panel de Admin",
      statsTitle: "Impacto de la Plataforma",
      satisfaction: "Satisfacción",
      respTime: "Tiempo de Respuesta",
      cost: "Costo",
      languages: "Idiomas"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // idioma padrão inicial
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;