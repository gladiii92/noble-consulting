/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Phone, 
  Mail, 
  MapPin, 
  Cookie,
  ArrowRight,
  ArrowUpRight,
  Loader2
} from 'lucide-react';

const GA_MEASUREMENT_ID = 'G-1WE2D4C6HL';

// --- DSGVO-konforme Google Analytics Nachladefunktion ---
const loadGoogleAnalytics = () => {
  if (typeof window === 'undefined') return;
  if (document.getElementById('ga-gtag-script')) return;

  const script = document.createElement('script');
  script.id = 'ga-gtag-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  const inlineScript = document.createElement('script');
  inlineScript.id = 'ga-inline-script';
  inlineScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', { 'anonymize_ip': true });
  `;
  document.head.appendChild(inlineScript);
};

// --- Logo ---
const Logo = ({ className = "h-8" }: { className?: string }) => (
  <img 
    src="/favicon.svg" 
    alt="NobleConsulting Logo" 
    className={`${className} object-contain`} 
  />
);

// --- Accessible Modal Helper ---
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode; 
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8" 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="modal-heading"
    >
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose} 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative bg-surface w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-divider shadow-2xl p-6 md:p-12 text-text"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-text-muted hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold p-1.5"
          aria-label="Schließen"
        >
          <X size={22} />
        </button>
        <h2 id="modal-heading" className="text-2xl md:text-3xl font-display text-heading mb-6 border-b border-divider pb-4">
          {title}
        </h2>
        <div className="prose prose-sm max-w-none text-text-muted leading-relaxed space-y-4 font-body">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// --- DSGVO & TTDSG Cookie Banner ---
const CookieConsentBanner = ({ 
  forceShow, 
  onCloseForce 
}: { 
  forceShow: boolean; 
  onCloseForce: () => void; 
}) => {
  const [consent, setConsent] = useState<'accepted' | 'rejected' | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cookie_consent');
    if (saved === 'accepted') {
      setConsent('accepted');
      loadGoogleAnalytics();
    } else if (saved === 'rejected') {
      setConsent('rejected');
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setConsent('accepted');
    onCloseForce();
    loadGoogleAnalytics();
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setConsent('rejected');
    onCloseForce();
  };

  const isVisible = forceShow || consent === null;
  if (!isVisible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] bg-surface text-text p-6 md:p-8 border border-divider shadow-2xl backdrop-blur-lg font-body"
      role="region"
      aria-label="Cookie-Einwilligung"
    >
      <div className="flex items-center gap-3 mb-3">
        <Cookie className="text-gold shrink-0" size={18} />
        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-heading">Datenschutz &amp; Cookies</h4>
      </div>
      <p className="text-xs text-text-muted leading-relaxed mb-6">
        Wir nutzen ausschließlich notwendige System-Funktionen sowie optional Google Analytics zur anonymisierten Reichweitenmessung (mit IP-Anonymisierung gem. TTDSG § 25 &amp; DSGVO). Eine Datenübertragung erfolgt erst nach Ihrer ausdrücklichen Einwilligung.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAcceptAll}
          className="flex-1 bg-navy hover:bg-gold text-white text-xs font-bold uppercase tracking-widest py-3 px-4 transition-colors focus-visible:ring-2 focus-visible:ring-gold text-center active:scale-[0.98]"
        >
          Alle akzeptieren
        </button>
        <button
          onClick={handleRejectAll}
          className="flex-1 bg-surface-offset hover:bg-divider text-text text-xs font-bold uppercase tracking-widest py-3 px-4 border border-divider transition-colors focus-visible:ring-2 focus-visible:ring-gold text-center active:scale-[0.98]"
        >
          Nur notwendige
        </button>
      </div>
    </motion.div>
  );
};

// --- Navbar ---
const Navbar = ({ 
  theme, 
  toggleTheme 
}: { 
  theme: 'light' | 'dark'; 
  toggleTheme: () => void; 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Das System', href: '#system' },
    { name: 'ROI-Rechner', href: '#rechner' },
    { name: 'Fallstudien', href: '#fallstudien' },
    { name: 'Über mich', href: '#profil' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-bg/95 backdrop-blur-md border-b border-divider py-3.5 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center relative">
        <a href="#" className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-gold outline-none">
          <Logo className={`h-8 ${isScrolled ? 'text-heading' : 'text-white'} group-hover:scale-105 transition-transform`} />
          <div className="flex flex-col">
            <span className={`font-display text-lg tracking-tight leading-none ${isScrolled ? 'text-heading' : 'text-white'}`}>NobleConsulting</span>
            <span className={`text-[9px] uppercase tracking-[0.2em] font-bold ${isScrolled ? 'text-text-muted' : 'text-white/70'}`}>David Heinke</span>
          </div>
        </a>

        {/* Desktop Menü */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              className={`text-xs uppercase tracking-widest font-semibold transition-colors hover:text-gold ${isScrolled ? 'text-text' : 'text-white/90'}`}
            >
              {link.name}
            </a>
          ))}
          <div className={`h-4 w-px ${isScrolled ? 'bg-divider' : 'bg-white/20'}`} />
          <button 
            onClick={toggleTheme} 
            className={`p-1.5 transition-colors hover:text-gold focus-visible:ring-2 focus-visible:ring-gold ${isScrolled ? 'text-text' : 'text-white'}`}
            aria-label="Design-Modus umschalten"
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <a 
            href="#rechner" 
            className="bg-gold hover:bg-gold-hover text-white px-5 py-2.5 text-xs uppercase tracking-widest font-bold transition-all shadow-sm active:scale-[0.98] inline-flex items-center gap-2"
          >
            <span>Ersparnis berechnen</span>
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Mobile Header Controls */}
        <div className="flex md:hidden items-center gap-3">
          <button 
            onClick={toggleTheme} 
            className={`p-2 focus-visible:ring-2 focus-visible:ring-gold ${isScrolled ? 'text-heading' : 'text-white'}`}
            aria-label="Design-Modus umschalten"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className={`p-2 focus-visible:ring-2 focus-visible:ring-gold ${isScrolled ? 'text-heading' : 'text-white'}`}
            aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 top-full bg-surface border-b border-divider p-6 flex flex-col gap-4 md:hidden shadow-2xl"
            >
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-lg font-display text-heading hover:text-gold transition-colors py-2 border-b border-divider/40"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#rechner" 
                onClick={() => setIsMenuOpen(false)} 
                className="mt-2 bg-gold text-white text-center py-3.5 uppercase tracking-widest font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>Ersparnis-Rechner starten</span>
                <ArrowRight size={14} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

// --- App Root ---
export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeModal, setActiveModal] = useState<'impressum' | 'datenschutz' | 'agb' | null>(null);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [prefilledData, setPrefilledData] = useState<{ fleet: string; note: string } | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleCalculatorComplete = (fleetSize: number, totalSavings: number, hoursSaved: number) => {
    setPrefilledData({
      fleet: `${fleetSize} Einheiten (Fahrzeuge, Maschinen & Mitarbeiter)`,
      note: `Errechnetes Potenzial aus ROI-Rechner: ~${totalSavings.toLocaleString('de-DE')} € jährliche Einsparung & ~${hoursSaved}h freigesetzte Chefzeit/Monat.`
    });
    const el = document.getElementById('kontakt');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-gold selection:text-white">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gold origin-left z-50" style={{ scaleX }} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <CookieConsentBanner 
        forceShow={showCookieSettings} 
        onCloseForce={() => setShowCookieSettings(false)} 
      />

      <main>
        {/* --- HERO: DISZIPLINIERTE TYPOGRAFIE & EDITORIAL HIERARCHY --- */}
        <section className="relative min-h-[85vh] flex items-center pt-28 pb-16 md:py-24 border-b border-divider bg-navy text-white">
          <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8">
              {/* Editorial Kicker Badge (Kein Vektor-Icon, reine typografische Disziplin) */}
              <div className="inline-block text-[10px] md:text-[11px] font-mono uppercase tracking-[0.25em] text-gold mb-5 border border-gold/30 bg-gold/10 px-3.5 py-1.5">
                Operative Inhaber-Entlastung • Handwerk &amp; Mittelstand
              </div>

              {/* H1 Headline: Ruhig, autoritär & harmonisch proportioniert */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[46px] font-display text-white leading-[1.14] tracking-tight mb-5">
                Garantierte 15.000 € bis 35.000 € Liquidität <br className="hidden sm:inline" />
                <span className="italic font-normal text-gold">&amp; 100% persönliche GF-Haftungsbefreiung.</span>
              </h1>

              {/* Subline */}
              <p className="text-sm sm:text-base md:text-lg text-white/80 mb-8 max-w-2xl leading-relaxed font-body font-light">
                Schluss mit zersplitterten Excel-Listen, Zettelwirtschaft und Belegchaos. 
                Wir überführen Fuhrpark, Auftragsabwicklung und interne Abläufe in Ihr schlüsselfertiges, automatisiertes Betriebs-Cockpit – 
                inklusive operativer Kostensanierung aus 15 Jahren Geschäftsführer-Praxis.
              </p>

              {/* Die 3 USPs: Reines Editorial Micro-Bento Grid ohne Icon-Clutter */}
              <div className="grid sm:grid-cols-3 gap-3 mb-9 max-w-2xl">
                <div className="p-3.5 bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold block mb-1">01 • Tempo</span>
                  <strong className="text-white block font-semibold text-xs leading-tight mb-0.5">Schlüsselfertig in 7–14 Tagen</strong>
                  <span className="text-white/60 text-[11px] leading-tight">Maximal 2h Chef-Aufwand</span>
                </div>

                <div className="p-3.5 bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold block mb-1">02 • Sofort-Effekt</span>
                  <strong className="text-white block font-semibold text-xs leading-tight mb-0.5">Erste Entlastung ab Tag 3</strong>
                  <span className="text-white/60 text-[11px] leading-tight">Vorbuchhaltung &amp; Listen</span>
                </div>

                <div className="p-3.5 bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold block mb-1">03 • Sicherheit</span>
                  <strong className="text-white block font-semibold text-xs leading-tight mb-0.5">0 Fristversäumnisse</strong>
                  <span className="text-white/60 text-[11px] leading-tight">TÜV, UVV, SP &amp; Fahrerlaubnis</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#rechner" 
                  className="bg-gold hover:bg-gold-hover text-white px-7 py-3.5 font-bold uppercase tracking-widest text-xs inline-flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.98]"
                >
                  <span>Einsparpotenzial berechnen</span>
                  <ArrowRight size={14} />
                </a>
                <a 
                  href="#fallstudien" 
                  className="px-7 py-3.5 font-bold uppercase tracking-widest text-xs border border-white/20 text-white hover:bg-white/10 transition-all text-center inline-flex items-center justify-center gap-2"
                >
                  <span>Zu den Fallstudien (&gt; 27.900 €)</span>
                </a>
              </div>
            </div>

            {/* Desktop Side Quote Card */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="border border-white/15 p-8 bg-white/5 backdrop-blur-sm space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">Der Praxis-Wedge</span>
                  <span className="text-[10px] font-mono text-white/50">Custom Cockpit</span>
                </div>
                <p className="font-display text-xl text-white leading-snug">
                  „Keine monatelangen, teuren ERP-Einführungen. Ein maßgeschneidertes Betriebs-Cockpit, das zersplitterte Excel-Listen ablöst und am Montagmorgen sofort funktioniert.“
                </p>
                <div className="pt-3 border-t border-white/10 text-xs text-white/70 font-body">
                  <strong className="text-white block font-semibold">David Heinke</strong>
                  Ehem. Geschäftsführer Transport &amp; Industrie
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SYSTEM-VERGLEICH: ZERSPITTERTE LISTEN VS. DIGITALES COCKPIT --- */}
        <section id="system" className="section-padding bg-bg border-b border-divider">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-16">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] font-bold text-gold block mb-3">Die 3 Kern-Module</span>
              <h2 className="text-3xl md:text-4xl font-display text-heading leading-tight">
                Warum zersplitterte Excel-Listen Ihren Betrieb lähmen – und was ein zentrales Cockpit ändert.
              </h2>
              <p className="text-text-muted mt-3 font-body text-sm leading-relaxed">
                Ob Fuhrpark, Aufträge, Werkzeuge oder Belege: Wer Geschäftsprozesse in isolierten Tabellen oder auf Papier führt, verliert wöchentlich bares Geld und haftet im Schadensfall privat.
              </p>
            </div>

            {/* 3 Modul-Karten: Typografisch strukturiert statt generischer Icon-Sammlung */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Modul 1: Fuhrpark & Fristen */}
              <div className="p-7 bg-surface border border-divider flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold block mb-2">Modul 01 • Haftungsschutz</span>
                  <h3 className="text-xl font-bold text-heading mb-3 font-body">Fuhrpark, Geräte &amp; Fristen</h3>
                  <p className="text-xs text-text-muted font-body leading-relaxed mb-4">
                    TÜV, UVV, SP, Sicherheitsprüfungen und regelmäßige Führerscheinkontrollen laufen vollautomatisiert. 
                  </p>
                  <ul className="space-y-2 text-xs text-text font-body">
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold">—</span>
                      <span>Alarmierung 30 Tage vor Fristablauf an Dispo &amp; Werkstatt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold">—</span>
                      <span>Mobile Schadens- &amp; Fotodokumentation per Smartphone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold">—</span>
                      <span>100% Audit-Sicherheit bei BG- &amp; Behördenkontrollen</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-divider text-[10px] font-mono text-text-muted uppercase">
                  Status: 0 Fristversäumnisse
                </div>
              </div>

              {/* Modul 2: Aufträge & Einsatz */}
              <div className="p-7 bg-surface border border-divider flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold block mb-2">Modul 02 • Transparenz</span>
                  <h3 className="text-xl font-bold text-heading mb-3 font-body">Auftrags- &amp; Einsatzplanung</h3>
                  <p className="text-xs text-text-muted font-body leading-relaxed mb-4">
                    Schluss mit Zetteln im Handschuhfach, Zurufen auf dem Betriebshof und vergessenen Arbeitsnachweisen.
                  </p>
                  <ul className="space-y-2 text-xs text-text font-body">
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold">—</span>
                      <span>Alle Projekte, Baustellen &amp; Einsätze auf einem Bildschirm</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold">—</span>
                      <span>Stundenerfassung &amp; Materialabgleich direkt vor Ort</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold">—</span>
                      <span>Sofortige Abrechnungsreife nach Projektabschluss</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-divider text-[10px] font-mono text-text-muted uppercase">
                  Status: Keine Zettelwirtschaft
                </div>
              </div>

              {/* Modul 3: DATEV-Vorbuchhaltung */}
              <div className="p-7 bg-surface border border-divider flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold block mb-2">Modul 03 • Kanzlei-Harmonie</span>
                  <h3 className="text-xl font-bold text-heading mb-3 font-body">Vorbuchhaltung &amp; Belege</h3>
                  <p className="text-xs text-text-muted font-body leading-relaxed mb-4">
                    DATEV-fertig vorkontierte Belege ohne Suchzeiten, Nachfragen oder Frust zum Monatswechsel.
                  </p>
                  <ul className="space-y-2 text-xs text-text font-body">
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold">—</span>
                      <span>Vorbuchhaltungsaufwand im Büro sinkt auf 1 Stunde/Woche</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold">—</span>
                      <span>Keine teuren Kanzlei-Nachbearbeitungshonorare für Zettelsuche</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold">—</span>
                      <span>Reibungslose Schnittstelle für Ihren Steuerberater</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-divider text-[10px] font-mono text-text-muted uppercase">
                  Status: 100% DATEV-kompatibel
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- WEDGE 3: INTERAKTIVER DIAGNOSTIC ROI-RECHNER --- */}
        <section id="rechner" className="section-padding bg-surface border-b border-divider">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-12">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] font-bold text-gold block mb-3">Diagnostic Tool</span>
              <h2 className="text-3xl md:text-4xl font-display text-heading leading-tight">
                Mittelstands-Liquiditäts- &amp; Ersparnisrechner.
              </h2>
              <p className="text-text-muted mt-3 font-body text-sm leading-relaxed">
                Ermitteln Sie in 30 Sekunden das reale Einsparpotenzial Ihres Betriebs bei Belegwesen, Vorbuchhaltung, Fuhrpark- und Prozessorganisation.
              </p>
            </div>

            <InteractiveRoiCalculator onCalculate={handleCalculatorComplete} />
          </div>
        </section>

        {/* --- DIE HORMOZI 5.000 € NETTO-GARANTIE --- */}
        <section className="py-14 bg-bg border-b border-divider">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-4xl mx-auto border border-gold/40 bg-surface p-8 md:p-12 shadow-md relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-gold block mb-1">
                    Unmissverständliche Risikoumkehr
                  </span>
                  <h3 className="text-2xl md:text-3xl font-display text-heading mb-3">
                    Die 5.000 € Netto-Garantie
                  </h3>
                  <p className="text-sm text-text-muted font-body leading-relaxed max-w-2xl">
                    „Finden wir in Ihrem Betrieb innerhalb der ersten 30 Tage nicht mindestens <strong>5.000 € an jährlichen Einsparungen</strong> (Belegwesen, Lieferantenkonditionen, Fuhrparkkosten) <strong>oder 10 Stunden freigesetzte Chefzeit pro Monat</strong>, arbeiten wir kostenfrei weiter, bis dieses Ziel erreicht ist – oder Sie erhalten Ihr Honorar zu 100% zurück.“
                  </p>
                </div>
                <div className="shrink-0 p-4 bg-surface-offset border border-divider text-center min-w-[140px]">
                  <span className="text-2xl font-display text-gold block">100%</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Risikofrei</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- ECHTE FALLSTUDIEN: GALABAU & REINIGUNG --- */}
        <section id="fallstudien" className="section-padding bg-surface border-b border-divider">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] font-bold text-gold block mb-3">Verifizierte Praxis-Ergebnisse</span>
              <h2 className="text-3xl md:text-4xl font-display text-heading leading-tight">
                Wie Betriebe nachweislich über 30.000 € pro Jahr einsparen.
              </h2>
              <p className="text-text-muted mt-3 font-body text-sm">
                Echte operative Beratungsergebnisse aus der Praxis. Anonymisiert zum Schutz der vertraulichen Betriebsdaten unserer Mandanten.
              </p>
            </div>

            <div className="space-y-12">
              {/* Fallstudie 1: GaLaBau */}
              <div className="border border-divider bg-bg p-8 md:p-12">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-divider">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest font-bold text-gold block mb-1">
                      Fallstudie GaLaBau • 15 Mitarbeiter • &gt; 1 Mio. € Umsatz
                    </span>
                    <h3 className="text-2xl font-display text-heading">
                      Belegaufwand von Tagen auf 1h/Woche reduziert &amp; Fuhrpark-Fristen automatisiert
                    </h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-3xl font-display text-gold block">&gt; 12.000 €</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-text-muted">Nettoersparnis / Jahr</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 font-body text-sm leading-relaxed text-text-muted">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-heading mb-2">Die Ausgangslage</h4>
                    <p>
                      Bürokraft und Inhaber verbrachten monatlich über 20 Stunden mit dem manuellen Zusammensuchen unvollständiger Tank- und Materialquittungen. Gleichzeitig fehlte jede Übersicht über die Prüffristen von 14 Fahrzeugen und Baggern.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-heading mb-2">Die Umsetzung &amp; Hebel</h4>
                    <p>
                      Einführung einer automatisierten Belegvorerfassung mit fehlerfreier DATEV-Übergabe an den Steuerberater. Vollständige Digitalisierung des Fuhrparks in einem maßgeschneiderten Cockpit mit automatischer Fristenwarnung 30 Tage vor Ablauf.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-divider grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-body">
                  <div>
                    <span className="text-text-faint block">Zeitaufwand Büro:</span>
                    <span className="font-bold text-heading">von 20h auf 1h / Woche</span>
                  </div>
                  <div>
                    <span className="text-text-faint block">Kanzlei-Rückfragen:</span>
                    <span className="font-bold text-heading">0 Rückfragen (DATEV-fertig)</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-text-faint block">Fristenüberwachung:</span>
                    <span className="font-bold text-gold">0 Versäumnisse (100% sicher)</span>
                  </div>
                </div>
              </div>

              {/* Fallstudie 2: Gebäudereinigung */}
              <div className="border border-divider bg-bg p-8 md:p-12">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-divider">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest font-bold text-gold block mb-1">
                      Fallstudie Gebäudereinigung • 10 Mitarbeiter
                    </span>
                    <h3 className="text-2xl font-display text-heading">
                      Materialeinkauf um 60% reduziert &amp; Auftragsabläufe optimiert
                    </h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-3xl font-display text-gold block">&gt; 27.900 €</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-text-muted">Gesamtersparnis / Jahr</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 font-body text-sm leading-relaxed text-text-muted">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-heading mb-2">Die Ausgangslage</h4>
                    <p>
                      Reinigungsmittel und Verbrauchsmaterial wurden mangels Rahmenverträgen im Einzelhandel (u.a. Lidl) für rund 1.250 € monatlich eingekauft. Die Vorbereitung der Buchhaltung war unstrukturiert, und feste Vollzeitverträge erzeugten in Sommerlöchern teure Leerläufe.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-heading mb-2">Die Umsetzung &amp; Hebel</h4>
                    <p>
                      Verhandlung von B2B-Großhandelskonditionen (Reinigungsmittel von 1.250 € auf 500 € mtl.); Standardisierung der internen Vorbuchhaltung; Flexibilisierung der Personalplanung durch geprüfte Subunternehmer.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-divider grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-body">
                  <div>
                    <span className="text-text-faint block">Einkaufsersparnis:</span>
                    <span className="font-bold text-heading">9.000 € / Jahr gespart</span>
                  </div>
                  <div>
                    <span className="text-text-faint block">Büro-Sortieraufwand:</span>
                    <span className="font-bold text-heading">von 15h auf 1h / Woche</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-text-faint block">Personalflexibilität:</span>
                    <span className="font-bold text-gold">~12.000 € / Jahr Leerlauf vermieden</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- PROFIL: DAVID HEINKE --- */}
        <section id="profil" className="section-padding bg-bg border-b border-divider">
          <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4">
              <div className="aspect-[3/4] bg-surface-offset border border-divider overflow-hidden shadow-lg">
                <img 
                  src="/bilder/portrait.png" 
                  alt="David Heinke – NobleConsulting" 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
            <div className="lg:col-span-8">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] font-bold text-gold block mb-3">Persönliche Betreuung</span>
              <h2 className="text-3xl md:text-4xl font-display text-heading mb-6">
                David Heinke • Warum Sie mit einem Praktiker sprechen.
              </h2>
              <div className="space-y-5 text-sm md:text-base text-text-muted font-body leading-relaxed max-w-2xl font-light">
                <p>
                  Ich war 15 Jahre lang selbst als Geschäftsführer in Transport, Logistik und produzierendem Gewerbe tätig. 
                  Ich kenne die Realität von Margendruck, Fristenstress und zersplitterten Tabellen aus eigener Erfahrung – nicht aus Lehrbüchern.
                </p>
                <p>
                  Durch mein Studium der Wirtschaftsinformatik verbinde ich 
                  betriebswirtschaftliche Kostensenkung mit moderner Systementwicklung (schlüsselfertige Betriebs-Cockpits und automatisierte Listenabläufe). 
                  Sie sprechen direkt mit mir – ohne Junior-Berater oder Agentur-Wasserkopf.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-divider text-xs font-body font-semibold text-heading">
                <div>
                  <span className="font-mono text-gold block mb-1">01 • Praxis</span>
                  <span>15 Jahre GF-Praxis</span>
                </div>
                <div>
                  <span className="font-mono text-gold block mb-1">02 • Informatik</span>
                  <span>Wirtschaftsinformatik-Know-how</span>
                </div>
                <div>
                  <span className="font-mono text-gold block mb-1">03 • Cockpits</span>
                  <span>Schlüsselfertige Listen-Systeme</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- KONTAKT & AUDIT-BUCHUNG --- */}
        <section id="kontakt" className="section-padding bg-navy text-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-4xl mx-auto border border-white/15 bg-white/5 p-8 md:p-14 shadow-2xl">
              <div className="grid md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold block mb-2">Unverbindlich &amp; Kostenfrei</span>
                  <h2 className="text-3xl font-display text-white mb-4">
                    48-Std. Liquiditäts- &amp; Listen-Check
                  </h2>
                  <p className="text-xs text-white/75 leading-relaxed font-body mb-6">
                    In einem kurzen Gespräch via Zoom oder Telefon prüfen wir, wie viel bares Geld und wie viele Stunden Chefzeit sich in Ihren Tabellen und Abläufen freisetzen lassen – inklusive konkreter Einschätzung der Fristen- und UVV-Sicherheit.
                  </p>
                  
                  {/* Klickbare Kontakt-Links mit echten tel/mailto Handlern */}
                  <div className="space-y-3.5 text-xs font-body text-white/85">
                    <a 
                      href="mailto:kontakt@noble-consulting.de" 
                      className="flex items-center gap-3 hover:text-gold transition-colors group focus-visible:ring-2 focus-visible:ring-gold py-1"
                    >
                      <Mail size={16} className="text-gold shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="underline-offset-4 group-hover:underline">kontakt@noble-consulting.de</span>
                    </a>
                    <a 
                      href="tel:+4915168482909" 
                      className="flex items-center gap-3 hover:text-gold transition-colors group focus-visible:ring-2 focus-visible:ring-gold py-1"
                    >
                      <Phone size={16} className="text-gold shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="underline-offset-4 group-hover:underline">+49 (0) 151 68482909</span>
                    </a>
                    <div className="flex items-center gap-3 py-1 text-white/70">
                      <MapPin size={16} className="text-gold shrink-0" />
                      <span>Lichtenfels, Oberfranken • Remote bundesweit</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 bg-surface text-text p-6 md:p-8 border border-divider shadow-lg">
                  <AuditContactForm 
                    initialFleet={prefilledData?.fleet}
                    initialNote={prefilledData?.note}
                    onOpenDatenschutz={() => setActiveModal('datenschutz')}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-10 border-t border-divider bg-surface text-text font-body">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-text-muted">
          <div className="flex items-center gap-3">
            <Logo className="h-6" />
            <span>NobleConsulting © {new Date().getFullYear()} • David Heinke</span>
          </div>
          <div className="flex flex-wrap gap-6 font-semibold">
            <button onClick={() => setActiveModal('impressum')} className="hover:text-gold transition-colors">Impressum</button>
            <button onClick={() => setActiveModal('datenschutz')} className="hover:text-gold transition-colors">Datenschutz</button>
            <button onClick={() => setActiveModal('agb')} className="hover:text-gold transition-colors">AGB</button>
            <button onClick={() => setShowCookieSettings(true)} className="hover:text-gold transition-colors text-gold">Cookie-Einstellungen</button>
          </div>
        </div>
      </footer>

      {/* --- MODALE --- */}
      <Modal isOpen={activeModal === 'impressum'} onClose={() => setActiveModal(null)} title="Impressum">
        <div className="space-y-4">
          <h4 className="text-base font-bold text-heading">Angaben gemäß § 5 TMG</h4>
          <p>NobleConsulting<br />David Heinke<br />Strategie- &amp; Prozessberatung für den Mittelstand<br />Friedrich-Ebert-Straße 85<br />96215 Lichtenfels<br />Bayern, Deutschland</p>

          <h4 className="text-base font-bold text-heading pt-2">Kontakt</h4>
          <p>Telefon: <a href="tel:+4915168482909" className="hover:text-gold underline">+49 (0) 151 68482909</a><br />E-Mail: <a href="mailto:kontakt@noble-consulting.de" className="hover:text-gold underline">kontakt@noble-consulting.de</a></p>

          <h4 className="text-base font-bold text-heading pt-2">Berufsbezeichnung</h4>
          <p>Berufsbezeichnung: Unternehmensberater &amp; ehem. Geschäftsführer<br />Zuständige Kammer: IHK für Oberfranken Bayreuth</p>

          <h4 className="text-base font-bold text-heading pt-2">Hinweis zur Umsatzsteuer</h4>
          <p className="text-xs text-text-muted">Gemäß § 19 UStG wird keine Umsatzsteuer erhoben.</p>

          <p className="text-xs pt-4 border-t border-divider">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV: David Heinke</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'datenschutz'} onClose={() => setActiveModal(null)} title="Datenschutzerklärung">
        <div className="space-y-4">
          <section>
            <h4 className="text-base font-bold text-heading">1. Verantwortlicher</h4>
            <p>David Heinke, NobleConsulting, Friedrich-Ebert-Straße 85, 96215 Lichtenfels, E-Mail: kontakt@noble-consulting.de</p>
          </section>

          <section>
            <h4 className="text-base font-bold text-heading">2. Reichweitenmessung mit Google Analytics</h4>
            <p>Diese Website nutzt Google Analytics (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) nur bei ausdrücklicher Einwilligung über den Cookie-Banner (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TTDSG). Die IP-Adresse wird vor der Übertragung anonymisiert (anonymizeIp). Sie können Ihre Einwilligung jederzeit über den Link „Cookie-Einstellungen“ im Footer widerrufen.</p>
          </section>

          <section>
            <h4 className="text-base font-bold text-heading">3. Lokale Schriften (DSGVO-konform)</h4>
            <p>Diese Webseite nutzt lokal gehostete Schriftarten ohne Verbindung zu externen Servern von Google. Es findet hierbei keine Datenübertragung statt.</p>
          </section>

          <section>
            <h4 className="text-base font-bold text-heading">4. Kontaktformular</h4>
            <p>Die Angaben aus dem Kontaktformular werden verschlüsselt zur Bearbeitung Ihrer Anfrage über Formspree Inc. (USA) verarbeitet (Art. 6 Abs. 1 lit. b DSGVO).</p>
          </section>
          <p className="text-xs pt-2 border-t border-divider">Stand: Oktober 2026</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'agb'} onClose={() => setActiveModal(null)} title="Allgemeine Geschäftsbedingungen">
        <div className="space-y-4">
          <section>
            <h4 className="text-base font-bold text-heading">§ 1 Geltungsbereich</h4>
            <p>Diese AGB gelten für alle Beratungs- und Systementwicklungsleistungen von David Heinke (NobleConsulting) gegenüber Unternehmern gem. § 14 BGB.</p>
          </section>
          <section>
            <h4 className="text-base font-bold text-heading">§ 2 Leistungsgegenstand</h4>
            <p>Gegenstand ist die Analyse, Konzeption und Implementierung von Vorbuchhaltungs-Strukturen, Fristenwächtern, digitalen Betriebs-Cockpits und operativen Prozess- und Kostenoptimierungen.</p>
          </section>
          <p className="text-xs pt-2 border-t border-divider">Stand: Oktober 2026</p>
        </div>
      </Modal>
    </div>
  );
}

// --- WEDGE 3: INTERAKTIVER DIAGNOSTIC ROI-RECHNER (ANTI-AI-SLOP, SAUBERE TYPOGRAFIE) ---
function InteractiveRoiCalculator({ 
  onCalculate 
}: { 
  onCalculate: (fleetSize: number, totalSavings: number, hoursSaved: number) => void; 
}) {
  const [fleetSize, setFleetSize] = useState<number>(12);
  const [internalTimeHours, setInternalTimeHours] = useState<number>(15);
  const [currentOrganization, setCurrentOrganization] = useState<'paper' | 'semi' | 'digital'>('paper');

  // Mathematisch fundierte & betriebswirtschaftlich saubere Berechnung:
  // 1. Eingesparte interne Arbeitszeit für Zettelsuche, Belegsortierung & Nachfragen:
  // Annahme: 15h interner Suchaufwand sinkt auf 2h/Monat. Stundensatz Bürokraft/Chef ~45 €/h.
  const hoursReducedPerMonth = Math.max(0, internalTimeHours - 2);
  const annualTimeSavings = Math.round(hoursReducedPerMonth * 45 * 12);

  // 2. Vermiedene Fristen- & Reparaturkosten (Fahrzeuge, Maschinen, Werkzeuge):
  // Vermeidung von Verzugsgebühren, unbemerkten Schrammen vor Rückgaben & Ad-Hoc-Stillständen.
  // Realistisch ~300 € pro Einheit / Jahr bei Zettelwirtschaft.
  let orgFactor = 1.0;
  if (currentOrganization === 'semi') orgFactor = 0.5;
  if (currentOrganization === 'digital') orgFactor = 0.2;
  const annualProcessSavings = Math.round(fleetSize * 300 * orgFactor);

  // Gesamtsumme Einsparpotenzial
  const totalAnnualSavings = annualTimeSavings + annualProcessSavings;

  // Freigesetzte Chef-Arbeitszeit pro Monat
  const hoursSavedPerMonth = fleetSize >= 15 ? 12 : (fleetSize >= 8 ? 8 : 5);

  return (
    <div className="bg-bg border border-divider p-6 md:p-10 shadow-sm">
      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* Eingabebereich (7 Spalten) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Betriebsgröße / Einheiten */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="fleet-slider" className="text-xs font-mono uppercase tracking-wider font-bold text-heading">
                Betriebsgröße (Fahrzeuge, Maschinen &amp; Mitarbeiter):
              </label>
              <span className="text-xs font-mono font-bold text-gold bg-surface px-2.5 py-1 border border-divider">
                {fleetSize} Einheiten
              </span>
            </div>
            <input 
              id="fleet-slider"
              type="range" 
              min={3} 
              max={50} 
              value={fleetSize} 
              onChange={(e) => setFleetSize(Number(e.target.value))}
              className="w-full accent-gold cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-text-faint mt-1">
              <span>3 Kleinstbetrieb</span>
              <span>25 Mittelstand</span>
              <span>50 Flotte &amp; Team</span>
            </div>
          </div>

          {/* Slider 2: Monatlicher Zeitaufwand für Zettelsuche & Belegsortierung */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="time-slider" className="text-xs font-mono uppercase tracking-wider font-bold text-heading">
                Monatliche Stunden für Belegsuche, Tabellenpflege &amp; Rückfragen:
              </label>
              <span className="text-xs font-mono font-bold text-gold bg-surface px-2.5 py-1 border border-divider">
                {internalTimeHours} Stunden / Monat
              </span>
            </div>
            <input 
              id="time-slider"
              type="range" 
              min={5} 
              max={40} 
              step={1}
              value={internalTimeHours} 
              onChange={(e) => setInternalTimeHours(Number(e.target.value))}
              className="w-full accent-gold cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-text-faint mt-1">
              <span>5h (Wenig)</span>
              <span>15h (Durchschnitt)</span>
              <span>40h+ (Großes Listenchaos)</span>
            </div>
          </div>

          {/* Auswahl 3: Aktuelle Listen-Organisation */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider font-bold text-heading block mb-2">
              Wie verwalten Sie Fristen (TÜV/UVV) &amp; Schadensmeldungen bisher?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCurrentOrganization('paper')}
                className={`py-2 px-3 text-xs border font-medium transition-all ${currentOrganization === 'paper' ? 'bg-gold text-white border-gold' : 'bg-surface text-text-muted border-divider hover:border-gold'}`}
              >
                Excel &amp; Papier
              </button>
              <button
                type="button"
                onClick={() => setCurrentOrganization('semi')}
                className={`py-2 px-3 text-xs border font-medium transition-all ${currentOrganization === 'semi' ? 'bg-gold text-white border-gold' : 'bg-surface text-text-muted border-divider hover:border-gold'}`}
              >
                Teil-digital
              </button>
              <button
                type="button"
                onClick={() => setCurrentOrganization('digital')}
                className={`py-2 px-3 text-xs border font-medium transition-all ${currentOrganization === 'digital' ? 'bg-gold text-white border-gold' : 'bg-surface text-text-muted border-divider hover:border-gold'}`}
              >
                Automatisiert
              </button>
            </div>
          </div>
        </div>

        {/* Ergebnisbereich (5 Spalten) */}
        <div className="lg:col-span-5 bg-surface border border-gold/40 p-6 md:p-8 shadow-md">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold block mb-1">
            Errechnetes Sparpotenzial
          </span>
          <div className="text-3xl md:text-4xl font-display text-heading mb-1">
            ~ {totalAnnualSavings.toLocaleString('de-DE')} €
            <span className="text-xs font-body font-normal text-text-muted block mt-1">Jährliches Einsparpotenzial</span>
          </div>

          <div className="space-y-3 py-4 my-4 border-y border-divider text-xs font-body">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Bürozeit &amp; Belegvorbereitung:</span>
              <strong className="text-heading font-mono">~ {annualTimeSavings.toLocaleString('de-DE')} € / J.</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Fristen- &amp; Fuhrparkschutz:</span>
              <strong className="text-heading font-mono">~ {annualProcessSavings.toLocaleString('de-DE')} € / J.</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Freigesetzte Chefzeit:</span>
              <strong className="text-gold font-mono">~ {hoursSavedPerMonth} Stunden / Monat</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onCalculate(fleetSize, totalAnnualSavings, hoursSavedPerMonth)}
            className="w-full bg-navy hover:bg-gold text-white py-3.5 px-4 text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span>Auswertung mit David Heinke besprechen</span>
            <ArrowRight size={14} />
          </button>
          <span className="text-[10px] text-text-faint text-center block mt-2">
            100% unverbindlich • Übernahme der Werte ins Formular
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Schlankes, robustes Formular mit E2E Event-Chain & Honeypot ---
function AuditContactForm({ 
  initialFleet,
  initialNote,
  onOpenDatenschutz
}: { 
  initialFleet?: string;
  initialNote?: string;
  onOpenDatenschutz: () => void;
}) {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const fleetId = useId();
  const noteId = useId();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefon: '',
    betrieb: '',
    nachricht: ''
  });

  useEffect(() => {
    if (initialFleet) {
      setFormData(prev => ({
        ...prev,
        betrieb: prev.betrieb ? prev.betrieb : initialFleet,
        nachricht: initialNote ? initialNote : prev.nachricht
      }));
    }
  }, [initialFleet, initialNote]);

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => data.append(key, val));

      const res = await fetch('https://formspree.io/f/mwvdoenj', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage('Die Anfrage konnte nicht übertragen werden. Bitte schreiben Sie direkt an kontakt@noble-consulting.de oder rufen Sie mich unter 0151 / 68482909 an.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung oder schreiben Sie direkt an kontakt@noble-consulting.de.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="text-gold font-display text-3xl mb-2">Anfrage eingegangen</div>
        <h4 className="text-xl font-display text-heading mb-2">Vielen Dank für Ihre Nachricht.</h4>
        <p className="text-xs text-text-muted font-body leading-relaxed max-w-sm mx-auto">
          David Heinke hat Ihre Auswertung erhalten und meldet sich innerhalb von 4 Arbeitsstunden persönlich bei Ihnen für eine kurze Ersteinschätzung.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body text-xs">
      {/* Honeypot für Formspree Bot-Schutz */}
      <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      {status === 'error' && (
        <div role="alert" aria-live="assertive" className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
          <span>{errorMessage}</span>
        </div>
      )}

      <div>
        <label htmlFor={nameId} className="uppercase tracking-wider font-bold text-text-muted block mb-1">
          Ihr Name *
        </label>
        <input
          id={nameId}
          required
          type="text"
          name="name"
          autoComplete="name"
          disabled={status === 'submitting'}
          value={formData.name}
          onChange={handleChange}
          placeholder="z.B. Markus Wagner"
          className="w-full bg-surface border border-divider px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={emailId} className="uppercase tracking-wider font-bold text-text-muted block mb-1">
            E-Mail *
          </label>
          <input
            id={emailId}
            required
            type="email"
            name="email"
            autoComplete="email"
            disabled={status === 'submitting'}
            value={formData.email}
            onChange={handleChange}
            placeholder="wagner@betrieb.de"
            className="w-full bg-surface border border-divider px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all"
          />
        </div>
        <div>
          <label htmlFor={phoneId} className="uppercase tracking-wider font-bold text-text-muted block mb-1">
            Telefon
          </label>
          <input
            id={phoneId}
            type="tel"
            name="telefon"
            autoComplete="tel"
            disabled={status === 'submitting'}
            value={formData.telefon}
            onChange={handleChange}
            placeholder="0171 / 1234567"
            className="w-full bg-surface border border-divider px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor={fleetId} className="uppercase tracking-wider font-bold text-text-muted block mb-1">
          Betriebs- &amp; Fuhrparkgröße
        </label>
        <input
          id={fleetId}
          type="text"
          name="betrieb"
          disabled={status === 'submitting'}
          value={formData.betrieb}
          onChange={handleChange}
          placeholder="z.B. GaLaBau, 14 Fahrzeuge, 18 Mitarbeiter"
          className="w-full bg-surface border border-divider px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all"
        />
      </div>

      <div>
        <label htmlFor={noteId} className="uppercase tracking-wider font-bold text-text-muted block mb-1">
          Ihre größte Baustelle / Anmerkungen (Optional)
        </label>
        <textarea
          id={noteId}
          rows={3}
          name="nachricht"
          disabled={status === 'submitting'}
          value={formData.nachricht}
          onChange={handleChange}
          placeholder="z.B. Zersplitterte Excel-Listen bei Prüffristen oder zu hoher Sortieraufwand bei Belegen..."
          className="w-full bg-surface border border-divider p-3 text-text focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold resize-none transition-all"
        />
      </div>

      {/* DSGVO Einverständnishinweis */}
      <p className="text-[10px] text-text-muted leading-tight">
        Mit dem Absenden erklären Sie sich mit der Übertragung Ihrer Daten zur Bearbeitung Ihrer Anfrage gem. unserer{' '}
        <button 
          type="button" 
          onClick={onOpenDatenschutz} 
          className="underline hover:text-gold transition-colors focus-visible:ring-1 focus-visible:ring-gold"
        >
          Datenschutzerklärung
        </button>{' '}
        einverstanden.
      </p>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-navy hover:bg-gold text-white uppercase tracking-widest font-bold py-3.5 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-gold shadow-sm active:scale-[0.98]"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Wird übertragen...</span>
          </>
        ) : (
          'Check unverbindlich anfragen'
        )}
      </button>
    </form>
  );
}
