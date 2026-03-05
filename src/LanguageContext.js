import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  es: {
    // Header
    admin: "Admin",
    bookNow: "Reservar Ahora",
    
    // Hero
    homeService: "Servicio a Domicilio",
    heroTitle1: "Cambio de Aceite",
    heroTitle2: "Sin Salir de Casa",
    heroDesc: "Soy Jose Montufar, mecánico profesional. Llevo el servicio hasta tu puerta. Sin filas, sin esperas. Agenda tu cita hoy.",
    scheduleAppointment: "Agendar Cita",
    learnMore: "Conocer Más",
    
    // Services
    ourServices: "Nuestros Servicios",
    whatWeOffer: "¿Qué Ofrecemos?",
    oilChange: "Cambio de Aceite",
    oilChangeDesc: "Aceite convencional, sintético o semi-sintético. Tú eliges.",
    doorToDoor: "A Domicilio",
    doorToDoorDesc: "Voy hasta tu casa, oficina o donde prefieras. Sin costo extra.",
    generalReview: "Revisión General",
    generalReviewDesc: "Reviso frenos, filtros, líquidos y más. Incluido en el servicio.",
    
    // How it works
    simpleAndFast: "Simple y Rápido",
    howItWorks: "¿Cómo Funciona?",
    step1: "Agenda",
    step1Desc: "Elige fecha, hora y tu dirección",
    step2: "Confirmo",
    step2Desc: "Te contacto para confirmar la cita",
    step3: "Llego",
    step3Desc: "Me presento en tu ubicación",
    step4: "Listo",
    step4Desc: "Servicio completo en tu casa",
    scheduleMyAppointment: "Agendar Mi Cita",
    
    // Payment
    paymentMethods: "Formas de Pago",
    payAsYouPrefer: "Paga Como Prefieras",
    cash: "Cash",
    cashDesc: "Efectivo al momento del servicio",
    zelle: "Zelle",
    zelleDesc: "Transferencia rápida y segura",
    cashApp: "Cash App",
    cashAppDesc: "Pago desde tu celular",
    depositNote: "* Si necesitas que compre el aceite, se requiere 50% de adelanto",
    
    // Footer
    footerText: "Jose Montufar • Mechanic Service • Door to Door",
    
    // Booking Form
    yourInfo: "Tu Información",
    yourInfoDesc: "Necesitamos tus datos para contactarte",
    fullName: "Nombre Completo",
    fullNamePlaceholder: "Ej: Juan Pérez",
    phone: "Teléfono",
    phonePlaceholder: "Ej: (555) 123-4567",
    address: "Dirección",
    addressPlaceholder: "Ej: 123 Main St, Apt 4B",
    city: "Ciudad",
    cityPlaceholder: "Ej: Miami",
    state: "Estado",
    statePlaceholder: "Ej: FL",
    zipCode: "Código Postal",
    zipPlaceholder: "Ej: 33101",
    
    yourVehicle: "Tu Vehículo",
    yourVehicleDesc: "Información de tu carro para el servicio",
    make: "Marca",
    makePlaceholder: "Ej: Toyota",
    model: "Modelo",
    modelPlaceholder: "Ej: Camry",
    year: "Año",
    oilType: "Tipo de Aceite",
    conventional: "Convencional",
    synthetic: "Sintético",
    semiSynthetic: "Semi-Sintético",
    highMileage: "Alto Kilometraje",
    mechanicBuysOil: "Que el mecánico compre el aceite",
    mechanicBuysOilNote: "Se requiere 50% de adelanto para esta opción",
    
    scheduleYourAppointment: "Agenda tu Cita",
    chooseWhenConvenient: "Elige cuándo te conviene",
    date: "Fecha",
    time: "Hora",
    selectTime: "Selecciona una hora",
    paymentMethod: "Método de Pago",
    cashOption: "Cash (Efectivo)",
    additionalNotes: "Notas Adicionales (opcional)",
    notesPlaceholder: "Ej: También necesito revisar los frenos, el carro hace un ruido extraño...",
    
    confirmYourAppointment: "Confirma tu Cita",
    reviewEverything: "Revisa que todo esté correcto",
    mechanicBuysOilWarning: "El mecánico comprará el aceite (50% adelanto)",
    notes: "Notas:",
    
    previous: "Anterior",
    next: "Siguiente",
    cancel: "Cancelar",
    confirmAppointment: "Confirmar Cita",
    sending: "Enviando...",
    
    // Steps
    stepInfo: "Tu Info",
    stepVehicle: "Vehículo",
    stepAppointment: "Cita",
    stepConfirm: "Confirmar",
    
    // Confirmation
    appointmentScheduled: "¡Cita Agendada!",
    willContact: "Te contactaremos para confirmar tu cita",
    dateLabel: "Fecha:",
    timeLabel: "Hora:",
    vehicleLabel: "Vehículo:",
    confirmationLabel: "Confirmación #:",
    backToHome: "Volver al Inicio",
    
    // Validation
    nameRequired: "Nombre requerido",
    phoneRequired: "Teléfono requerido",
    addressRequired: "Dirección requerida",
    cityRequired: "Ciudad requerida",
    stateRequired: "Estado requerido",
    zipRequired: "Código postal requerido",
    makeRequired: "Marca requerida",
    modelRequired: "Modelo requerido",
    dateRequired: "Fecha requerida",
    timeRequired: "Hora requerida",
    
    // Toast messages
    appointmentSuccess: "¡Cita agendada exitosamente!",
    appointmentError: "Error al agendar la cita. Intenta de nuevo.",
    appointmentNotFound: "No se encontró la cita",
    
    // Admin
    adminPanel: "Panel de Administración",
    createAdminAccount: "Crear Cuenta Admin",
    yourName: "Tu Nombre",
    yourNamePlaceholder: "Ej: Jose Montufar",
    username: "Usuario",
    usernamePlaceholder: "Ej: jose",
    password: "Contraseña",
    createAccount: "Crear Cuenta",
    login: "Iniciar Sesión",
    loading: "Cargando...",
    backToSite: "Volver al sitio",
    accountCreated: "Cuenta creada. Ahora inicia sesión.",
    welcome: "¡Bienvenido!",
    authError: "Error de autenticación",
    
    // Dashboard
    dashboard: "Dashboard",
    logout: "Cerrar Sesión",
    today: "Hoy",
    pending: "Pendientes",
    confirmed: "Confirmadas",
    completed: "Completadas",
    cancelled: "Canceladas",
    all: "Todas",
    noAppointments: "No hay citas",
    phoneLabel: "Teléfono:",
    addressLabel: "Dirección:",
    oilLabel: "Aceite:",
    paymentLabel: "Pago:",
    effectiveCash: "Efectivo",
    confirm: "Confirmar",
    cancelAppointment: "Cancelar",
    markCompleted: "Marcar Completada",
    delete: "Eliminar",
    deleteConfirm: "¿Eliminar esta cita?",
    statusConfirmed: "confirmada",
    statusCompleted: "completada",
    statusCancelled: "cancelada",
    updateError: "Error al actualizar la cita",
    deleteSuccess: "Cita eliminada",
    deleteError: "Error al eliminar la cita",
    
    // Status labels
    statusPending: "Pendiente",
    statusConfirmedLabel: "Confirmada",
    statusCompletedLabel: "Completada",
    statusCancelledLabel: "Cancelada",

    // Language
    language: "Idioma",
    spanish: "Español",
    english: "English"
  },
  en: {
    // Header
    admin: "Admin",
    bookNow: "Book Now",
    
    // Hero
    homeService: "Home Service",
    heroTitle1: "Oil Change",
    heroTitle2: "Without Leaving Home",
    heroDesc: "I'm Jose Montufar, professional mechanic. I bring the service to your door. No lines, no waiting. Schedule your appointment today.",
    scheduleAppointment: "Schedule Appointment",
    learnMore: "Learn More",
    
    // Services
    ourServices: "Our Services",
    whatWeOffer: "What Do We Offer?",
    oilChange: "Oil Change",
    oilChangeDesc: "Conventional, synthetic or semi-synthetic oil. You choose.",
    doorToDoor: "Door to Door",
    doorToDoorDesc: "I go to your home, office or wherever you prefer. No extra cost.",
    generalReview: "General Inspection",
    generalReviewDesc: "I check brakes, filters, fluids and more. Included in the service.",
    
    // How it works
    simpleAndFast: "Simple and Fast",
    howItWorks: "How Does It Work?",
    step1: "Schedule",
    step1Desc: "Choose date, time and your address",
    step2: "I Confirm",
    step2Desc: "I contact you to confirm the appointment",
    step3: "I Arrive",
    step3Desc: "I show up at your location",
    step4: "Done",
    step4Desc: "Complete service at your home",
    scheduleMyAppointment: "Schedule My Appointment",
    
    // Payment
    paymentMethods: "Payment Methods",
    payAsYouPrefer: "Pay As You Prefer",
    cash: "Cash",
    cashDesc: "Cash at time of service",
    zelle: "Zelle",
    zelleDesc: "Fast and secure transfer",
    cashApp: "Cash App",
    cashAppDesc: "Pay from your phone",
    depositNote: "* If you need me to buy the oil, 50% deposit is required",
    
    // Footer
    footerText: "Jose Montufar • Mechanic Service • Door to Door",
    
    // Booking Form
    yourInfo: "Your Information",
    yourInfoDesc: "We need your details to contact you",
    fullName: "Full Name",
    fullNamePlaceholder: "Ex: John Smith",
    phone: "Phone",
    phonePlaceholder: "Ex: (555) 123-4567",
    address: "Address",
    addressPlaceholder: "Ex: 123 Main St, Apt 4B",
    city: "City",
    cityPlaceholder: "Ex: Miami",
    state: "State",
    statePlaceholder: "Ex: FL",
    zipCode: "Zip Code",
    zipPlaceholder: "Ex: 33101",
    
    yourVehicle: "Your Vehicle",
    yourVehicleDesc: "Information about your car for the service",
    make: "Make",
    makePlaceholder: "Ex: Toyota",
    model: "Model",
    modelPlaceholder: "Ex: Camry",
    year: "Year",
    oilType: "Oil Type",
    conventional: "Conventional",
    synthetic: "Synthetic",
    semiSynthetic: "Semi-Synthetic",
    highMileage: "High Mileage",
    mechanicBuysOil: "Mechanic buys the oil",
    mechanicBuysOilNote: "50% deposit required for this option",
    
    scheduleYourAppointment: "Schedule Your Appointment",
    chooseWhenConvenient: "Choose when it's convenient",
    date: "Date",
    time: "Time",
    selectTime: "Select a time",
    paymentMethod: "Payment Method",
    cashOption: "Cash",
    additionalNotes: "Additional Notes (optional)",
    notesPlaceholder: "Ex: I also need to check the brakes, the car makes a strange noise...",
    
    confirmYourAppointment: "Confirm Your Appointment",
    reviewEverything: "Review that everything is correct",
    mechanicBuysOilWarning: "Mechanic will buy the oil (50% deposit)",
    notes: "Notes:",
    
    previous: "Previous",
    next: "Next",
    cancel: "Cancel",
    confirmAppointment: "Confirm Appointment",
    sending: "Sending...",
    
    // Steps
    stepInfo: "Your Info",
    stepVehicle: "Vehicle",
    stepAppointment: "Appointment",
    stepConfirm: "Confirm",
    
    // Confirmation
    appointmentScheduled: "Appointment Scheduled!",
    willContact: "We will contact you to confirm your appointment",
    dateLabel: "Date:",
    timeLabel: "Time:",
    vehicleLabel: "Vehicle:",
    confirmationLabel: "Confirmation #:",
    backToHome: "Back to Home",
    
    // Validation
    nameRequired: "Name required",
    phoneRequired: "Phone required",
    addressRequired: "Address required",
    cityRequired: "City required",
    stateRequired: "State required",
    zipRequired: "Zip code required",
    makeRequired: "Make required",
    modelRequired: "Model required",
    dateRequired: "Date required",
    timeRequired: "Time required",
    
    // Toast messages
    appointmentSuccess: "Appointment scheduled successfully!",
    appointmentError: "Error scheduling appointment. Please try again.",
    appointmentNotFound: "Appointment not found",
    
    // Admin
    adminPanel: "Admin Panel",
    createAdminAccount: "Create Admin Account",
    yourName: "Your Name",
    yourNamePlaceholder: "Ex: Jose Montufar",
    username: "Username",
    usernamePlaceholder: "Ex: jose",
    password: "Password",
    createAccount: "Create Account",
    login: "Login",
    loading: "Loading...",
    backToSite: "Back to site",
    accountCreated: "Account created. Now login.",
    welcome: "Welcome!",
    authError: "Authentication error",
    
    // Dashboard
    dashboard: "Dashboard",
    logout: "Logout",
    today: "Today",
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
    all: "All",
    noAppointments: "No appointments",
    phoneLabel: "Phone:",
    addressLabel: "Address:",
    oilLabel: "Oil:",
    paymentLabel: "Payment:",
    effectiveCash: "Cash",
    confirm: "Confirm",
    cancelAppointment: "Cancel",
    markCompleted: "Mark Completed",
    delete: "Delete",
    deleteConfirm: "Delete this appointment?",
    statusConfirmed: "confirmed",
    statusCompleted: "completed",
    statusCancelled: "cancelled",
    updateError: "Error updating appointment",
    deleteSuccess: "Appointment deleted",
    deleteError: "Error deleting appointment",
    
    // Status labels
    statusPending: "Pending",
    statusConfirmedLabel: "Confirmed",
    statusCompletedLabel: "Completed",
    statusCancelledLabel: "Cancelled",

    // Language
    language: "Language",
    spanish: "Español",
    english: "English"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'es';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
