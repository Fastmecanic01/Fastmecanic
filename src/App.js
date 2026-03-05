import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { 
  Wrench, Droplet, Car, Calendar, MapPin, Phone, Clock, 
  ChevronRight, ChevronLeft, CheckCircle2, Menu, X,
  LayoutDashboard, LogOut, User, DollarSign, FileText,
  AlertCircle, Check, Trash2, Globe, Download, Share
} from "lucide-react";
import { LanguageProvider, useLanguage } from "./LanguageContext";

// PWA Install Hook
const useInstallPWA = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for install prompt
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!installPrompt) return false;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
    return result.outcome === 'accepted';
  };

  return { installPrompt, isInstalled, isIOS, install };
};

// Install Banner Component
const InstallBanner = () => {
  const { installPrompt, isInstalled, isIOS, install } = useInstallPWA();
  const { language } = useLanguage();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = localStorage.getItem('install-banner-dismissed');
    if (wasDismissed) setDismissed(true);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem('install-banner-dismissed', 'true');
  };

  if (isInstalled || dismissed) return null;
  if (!installPrompt && !isIOS) return null;

  const texts = {
    es: {
      install: "Instalar App",
      iosTitle: "Instalar en iPhone/iPad",
      iosStep1: "Toca el botón compartir",
      iosStep2: 'Selecciona "Añadir a pantalla de inicio"',
      iosStep3: 'Toca "Añadir"',
      close: "Cerrar"
    },
    en: {
      install: "Install App",
      iosTitle: "Install on iPhone/iPad",
      iosStep1: "Tap the share button",
      iosStep2: 'Select "Add to Home Screen"',
      iosStep3: 'Tap "Add"',
      close: "Close"
    }
  };

  const t = texts[language] || texts.es;

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSInstructions(true)}
          className="fixed bottom-20 right-4 z-50 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm uppercase tracking-wide animate-bounce"
          data-testid="install-ios-btn"
        >
          <Download className="w-5 h-5" />
          {t.install}
        </button>

        {showIOSInstructions && (
          <div className="fixed inset-0 z-[100] bg-black/50 flex items-end justify-center p-4">
            <div className="bg-card rounded-t-2xl w-full max-w-md p-6 animate-slide-up">
              <h3 className="font-display text-xl font-bold uppercase tracking-tight mb-4 text-center">
                {t.iosTitle}
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                  <div className="flex items-center gap-2">
                    <Share className="w-5 h-5 text-secondary" />
                    <span>{t.iosStep1}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                  <span>{t.iosStep2}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                  <span>{t.iosStep3}</span>
                </div>
              </div>
              <button
                onClick={() => { setShowIOSInstructions(false); dismiss(); }}
                className="w-full bg-primary text-primary-foreground py-3 rounded-md font-bold uppercase tracking-wide"
              >
                {t.close}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      onClick={install}
      className="fixed bottom-20 right-4 z-50 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm uppercase tracking-wide animate-bounce"
      data-testid="install-app-btn"
    >
      <Download className="w-5 h-5" />
      {t.install}
    </button>
  );
};

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ============ COMPONENTS ============

const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-wide transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  };
  const sizes = {
    default: "h-12 px-6 text-base rounded-md",
    sm: "h-10 px-4 text-sm rounded-md",
    lg: "h-14 px-8 text-lg rounded-md",
    icon: "h-10 w-10 rounded-md"
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ label, error, className = "", ...props }) => (
  <div className="space-y-2">
    {label && <label className="text-sm font-medium text-foreground">{label}</label>}
    <input 
      className={`w-full h-12 px-4 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${error ? 'border-destructive' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
);

const Select = ({ label, error, options, className = "", ...props }) => (
  <div className="space-y-2">
    {label && <label className="text-sm font-medium text-foreground">{label}</label>}
    <select 
      className={`w-full h-12 px-4 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${error ? 'border-destructive' : ''} ${className}`}
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
);

const Textarea = ({ label, error, className = "", ...props }) => (
  <div className="space-y-2">
    {label && <label className="text-sm font-medium text-foreground">{label}</label>}
    <textarea 
      className={`w-full min-h-[120px] p-4 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none ${error ? 'border-destructive' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-card border border-border rounded-lg ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-muted text-muted-foreground",
    pending: "bg-warning/20 text-warning",
    confirmed: "bg-secondary/20 text-secondary",
    completed: "bg-success/20 text-success",
    cancelled: "bg-destructive/20 text-destructive"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Language Selector Component
const LanguageSelector = ({ variant = "default" }) => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div className="relative">
      <button
        onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          variant === 'dark' 
            ? 'hover:bg-muted text-foreground' 
            : 'hover:bg-accent text-foreground'
        }`}
        data-testid="language-selector"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{language === 'es' ? 'ES' : 'EN'}</span>
      </button>
    </div>
  );
};

// ============ LANDING PAGE ============

const LandingPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Install Banner */}
      <InstallBanner />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-primary" />
            <span className="font-display text-xl font-bold uppercase tracking-tight">Fast Mechanic</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSelector />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/admin')}
              data-testid="admin-link"
            >
              {t('admin')}
            </Button>
            <Button 
              size="sm"
              onClick={() => navigate('/book')}
              data-testid="book-now-header-btn"
            >
              {t('bookNow')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1713019023680-e531ce0e01d3?w=1920&q=80)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <p className="text-primary font-medium uppercase tracking-wider mb-4 animate-fade-up">
              {t('homeService')}
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tighter text-foreground mb-6 animate-fade-up animate-delay-100">
              {t('heroTitle1')}<br />
              <span className="text-primary">{t('heroTitle2')}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up animate-delay-200">
              {t('heroDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animate-delay-300">
              <Button 
                size="lg" 
                onClick={() => navigate('/book')}
                data-testid="book-now-hero-btn"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {t('scheduleAppointment')}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
                data-testid="learn-more-btn"
              >
                {t('learnMore')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-32 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <p className="text-primary font-medium uppercase tracking-wider mb-4">{t('ourServices')}</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight">
              {t('whatWeOffer')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Droplet,
                title: t('oilChange'),
                desc: t('oilChangeDesc')
              },
              {
                icon: Car,
                title: t('doorToDoor'),
                desc: t('doorToDoorDesc')
              },
              {
                icon: Wrench,
                title: t('generalReview'),
                desc: t('generalReviewDesc')
              }
            ].map((service, i) => (
              <Card key={i} className="p-6 md:p-8 hover:border-primary transition-colors group">
                <service.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-xl font-bold uppercase tracking-tight mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground">{service.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <p className="text-primary font-medium uppercase tracking-wider mb-4">{t('simpleAndFast')}</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight">
              {t('howItWorks')}
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: t('step1'), desc: t('step1Desc') },
              { step: "02", title: t('step2'), desc: t('step2Desc') },
              { step: "03", title: t('step3'), desc: t('step3Desc') },
              { step: "04", title: t('step4'), desc: t('step4Desc') }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-6xl font-bold text-primary/20 mb-2">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/book')}
              data-testid="book-now-cta-btn"
            >
              <Calendar className="w-5 h-5 mr-2" />
              {t('scheduleMyAppointment')}
            </Button>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 md:py-32 bg-foreground text-background relative noise-overlay">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-primary font-medium uppercase tracking-wider mb-4">{t('paymentMethods')}</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight">
              {t('payAsYouPrefer')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { name: t('cash'), desc: t('cashDesc') },
              { name: t('zelle'), desc: t('zelleDesc') },
              { name: t('cashApp'), desc: t('cashAppDesc') }
            ].map((method, i) => (
              <div key={i} className="bg-background/10 backdrop-blur-sm border border-background/20 rounded-lg p-6 text-center">
                <DollarSign className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-display text-lg font-bold uppercase tracking-tight mb-1">
                  {method.name}
                </h3>
                <p className="text-sm text-background/70">{method.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-background/70 text-sm">
            {t('depositNote')}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-medium uppercase tracking-wider mb-4">
              {language === 'es' ? 'Contacto' : 'Contact'}
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight">
              {language === 'es' ? '¿Preguntas? Llámame' : 'Questions? Call Me'}
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <a 
              href="tel:+15622989551" 
              className="flex items-center gap-3 bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors group"
              data-testid="contact-phone"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">
                  {language === 'es' ? 'Teléfono' : 'Phone'}
                </p>
                <p className="font-display text-xl font-bold">(562) 298-9551</p>
              </div>
            </a>

            <a 
              href="mailto:fastmecanic01@gmail.com" 
              className="flex items-center gap-3 bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors group"
              data-testid="contact-email"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="font-display text-lg font-bold">fastmecanic01@gmail.com</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              <span className="font-display text-lg font-bold uppercase tracking-tight">Fast Mechanic</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
              <a href="tel:+15622989551" className="hover:text-primary transition-colors flex items-center gap-2">
                <Phone className="w-4 h-4" />
                (562) 298-9551
              </a>
              <span className="hidden sm:inline">•</span>
              <a href="mailto:fastmecanic01@gmail.com" className="hover:text-primary transition-colors">
                fastmecanic01@gmail.com
              </a>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {t('footerText')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ============ BOOKING PAGE ============

const BookingPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    oil_type: 'synthetic',
    appointment_date: '',
    appointment_time: '',
    payment_method: 'cash',
    mechanic_buys_oil: false,
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const oilTypes = [
    { value: 'conventional', label: t('conventional') },
    { value: 'synthetic', label: t('synthetic') },
    { value: 'semi-synthetic', label: t('semiSynthetic') },
    { value: 'high-mileage', label: t('highMileage') }
  ];

  const timeSlots = [
    { value: '08:00', label: '8:00 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' }
  ];

  const paymentMethods = [
    { value: 'cash', label: t('cashOption') },
    { value: 'zelle', label: 'Zelle' },
    { value: 'cashapp', label: 'Cash App' }
  ];

  const years = Array.from({ length: 35 }, (_, i) => ({
    value: new Date().getFullYear() - i,
    label: (new Date().getFullYear() - i).toString()
  }));

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.customer_name.trim()) newErrors.customer_name = t('nameRequired');
      if (!formData.phone.trim()) newErrors.phone = t('phoneRequired');
      if (!formData.address.trim()) newErrors.address = t('addressRequired');
      if (!formData.city.trim()) newErrors.city = t('cityRequired');
      if (!formData.state.trim()) newErrors.state = t('stateRequired');
      if (!formData.zip_code.trim()) newErrors.zip_code = t('zipRequired');
    }
    
    if (currentStep === 2) {
      if (!formData.make.trim()) newErrors.make = t('makeRequired');
      if (!formData.model.trim()) newErrors.model = t('modelRequired');
    }
    
    if (currentStep === 3) {
      if (!formData.appointment_date) newErrors.appointment_date = t('dateRequired');
      if (!formData.appointment_time) newErrors.appointment_time = t('timeRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => setStep(s => s - 1);

  const submitBooking = async () => {
    if (!validateStep(step)) return;
    
    setLoading(true);
    try {
      const payload = {
        customer_name: formData.customer_name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        vehicle: {
          make: formData.make,
          model: formData.model,
          year: parseInt(formData.year)
        },
        oil_type: formData.oil_type,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        payment_method: formData.payment_method,
        mechanic_buys_oil: formData.mechanic_buys_oil,
        notes: formData.notes || null
      };

      const response = await axios.post(`${API}/appointments`, payload);
      toast.success(t('appointmentSuccess'));
      navigate(`/confirmation/${response.data.id}`);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(t('appointmentError'));
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  const stepLabels = [t('stepInfo'), t('stepVehicle'), t('stepAppointment'), t('stepConfirm')];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:text-primary transition-colors"
            data-testid="back-to-home"
          >
            <Wrench className="w-5 h-5 text-primary" />
            <span className="font-display text-lg font-bold uppercase tracking-tight">Fast Mechanic</span>
          </button>
          <LanguageSelector />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${step > i + 1 ? 'bg-success text-success-foreground' : 
                    step === i + 1 ? 'bg-primary text-primary-foreground' : 
                    'bg-muted text-muted-foreground'}`}
                >
                  {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:inline
                  ${step === i + 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {label}
                </span>
                {i < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground mx-2 hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>

        <Card className="p-6 md:p-8">
          {/* Step 1: Customer Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-2">
                  {t('yourInfo')}
                </h2>
                <p className="text-muted-foreground">{t('yourInfoDesc')}</p>
              </div>

              <div className="grid gap-4">
                <Input 
                  label={t('fullName')}
                  placeholder={t('fullNamePlaceholder')}
                  value={formData.customer_name}
                  onChange={e => updateField('customer_name', e.target.value)}
                  error={errors.customer_name}
                  data-testid="input-customer-name"
                />
                <Input 
                  label={t('phone')}
                  placeholder={t('phonePlaceholder')}
                  value={formData.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  error={errors.phone}
                  data-testid="input-phone"
                />
                <Input 
                  label={t('address')}
                  placeholder={t('addressPlaceholder')}
                  value={formData.address}
                  onChange={e => updateField('address', e.target.value)}
                  error={errors.address}
                  data-testid="input-address"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Input 
                    label={t('city')}
                    placeholder={t('cityPlaceholder')}
                    value={formData.city}
                    onChange={e => updateField('city', e.target.value)}
                    error={errors.city}
                    data-testid="input-city"
                  />
                  <Input 
                    label={t('state')}
                    placeholder={t('statePlaceholder')}
                    value={formData.state}
                    onChange={e => updateField('state', e.target.value)}
                    error={errors.state}
                    data-testid="input-state"
                  />
                  <Input 
                    label={t('zipCode')}
                    placeholder={t('zipPlaceholder')}
                    value={formData.zip_code}
                    onChange={e => updateField('zip_code', e.target.value)}
                    error={errors.zip_code}
                    className="col-span-2 md:col-span-1"
                    data-testid="input-zip"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle Info */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-2">
                  {t('yourVehicle')}
                </h2>
                <p className="text-muted-foreground">{t('yourVehicleDesc')}</p>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label={t('make')}
                    placeholder={t('makePlaceholder')}
                    value={formData.make}
                    onChange={e => updateField('make', e.target.value)}
                    error={errors.make}
                    data-testid="input-make"
                  />
                  <Input 
                    label={t('model')}
                    placeholder={t('modelPlaceholder')}
                    value={formData.model}
                    onChange={e => updateField('model', e.target.value)}
                    error={errors.model}
                    data-testid="input-model"
                  />
                </div>
                <Select 
                  label={t('year')}
                  options={years}
                  value={formData.year}
                  onChange={e => updateField('year', e.target.value)}
                  data-testid="select-year"
                />
                <Select 
                  label={t('oilType')}
                  options={oilTypes}
                  value={formData.oil_type}
                  onChange={e => updateField('oil_type', e.target.value)}
                  data-testid="select-oil"
                />

                <div className="border border-border rounded-md p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={formData.mechanic_buys_oil}
                      onChange={e => updateField('mechanic_buys_oil', e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-input accent-primary"
                      data-testid="checkbox-mechanic-buys"
                    />
                    <div>
                      <span className="font-medium">{t('mechanicBuysOil')}</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('mechanicBuysOilNote')}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Appointment */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-2">
                  {t('scheduleYourAppointment')}
                </h2>
                <p className="text-muted-foreground">{t('chooseWhenConvenient')}</p>
              </div>

              <div className="grid gap-4">
                <Input 
                  type="date"
                  label={t('date')}
                  min={minDate}
                  value={formData.appointment_date}
                  onChange={e => updateField('appointment_date', e.target.value)}
                  error={errors.appointment_date}
                  data-testid="input-date"
                />
                <Select 
                  label={t('time')}
                  options={[{ value: '', label: t('selectTime') }, ...timeSlots]}
                  value={formData.appointment_time}
                  onChange={e => updateField('appointment_time', e.target.value)}
                  error={errors.appointment_time}
                  data-testid="select-time"
                />
                <Select 
                  label={t('paymentMethod')}
                  options={paymentMethods}
                  value={formData.payment_method}
                  onChange={e => updateField('payment_method', e.target.value)}
                  data-testid="select-payment"
                />
                <Textarea 
                  label={t('additionalNotes')}
                  placeholder={t('notesPlaceholder')}
                  value={formData.notes}
                  onChange={e => updateField('notes', e.target.value)}
                  data-testid="input-notes"
                />
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-2">
                  {t('confirmYourAppointment')}
                </h2>
                <p className="text-muted-foreground">{t('reviewEverything')}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-muted/50 rounded-md p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{formData.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{formData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm">{formData.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.city}, {formData.state} {formData.zip_code}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-md p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Car className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {formData.year} {formData.make} {formData.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {oilTypes.find(o => o.value === formData.oil_type)?.label}
                      </p>
                    </div>
                  </div>
                  {formData.mechanic_buys_oil && (
                    <div className="flex items-center gap-2 text-sm text-warning">
                      <AlertCircle className="w-4 h-4" />
                      <span>{t('mechanicBuysOilWarning')}</span>
                    </div>
                  )}
                </div>

                <div className="bg-muted/50 rounded-md p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {new Date(formData.appointment_date + 'T12:00:00').toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {timeSlots.find(t => t.value === formData.appointment_time)?.label}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                    <p className="font-medium">
                      {paymentMethods.find(p => p.value === formData.payment_method)?.label}
                    </p>
                  </div>
                </div>

                {formData.notes && (
                  <div className="bg-muted/50 rounded-md p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm mb-1">{t('notes')}</p>
                        <p className="text-sm text-muted-foreground">{formData.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep} data-testid="prev-step-btn">
                <ChevronLeft className="w-4 h-4 mr-2" />
                {t('previous')}
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => navigate('/')} data-testid="cancel-btn">
                {t('cancel')}
              </Button>
            )}

            {step < 4 ? (
              <Button onClick={nextStep} data-testid="next-step-btn">
                {t('next')}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={submitBooking} disabled={loading} data-testid="submit-booking-btn">
                {loading ? t('sending') : t('confirmAppointment')}
                <CheckCircle2 className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

// ============ CONFIRMATION PAGE ============

const ConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`${API}/appointments/${id}`);
        setAppointment(response.data);
      } catch (error) {
        console.error('Error fetching appointment:', error);
        toast.error(t('appointmentNotFound'));
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{t('appointmentNotFound')}</p>
        <Button onClick={() => navigate('/')}>{t('backToHome')}</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight mb-2">
          {t('appointmentScheduled')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t('willContact')}
        </p>

        <div className="bg-muted/50 rounded-md p-4 text-left space-y-2 mb-8">
          <p className="text-sm">
            <span className="text-muted-foreground">{t('dateLabel')}</span>{' '}
            <span className="font-medium">
              {new Date(appointment.appointment_date + 'T12:00:00').toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">{t('timeLabel')}</span>{' '}
            <span className="font-medium">{appointment.appointment_time}</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">{t('vehicleLabel')}</span>{' '}
            <span className="font-medium">
              {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">{t('confirmationLabel')}</span>{' '}
            <span className="font-mono text-xs">{appointment.id.slice(0, 8)}</span>
          </p>
        </div>

        <Button onClick={() => navigate('/')} className="w-full" data-testid="back-home-btn">
          {t('backToHome')}
        </Button>
      </Card>
    </div>
  );
};

// ============ ADMIN LOGIN ============

const AdminLogin = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      navigate('/admin/dashboard');
      return;
    }

    const checkAdmin = async () => {
      try {
        const response = await axios.get(`${API}/admin/check`);
        setIsSetup(!response.data.exists);
      } catch (error) {
        console.error('Error checking admin:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isSetup) {
        await axios.post(`${API}/admin/setup`, formData);
        toast.success(t('accountCreated'));
        setIsSetup(false);
        setFormData({ ...formData, name: '' });
      } else {
        const response = await axios.post(`${API}/admin/login`, {
          username: formData.username,
          password: formData.password
        });
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_name', response.data.admin.name);
        toast.success(t('welcome'));
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.detail || t('authError'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen dark bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="flex justify-end mb-4">
          <LanguageSelector variant="dark" />
        </div>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wrench className="w-8 h-8 text-primary" />
            <span className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
              Fast Mechanic
            </span>
          </div>
          <h1 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
            {isSetup ? t('createAdminAccount') : t('adminPanel')}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSetup && (
            <Input 
              label={t('yourName')}
              placeholder={t('yourNamePlaceholder')}
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              data-testid="input-admin-name"
            />
          )}
          <Input 
            label={t('username')}
            placeholder={t('usernamePlaceholder')}
            value={formData.username}
            onChange={e => setFormData({ ...formData, username: e.target.value })}
            required
            data-testid="input-admin-username"
          />
          <Input 
            type="password"
            label={t('password')}
            placeholder="••••••••"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            required
            data-testid="input-admin-password"
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={submitting}
            data-testid="admin-submit-btn"
          >
            {submitting ? t('loading') : isSetup ? t('createAccount') : t('login')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t('backToSite')}
          </button>
        </div>
      </Card>
    </div>
  );
};

// ============ ADMIN DASHBOARD ============

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const adminName = localStorage.getItem('admin_name') || 'Admin';

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
  });

  const fetchData = async () => {
    try {
      const [appointmentsRes, statsRes] = await Promise.all([
        axios.get(`${API}/admin/appointments`, getAuthHeaders()),
        axios.get(`${API}/admin/stats`, getAuthHeaders())
      ]);
      setAppointments(appointmentsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_name');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [navigate]);

  const updateAppointmentStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/admin/appointments/${id}`, { status }, getAuthHeaders());
      const statusMsg = status === 'confirmed' ? t('statusConfirmed') : 
                       status === 'completed' ? t('statusCompleted') : t('statusCancelled');
      toast.success(`${t('statusPending')} ${statusMsg}`);
      fetchData();
      setSelectedAppointment(null);
    } catch (error) {
      toast.error(t('updateError'));
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm(t('deleteConfirm'))) return;
    try {
      await axios.delete(`${API}/admin/appointments/${id}`, getAuthHeaders());
      toast.success(t('deleteSuccess'));
      fetchData();
      setSelectedAppointment(null);
    } catch (error) {
      toast.error(t('deleteError'));
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_name');
    navigate('/admin');
  };

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(a => a.status === filter);

  const statusColors = {
    pending: 'pending',
    confirmed: 'confirmed',
    completed: 'completed',
    cancelled: 'cancelled'
  };

  const statusLabels = {
    pending: t('statusPending'),
    confirmed: t('statusConfirmedLabel'),
    completed: t('statusCompletedLabel'),
    cancelled: t('statusCancelledLabel')
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen dark bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-4 hidden md:block">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Wrench className="w-6 h-6 text-primary" />
          <span className="font-display text-lg font-bold uppercase tracking-tight">Fast Mechanic</span>
        </div>

        <nav className="space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">{t('dashboard')}</span>
          </button>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="mb-4">
            <LanguageSelector variant="dark" />
          </div>
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium truncate">{adminName}</span>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            data-testid="logout-btn"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-8">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-primary" />
            <span className="font-display text-lg font-bold uppercase tracking-tight">Fast Mechanic</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector variant="dark" />
            <button onClick={logout} className="p-2 hover:bg-muted rounded-md">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: t('today'), value: stats?.today || 0, icon: Calendar },
            { label: t('pending'), value: stats?.pending || 0, icon: Clock },
            { label: t('confirmed'), value: stats?.confirmed || 0, icon: CheckCircle2 },
            { label: t('completed'), value: stats?.completed || 0, icon: Check }
          ].map((stat, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="font-display text-3xl font-bold">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { value: 'all', label: t('all') },
            { value: 'pending', label: t('pending') },
            { value: 'confirmed', label: t('confirmed') },
            { value: 'completed', label: t('completed') },
            { value: 'cancelled', label: t('cancelled') }
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors
                ${filter === f.value 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:text-foreground'}`}
              data-testid={`filter-${f.value}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">{t('noAppointments')}</p>
            </Card>
          ) : (
            filteredAppointments.map(apt => (
              <Card 
                key={apt.id} 
                className={`p-4 cursor-pointer hover:border-primary transition-colors ${selectedAppointment?.id === apt.id ? 'border-primary' : ''}`}
                onClick={() => setSelectedAppointment(selectedAppointment?.id === apt.id ? null : apt)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium truncate">{apt.customer_name}</h3>
                      <Badge variant={statusColors[apt.status]}>{statusLabels[apt.status]}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(apt.appointment_date + 'T12:00:00').toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {apt.appointment_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Car className="w-4 h-4" />
                        {apt.vehicle.year} {apt.vehicle.make} {apt.vehicle.model}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${selectedAppointment?.id === apt.id ? 'rotate-90' : ''}`} />
                </div>

                {/* Expanded Details */}
                {selectedAppointment?.id === apt.id && (
                  <div className="mt-4 pt-4 border-t border-border animate-fade-in" onClick={e => e.stopPropagation()}>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="text-muted-foreground">{t('phoneLabel')}</span>{' '}
                          <a href={`tel:${apt.phone}`} className="text-primary hover:underline">{apt.phone}</a>
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">{t('addressLabel')}</span>{' '}
                          {apt.address}, {apt.city}, {apt.state} {apt.zip_code}
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">{t('oilLabel')}</span>{' '}
                          {apt.oil_type}
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">{t('paymentLabel')}</span>{' '}
                          {apt.payment_method === 'cash' ? t('effectiveCash') : apt.payment_method === 'zelle' ? 'Zelle' : 'Cash App'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        {apt.mechanic_buys_oil && (
                          <p className="text-sm text-warning flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {t('mechanicBuysOilWarning')}
                          </p>
                        )}
                        {apt.notes && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">{t('notes')}</span>
                            <p className="mt-1 p-2 bg-muted rounded text-foreground">{apt.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {apt.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                            data-testid={`confirm-btn-${apt.id}`}
                          >
                            <Check className="w-4 h-4 mr-1" /> {t('confirm')}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                            data-testid={`cancel-btn-${apt.id}`}
                          >
                            <X className="w-4 h-4 mr-1" /> {t('cancelAppointment')}
                          </Button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <Button 
                          size="sm"
                          onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                          data-testid={`complete-btn-${apt.id}`}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" /> {t('markCompleted')}
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => deleteAppointment(apt.id)}
                        data-testid={`delete-btn-${apt.id}`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> {t('delete')}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

// ============ PROTECTED ROUTE ============

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

// ============ MAIN APP ============

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <Toaster position="top-center" richColors />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/confirmation/:id" element={<ConfirmationPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
