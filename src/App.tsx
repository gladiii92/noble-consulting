/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Menu, 
  X, 
  Moon, 
  Sun, 
  ArrowUpRight, 
  CheckCircle2, 
  Database,
  Truck,
  FileSpreadsheet,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Cookie
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

// --- Visual Assets ---
const ASSETS = {
  hero: "/bilder/office.png",
  portrait: "/bilder/portrait.png",
  analysis: "/bilder/analysis.png",
  optimierung: "/bilder/optimierung.png",
};

// --- Logo ---
const Logo = ({ className = "h-8" }: { className?: string }) => (
  <img 
    src="/bilder/Logo_favicon.png" 
    alt="NobleConsulting Logo" 
    className={`${className} object-contain`} 
  />
);

// --- Modal Helper ---
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-navy/80 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-surface w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-divider shadow-2xl p-6 md:p-12 text-text"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-text-muted hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold p-1"
          aria-label="Schließen"
        >
          <X size={22} />
        </button>
        <h2 className="text-2xl md:text-3xl font-display text-navy mb-6 border-b border-divider pb-4">{title}</h2>
        <div className="prose prose-sm max-w-none text-text-muted leading-relaxed space-y-4 font-body">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// --- DSGVO & TTDSG Cookie Banner (Rechts unten schwebend) ---
const CookieConsentBanner = ({ onOpenSettings }: { onOpenSettings?: () => void }) => {
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
    loadGoogleAnalytics();
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setConsent('rejected');
  };

  if (consent !== null) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] bg-surface text-text p-6 md:p-8 border border-divider shadow-2xl backdrop-blur-lg font-body"
      role="region"
      aria-label="Cookie-Einwilligung"
    >
      <div className="flex items-center gap-3 mb-3">
        <Cookie className="text-gold" size={20} />
        <h4 className="text-sm font-bold uppercase tracking-wider text-navy">Datenschutz &amp; Cookies</h4>
      </div>
      <p className="text-xs text-text-muted leading-relaxed mb-6">
        Wir nutzen ausschließlich notwendige System-Cookies sowie Google Analytics zur anonymisierten Reichweitenmessung (mit IP-Anonymisierung gem. TTDSG § 25 &amp; DSGVO). Eine Datenübertragung an Google erfolgt erst nach Ihrer ausdrücklichen Einwilligung.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAcceptAll}
          className="flex-1 bg-navy hover:bg-gold text-white text-xs font-bold uppercase tracking-widest py-3 px-4 transition-colors focus-visible:ring-2 focus-visible:ring-gold text-center"
        >
          Alle akzeptieren
        </button>
        <button
          onClick={handleRejectAll}
          className="flex-1 bg-surface-offset hover:bg-divider text-text text-xs font-bold uppercase tracking-widest py-3 px-4 border border-divider transition-colors focus-visible:ring-2 focus-visible:ring-gold text-center"
        >
          Nur notwendige
        </button>
      </div>
    </motion.div>
  );
};

// --- Navbar (Ruhig, unaufdringlich, edel) ---
const Navbar = ({ theme, toggleTheme }: { theme: 'light' | 'dark', toggleTheme: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Das System', href: '#system' },
    { name: 'Fallstudien', href: '#fallstudien' },
    { name: 'Über mich', href: '#profil' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-bg/95 backdrop-blur-md border-b border-divider py-4 shadow-sm' : 'bg-transparent py-7'}`}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <a href="#" className="flex items-center gap-3.5 group focus-visible:ring-2 focus-visible:ring-gold outline-none">
          <Logo className={`h-8 ${isScrolled ? 'text-navy' : 'text-white'} group-hover:text-gold transition-colors`} />
          <div className="flex flex-col">
            <span className={`font-display text-lg tracking-tight leading-none ${isScrolled ? 'text-navy' : 'text-white'}`}>NobleConsulting</span>
            <span className={`text-[9px] uppercase tracking-[0.2em] font-bold ${isScrolled ? 'text-text-muted' : 'text-white/70'}`}>David Heinke</span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-10">
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
            href="#kontakt" 
            className="bg-gold hover:bg-gold-hover text-white px-6 py-2.5 text-xs uppercase tracking-widest font-bold transition-all shadow-sm active:scale-[0.98]"
          >
            15-Min. Audit buchen
          </a>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <button 
            onClick={toggleTheme} 
            className={`p-2 ${isScrolled ? 'text-navy' : 'text-white'}`}
            aria-label="Design-Modus umschalten"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className={`p-2 ${isScrolled ? 'text-navy' : 'text-white'}`}
            aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="fixed inset-x-0 top-full bg-surface border-b border-divider p-6 flex flex-col gap-4 md:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)} 
                className="text-lg font-display text-navy hover:text-gold transition-colors py-2 border-b border-divider/40"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#kontakt" 
              onClick={() => setIsMenuOpen(false)} 
              className="mt-2 bg-gold text-white text-center py-3.5 uppercase tracking-widest font-bold text-xs"
            >
              15-Min. Audit buchen
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- App Root ---
export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeModal, setActiveModal] = useState<'impressum' | 'datenschutz' | 'agb' | 'cookies' | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const resetCookieConsent = () => {
    localStorage.removeItem('cookie_consent');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-gold selection:text-white">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gold origin-left z-50" style={{ scaleX }} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <CookieConsentBanner />

      <main>
        {/* --- HERO: RADIKAL FOKUSSIERT & RUHIG --- */}
        <section className="relative min-h-[88vh] flex items-center pt-28 pb-16 md:py-0 border-b border-divider bg-navy text-white">
          <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8">
              <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-gold block mb-6">
                Maßgeschneiderte relationale Systeme für Inhaber
              </span>

              <h1 className="text-fluid-3xl leading-[0.95] mb-8 text-white font-display">
                Das digitale Betriebssystem <br />
                <span className="italic font-normal text-gold">für den Mittelstand.</span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed font-body font-light">
                Schluss mit zersplitterten Excel-Listen, Zettelwirtschaft und verpassten Fristen. 
                Wir überführen Fuhrpark, Auftragsabwicklung und interne Abläufe in Ihr schlüsselfertiges, automatisiertes Betriebs-Cockpit.
              </p>

              <div className="flex flex-wrap gap-x-8 gap-y-3 mb-10 text-xs md:text-sm text-white/90 font-body">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-gold shrink-0" />
                  <span>Schlüsselfertig in 7 bis 14 Tagen</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-gold shrink-0" />
                  <span>100% DSGVO-konform (Deutsche Cloud)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-gold shrink-0" />
                  <span>Aus 15 Jahren Geschäftsführer-Praxis</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#kontakt" 
                  className="bg-gold hover:bg-gold-hover text-white px-8 py-4 font-bold uppercase tracking-widest text-xs inline-flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                >
                  15-Min. System-Audit anfragen <ArrowUpRight size={16} />
                </a>
                <a 
                  href="#fallstudien" 
                  className="px-8 py-4 font-bold uppercase tracking-widest text-xs border border-white/20 text-white hover:bg-white/5 transition-all text-center"
                >
                  Zu den Fallstudien
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:block">
              <div className="border border-white/10 p-8 bg-white/5 backdrop-blur-sm space-y-6">
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold block">Das Versprechen</span>
                <p className="font-display text-2xl text-white leading-snug">
                  „Keine monatelangen ERP-Einführungen. Ein System, das am Montagmorgen sofort funktioniert.“
                </p>
                <div className="pt-4 border-t border-white/10 text-xs text-white/60 font-body">
                  David Heinke • Ehem. GF Transport &amp; Industrie
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SYSTEM-VERGLEICH: EXCEL VS. DIGITALES COCKPIT --- */}
        <section id="system" className="section-padding bg-bg border-b border-divider">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-gold block mb-3">Der Hebel</span>
              <h2 className="text-3xl md:text-4xl font-display text-navy leading-tight">
                Warum Standard-Excel Ihren Betrieb ausbremst – und was ein relationales System ändert.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Vorher */}
              <div className="p-8 md:p-10 bg-surface border border-divider">
                <div className="flex items-center gap-3 text-red-600 mb-6 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle size={18} />
                  <span>Der Status Quo: Das Excel-Dilemma</span>
                </div>
                <h3 className="text-xl font-bold text-navy mb-4 font-body">Zersplitterte Dateien &amp; Blindflug</h3>
                <ul className="space-y-4 text-sm text-text-muted font-body leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span><strong>Fristenrisiko:</strong> TÜV, UVV, SP und Führerscheinkontrollen werden in Tabellen vergessen. Bei Kontrollen oder Unfällen drohen Stillstand und Haftung.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span><strong>Versionen-Chaos:</strong> Drei Mitarbeiter arbeiten in unterschiedlichen Tabellen. Niemand weiß, welcher Datenstand aktuell ist.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span><strong>10h+ verlorene Chefzeit:</strong> Wochenenden vergehen mit manueller Dateneingabe, statt den Betrieb strategisch zu lenken.</span>
                  </li>
                </ul>
              </div>

              {/* Nachher */}
              <div className="p-8 md:p-10 bg-surface border-2 border-gold/40 shadow-lg relative">
                <div className="flex items-center gap-3 text-gold mb-6 font-bold text-xs uppercase tracking-wider">
                  <Sparkles size={18} />
                  <span>Die Lösung: Ihr relationales Betriebs-Cockpit</span>
                </div>
                <h3 className="text-xl font-bold text-navy mb-4 font-body">Zentral, automatisiert &amp; idiotensicher</h3>
                <ul className="space-y-4 text-sm text-text font-body leading-relaxed">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-gold shrink-0 mt-0.5" />
                    <span><strong>Automatische Fristenwarnung:</strong> E-Mail-Alarm 30 Tage vor Ablauf von Prüfungen direkt an Werkstatt oder Dispo. 0 Fristversäumnisse.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-gold shrink-0 mt-0.5" />
                    <span><strong>Mobile Fahrer-App:</strong> Fahrer melden Mängel und Schäden in 20 Sekunden per Smartphone (inkl. Foto). Volle Transparenz vor Leasing-Rückgaben.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-gold shrink-0 mt-0.5" />
                    <span><strong>Schlüsselfertige Einführung:</strong> Keine komplizierte Software-Schulung. Wir bauen Ihr System auf sicherer relationaler Datenbank-Architektur (Deutsche Cloud) in 7 bis 14 Tagen auf.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* --- ECHTE FALLSTUDIEN: GALABAU & REINIGUNG --- */}
        <section id="fallstudien" className="section-padding bg-surface border-b border-divider">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-gold block mb-3">Reale Ergebnisse</span>
              <h2 className="text-3xl md:text-4xl font-display text-navy leading-tight">
                Wie Betriebe nachweislich über 30.000 € pro Jahr einsparen.
              </h2>
              <p className="text-text-muted mt-3 font-body text-sm">
                Echte Beratungsfälle aus der Praxis. Anonymisiert zum Schutz der vertraulichen Betriebsdaten.
              </p>
            </div>

            <div className="space-y-12">
              {/* Fallstudie 1: GaLaBau */}
              <div className="border border-divider bg-bg p-8 md:p-12">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-divider">
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-navy block">
                      Garten- &amp; Landschaftsbau • 15 Mitarbeiter • &gt; 1 Mio. € Umsatz
                    </span>
                    <h3 className="text-2xl font-display text-navy mt-1">
                      Steuerberaterkosten um 95% gesenkt &amp; Versicherungs-Altlasten bereinigt
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-display text-gold block">&gt; 12.000 €</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Nettoersparnis / Jahr</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 font-body text-sm leading-relaxed text-text-muted">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-navy mb-2">Die Ausgangslage</h4>
                    <p>
                      Der Inhaber zahlte monatlich über 700 € an den Steuerberater, allein für das manuelle Sortieren und Vorkontieren von Belegen. Gleichzeitig liefen diverse gewerbliche Altversicherungen weiter, die längst überflüssig oder überteuert waren.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-navy mb-2">Die Umsetzung &amp; Hebel</h4>
                    <p>
                      Umstellung der Vorerfassung auf eine standardisierte, automatisierte Vorbuchhaltungs-Struktur (nur ~1 Stunde Zeitaufwand pro Woche für das Büro). Vollständiges Audit des Versicherungsbestands aus 10 Jahren IHK-Praxis – mit 3 gekündigten Altpolicen.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-divider grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-body">
                  <div>
                    <span className="text-text-faint block">Steuerberaterkosten:</span>
                    <span className="font-bold text-navy">von 700 € auf 25 € / Monat</span>
                  </div>
                  <div>
                    <span className="text-text-faint block">Zeitaufwand Büro:</span>
                    <span className="font-bold text-navy">nur 1 Stunde / Woche</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-text-faint block">Versicherungs-Ersparnis:</span>
                    <span className="font-bold text-gold">~4.000 € / Jahr netto</span>
                  </div>
                </div>
              </div>

              {/* Fallstudie 2: Gebäudereinigung */}
              <div className="border border-divider bg-bg p-8 md:p-12">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-divider">
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-navy block">
                      Gewerbliche Gebäudereinigung • 10 Mitarbeiter
                    </span>
                    <h3 className="text-2xl font-display text-navy mt-1">
                      Materialeinkauf um 60% reduziert &amp; Buchhaltung optimiert
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-display text-gold block">&gt; 27.900 €</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Gesamtersparnis / Jahr</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 font-body text-sm leading-relaxed text-text-muted">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-navy mb-2">Die Ausgangslage</h4>
                    <p>
                      Reinigungsmittel und Verbrauchsmaterial wurden mangels Rahmenverträgen im Einzelhandel (u.a. Lidl) für rund 1.250 € monatlich eingekauft. Die externe Buchhaltung kostete 600 € monatlich, und feste Vollzeitverträge erzeugten in Sommerlöchern teure Leerläufe.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-navy mb-2">Die Umsetzung &amp; Hebel</h4>
                    <p>
                      Verhandlung von B2B-Großhandelskonditionen (Reinigungsmittel von 1.250 € auf 500 € mtl.); Standardisierung der internen Vorbuchhaltung (von 600 € auf 25 € mtl.); Flexibilisierung der Personalplanung durch geprüfte Subunternehmer.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-divider grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-body">
                  <div>
                    <span className="text-text-faint block">Einkaufsersparnis:</span>
                    <span className="font-bold text-navy">9.000 € / Jahr gespart</span>
                  </div>
                  <div>
                    <span className="text-text-faint block">Buchhaltungskosten:</span>
                    <span className="font-bold text-navy">von 600 € auf 25 € / Monat</span>
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
              <div className="aspect-[3/4] bg-surface-offset border border-divider overflow-hidden">
                <img 
                  src={ASSETS.portrait} 
                  alt="David Heinke – NobleConsulting" 
                  className="w-full h-full object-cover grayscale"
                />
              </div>
            </div>
            <div className="lg:col-span-8">
              <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-gold block mb-3">Persönliche Betreuung</span>
              <h2 className="text-3xl md:text-4xl font-display text-navy mb-6">
                David Heinke • Warum Sie mit einem Praktiker sprechen.
              </h2>
              <div className="space-y-5 text-sm md:text-base text-text-muted font-body leading-relaxed max-w-2xl font-light">
                <p>
                  Ich war 15 Jahre lang selbst als Geschäftsführer in Transport, Logistik und produzierendem Gewerbe tätig. 
                  Ich kenne die Realität von Margendruck, Notdiensten am Wochenende und zersplitterten Tabellen aus eigener Erfahrung – nicht aus Lehrbüchern.
                </p>
                <p>
                  Durch mein Studium der Wirtschaftsinformatik und 10 Jahre IHK-zertifizierte Versicherungspraxis verbinde ich 
                  betriebswirtschaftliche Kostensenkung mit moderner relationaler Systementwicklung (No-Code- &amp; Workflow-Architektur). 
                  Sie sprechen direkt mit mir – ohne Junior-Berater oder Agentur-Wasserkopf.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-divider text-xs font-body font-semibold text-navy">
                <div>✓ 15 Jahre GF-Praxis</div>
                <div>✓ 10 Jahre IHK-Versicherungsexpertise</div>
                <div>✓ Wirtschaftsinformatik-Expertise</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- KONTAKT & AUDIT-BUCHUNG --- */}
        <section id="kontakt" className="section-padding bg-navy text-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-4xl mx-auto border border-white/15 bg-white/5 p-8 md:p-14">
              <div className="grid md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-5">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-bold block mb-2">Unverbindlich</span>
                  <h2 className="text-3xl font-display text-white mb-4">
                    15-Minuten System-Audit
                  </h2>
                  <p className="text-xs text-white/70 leading-relaxed font-body mb-6">
                    In einem kurzen Gespräch via Zoom oder Telefon prüfen wir, ob und wie sich Ihr Fuhrpark oder Ihre Abläufe in ein zentrales digitales Cockpit überführen lassen – inklusive konkreter Einschätzung des Einsparpotenzials.
                  </p>
                  <div className="space-y-3 text-xs font-body text-white/80">
                    <div className="flex items-center gap-2.5">
                      <Mail size={15} className="text-gold" />
                      <span>kontakt@noble-consulting.de</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone size={15} className="text-gold" />
                      <span>+49 (0) 151 68482909</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin size={15} className="text-gold" />
                      <span>Lichtenfels, Oberfranken • Remote bundesweit</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 bg-surface text-text p-6 md:p-8 border border-divider">
                  <AuditContactForm />
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
            <Logo className="h-6 text-navy" />
            <span>NobleConsulting © {new Date().getFullYear()} • David Heinke</span>
          </div>
          <div className="flex flex-wrap gap-6 font-semibold">
            <button onClick={() => setActiveModal('impressum')} className="hover:text-gold transition-colors">Impressum</button>
            <button onClick={() => setActiveModal('datenschutz')} className="hover:text-gold transition-colors">Datenschutz</button>
            <button onClick={() => setActiveModal('agb')} className="hover:text-gold transition-colors">AGB</button>
            <button onClick={resetCookieConsent} className="hover:text-gold transition-colors text-gold">Cookie-Einstellungen</button>
          </div>
        </div>
      </footer>

      {/* --- MODALE --- */}
      <Modal isOpen={activeModal === 'impressum'} onClose={() => setActiveModal(null)} title="Impressum">
        <div className="space-y-4">
          <h4 className="text-base font-bold text-navy">Angaben gemäß § 5 TMG</h4>
          <p>NobleConsulting<br />David Heinke<br />Strategie- &amp; Prozessberatung für den Mittelstand<br />Friedrich-Ebert-Straße 85<br />96215 Lichtenfels<br />Bayern, Deutschland</p>

          <h4 className="text-base font-bold text-navy pt-2">Kontakt</h4>
          <p>Telefon: +49 (0) 151 68482909<br />E-Mail: kontakt@noble-consulting.de</p>

          <h4 className="text-base font-bold text-navy pt-2">Berufsbezeichnung</h4>
          <p>Berufsbezeichnung: Unternehmensberater &amp; Student der Wirtschaftsinformatik<br />Zertifizierter Versicherungskaufmann (IHK)<br />Zuständige Kammer: IHK für Oberfranken Bayreuth</p>

          <h4 className="text-base font-bold text-navy pt-2">Hinweis zur Umsatzsteuer</h4>
          <p>Gemäß § 19 UStG wird keine Umsatzsteuer erhoben.</p>

          <p className="text-xs pt-4 border-t border-divider">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV: David Heinke</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'datenschutz'} onClose={() => setActiveModal(null)} title="Datenschutzerklärung">
        <div className="space-y-4">
          <section>
            <h4 className="text-base font-bold text-navy">1. Verantwortlicher</h4>
            <p>David Heinke, NobleConsulting, Friedrich-Ebert-Straße 85, 96215 Lichtenfels, E-Mail: kontakt@noble-consulting.de</p>
          </section>

          <section>
            <h4 className="text-base font-bold text-navy">2. Reichweitenmessung mit Google Analytics</h4>
            <p>Diese Website nutzt Google Analytics (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) nur bei ausdrücklicher Einwilligung über den Cookie-Banner (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TTDSG). Die IP-Adresse wird vor der Übertragung anonymisiert (anonymizeIp). Sie können Ihre Einwilligung jederzeit über den Link „Cookie-Einstellungen“ im Footer widerrufen.</p>
          </section>

          <section>
            <h4 className="text-base font-bold text-navy">3. Kontaktformular</h4>
            <p>Die Angaben aus dem Kontaktformular werden verschlüsselt über Formspree, Inc., USA zur Bearbeitung der Anfrage verarbeitet (Art. 6 Abs. 1 lit. b DSGVO).</p>
          </section>
          <p className="text-xs pt-2 border-t border-divider">Stand: Oktober 2026</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'agb'} onClose={() => setActiveModal(null)} title="Allgemeine Geschäftsbedingungen">
        <div className="space-y-4">
          <section>
            <h4 className="text-base font-bold text-navy">§ 1 Geltungsbereich</h4>
            <p>Diese AGB gelten für alle Beratungs- und Systementwicklungsleistungen von David Heinke (NobleConsulting) gegenüber Unternehmern gem. § 14 BGB.</p>
          </section>
          <section>
            <h4 className="text-base font-bold text-navy">§ 2 Leistungsgegenstand</h4>
            <p>Gegenstand ist die Analyse, Konzeption und Implementierung von relationalen Datenbanksystemen, Prozessoptimierungen und Kostenanalysen.</p>
          </section>
          <p className="text-xs pt-2 border-t border-divider">Stand: Oktober 2026</p>
        </div>
      </Modal>
    </div>
  );
}

// --- Schlankes, robustes Formular ---
function AuditContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefon: '',
    betrieb: '',
    nachricht: ''
  });
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
        setErrorMessage('Die Anfrage konnte nicht übertragen werden. Bitte schreiben Sie direkt an kontakt@noble-consulting.de oder rufen Sie an.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung oder schreiben Sie an kontakt@noble-consulting.de.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <CheckCircle2 size={44} className="text-gold mx-auto mb-3" />
        <h4 className="text-xl font-display text-navy mb-2">Vielen Dank für Ihre Anfrage.</h4>
        <p className="text-xs text-text-muted font-body">
          David Heinke wird sich innerhalb von 4 Arbeitsstunden persönlich bei Ihnen melden.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body text-xs">
      {status === 'error' && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700">
          {errorMessage}
        </div>
      )}

      <div>
        <label className="uppercase tracking-wider font-bold text-text-muted block mb-1">Ihr Name *</label>
        <input
          required
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="z.B. Markus Wagner"
          className="w-full bg-surface border border-divider px-3 py-2 text-text focus:outline-none focus:border-gold"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="uppercase tracking-wider font-bold text-text-muted block mb-1">E-Mail *</label>
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="wagner@betrieb.de"
            className="w-full bg-surface border border-divider px-3 py-2 text-text focus:outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="uppercase tracking-wider font-bold text-text-muted block mb-1">Telefon</label>
          <input
            type="tel"
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
            placeholder="0171 / 1234567"
            className="w-full bg-surface border border-divider px-3 py-2 text-text focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <div>
        <label className="uppercase tracking-wider font-bold text-text-muted block mb-1">Betrieb &amp; Fuhrparkgröße</label>
        <input
          type="text"
          name="betrieb"
          value={formData.betrieb}
          onChange={handleChange}
          placeholder="z.B. GaLaBau, 14 Fahrzeuge, 18 Mitarbeiter"
          className="w-full bg-surface border border-divider px-3 py-2 text-text focus:outline-none focus:border-gold"
        />
      </div>

      <div>
        <label className="uppercase tracking-wider font-bold text-text-muted block mb-1">Ihre größte Baustelle (Optional)</label>
        <textarea
          rows={3}
          name="nachricht"
          value={formData.nachricht}
          onChange={handleChange}
          placeholder="z.B. Excel-Chaos bei UVV-Prüfungen oder Steuerberaterkosten..."
          className="w-full bg-surface border border-divider p-3 text-text focus:outline-none focus:border-gold resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-navy hover:bg-gold text-white uppercase tracking-widest font-bold py-3.5 transition-colors disabled:opacity-50"
      >
        {status === 'submitting' ? 'Wird übertragen...' : '15-Min. Audit anfragen'}
      </button>
    </form>
  );
}
