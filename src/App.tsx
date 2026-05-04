import React, { useEffect, useState, useRef } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import './index.css';
import logoGreen from './assets/images/kreli-logo-green.png';
import { translations, Language } from './translations';

function App() {
  const [state, handleSubmit] = useForm("xykbeano");
  const [isHeaderBlack, setIsHeaderBlack] = useState(false);
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('kreli_lang') as Language) || 'fr';
  });
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const waitlistRef = useRef<HTMLElement>(null);

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('kreli_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const intersectingSections = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        let changed = false;
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            intersectingSections.add(entry.target);
            changed = true;
          } else if (intersectingSections.has(entry.target)) {
            intersectingSections.delete(entry.target);
            changed = true;
          }
        });
        if (changed) setIsHeaderBlack(intersectingSections.size > 0);
      },
      { threshold: 0.5 }
    );

    if (aboutRef.current) observer.observe(aboutRef.current);
    if (waitlistRef.current) observer.observe(waitlistRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Custom cursor logic
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Hide cursor on mobile
    if ('ontouchstart' in window) {
      cursor.style.display = 'none';
      return;
    }

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      cursor.style.left = cursorX - 10 + 'px';
      cursor.style.top = cursorY - 10 + 'px';
      animationFrameId = requestAnimationFrame(animateCursor);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animateCursor();

    // Setup interactive hover expansion
    const interactiveElements = document.querySelectorAll('a, button, input, .feature-card, .lang-btn');
    const handleMouseEnter = () => cursor.classList.add('expanded');
    const handleMouseLeave = () => cursor.classList.remove('expanded');

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Scroll reveal logic using IntersectionObserver (works with scroll-snap)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    revealElements.forEach(el => revealObserver.observe(el));

    // Parallax
    const handleParallax = (e: MouseEvent) => {
      const floats = document.querySelectorAll<HTMLElement>('.floating-element');
      const x = (e.clientX - window.innerWidth / 2) / 50;
      const y = (e.clientY - window.innerHeight / 2) / 50;

      floats.forEach((float, i) => {
        const speed = (i + 1) * 0.5;
        float.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };
    document.addEventListener('mousemove', handleParallax);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleParallax);
      revealObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // handleSubmit is provided by useForm

  return (
    <>
      <div className="cursor-follower" ref={cursorRef}></div>
      <div className="noise-overlay"></div>

      <nav className={`fixed top-0 left-0 w-full px-5 py-4 md:px-12 md:py-8 flex justify-between items-center z-50 pointer-events-none transition-colors duration-500 ${isHeaderBlack ? 'text-black' : 'text-[#F2F2F2]'}`}>
        <div className="flex items-center gap-2 md:gap-3 font-sans text-xl md:text-3xl font-black tracking-tighter hover:opacity-80 transition-opacity">
          <img src={logoGreen} alt="Kreli" className={`w-6 h-6 md:w-8 md:h-8 object-contain transition-all duration-500 ${isHeaderBlack ? 'brightness-0' : ''}`} />
          <span>kreli</span>
        </div>
        
        <div className="flex items-center gap-6 md:gap-10 pointer-events-auto">
          <div className={`hidden md:flex font-mono text-xs md:text-sm rtl:text-sm md:rtl:text-base tracking-[0.2em] md:tracking-[0.3em] rtl:tracking-normal uppercase items-center gap-3 transition-colors duration-500 ${isHeaderBlack ? 'text-black' : 'text-[#05DC7F]'}`}>
            <span className={`w-2 h-2 rounded-full animate-pulse transition-colors duration-500 ${isHeaderBlack ? 'bg-black' : 'bg-[#05DC7F]'}`}></span>
            {t.nav.coming}
          </div>

          <div className="relative pointer-events-auto">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              aria-label={t.nav.languageLabel || 'Change language'}
              aria-haspopup="menu"
              aria-expanded={langMenuOpen}
              className={`flex items-center justify-center p-2.5 md:p-3 rounded-full transition-all duration-300 border-2 hover:-translate-y-0.5 backdrop-blur-md ${isHeaderBlack ? 'border-black/10 hover:border-black/30 hover:bg-black/5 bg-black/5 text-black' : 'border-[#05DC7F]/20 hover:border-[#05DC7F]/50 bg-black/5 hover:bg-[#05DC7F]/10 text-[#F2F2F2] hover:text-[#05DC7F] drop-shadow-[0_0_8px_rgba(5,220,127,0)] hover:drop-shadow-[0_0_8px_rgba(5,220,127,0.5)]'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </button>

            {langMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)}></div>
                <div className={`absolute top-full mt-4 end-0 z-50 flex flex-col min-w-[150px] border-4 shadow-[8px_8px_0px_rgba(0,0,0,0.5)] rtl:-shadow-[8px_8px_0px_rgba(0,0,0,0.5)] animate-[slideUp_0.2s_ease-out] ${isHeaderBlack ? 'bg-[#F2F2F2] border-black text-black' : 'bg-[#000000] border-[#05DC7F] text-[#F2F2F2]'}`}>
                  {(['fr', 'ar', 'en'] as const).map(l => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangMenuOpen(false); }}
                      className={`flex items-center justify-between px-5 py-4 font-mono text-sm md:text-base font-bold uppercase transition-colors border-b-2 last:border-none ${lang === l ? 'bg-[#05DC7F] text-black' : (isHeaderBlack ? 'hover:bg-black/5' : 'hover:bg-[#05DC7F]/20')} ${isHeaderBlack ? 'border-black/10' : 'border-[#05DC7F]/20'}`}
                    >
                      <span className="font-sans font-black tracking-tight">{l === 'ar' ? 'العربية' : l === 'fr' ? 'Français' : 'English'}</span>
                      <span className={`text-[10px] space-x-1 ${lang === l ? 'text-black/60' : 'opacity-40'}`}>{l.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
      <section className="hero">
        <div className="hero-grid"></div>

        <div className="floating-element float-1"></div>
        <div className="floating-element float-2"></div>
        <div className="floating-element float-3">
          <img src={logoGreen} alt="" aria-hidden="true" width={200} height={200} fetchPriority="high" decoding="async" className="w-[200px] h-[200px] object-contain" />
        </div>

        <div className="hero-content">
          <div className="hero-badge">{t.hero.badge}</div>

          <h1 className="hero-title pt-4">
            <span className="line"><span style={{ '--delay': '0.2s' } as React.CSSProperties}>{t.hero.titleRent}</span></span>
            <span className="line"><span style={{ '--delay': '0.3s' } as React.CSSProperties} className="green">{t.hero.titleAnything}</span></span>
            <span className="line"><span style={{ '--delay': '0.4s' } as React.CSSProperties} className="outline">{t.hero.titleAnywhere}</span></span>
          </h1>

          <p className="hero-subtitle">
            {t.hero.subtitle}
          </p>
        </div>

        <div className="marquee-container" dir="ltr">
          <div className="marquee">
            {[...Array(12)].map((_, i) => (
              <div className="marquee-item" key={i}>
                {t.hero.categories[i % 6]}
                <span className="dot"></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={aboutRef} className="w-full min-h-screen bg-[#142D2B] snap-start flex flex-col justify-center relative overflow-hidden z-10 px-5 md:px-16 py-16 md:py-20 outline-none">

        {/* Animated Background Text - Angled Marquee */}
        <div className="absolute top-[30%] -start-[10%] flex pointer-events-none z-0 transform -rotate-12 w-max" style={{ animation: 'marquee 45s linear infinite' }} dir="ltr">
          <div className="flex whitespace-nowrap text-[#05DC7F]/[0.03] font-black text-[18vw] md:text-[18vw] tracking-tighter leading-none pe-8 md:pe-16">
            {t.marqueeBg}
          </div>
          <div className="flex whitespace-nowrap text-[#05DC7F]/[0.03] font-black text-[18vw] md:text-[18vw] tracking-tighter leading-none pe-8 md:pe-16">
            {t.marqueeBg}
          </div>
        </div>

        {/* Content Container */}
        <div className="w-full max-w-[1400px] mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16 xl:gap-24">

          {/* Left Side: Massive Brutalist Statement Card */}
          <div className="w-full lg:w-1/2 flex justify-center reveal">
            <div className="bg-[#05DC7F] border-[3px] md:border-4 border-black p-6 md:p-14 shadow-[8px_8px_0px_#000000] md:shadow-[12px_12px_0px_#000000] transform rtl:rotate-2 ltr:-rotate-2 hover:rotate-0 transition-transform duration-500 relative w-full max-w-2xl">
              <div className="absolute -top-4 md:-top-5 rtl:-right-4 md:rtl:-right-5 ltr:-left-4 md:ltr:-left-5 bg-black text-[#05DC7F] font-mono text-[10px] md:text-sm rtl:text-sm md:rtl:text-base uppercase tracking-widest rtl:tracking-normal px-3 md:px-4 py-1.5 md:py-2 border-2 border-black font-bold">
                {t.untapped.badge}
              </div>
              <h2 className="text-3xl md:text-7xl lg:text-[5rem] font-black text-black leading-[0.9] tracking-tighter uppercase mt-4">
                {t.untapped.title1} <br />
                <span className="text-white drop-shadow-[4px_4px_0px_#000000]">{t.untapped.title2}</span> <br />
                {t.untapped.title3}
              </h2>

              {/* Floating accent mark */}
              <div className="absolute -bottom-8 ltr:-right-8 rtl:-left-8 hidden md:flex items-center justify-center w-24 h-24 bg-white border-4 border-black rounded-full rtl:-scale-x-100 shadow-[8px_8px_0px_#000000] animate-[float_5s_ease-in-out_infinite]">
                <span className="text-black font-black text-5xl">!</span>
              </div>
            </div>
          </div>

          {/* Right Side: Brutalist Text Blocks */}
          <div className="w-full lg:w-1/2 flex flex-col gap-5 md:gap-8">

            {/* Dark Card */}
            <div className="bg-[#000000] border-[3px] md:border-4 border-[#05DC7F] p-5 md:p-10 shadow-[6px_6px_0px_#05DC7F] md:shadow-[8px_8px_0px_#05DC7F] transform rotate-1 hover:rotate-0 transition-transform duration-500 reveal">
              <p className="font-sans text-base md:text-2xl text-[#F2F2F2] leading-relaxed">
                {t.untapped.darkCard1}
              </p>
              <p className="font-mono text-[#05DC7F] text-sm md:text-lg rtl:text-base md:rtl:text-xl font-bold mt-4 md:mt-6 uppercase tracking-wider rtl:tracking-normal relative inline-block">
                {t.untapped.darkCard2} <br />{t.untapped.darkCard3}
                <span className="absolute -bottom-2 start-0 w-full h-1 bg-[#05DC7F]"></span>
              </p>
            </div>

            {/* Light Card */}
            <div className="bg-[#F2F2F2] border-[3px] md:border-4 border-black p-5 md:p-10 shadow-[6px_6px_0px_#000000] md:shadow-[8px_8px_0px_#000000] transform -rotate-1 hover:rotate-0 transition-transform duration-500 reveal" style={{ transitionDelay: '100ms' }}>
              <p className="font-sans text-base md:text-xl text-black font-bold leading-relaxed mb-3 md:mb-4">
                {t.untapped.lightCard1}
              </p>
              <p className="font-sans text-sm md:text-lg text-black/70">
                <strong className="text-black text-base md:text-xl font-black">{t.untapped.lightCard2}</strong> {t.untapped.lightCard3}
              </p>
            </div>

            {/* Guarantee Tag */}
            <div className="self-start md:self-end bg-[#142D2B] border-2 border-[#05DC7F] px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-4 reveal shadow-[4px_4px_0px_#05DC7F]" style={{ transitionDelay: '200ms' }}>
              <span className={`font-sans font-black text-xl md:text-2xl text-[#05DC7F] ${lang === 'ar' ? 'arabic' : ''}`}>
                {t.untapped.guaranteeWord}
              </span>
              <div className="w-px h-6 md:h-8 bg-[#05DC7F]/30"></div>
              <span className="font-mono text-[10px] md:text-xs rtl:text-xs md:rtl:text-sm text-[#05DC7F] tracking-widest rtl:tracking-normal uppercase">{t.untapped.guaranteeSub}</span>
            </div>

          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-header">
          <div className="section-number">{t.features.badge}</div>
          <h2 className="features-title reveal">{t.features.title}</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card reveal">
            <div className="feature-number">01</div>
            <svg className="feature-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="24" cy="24" r="20" />
              <path d="M24 14v20M14 24h20" />
            </svg>
            <h3 className="feature-title">{t.features.card1Title}</h3>
            <p className="feature-text">{t.features.card1Text}</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-number">02</div>
            <svg className="feature-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M24 4l6 12 13 2-9 9 2 13-12-6-12 6 2-13-9-9 13-2z" />
            </svg>
            <h3 className="feature-title">{t.features.card2Title}</h3>
            <p className="feature-text">{t.features.card2Text}</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-number">03</div>
            <svg className="feature-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="8" y="12" width="32" height="28" rx="2" />
              <path d="M16 12V8a8 8 0 1116 0v4" />
              <circle cx="24" cy="26" r="4" />
              <path d="M24 30v6" />
            </svg>
            <h3 className="feature-title">{t.features.card3Title}</h3>
            <p className="feature-text">{t.features.card3Text}</p>
          </div>
        </div>

        {/* Mobile swipe hint */}
        <div className="md:hidden flex items-center justify-center gap-2 mt-6 text-[#F2F2F2]/30 font-mono text-xs tracking-widest uppercase">
          <svg className="w-4 h-4 animate-[swipeHint_1.5s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          {t.features.swipe || 'swipe'}
        </div>
      </section>

      <section ref={waitlistRef} className="w-full h-screen bg-[#05DC7F] snap-start flex flex-col justify-center items-center px-5 md:px-6 relative overflow-hidden z-10 outline-none">

        {/* Animated Background Marquees */}
        <div className="absolute top-[10%] start-0 flex pointer-events-none z-0 w-max" style={{ animation: 'marquee 35s linear infinite' }} dir="ltr">
          <div className="flex whitespace-nowrap text-black/10 font-black text-[16vw] md:text-[14vw] tracking-tighter mix-blend-overlay leading-none pr-8 md:pr-12">
            {t.waitlist.bg1}
          </div>
          <div className="flex whitespace-nowrap text-black/10 font-black text-[16vw] md:text-[14vw] tracking-tighter mix-blend-overlay leading-none pr-8 md:pr-12">
            {t.waitlist.bg1}
          </div>
        </div>

        <div className="absolute bottom-[8%] start-0 flex pointer-events-none z-0 w-max" style={{ animation: 'marquee 30s linear infinite reverse' }} dir="ltr">
          <div className="flex whitespace-nowrap text-black/10 font-black text-[16vw] md:text-[14vw] tracking-tighter mix-blend-overlay leading-none pr-8 md:pr-12">
            {t.waitlist.bg2}
          </div>
          <div className="flex whitespace-nowrap text-black/10 font-black text-[16vw] md:text-[14vw] tracking-tighter mix-blend-overlay leading-none pr-8 md:pr-12">
            {t.waitlist.bg2}
          </div>
        </div>

        {/* Floating Background K Vectors */}
        <img src={logoGreen} alt="" aria-hidden="true" loading="lazy" decoding="async" className="hidden lg:block absolute top-[25%] start-[10%] w-32 h-32 object-contain brightness-0 opacity-[0.08] pointer-events-none animate-[float_6s_ease-in-out_infinite]" />
        <img src={logoGreen} alt="" aria-hidden="true" loading="lazy" decoding="async" className="hidden lg:block absolute bottom-[25%] end-[10%] w-48 h-48 object-contain brightness-0 opacity-[0.08] pointer-events-none animate-[float_8s_ease-in-out_infinite_reverse]" />

        {/* Foreground Action Panel (Neo-Brutalist) */}
        <div className="max-w-3xl w-full flex flex-col items-center text-center z-10 mt-0 md:mt-10">

          {/* Logo Badge */}
          <div className="w-16 h-16 md:w-24 md:h-24 mb-4 md:mb-6 bg-black rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center transform hover:scale-110 hover:rotate-6 transition-transform duration-500 shadow-[6px_6px_0px_rgba(0,0,0,0.3)] md:shadow-[8px_8px_0px_rgba(0,0,0,0.3)]">
            <img src={logoGreen} alt="Kreli" className="w-7 h-7 md:w-10 md:h-10 object-contain" />
          </div>

          <h2 className="text-4xl md:text-8xl font-black text-black tracking-tighter uppercase mb-3 md:mb-4 leading-none">
            {t.waitlist.title}
          </h2>

          <p className="font-sans text-base md:text-2xl font-bold text-black/70 mb-8 md:mb-12 px-2 md:px-4 max-w-xl">
            {t.waitlist.subtitle}
          </p>

          {!state.succeeded ? (
            <div className="w-full flex flex-col gap-2 relative">
              <form className="w-full flex flex-col md:flex-row gap-3 md:gap-5" onSubmit={handleSubmit} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <input
                  type="email"
                  name="email"
                  className="flex-1 bg-[#F2F2F2] border-[3px] md:border-4 border-black px-5 md:px-8 py-4 md:py-5 font-mono text-base md:text-xl text-black placeholder:text-black/40 shadow-[6px_6px_0px_#000000] md:shadow-[8px_8px_0px_#000000] rtl:-shadow-[6px_6px_0px_#000000] md:rtl:-shadow-[8px_8px_0px_#000000] focus:shadow-[4px_4px_0px_#000000] focus:translate-y-1 focus:outline-none transition-all rounded-none text-start"
                  placeholder={t.waitlist.placeholder}
                  required
                  dir="ltr"
                />
                <button
                  type="submit"
                  className="bg-black text-[#05DC7F] px-8 md:px-12 py-4 md:py-5 font-black uppercase tracking-widest rtl:tracking-normal text-base md:text-xl rtl:text-lg md:rtl:text-2xl border-[3px] md:border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.6)] md:shadow-[8px_8px_0px_rgba(0,0,0,0.6)] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.6)] hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  disabled={state.submitting}
                >
                  {state.submitting ? '...' : (
                    <span className="flex items-center justify-center gap-3">
                      {t.waitlist.submit}
                      <svg className="w-5 h-5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  )}
                </button>
              </form>
              <ValidationError 
                prefix="Email" 
                field="email"
                errors={state.errors}
                className="text-red-500 font-mono text-sm self-start mt-2"
              />
            </div>
          ) : (
            <div className="bg-black text-[#05DC7F] px-6 md:px-10 py-6 md:py-8 border-[3px] md:border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.6)] md:shadow-[8px_8px_0px_rgba(0,0,0,0.6)] w-full flex items-center justify-center gap-4 md:gap-6 animate-[slideUp_0.5s_ease-out]">
              <span className="text-2xl md:text-3xl">🔥</span>
              <span className="font-mono font-bold text-sm md:text-xl">{t.waitlist.success}</span>
            </div>
          )}
        </div>
      </section>

      </main>
      <footer className="w-full min-h-screen md:h-screen bg-[#000000] snap-start flex flex-col relative overflow-hidden">
        {/* Giant Subtle Logo in Background/Bottom */}
        <div className="absolute font-sans bottom-0 left-0 w-full flex justify-center translate-y-[28%] md:translate-y-[22%] pointer-events-none select-none z-0">
          <h1 className="text-[40vw] md:text-[25vw] font-black text-[#1F1F1F] leading-none tracking-tighter m-0 p-0">
            kreli
          </h1>
        </div>

        {/* Content Container */}
        <div className="flex-1 w-full max-w-[1400px] mx-auto px-5 md:px-16 pt-16 md:pt-24 pb-8 md:pb-0 flex flex-col justify-between relative z-10">

          {/* Top Row: Tagline & Socials */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-16 mt-4 md:mt-10">

            {/* Branding Block */}
            <div className="flex flex-col gap-4 md:gap-6 max-w-lg">
              <div className="hidden md:flex items-center gap-5 mb-4">
                <div className="w-16 h-16 bg-[#000000] border border-[#1F1F1F] rounded-2xl flex items-center justify-center shadow-lg">
                  <img src={logoGreen} alt="K" className="w-8 h-8 object-contain" />
                </div>
                <span className="text-5xl font-black text-[#F2F2F2] tracking-tighter">kreli</span>
              </div>
              <p className="font-sans text-xl md:text-3xl font-light text-[#F2F2F2]/70 leading-tight">
                {t.footer.subtitle}
              </p>
              <div className="w-12 md:w-16 h-1 md:h-1.5 bg-[#05DC7F] mt-1 md:mt-2 rounded-full shadow-[0_0_15px_rgba(5,220,127,0.3)]"></div>

              <div className="flex flex-wrap gap-x-6 md:gap-x-8 gap-y-3 md:gap-y-4 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-[#1F1F1F]/50">
                <p className="font-mono text-[10px] md:text-xs text-[#F2F2F2]/70 tracking-wider">
                  © 2026 Kreli. {t.footer.madeIn} <span role="img" aria-label="morocco">🇲🇦</span>
                </p>
                <div className="flex gap-4 md:gap-6">
                  <a href="#" className="font-mono text-[10px] md:text-xs text-[#F2F2F2]/70 hover:text-[#05DC7F] transition-colors tracking-wider">{t.footer.privacy}</a>
                  <a href="#" className="font-mono text-[10px] md:text-xs text-[#F2F2F2]/70 hover:text-[#05DC7F] transition-colors tracking-wider">{t.footer.terms}</a>
                </div>
              </div>
            </div>

            {/* Social Cards */}
            <div className="flex flex-col gap-3 md:gap-5 w-full md:w-auto">
              <h3 className="font-mono text-xs md:text-sm rtl:text-base uppercase tracking-[0.3em] rtl:tracking-normal text-[#05DC7F] font-bold mb-1 md:mb-2 md:text-start md:rtl:text-end ltr:text-right">{t.footer.connect}</h3>
              <div className="flex flex-col gap-3 md:gap-4">
                {['Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                  <a key={social} href="#" className="flex items-center justify-between px-6 md:px-8 py-4 md:py-5 bg-[#1F1F1F] hover:bg-[#142D2B] border border-transparent hover:border-[#05DC7F]/50 rounded-xl md:rounded-2xl transition-all duration-300 group min-w-0 md:min-w-[260px] shadow-sm hover:shadow-lg hover:-translate-y-1">
                    <span className="font-sans font-bold text-[#F2F2F2] text-base md:text-lg tracking-wide">{social}</span>
                    <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#F2F2F2]/10 group-hover:bg-[#05DC7F] group-hover:shadow-[0_0_12px_#05DC7F] transition-all duration-300"></span>
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}

export default App;
