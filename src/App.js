import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { 
  Wrench, Droplet, Car, Calendar, MapPin, Phone, Clock, 
  ChevronRight, ChevronLeft, CheckCircle2, Menu, X,
  LayoutDashboard, LogOut, User, DollarSign, FileText,
  AlertCircle, Check, Trash2, Globe, Download, Share,
  Settings, Save, Plus, Mail, Briefcase, MapPinned, CreditCard,
  Timer, Edit3, Power, Zap
} from "lucide-react";
import { LanguageProvider, useLanguage } from "./LanguageContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ============ COMPONENTS ============

const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-wide transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    fire: "bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-500 hover:to-red-500 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
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
      className={`w-full h-12 px-4 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${error ? 'border-destructive' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
);

const Select = ({ label, error, options, className = "", ...props }) => (
  <div className="space-y-2">
    {label && <label className="text-sm font-medium text-foreground">{label}</label>}
    <select 
      className={`w-full h-12 px-4 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${error ? 'border-destructive' : ''} ${className}`}
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
      className={`w-full min-h-[120px] p-4 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none ${error ? 'border-destructive' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
);

const Card = ({ children, className = "", glow = false }) => (
  <div className={`bg-card border border-border rounded-lg transition-all duration-300 ${glow ? 'hover:border-primary hover:shadow-lg hover:shadow-primary/10' : ''} ${className}`}>
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div className="bg-background border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            {title}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-muted text-muted-foreground",
    pending: "bg-warning/20 text-warning",
    confirmed: "bg-secondary/20 text-secondary",
    completed: "bg-success/20 text-success",
    cancelled: "bg-destructive/20 text-destructive",
    fire: "bg-gradient-to-r from-orange-500 to-red-500 text-white"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Toggle Switch Component
const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-primary' : 'bg-muted'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
    </div>
    {label && <span className="text-sm font-medium">{label}</span>}
  </label>
);

// ============ LANGUAGE SELECTOR ============
const LanguageSelector = ({ variant = "default" }) => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <button
      onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
        variant === 'dark' ? 'hover:bg-muted text-foreground' : 'hover:bg-accent text-foreground'
      }`}
      data-testid="language-selector"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">{language === 'es' ? 'ES' : 'EN'}</span>
    </button>
  );
};

// ============ LANDING PAGE ============
const LandingPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API}/settings/public`);
        setSettings(res.data);
      } catch (err) {
        console.log('Using defaults');
      }
    };
    fetchSettings();
  }, []);

  const profile = settings?.profile || {
    name: "Jose Montufar",
    phone: "(562) 298-9551",
    email: "fastmecanic01@gmail.com",
    bio: "Mecánico profesional con servicio a domicilio"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold uppercase tracking-tight">Fast Mechanic</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSelector />
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} data-testid="admin-link">
              {t('admin')}
            </Button>
            <Button size="sm" onClick={() => navigate('/book')} data-testid="book-now-header-btn">
              {t('bookNow')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1713019023680-e531ce0e01d3?w=1920&q=80)` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <p className="text-primary font-medium uppercase tracking-wider mb-4 animate-fade-up">
              {t('homeService')}
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tighter text-foreground mb-6 animate-fade-up animate-delay-100">
              {t('heroTitle1')}<br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">{t('heroTitle2')}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up animate-delay-200">
              {t('heroDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animate-delay-300">
              <Button variant="fire" size="lg" onClick={() => navigate('/book')} data-testid="book-now-hero-btn">
                <Zap className="w-5 h-5 mr-2" />
                {t('scheduleAppointment')}
              </Button>
              <Button variant="outline" size="lg" onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })} data-testid="learn-more-btn">
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
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight">{t('whatWeOffer')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Droplet, title: t('oilChange'), desc: t('oilChangeDesc') },
              { icon: Car, title: t('doorToDoor'), desc: t('doorToDoorDesc') },
              { icon: Wrench, title: t('generalReview'), desc: t('generalReviewDesc') }
            ].map((service, i) => (
              <Card key={i} glow className="p-6 md:p-8 group">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight mb-2">{service.title}</h3>
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
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight">{t('howItWorks')}</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: t('step1'), desc: t('step1Desc') },
              { step: "02", title: t('step2'), desc: t('step2Desc') },
              { step: "03", title: t('step3'), desc: t('step3Desc') },
              { step: "04", title: t('step4'), desc: t('step4Desc') }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="font-display text-6xl font-bold bg-gradient-to-br from-orange-500/20 to-red-500/20 bg-clip-text text-transparent mb-2 group-hover:from-orange-500 group-hover:to-red-500 transition-all">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="fire" size="lg" onClick={() => navigate('/book')} data-testid="book-now-cta-btn">
              <Zap className="w-5 h-5 mr-2" />
              {t('scheduleMyAppointment')}
            </Button>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-orange-400 font-medium uppercase tracking-wider mb-4">{t('paymentMethods')}</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight">{t('payAsYouPrefer')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { name: t('cash'), desc: t('cashDesc') },
              { name: t('zelle'), desc: t('zelleDesc') },
              { name: t('cashApp'), desc: t('cashAppDesc') }
            ].map((method, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-orange-500/50 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-bold uppercase tracking-tight mb-1">{method.name}</h3>
                <p className="text-sm text-white/60">{method.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-white/50 text-sm">{t('depositNote')}</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-medium uppercase tracking-wider mb-4">{language === 'es' ? 'Contacto' : 'Contact'}</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight">{language === 'es' ? '¿Preguntas? Llámame' : 'Questions? Call Me'}</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <a href={`tel:${profile.phone}`} className="flex items-center gap-3 bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all group" data-testid="contact-phone">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">{language === 'es' ? 'Teléfono' : 'Phone'}</p>
                <p className="font-display text-xl font-bold">{profile.phone}</p>
              </div>
            </a>

            <a href={`mailto:${profile.email}`} className="flex items-center gap-3 bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all group" data-testid="contact-email">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="font-display text-lg font-bold">{profile.email}</p>
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
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-lg font-bold uppercase tracking-tight">Fast Mechanic</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
              <a href={`tel:${profile.phone}`} className="hover:text-primary transition-colors flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {profile.phone}
              </a>
              <span className="hidden sm:inline">•</span>
              <a href={`mailto:${profile.email}`} className="hover:text-primary transition-colors">{profile.email}</a>
            </div>
            
            <p className="text-sm text-muted-foreground">{t('footerText')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ============ BOOKING PAGE (Simplified for length) ============
const BookingPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '', phone: '', address: '', city: '', state: '', zip_code: '',
    make: '', model: '', year: new Date().getFullYear(), oil_type: 'synthetic',
    appointment_date: '', appointment_time: '', payment_method: 'cash',
    mechanic_buys_oil: false, notes: ''
  });
  const [errors, setErrors] = useState({});

  const oilTypes = [
    { value: 'conventional', label: t('conventional') },
    { value: 'synthetic', label: t('synthetic') },
    { value: 'semi-synthetic', label: t('semiSynthetic') },
    { value: 'high-mileage', label: t('highMileage') }
  ];

  const timeSlots = [
    { value: '08:00', label: '8:00 AM' }, { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' }, { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' }, { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' }, { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' }, { value: '17:00', label: '5:00 PM' }
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
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
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

  const nextStep = () => { if (validateStep(step)) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  const submitBooking = async () => {
    if (!validateStep(step)) return;
    setLoading(true);
    try {
      const payload = {
        customer_name: formData.customer_name, phone: formData.phone,
        address: formData.address, city: formData.city, state: formData.state, zip_code: formData.zip_code,
        vehicle: { make: formData.make, model: formData.model, year: parseInt(formData.year) },
        oil_type: formData.oil_type, appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time, payment_method: formData.payment_method,
        mechanic_buys_oil: formData.mechanic_buys_oil, notes: formData.notes || null
      };
      const response = await axios.post(`${API}/appointments`, payload);
      toast.success(t('appointmentSuccess'));
      navigate(`/confirmation/${response.data.id}`);
    } catch (error) {
      toast.error(t('appointmentError'));
    } finally { setLoading(false); }
  };

  const minDate = new Date().toISOString().split('T')[0];
  const stepLabels = [t('stepInfo'), t('stepVehicle'), t('stepAppointment'), t('stepConfirm')];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:text-primary transition-colors" data-testid="back-to-home">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-lg font-bold uppercase tracking-tight">Fast Mechanic</span>
          </button>
          <LanguageSelector />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${step > i + 1 ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' : 
                    step === i + 1 ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30' : 
                    'bg-muted text-muted-foreground'}`}>
                  {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:inline ${step === i + 1 ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
                {i < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground mx-2 hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>

        <Card className="p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-2">{t('yourInfo')}</h2>
                <p className="text-muted-foreground">{t('yourInfoDesc')}</p>
              </div>
              <div className="grid gap-4">
                <Input label={t('fullName')} placeholder={t('fullNamePlaceholder')} value={formData.customer_name} onChange={e => updateField('customer_name', e.target.value)} error={errors.customer_name} data-testid="input-customer-name" />
                <Input label={t('phone')} placeholder={t('phonePlaceholder')} value={formData.phone} onChange={e => updateField('phone', e.target.value)} error={errors.phone} data-testid="input-phone" />
                <Input label={t('address')} placeholder={t('addressPlaceholder')} value={formData.address} onChange={e => updateField('address', e.target.value)} error={errors.address} data-testid="input-address" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Input label={t('city')} placeholder={t('cityPlaceholder')} value={formData.city} onChange={e => updateField('city', e.target.value)} error={errors.city} data-testid="input-city" />
                  <Input label={t('state')} placeholder={t('statePlaceholder')} value={formData.state} onChange={e => updateField('state', e.target.value)} error={errors.state} data-testid="input-state" />
                  <Input label={t('zipCode')} placeholder={t('zipPlaceholder')} value={formData.zip_code} onChange={e => updateField('zip_code', e.target.value)} error={errors.zip_code} className="col-span-2 md:col-span-1" data-testid="input-zip" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-2">{t('yourVehicle')}</h2>
                <p className="text-muted-foreground">{t('yourVehicleDesc')}</p>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label={t('make')} placeholder={t('makePlaceholder')} value={formData.make} onChange={e => updateField('make', e.target.value)} error={errors.make} data-testid="input-make" />
                  <Input label={t('model')} placeholder={t('modelPlaceholder')} value={formData.model} onChange={e => updateField('model', e.target.value)} error={errors.model} data-testid="input-model" />
                </div>
                <Select label={t('year')} options={years} value={formData.year} onChange={e => updateField('year', e.target.value)} data-testid="select-year" />
                <Select label={t('oilType')} options={oilTypes} value={formData.oil_type} onChange={e => updateField('oil_type', e.target.value)} data-testid="select-oil" />
                <div className="border border-border rounded-md p-4 hover:border-primary transition-colors">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.mechanic_buys_oil} onChange={e => updateField('mechanic_buys_oil', e.target.checked)} className="mt-1 w-5 h-5 rounded border-input accent-primary" data-testid="checkbox-mechanic-buys" />
                    <div>
                      <span className="font-medium">{t('mechanicBuysOil')}</span>
                      <p className="text-sm text-muted-foreground mt-1">{t('mechanicBuysOilNote')}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-2">{t('scheduleYourAppointment')}</h2>
                <p className="text-muted-foreground">{t('chooseWhenConvenient')}</p>
              </div>
              <div className="grid gap-4">
                <Input type="date" label={t('date')} min={minDate} value={formData.appointment_date} onChange={e => updateField('appointment_date', e.target.value)} error={errors.appointment_date} data-testid="input-date" />
                <Select label={t('time')} options={[{ value: '', label: t('selectTime') }, ...timeSlots]} value={formData.appointment_time} onChange={e => updateField('appointment_time', e.target.value)} error={errors.appointment_time} data-testid="select-time" />
                <Select label={t('paymentMethod')} options={paymentMethods} value={formData.payment_method} onChange={e => updateField('payment_method', e.target.value)} data-testid="select-payment" />
                <Textarea label={t('additionalNotes')} placeholder={t('notesPlaceholder')} value={formData.notes} onChange={e => updateField('notes', e.target.value)} data-testid="input-notes" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-2">{t('confirmYourAppointment')}</h2>
                <p className="text-muted-foreground">{t('reviewEverything')}</p>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{formData.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{formData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm">{formData.address}</p>
                      <p className="text-sm text-muted-foreground">{formData.city}, {formData.state} {formData.zip_code}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Car className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{formData.year} {formData.make} {formData.model}</p>
                      <p className="text-sm text-muted-foreground">{oilTypes.find(o => o.value === formData.oil_type)?.label}</p>
                    </div>
                  </div>
                  {formData.mechanic_buys_oil && (
                    <div className="flex items-center gap-2 text-sm text-orange-500">
                      <AlertCircle className="w-4 h-4" />
                      <span>{t('mechanicBuysOilWarning')}</span>
                    </div>
                  )}
                </div>
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{new Date(formData.appointment_date + 'T12:00:00').toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p className="text-sm text-muted-foreground">{timeSlots.find(t => t.value === formData.appointment_time)?.label}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-orange-500 mt-0.5" />
                    <p className="font-medium">{paymentMethods.find(p => p.value === formData.payment_method)?.label}</p>
                  </div>
                </div>
                {formData.notes && (
                  <div className="bg-muted/50 rounded-xl p-4">
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

          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep} data-testid="prev-step-btn">
                <ChevronLeft className="w-4 h-4 mr-2" />{t('previous')}
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => navigate('/')} data-testid="cancel-btn">{t('cancel')}</Button>
            )}
            {step < 4 ? (
              <Button variant="fire" onClick={nextStep} data-testid="next-step-btn">
                {t('next')}<ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button variant="fire" onClick={submitBooking} disabled={loading} data-testid="submit-booking-btn">
                {loading ? t('sending') : t('confirmAppointment')}<CheckCircle2 className="w-4 h-4 ml-2" />
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
        toast.error(t('appointmentNotFound'));
      } finally { setLoading(false); }
    };
    fetchAppointment();
  }, [id, t]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  if (!appointment) return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><p className="text-muted-foreground">{t('appointmentNotFound')}</p><Button onClick={() => navigate('/')}>{t('backToHome')}</Button></div>;

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight mb-2">{t('appointmentScheduled')}</h1>
        <p className="text-muted-foreground mb-8">{t('willContact')}</p>
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 text-left space-y-2 mb-8">
          <p className="text-sm"><span className="text-muted-foreground">{t('dateLabel')}</span> <span className="font-medium">{new Date(appointment.appointment_date + 'T12:00:00').toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></p>
          <p className="text-sm"><span className="text-muted-foreground">{t('timeLabel')}</span> <span className="font-medium">{appointment.appointment_time}</span></p>
          <p className="text-sm"><span className="text-muted-foreground">{t('vehicleLabel')}</span> <span className="font-medium">{appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}</span></p>
          <p className="text-sm"><span className="text-muted-foreground">{t('confirmationLabel')}</span> <span className="font-mono text-xs">{appointment.id.slice(0, 8)}</span></p>
        </div>
        <Button variant="fire" onClick={() => navigate('/')} className="w-full" data-testid="back-home-btn">{t('backToHome')}</Button>
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
  const [formData, setFormData] = useState({ username: '', password: '', name: '' });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) { navigate('/admin/dashboard'); return; }
    const checkAdmin = async () => {
      try {
        const response = await axios.get(`${API}/admin/check`);
        setIsSetup(!response.data.exists);
      } catch (error) { console.error('Error checking admin:', error); }
      finally { setLoading(false); }
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
        const response = await axios.post(`${API}/admin/login`, { username: formData.username, password: formData.password });
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_name', response.data.admin.name);
        toast.success(t('welcome'));
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || t('authError'));
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center dark bg-background"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen dark bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 border-orange-500/20">
        <div className="flex justify-end mb-4"><LanguageSelector variant="dark" /></div>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Wrench className="w-7 h-7 text-white" />
            </div>
          </div>
          <span className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">Fast Mechanic</span>
          <h1 className="font-display text-lg font-bold uppercase tracking-tight text-muted-foreground mt-2">{isSetup ? t('createAdminAccount') : t('adminPanel')}</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSetup && <Input label={t('yourName')} placeholder={t('yourNamePlaceholder')} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required data-testid="input-admin-name" />}
          <Input label={t('username')} placeholder={t('usernamePlaceholder')} value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required data-testid="input-admin-username" />
          <Input type="password" label={t('password')} placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required data-testid="input-admin-password" />
          <Button type="submit" variant="fire" className="w-full" disabled={submitting} data-testid="admin-submit-btn">{submitting ? t('loading') : isSetup ? t('createAccount') : t('login')}</Button>
        </form>
        <div className="mt-6 text-center"><button onClick={() => navigate('/')} className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('backToSite')}</button></div>
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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);

  const adminName = localStorage.getItem('admin_name') || 'Admin';
  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } });

  const fetchData = async () => {
    try {
      const [appointmentsRes, statsRes] = await Promise.all([
        axios.get(`${API}/admin/appointments`, getAuthHeaders()),
        axios.get(`${API}/admin/stats`, getAuthHeaders())
      ]);
      setAppointments(appointmentsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_name');
        navigate('/admin');
      }
    } finally { setLoading(false); }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { navigate('/admin'); return; }
    fetchData();
  }, [navigate]);

  const updateAppointmentStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/admin/appointments/${id}`, { status }, getAuthHeaders());
      toast.success(`Cita ${status === 'confirmed' ? 'confirmada' : status === 'completed' ? 'completada' : 'cancelada'}`);
      fetchData();
      setSelectedAppointment(null);
    } catch (error) { toast.error(t('updateError')); }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm(t('deleteConfirm'))) return;
    try {
      await axios.delete(`${API}/admin/appointments/${id}`, getAuthHeaders());
      toast.success(t('deleteSuccess'));
      fetchData();
      setSelectedAppointment(null);
    } catch (error) { toast.error(t('deleteError')); }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_name');
    navigate('/admin');
  };

  const openSettings = async () => {
    try {
      const res = await axios.get(`${API}/admin/settings`, getAuthHeaders());
      setSettings(res.data);
      setShowSettingsModal(true);
    } catch (error) {
      toast.error(language === 'es' ? 'Error al cargar ajustes' : 'Error loading settings');
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      await axios.put(`${API}/admin/settings/profile`, settings.profile, getAuthHeaders());
      await axios.put(`${API}/admin/settings/services`, settings.services, getAuthHeaders());
      toast.success(language === 'es' ? '¡Ajustes guardados!' : 'Settings saved!');
      setShowSettingsModal(false);
    } catch (error) {
      toast.error(language === 'es' ? 'Error al guardar' : 'Error saving');
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredAppointments = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);
  const statusColors = { pending: 'pending', confirmed: 'confirmed', completed: 'completed', cancelled: 'cancelled' };
  const statusLabels = { pending: t('statusPending'), confirmed: t('statusConfirmedLabel'), completed: t('statusCompletedLabel'), cancelled: t('statusCancelledLabel') };

  if (loading) return <div className="min-h-screen flex items-center justify-center dark bg-background"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen dark bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-gray-900 to-black border-r border-orange-500/20 p-4 hidden md:block">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <span className="font-display text-lg font-bold uppercase tracking-tight">Fast Mechanic</span>
        </div>

        <nav className="space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">{t('dashboard')}</span>
          </button>
          <button onClick={openSettings} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all hover:bg-white/5 text-muted-foreground hover:text-white" data-testid="settings-btn-desktop">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Ajustes</span>
          </button>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="mb-4"><LanguageSelector variant="dark" /></div>
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
              <User className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-sm font-medium truncate">{adminName}</span>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all" data-testid="logout-btn">
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
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-lg font-bold uppercase tracking-tight">Fast Mechanic</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={openSettings} className="p-2 hover:bg-white/10 rounded-xl transition-colors" data-testid="settings-btn-mobile">
              <Settings className="w-5 h-5" />
            </button>
            <LanguageSelector variant="dark" />
            <button onClick={logout} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Dashboard Content */}
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: t('today'), value: stats?.today || 0, icon: Calendar, color: 'from-blue-500 to-blue-600' },
                { label: t('pending'), value: stats?.pending || 0, icon: Clock, color: 'from-yellow-500 to-orange-500' },
                { label: t('confirmed'), value: stats?.confirmed || 0, icon: CheckCircle2, color: 'from-green-500 to-green-600' },
                { label: t('completed'), value: stats?.completed || 0, icon: Check, color: 'from-purple-500 to-purple-600' }
              ].map((stat, i) => (
                <Card key={i} className="p-4 border-orange-500/10 hover:border-orange-500/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
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
                <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filter === f.value ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30' : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'}`} data-testid={`filter-${f.value}`}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <Card className="p-8 text-center border-orange-500/10">
                  <p className="text-muted-foreground">{t('noAppointments')}</p>
                </Card>
              ) : (
                filteredAppointments.map(apt => (
                  <Card key={apt.id} glow className={`p-4 cursor-pointer ${selectedAppointment?.id === apt.id ? 'border-orange-500 shadow-lg shadow-orange-500/10' : 'border-orange-500/10'}`} onClick={() => setSelectedAppointment(selectedAppointment?.id === apt.id ? null : apt)}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium truncate">{apt.customer_name}</h3>
                          <Badge variant={statusColors[apt.status]}>{statusLabels[apt.status]}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-orange-500" />{new Date(apt.appointment_date + 'T12:00:00').toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric' })}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-orange-500" />{apt.appointment_time}</span>
                          <span className="flex items-center gap-1"><Car className="w-4 h-4 text-orange-500" />{apt.vehicle.year} {apt.vehicle.make} {apt.vehicle.model}</span>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${selectedAppointment?.id === apt.id ? 'rotate-90' : ''}`} />
                    </div>

                    {selectedAppointment?.id === apt.id && (
                      <div className="mt-4 pt-4 border-t border-border animate-fade-in" onClick={e => e.stopPropagation()}>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <p className="text-sm"><span className="text-muted-foreground">{t('phoneLabel')}</span> <a href={`tel:${apt.phone}`} className="text-orange-500 hover:underline">{apt.phone}</a></p>
                            <p className="text-sm"><span className="text-muted-foreground">{t('addressLabel')}</span> {apt.address}, {apt.city}, {apt.state} {apt.zip_code}</p>
                            <p className="text-sm"><span className="text-muted-foreground">{t('oilLabel')}</span> {apt.oil_type}</p>
                            <p className="text-sm"><span className="text-muted-foreground">{t('paymentLabel')}</span> {apt.payment_method === 'cash' ? t('effectiveCash') : apt.payment_method}</p>
                          </div>
                          <div className="space-y-2">
                            {apt.mechanic_buys_oil && <p className="text-sm text-orange-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{t('mechanicBuysOilWarning')}</p>}
                            {apt.notes && <div className="text-sm"><span className="text-muted-foreground">{t('notes')}</span><p className="mt-1 p-2 bg-muted rounded-lg text-foreground">{apt.notes}</p></div>}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {apt.status === 'pending' && (
                            <>
                              <Button size="sm" variant="fire" onClick={() => updateAppointmentStatus(apt.id, 'confirmed')} data-testid={`confirm-btn-${apt.id}`}><Check className="w-4 h-4 mr-1" /> {t('confirm')}</Button>
                              <Button size="sm" variant="destructive" onClick={() => updateAppointmentStatus(apt.id, 'cancelled')} data-testid={`cancel-btn-${apt.id}`}><X className="w-4 h-4 mr-1" /> {t('cancelAppointment')}</Button>
                            </>
                          )}
                          {apt.status === 'confirmed' && <Button size="sm" variant="fire" onClick={() => updateAppointmentStatus(apt.id, 'completed')} data-testid={`complete-btn-${apt.id}`}><CheckCircle2 className="w-4 h-4 mr-1" /> {t('markCompleted')}</Button>}
                          <Button size="sm" variant="ghost" onClick={() => deleteAppointment(apt.id)} data-testid={`delete-btn-${apt.id}`}><Trash2 className="w-4 h-4 mr-1" /> {t('delete')}</Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </>
      </main>

      {/* Settings Modal */}
      <Modal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)}
        title={language === 'es' ? 'Ajustes' : 'Settings'}
      >
        {settings ? (
          <div className="space-y-6">
            {/* Profile Section */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" />
                {language === 'es' ? 'Mi Perfil' : 'My Profile'}
              </h3>
              <div className="space-y-3">
                <Input 
                  label={language === 'es' ? 'Nombre' : 'Name'} 
                  value={settings.profile?.name || ''} 
                  onChange={e => setSettings({...settings, profile: {...settings.profile, name: e.target.value}})} 
                />
                <Input 
                  label={language === 'es' ? 'Teléfono' : 'Phone'} 
                  value={settings.profile?.phone || ''} 
                  onChange={e => setSettings({...settings, profile: {...settings.profile, phone: e.target.value}})} 
                />
                <Input 
                  label="Email" 
                  value={settings.profile?.email || ''} 
                  onChange={e => setSettings({...settings, profile: {...settings.profile, email: e.target.value}})} 
                />
              </div>
            </div>

            {/* Services Section */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-orange-500" />
                {language === 'es' ? 'Servicios' : 'Services'}
              </h3>
              <div className="space-y-4">
                {settings.services?.map((service, idx) => (
                  <div key={idx} className="p-4 bg-muted/50 rounded-lg space-y-3">
                    <Input 
                      label={language === 'es' ? 'Nombre (Español)' : 'Name (Spanish)'} 
                      value={service.name || ''} 
                      onChange={e => {
                        const newServices = [...settings.services];
                        newServices[idx].name = e.target.value;
                        setSettings({...settings, services: newServices});
                      }}
                    />
                    <Input 
                      label={language === 'es' ? 'Precio ($)' : 'Price ($)'} 
                      type="number" 
                      value={service.price || 0} 
                      onChange={e => {
                        const newServices = [...settings.services];
                        newServices[idx].price = parseFloat(e.target.value) || 0;
                        setSettings({...settings, services: newServices});
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <Button 
              onClick={saveSettings} 
              disabled={savingSettings}
              variant="fire"
              className="w-full"
              data-testid="settings-save-btn"
            >
              <Save className="w-4 h-4 mr-2" />
              {savingSettings ? (language === 'es' ? 'Guardando...' : 'Saving...') : (language === 'es' ? 'Guardar Cambios' : 'Save Changes')}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}
      </Modal>
    </div>
  );
};

// ============ ADMIN SETTINGS ============
const AdminSettings = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API}/admin/settings`, getAuthHeaders());
        setSettings(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/admin/settings/profile`, settings.profile, getAuthHeaders());
      toast.success(language === 'es' ? '¡Perfil guardado!' : 'Profile saved!');
    } catch (err) { toast.error('Error'); }
    finally { setSaving(false); }
  };

  const saveSchedule = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/admin/settings/schedule`, settings.schedule, getAuthHeaders());
      toast.success(language === 'es' ? '¡Horario guardado!' : 'Schedule saved!');
    } catch (err) { toast.error('Error'); }
    finally { setSaving(false); }
  };

  const saveServices = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/admin/settings/services`, settings.services, getAuthHeaders());
      toast.success(language === 'es' ? '¡Servicios guardados!' : 'Services saved!');
    } catch (err) { toast.error('Error'); }
    finally { setSaving(false); }
  };

  const savePaymentMethods = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/admin/settings/payment-methods`, settings.payment_methods, getAuthHeaders());
      toast.success(language === 'es' ? '¡Métodos de pago guardados!' : 'Payment methods saved!');
    } catch (err) { toast.error('Error'); }
    finally { setSaving(false); }
  };

  const saveZones = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/admin/settings/service-zones`, settings.service_zones, getAuthHeaders());
      toast.success(language === 'es' ? '¡Zonas guardadas!' : 'Zones saved!');
    } catch (err) { toast.error('Error'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center p-8"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  const sections = [
    { id: 'profile', icon: User, label: language === 'es' ? 'Mi Perfil' : 'My Profile' },
    { id: 'schedule', icon: Clock, label: language === 'es' ? 'Horarios' : 'Schedule' },
    { id: 'services', icon: Wrench, label: language === 'es' ? 'Servicios' : 'Services' },
    { id: 'payments', icon: CreditCard, label: language === 'es' ? 'Pagos' : 'Payments' },
    { id: 'zones', icon: MapPinned, label: language === 'es' ? 'Zonas' : 'Zones' },
  ];

  const dayLabels = {
    monday: language === 'es' ? 'Lunes' : 'Monday',
    tuesday: language === 'es' ? 'Martes' : 'Tuesday',
    wednesday: language === 'es' ? 'Miércoles' : 'Wednesday',
    thursday: language === 'es' ? 'Jueves' : 'Thursday',
    friday: language === 'es' ? 'Viernes' : 'Friday',
    saturday: language === 'es' ? 'Sábado' : 'Saturday',
    sunday: language === 'es' ? 'Domingo' : 'Sunday',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          {language === 'es' ? 'Ajustes' : 'Settings'}
        </h1>
        <p className="text-muted-foreground mt-2">{language === 'es' ? 'Configura tu negocio' : 'Configure your business'}</p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeSection === s.id ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            <s.icon className="w-4 h-4" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Profile Section */}
      {activeSection === 'profile' && settings && (
        <Card className="p-6 border-orange-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-tight">{language === 'es' ? 'Mi Perfil' : 'My Profile'}</h2>
              <p className="text-sm text-muted-foreground">{language === 'es' ? 'Tu información de contacto' : 'Your contact information'}</p>
            </div>
          </div>
          <div className="grid gap-4">
            <Input label={language === 'es' ? 'Nombre' : 'Name'} value={settings.profile.name} onChange={e => setSettings({...settings, profile: {...settings.profile, name: e.target.value}})} />
            <Input label={language === 'es' ? 'Teléfono' : 'Phone'} value={settings.profile.phone} onChange={e => setSettings({...settings, profile: {...settings.profile, phone: e.target.value}})} />
            <Input label="Email" value={settings.profile.email} onChange={e => setSettings({...settings, profile: {...settings.profile, email: e.target.value}})} />
            <Textarea label={language === 'es' ? 'Bio' : 'Bio'} value={settings.profile.bio} onChange={e => setSettings({...settings, profile: {...settings.profile, bio: e.target.value}})} />
          </div>
          <div className="mt-6">
            <Button variant="fire" onClick={saveProfile} disabled={saving}><Save className="w-4 h-4 mr-2" />{saving ? '...' : language === 'es' ? 'Guardar' : 'Save'}</Button>
          </div>
        </Card>
      )}

      {/* Schedule Section */}
      {activeSection === 'schedule' && settings && (
        <Card className="p-6 border-orange-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-tight">{language === 'es' ? 'Horarios de Trabajo' : 'Work Schedule'}</h2>
              <p className="text-sm text-muted-foreground">{language === 'es' ? 'Configura tus días y horas' : 'Set your days and hours'}</p>
            </div>
          </div>
          <div className="space-y-4">
            {settings.schedule.map((day, idx) => (
              <div key={day.day} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${day.enabled ? 'border-orange-500/30 bg-orange-500/5' : 'border-border bg-muted/30'}`}>
                <div className="flex items-center gap-4">
                  <Toggle checked={day.enabled} onChange={(e) => {
                    const newSchedule = [...settings.schedule];
                    newSchedule[idx].enabled = !day.enabled;
                    setSettings({...settings, schedule: newSchedule});
                  }} />
                  <span className={`font-medium ${day.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>{dayLabels[day.day]}</span>
                </div>
                {day.enabled && (
                  <div className="flex items-center gap-2">
                    <input type="time" value={day.start_time} onChange={e => {
                      const newSchedule = [...settings.schedule];
                      newSchedule[idx].start_time = e.target.value;
                      setSettings({...settings, schedule: newSchedule});
                    }} className="bg-background border border-input rounded-lg px-3 py-2 text-sm" />
                    <span className="text-muted-foreground">-</span>
                    <input type="time" value={day.end_time} onChange={e => {
                      const newSchedule = [...settings.schedule];
                      newSchedule[idx].end_time = e.target.value;
                      setSettings({...settings, schedule: newSchedule});
                    }} className="bg-background border border-input rounded-lg px-3 py-2 text-sm" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="fire" onClick={saveSchedule} disabled={saving}><Save className="w-4 h-4 mr-2" />{saving ? '...' : language === 'es' ? 'Guardar' : 'Save'}</Button>
          </div>
        </Card>
      )}

      {/* Services Section */}
      {activeSection === 'services' && settings && (
        <Card className="p-6 border-orange-500/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold uppercase tracking-tight">{language === 'es' ? 'Servicios y Precios' : 'Services & Prices'}</h2>
                <p className="text-sm text-muted-foreground">{language === 'es' ? 'Lo que ofreces' : 'What you offer'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {settings.services.map((service, idx) => (
              <div key={service.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${service.enabled ? 'border-orange-500/30 bg-orange-500/5' : 'border-border bg-muted/30'}`}>
                <div className="flex items-center gap-4 flex-1">
                  <Toggle checked={service.enabled} onChange={() => {
                    const newServices = [...settings.services];
                    newServices[idx].enabled = !service.enabled;
                    setSettings({...settings, services: newServices});
                  }} />
                  <div className="flex-1">
                    <input type="text" value={service.name} onChange={e => {
                      const newServices = [...settings.services];
                      newServices[idx].name = e.target.value;
                      setSettings({...settings, services: newServices});
                    }} className="bg-transparent font-medium w-full focus:outline-none" placeholder="Nombre del servicio" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">$</span>
                  <input type="number" value={service.price} onChange={e => {
                    const newServices = [...settings.services];
                    newServices[idx].price = parseFloat(e.target.value) || 0;
                    setSettings({...settings, services: newServices});
                  }} className="bg-background border border-input rounded-lg px-3 py-2 text-sm w-20 text-right font-bold" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="fire" onClick={saveServices} disabled={saving}><Save className="w-4 h-4 mr-2" />{saving ? '...' : language === 'es' ? 'Guardar' : 'Save'}</Button>
          </div>
        </Card>
      )}

      {/* Payment Methods Section */}
      {activeSection === 'payments' && settings && (
        <Card className="p-6 border-orange-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-tight">{language === 'es' ? 'Métodos de Pago' : 'Payment Methods'}</h2>
              <p className="text-sm text-muted-foreground">{language === 'es' ? 'Cómo te pueden pagar' : 'How they can pay you'}</p>
            </div>
          </div>
          <div className="space-y-3">
            {settings.payment_methods.map((method, idx) => (
              <div key={method.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${method.enabled ? 'border-orange-500/30 bg-orange-500/5' : 'border-border bg-muted/30'}`}>
                <div className="flex items-center gap-4">
                  <Toggle checked={method.enabled} onChange={() => {
                    const newMethods = [...settings.payment_methods];
                    newMethods[idx].enabled = !method.enabled;
                    setSettings({...settings, payment_methods: newMethods});
                  }} />
                  <span className={`font-medium ${method.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>{method.name}</span>
                </div>
                <input type="text" value={method.details} onChange={e => {
                  const newMethods = [...settings.payment_methods];
                  newMethods[idx].details = e.target.value;
                  setSettings({...settings, payment_methods: newMethods});
                }} placeholder={language === 'es' ? 'Usuario/Detalles' : 'Username/Details'} className="bg-background border border-input rounded-lg px-3 py-2 text-sm w-48" />
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="fire" onClick={savePaymentMethods} disabled={saving}><Save className="w-4 h-4 mr-2" />{saving ? '...' : language === 'es' ? 'Guardar' : 'Save'}</Button>
          </div>
        </Card>
      )}

      {/* Service Zones Section */}
      {activeSection === 'zones' && settings && (
        <Card className="p-6 border-orange-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <MapPinned className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-tight">{language === 'es' ? 'Zonas de Servicio' : 'Service Zones'}</h2>
              <p className="text-sm text-muted-foreground">{language === 'es' ? 'Dónde trabajas' : 'Where you work'}</p>
            </div>
          </div>
          <div className="space-y-3">
            {settings.service_zones.map((zone, idx) => (
              <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${zone.enabled ? 'border-orange-500/30 bg-orange-500/5' : 'border-border bg-muted/30'}`}>
                <div className="flex items-center gap-4">
                  <Toggle checked={zone.enabled} onChange={() => {
                    const newZones = [...settings.service_zones];
                    newZones[idx].enabled = !zone.enabled;
                    setSettings({...settings, service_zones: newZones});
                  }} />
                  <div className="flex gap-2">
                    <input type="text" value={zone.city} onChange={e => {
                      const newZones = [...settings.service_zones];
                      newZones[idx].city = e.target.value;
                      setSettings({...settings, service_zones: newZones});
                    }} className="bg-background border border-input rounded-lg px-3 py-2 text-sm" placeholder="Ciudad" />
                    <input type="text" value={zone.state} onChange={e => {
                      const newZones = [...settings.service_zones];
                      newZones[idx].state = e.target.value;
                      setSettings({...settings, service_zones: newZones});
                    }} className="bg-background border border-input rounded-lg px-3 py-2 text-sm w-20" placeholder="Estado" />
                  </div>
                </div>
                <button onClick={() => {
                  const newZones = settings.service_zones.filter((_, i) => i !== idx);
                  setSettings({...settings, service_zones: newZones});
                }} className="p-2 hover:bg-destructive/20 rounded-lg text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => {
              setSettings({...settings, service_zones: [...settings.service_zones, { city: '', state: '', enabled: true }]});
            }}>
              <Plus className="w-4 h-4 mr-2" />{language === 'es' ? 'Agregar Zona' : 'Add Zone'}
            </Button>
          </div>
          <div className="mt-6">
            <Button variant="fire" onClick={saveZones} disabled={saving}><Save className="w-4 h-4 mr-2" />{saving ? '...' : language === 'es' ? 'Guardar' : 'Save'}</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

// ============ PROTECTED ROUTE ============
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/admin" replace />;
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
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
