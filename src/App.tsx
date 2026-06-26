/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'motion/react';
import { 
  ChevronRight, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  ArrowUpRight, 
  CheckCircle2, 
  TrendingUp, 
  BarChart3, 
  Target,
  Zap,
  MapPin,
  Mail,
  Phone,
  Globe
} from 'lucide-react';

// --- Visual Assets ---
const ASSETS = {
  hero: "/bilder/office.png",
  portrait: "/bilder/portrait.png",
  analysis: "/bilder/analysis.png",
  optimierung: "/bilder/optimierung.png",
  gbp: "/bilder/gbp.png",
};

// --- Modal Helper ---
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-navy/90 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-none border border-divider shadow-2xl p-8 md:p-12"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-navy hover:text-gold transition-colors">
          <X size={24} />
        </button>
        <h2 className="text-3xl font-display text-navy mb-8 border-b border-divider pb-4">{title}</h2>
        <div className="prose prose-sm max-w-none text-text-muted leading-relaxed space-y-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// --- Components ---

const Logo = ({ className = "h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="NobleConsulting Logo">
    <path d="M20 20H80V80H20V20Z" stroke="currentColor" strokeWidth="1" />
    <path d="M40 30V70" stroke="var(--color-gold)" strokeWidth="4" />
    <path d="M60 30V70" stroke="currentColor" strokeWidth="4" />
    <rect x="35" y="45" width="30" height="1" fill="currentColor" />
  </svg>
);

const SectionHeading = ({ children, subtitle, light = false }: { children: React.ReactNode, subtitle?: string, light?: boolean }) => (
  <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div className="max-w-2xl">
      {subtitle && (
        <span className={`text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block ${light ? 'text-gold-highlight opacity-60' : 'text-gold'}`}>
          {subtitle}
        </span>
      )}
      <h2 className={`text-fluid-2xl leading-[1.05] ${light ? 'text-white' : 'text-navy'}`}>
        {children}
      </h2>
    </div>
  </div>
);

const Counter = ({ target, suffix = "", prefix = "", duration = 2 }: { target: number, suffix?: string, prefix?: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, target, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString('de-DE')}{suffix}</span>;
};

// --- Navbar ---

const Navbar = ({ theme, toggleTheme }: { theme: 'light' | 'dark', toggleTheme: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Transition when leaving hero (approx 80vh)
      setIsScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Strategie', href: '#strategie' },
    { name: 'Erfolge', href: '#erfolge' },
    { name: 'Expertise', href: '#expertise' },
    { name: 'Kontakt', href: '#kontakt' },
  ];

  // Logic for colors: Initial state (at top) is white text for the dark hero overlap. 
  // Scrolled state is Navy. Dark mode always prefers Light/Gold accents.
  const navColorClass = isScrolled ? 'text-navy' : 'text-white';
  const iconColorClass = isScrolled ? 'text-navy/60' : 'text-white';
  const dividerClass = isScrolled ? 'bg-divider' : 'bg-white/20';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-bg/90 backdrop-blur-xl border-b border-divider py-4' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-8 flex justify-between items-center">
        <a href="#" className="flex items-center gap-4 group">
          <Logo className={`h-10 ${isScrolled ? 'text-navy' : 'text-white'} group-hover:text-gold transition-colors`} />
          <div className="flex flex-col">
            <span className={`font-display text-xl leading-none transition-colors ${isScrolled ? 'text-navy' : 'text-white'}`}>NobleConsulting</span>
            <span className={`text-[9px] uppercase tracking-[0.2em] transition-colors ${isScrolled ? 'text-text-muted' : 'text-white/60'}`}>David Heinke</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className={`text-[11px] uppercase tracking-widest font-bold transition-colors hover:text-gold ${navColorClass}`}>
              {link.name}
            </a>
          ))}
          <div className={`h-4 w-px transition-colors ${dividerClass}`} />
          <button onClick={toggleTheme} className={`p-2 transition-colors hover:text-gold ${iconColorClass}`}>
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <a href="#kontakt" className={`${isScrolled ? 'bg-navy text-white' : 'bg-gold text-white'} px-8 hidden md:flex items-center py-3 rounded-none text-[11px] uppercase tracking-widest font-bold hover:bg-gold transition-all shadow-xl shadow-navy/10`}>
            Erstgespräch
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-6">
          <button onClick={toggleTheme} className={`${isScrolled ? 'text-navy' : 'text-white'}`}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${isScrolled ? 'text-navy' : 'text-white'}`}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white dark:bg-surface-2 z-40 p-12 flex flex-col justify-center gap-8 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)} 
                className="text-4xl font-display text-navy"
              >
                {link.name}
              </motion.a>
            ))}
            <a href="#kontakt" onClick={() => setIsMenuOpen(false)} className="mt-8 bg-navy text-white text-center py-5 uppercase tracking-[0.2em] font-bold">
              Erstgespräch
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Main App ---

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeModal, setActiveModal] = useState<'impressum' | 'datenschutz' | 'agb' | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="min-h-screen">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gold origin-left z-[60]" style={{ scaleX }} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        {/* --- HERO: UNIFIED DARK --- */}
        <section className="relative min-h-[90vh] md:h-screen flex items-stretch border-b border-divider pt-20 md:pt-0 bg-navy text-white">
          <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px w-12 bg-gold" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gold">NobleConsulting</span>
              </div>
              <h1 className="text-fluid-3xl leading-[0.9] mb-10 max-w-[12ch] text-white">
                Klarheit. <br />
                <span className="italic font-normal text-gold">Struktur.</span> <br />
                Wachstum.
              </h1>
              <p className="text-lg md:text-xl text-white/70 mb-12 max-w-lg leading-[1.6]">
                Wir optimieren den Mittelstand. <br className="hidden md:block" />
                Strategische Beratung für inhabergeführte Unternehmen <br className="md:hidden" /> von&nbsp;<span className="inline-block text-gold font-bold whitespace-nowrap">1 bis 30 Mitarbeitern</span>. <br />
                Ob Wachstum, Optimierung oder Krisenmanagement – wir schaffen Stabilität.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <a href="#kontakt" className="group bg-gold text-white px-12 py-5 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white hover:text-navy transition-all duration-500">
                  Erstgespräch <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                <a href="#strategie" className="px-12 py-5 font-bold uppercase tracking-widest text-xs border border-white/20 text-white hover:bg-white/5 transition-all text-center">
                  Unsere Strategie
                </a>
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 relative hidden lg:block overflow-hidden">
            <motion.img 
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 }}
              transition={{ duration: 2 }}
              src={ASSETS.hero} 
              alt="Professional Office Environment"
              className="absolute inset-0 w-full h-full object-cover filter grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-navy via-navy/80 to-transparent" />
            <div className="absolute bottom-20 left-20 right-20">
              <div className="h-px w-20 bg-gold mb-8" />
              <p className="text-3xl font-display text-white italic max-w-sm">
                „Erfolg ist kein Zufall, sondern das Ergebnis präziser Prozesse und klarer Zahlen.“
              </p>
            </div>
          </div>
        </section>

        {/* --- IMPACT: MINIMAL GRID --- */}
        <section id="erfolge" className="border-b border-divider">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-divider">
            {[
              { label: 'Nachweisbare Ersparnis', value: 30000, suffix: ' €' },
              { label: 'Eigene Betriebe aufgebaut', value: 2, suffix: ' Exits' },
              { label: 'Operative Erfahrung', value: 10, suffix: ' Jahre+' },
              { label: 'Zielgruppe', value: 30, prefix: '1–', suffix: ' MA' },
            ].map((stat, i) => (
              <div key={i} className="p-10 md:p-12 flex flex-col justify-center group hover:bg-surface-offset transition-colors duration-700">
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-gold mb-4 group-hover:translate-x-2 transition-transform duration-500">{stat.label}</span>
                <div className="text-5xl md:text-6xl font-display text-navy">
                  <Counter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- STRATEGIE: EDITORIAL ROWS --- */}
        <section id="strategie" className="section-padding bg-surface">
          <div className="container mx-auto px-8">
            <SectionHeading subtitle="Methodik">Der Weg zur Marktführerschaft</SectionHeading>
            
            <div className="space-y-32 md:space-y-64">
              {[
                {
                  title: "Kosten & Prozesse",
                  desc: "Jede Kostenposition wird hinterfragt, jeder Ablauf auf Effizienz geprüft – nicht theoretisch, sondern aus der Praxis eines ehemaligen Geschäftsführers. Was nicht messbar besser wird, bleibt raus.",
                  impact: "Nachweisbares Einsparpotenzial ab dem ersten Gespräch.",
                  img: ASSETS.analysis
                },
                {
                  title: "Restrukturierung & Krisen",
                  desc: "Betriebe in schwierigen Phasen brauchen keine Folien, sondern klare Entscheidungen. Erfahrung aus dem Aufbau und der Sanierung eigener Unternehmen – kein Berater der nie selbst Unternehmer war.",
                  impact: "Stabilisierung durch operative Maßnahmen statt Konzeptpapiere.",
                  img: ASSETS.optimierung
                },
                {
                  title: "Wachstum & Exit",
                  desc: "Umsatz verdreifacht, Rentabilität verdoppelt, erfolgreicher Unternehmensverkauf – diese Erfahrung fließt direkt in die Begleitung von Wachstumsphasen und Nachfolgeprozessen ein.",
                  impact: "Maximale Bewertung bei geordnetem Übergang.",
                  img: ASSETS.portrait
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`grid lg:grid-cols-12 gap-16 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className={`lg:col-span-5 ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                    <h3 className="text-4xl md:text-5xl mb-8 leading-tight">{item.title}</h3>
                    <p className="text-lg text-text-muted mb-10 leading-relaxed">{item.desc}</p>
                    <div className="flex items-center gap-4 text-navy font-bold uppercase tracking-widest text-[10px]">
                      <TrendingUp size={16} className="text-gold" /> {item.impact}
                    </div>
                  </div>
                  <div className={`lg:col-span-7 aspect-[16/10] bg-surface-offset overflow-hidden border border-divider ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover grayscale object-cover object-[50%_30%] hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- GBP FOCUS: REGIONALE DOMINANZ --- */}
        <section className="py-24 bg-surface-offset border-b border-divider">
          <div className="container mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gold mb-6 block">Lokale Dominanz</span>
                <h2 className="text-fluid-2xl leading-[1.05] text-navy mb-8">
                  Google Business Profile: <br />
                  <span className="italic font-normal">Sichtbarkeit</span> die konvertiert.
                </h2>
                <p className="text-lg text-text-muted mb-8 leading-relaxed">
                  Regionale Marktführerschaft beginnt bei Google. Wir optimieren Ihr Google Business Profile (GBP) 
                  für maximale Reichweite in Oberfranken und Umgebung. Mehr Anrufe, mehr Kunden, mehr Umsatz.
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="p-6 bg-white border border-divider">
                    <p className="text-3xl font-display text-gold mb-1">+45%</p>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Mehr Anfragen</p>
                  </div>
                  <div className="p-6 bg-white border border-divider">
                    <p className="text-3xl font-display text-navy">Top 3</p>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Ranking</p>
                  </div>
                  <div className="p-6 bg-white border border-divider col-span-2 lg:col-span-1">
                    <p className="text-3xl font-display text-gold mb-1">~2.400€</p>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Mehrumsatz / Monat</p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video bg-navy overflow-hidden group border border-divider">
                <img 
                  src={ASSETS.gbp} 
                  alt="Digital Growth" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 blur-[2px] group-hover:blur-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- EXPERTISE: BENTO BOX --- */}
        <section id="expertise" className="section-padding bg-navy text-white relative overflow-hidden">
           {/* Background Pattern */}
           <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-gold) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           
           <div className="container mx-auto px-8 relative z-10">
             <SectionHeading subtitle="Expertise" light>Fundiertes Wissen. <br />Keine Kompromisse.</SectionHeading>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
               {[
                 { icon: <Target />, title: "Krisenmanagement" },
                 { icon: <BarChart3 />, title: "Profitabilitäts-Analyse" },
                 { icon: <Globe />, title: "Regionale Dominanz (GBP)" },
                 { icon: <Zap />, title: "Prozess-Optimierung" },
                 { icon: <CheckCircle2 />, title: "Restrukturierung" },
                 { icon: <ArrowUpRight />, title: "M&A Beratung" },
               ].map((skill, i) => (
                 <div key={i} className="p-12 border border-white/10 hover:bg-white/5 transition-colors group">
                    <div className="mb-6 text-gold group-hover:scale-110 transition-transform">{skill.icon}</div>
                    <h4 className="text-xl font-medium text-white">{skill.title}</h4>
                 </div>
               ))}
             </div>
           </div>
        </section>

        {/* --- ABOUT: THE FACE --- */}
        <section className="section-padding bg-white">
           <div className="container mx-auto px-8">
             <div className="grid lg:grid-cols-2 gap-24 items-center">
                <div className="aspect-[3/4] relative overflow-hidden bg-surface-offset border border-divider">
                  <img 
                    src={ASSETS.portrait} 
                    alt="David Heinke" 
                    className="w-full h-full object-cover grayscale filter"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 left-0 bg-gold text-white px-8 py-4 font-bold uppercase tracking-widest text-[10px]">
                    GF Erfahrung & Finanzprofi
                  </div>
                </div>
                
                <div>
                  <SectionHeading subtitle="Profil">David Heinke</SectionHeading>
                  <div className="space-y-8 text-xl text-text-muted font-light leading-relaxed">
                    <p>
                      Theorie ist für Akademiker. Praxis ist für Unternehmer. Als ehemaliger 
                      Geschäftsführer in Transport & Logistik sowie im produzierenden Gewerbe 
                      kenne ich die schlaflosen Nächte, wenn Prozesse klemmen oder die Marge 
                      nicht stimmt.
                    </p>
                    <p>
                      Ich habe Betriebe nicht nur begleitet – ich habe sie selbst aufgebaut, 
                      skaliert und erfolgreich verkauft. Dieser Hintergrund ist mein Angebot 
                      an Inhaber in <strong>Oberfranken</strong>, die echte Ergebnisse brauchen.
                    </p>
                    <ul className="grid gap-6 pt-8">
                      {[
                        'Geschäftsführer in Transport & produzierendem Gewerbe',
                        'Operative Skalierung und erfolgreicher Unternehmensverkauf',
                        'Fokus auf inhabergeführte KMU mit 1–30 Mitarbeitern',
                        'Zertifizierter Versicherungskaufmann & Datenanalytik'
                      ].map((point, i) => (
                        <li key={i} className="flex gap-4 items-center text-navy font-bold text-sm tracking-widest uppercase">
                          <CheckCircle2 size={16} className="text-gold" /> {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
             </div>
           </div>
        </section>

        {/* --- CONTACT --- */}
        <section id="kontakt" className="section-padding bg-surface-offset">
          <div className="container mx-auto px-8">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-5 border border-divider bg-white">
              <div className="lg:col-span-2 bg-navy p-12 md:p-20 text-white">
                <h2 className="text-fluid-xl text-white mb-8">Bereit für <br />Ergebnisse?</h2>
                <p className="text-gold-highlight opacity-60 mb-12 leading-relaxed">
                  Lassen Sie uns unverbindlich prüfen, welche Hebel wir in Ihrem Unternehmen sofort umlegen können.
                </p>
                <div className="space-y-8">
                   <div className="flex items-center gap-6 group cursor-pointer">
                      <div className="w-12 h-12 flex items-center justify-center border border-white/20 group-hover:border-gold group-hover:bg-gold transition-all">
                        <Mail size={18} />
                      </div>
                      <span className="text-sm tracking-widest font-bold">kontakt@noble-consulting.de</span>
                   </div>
                   <div className="flex items-center gap-6 group cursor-pointer">
                      <div className="w-12 h-12 flex items-center justify-center border border-white/20 group-hover:border-gold group-hover:bg-gold transition-all">
                        <MapPin size={18} />
                      </div>
                      <span className="text-sm tracking-widest font-bold">Oberfranken | Remote</span>
                   </div>
                </div>
              </div>
              
              <div className="lg:col-span-3 p-12 md:p-20">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-divider bg-white">
        <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <Logo className="h-8 text-navy" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">NobleConsulting © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-12 text-[10px] uppercase tracking-widest font-bold text-text-muted">
            <button onClick={() => setActiveModal('impressum')} className="hover:text-navy transition-colors">Impressum</button>
            <button onClick={() => setActiveModal('datenschutz')} className="hover:text-navy transition-colors">Datenschutz</button>
            <button onClick={() => setActiveModal('agb')} className="hover:text-navy transition-colors">AGB</button>
          </div>
        </div>
      </footer>

      <Modal isOpen={activeModal === 'impressum'} onClose={() => setActiveModal(null)} title="Impressum">
        <section className="space-y-4">
          <h4 className="text-lg font-bold text-navy">Angaben gemäß § 5 TMG</h4>
          <p>NobleConsulting<br />David Heinke<br />Strategieberatung für den Mittelstand<br />Friedrich-Ebert-Straße 85<br />96215 Lichtenfels<br />Bayern, Deutschland</p>
          
          <h4 className="text-lg font-bold text-navy pt-4">Kontakt</h4>
          <p>Telefon: +49 (0) 151 68482909<br />E-Mail: kontakt@noble-consulting.de</p>
          
          <h4 className="text-lg font-bold text-navy pt-4">Berufsbezeichnung und berufsrechtliche Regelungen</h4>
          <p>Berufsbezeichnung: Zertifizierter Versicherungskaufmann & Unternehmensberater<br />Zuständige Kammer: IHK für Oberfranken Bayreuth</p>

          <h4 className="text-lg font-bold text-navy pt-4">Hinweis:</h4>
          <p>Gemäß § 19 UStG wird keine Umsatzsteuer erhoben.<br /></p>

          <p className="text-xs pt-8 border-t border-divider">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV: David Heinke</p>
        </section>
      </Modal>

      <Modal isOpen={activeModal === 'datenschutz'} onClose={() => setActiveModal(null)} title="Datenschutzerklärung">
        <div className="space-y-6">
          <section>
            <h4 className="text-lg font-bold text-navy">1. Verantwortlicher</h4>
            <p>David Heinke, NobleConsulting<br />Friedrich-Ebert-Straße 85, 96215 Lichtenfels<br />E-Mail: kontakt@noble-consulting.de</p>
          </section>

          <section>
            <h4 className="text-lg font-bold text-navy">2. Grundsatz</h4>
            <p>Wir verarbeiten personenbezogene Daten nur soweit dies zur Bereitstellung dieser Website und unserer Leistungen erforderlich ist. Eine Weitergabe an Dritte erfolgt nicht, sofern keine gesetzliche Verpflichtung besteht.</p>
          </section>

          <section>
            <h4 className="text-lg font-bold text-navy">3. Hosting</h4>
            <p>Diese Website wird über Cloudflare Pages gehostet (Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA). Beim Aufruf werden automatisch Server-Logfiles erfasst (IP-Adresse, Zeitstempel, aufgerufene Seiten). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert.</p>
          </section>

          <section>
            <h4 className="text-lg font-bold text-navy">4. Kontaktformular</h4>
            <p>Bei Nutzung des Kontaktformulars werden die eingegebenen Daten (Name, E-Mail, Nachricht) zur Bearbeitung Ihrer Anfrage verarbeitet. Das Formular wird über Formspree, Inc. (548 Market St, San Francisco, CA 94104, USA) übermittelt. Formspree ist nach dem EU-US Data Privacy Framework zertifiziert. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Die Daten werden nach Abschluss der Kommunikation gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.</p>
          </section>

          <section>
            <h4 className="text-lg font-bold text-navy">5. Google Fonts</h4>
            <p>Diese Website lädt Schriftarten von Google Fonts (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland). Dabei wird Ihre IP-Adresse an Google übertragen. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einheitlicher Darstellung).</p>
          </section>

          <section>
            <h4 className="text-lg font-bold text-navy">6. Cookies</h4>
            <p>Diese Website verwendet keine Cookies und kein Tracking.</p>
          </section>

          <section>
            <h4 className="text-lg font-bold text-navy">7. Ihre Rechte</h4>
            <p>Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch (Art. 21 DSGVO). Beschwerden richten Sie an: Bayerisches Landesamt für Datenschutzaufsicht (BayLDA), Promenade 27, 91522 Ansbach.</p>
          </section>

          <p className="text-xs pt-4 border-t border-divider">Stand: Juni 2026</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'agb'} onClose={() => setActiveModal(null)} title="Allgemeine Geschäftsbedingungen">
        <div className="space-y-6">
          <section>
            <h4 className="text-lg font-bold text-navy">§ 1 Geltungsbereich</h4>
            <p>Diese AGB gelten für alle Beratungsleistungen von David Heinke, NobleConsulting (nachfolgend „Berater") gegenüber Unternehmern im Sinne des § 14 BGB (nachfolgend „Auftraggeber").</p>
          </section>

          <section>
            <h4 className="text-lg font-bold text-navy">§ 2 Vertragsschluss</h4>
            <p>Ein Vertrag kommt durch schriftliche Auftragsbestätigung (E-Mail genügt) oder Beginn der Leistungserbringung zustande.</p>
          </section>

          <section>
            <h4 className="text-lg font-bold text-navy">§ 3 Leistungsgegenstand</h4>
            <p>Der Berater erbringt Beratungsleistungen in den Bereichen Prozessoptimierung, Kostenanalyse und Unternehmensstrukturierung. Der Berater schuldet keinen bestimmten wirtschaftlichen Erfolg, sondern fachkundige Beratung und Empfehlungen.</p>
          </section>

          <section>
            <h4 className="text-lg font-bold text-navy">§ 4 Vergütung</h4>
            <p>Die Vergütung richtet sich nach dem individuellen Angebot. Alle Preise verstehen sich zuzüglich gesetzlicher Mehrwertsteuer, sofern der Berater nicht Kleinunternehmer nach § 19 UStG ist. Rechnungen sind innerhalb von 14 Tagen nach Zugang zahlbar.</p>
          </section>

          <section>
            <h4 className="text-lg font-bold text-navy">§ 5 Mitwirkungspflichten</h4>
            <p>Der Auftraggeber stellt alle für die Beratung erforderlichen Informationen und Unterlagen vollständig und rechtzeitig zur Verfügung. Verzögerungen durch unvollständige Informationen gehen nicht zu Lasten des Beraters.</p>
          </section>

          <section>
            <h4 className="text-lg font-bold text-navy">§ 6 Vertraulichkeit</h4>
            <p>Beide Parteien behandeln alle im Rahmen der Zusammenarbeit bekanntgewordenen Informationen vertraulich. Diese Pflicht gilt über das Vertragsende hinaus.</p>
          </section>

          <section>
            <h4 className="text-lg font-bold text-navy">§ 7 Haftung</h4>
            <p>Die Haftung des Beraters ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. Eine Haftung für den wirtschaftlichen Erfolg umgesetzter Empfehlungen ist ausgeschlossen. Die Haftung ist der Höhe nach auf das vereinbarte Honorar begrenzt.</p>
          </section>

          <section>
            <h4 className="text-lg font-bold text-navy">§ 8 Schlussbestimmungen</h4>
            <p>Es gilt deutsches Recht. Gerichtsstand ist Lichtenfels, sofern der Auftraggeber Kaufmann ist. Sollten einzelne Bestimmungen unwirksam sein, bleibt der Rest des Vertrags wirksam.</p>
          </section>

          <p className="text-xs pt-4 border-t border-divider">Stand: Juni 2026</p>
        </div>
      </Modal>
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    const data = new FormData(e.currentTarget)

    const res = await fetch('https://formspree.io/f/mwvdoenj', {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    })

    res.ok ? setStatus('success') : setStatus('error')
  }

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
        <CheckCircle2 size={48} className="text-gold mx-auto mb-6" />
        <h3 className="text-3xl mb-4 leading-tight">Vielen Dank.</h3>
        <p className="text-text-muted">Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
      </motion.div>
    )
  }

  if (status === 'error') {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-bold mb-4">Fehler beim Senden.</p>
        <p className="text-text-muted text-sm">Bitte schreibe direkt an <a href="mailto:kontakt@noble-consulting.de" className="text-navy underline">kontakt@noble-consulting.de</a></p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted">Ihr Name</label>
          <input
            required
            type="text"
            name="name"
            className="w-full bg-transparent border-b border-divider py-2 focus:outline-none focus:border-navy transition-colors"
          />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted">E-Mail Adresse</label>
          <input
            required
            type="email"
            name="email"
            className="w-full bg-transparent border-b border-divider py-2 focus:outline-none focus:border-navy transition-colors"
          />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted">Mitarbeiteranzahl</label>
        <select
          name="mitarbeiter"
          className="w-full bg-transparent border-b border-divider py-2 focus:outline-none focus:border-navy transition-colors appearance-none"
        >
          <option>1 - 10 Mitarbeiter</option>
          <option>11 - 30 Mitarbeiter</option>
          <option>ab 30 Mitarbeiter</option>
        </select>
      </div>
      <div className="space-y-4">
        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted">Ihre Nachricht</label>
        <textarea
          rows={3}
          name="nachricht"
          className="w-full bg-transparent border-b border-divider py-2 focus:outline-none focus:border-navy transition-colors resize-none"
        />
      </div>
      <button
        disabled={status === 'submitting'}
        className="w-full bg-navy text-white text-[11px] uppercase tracking-[0.3em] font-bold py-6 hover:bg-gold transition-all duration-500 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Wird gesendet...' : 'Erstgespräch anfragen'}
      </button>
    </form>
  )
}

