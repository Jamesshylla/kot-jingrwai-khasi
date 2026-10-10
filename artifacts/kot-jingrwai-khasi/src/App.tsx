import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDown, ArrowRight, BookOpen, Check, ChevronDown, ChevronRight, Clipboard,
  Download, ExternalLink, Heart, Menu, Music2, Search, ShieldCheck, Smartphone,
  Sparkles, Star, X, Zap,
} from 'lucide-react';

const LOGO = '/assets/logo.png';
const PORTRAIT = '/assets/developer.png';
const QR = '/assets/upi-qr.jpeg';
const APK = '/downloads/app-release.apk';
const UPI = 'jamesshylla01-1@oksbi';

const navItems = [
  ['About', 'about'], ['Features', 'features'], ['App', 'experience'], ['Download', 'download'], ['Support', 'support'],
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function App() {
  const reduceMotion = useReducedMotion();
  const [intro, setIntro] = useState(false);
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [qrOpen, setQrOpen] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('kot-jingrwai-intro-seen');
    if (!seen && !reduceMotion) {
      setIntro(true);
      const timer = window.setTimeout(() => {
        localStorage.setItem('kot-jingrwai-intro-seen', '1');
        setIntro(false);
      }, 5200);
      return () => window.clearTimeout(timer);
    }
    localStorage.setItem('kot-jingrwai-intro-seen', '1');
    return undefined;
  }, [reduceMotion]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const downloadApp = () => {
    setToast('Download started.');
  };

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI);
      setToast('UPI ID copied.');
    } catch {
      setToast('Copy is unavailable here. Please select the UPI ID.');
    }
  };

  const payWithUpi = () => {
    window.location.href = `upi://pay?pa=${UPI}&pn=James%20Shylla&cu=INR`;
    window.setTimeout(() => setToast('UPI app handoff requested. Payment was not completed.'), 700);
  };

  return (
    <div className="grain min-h-[100dvh] overflow-x-hidden bg-[#0b1019] text-[#f2efe8]">
      <AnimatePresence>{intro && <Intro onSkip={() => { localStorage.setItem('kot-jingrwai-intro-seen', '1'); setIntro(false); }} />}</AnimatePresence>
      <Header menu={menu} setMenu={setMenu} />
      <main>
        <Hero onDownload={downloadApp} />
        <Story />
        <DownloadSection onDownload={downloadApp} onInstall={() => setInstallOpen(true)} />
        <Features />
        <Experience />
        <Offline />
        <Install onInstall={() => setInstallOpen(true)} />
        <Support onCopy={copyUpi} onPay={payWithUpi} onViewQr={() => setQrOpen(true)} />
        <Scripture onDownload={downloadApp} />
      </main>
      <Footer onNavigate={scrollToId} />
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#d8ad58]/30 bg-[#17202d]/95 px-5 py-3 text-sm shadow-2xl shadow-black/40"
            role="status" data-testid="status-toast"><Check size={16} className="text-[#e5bb63]" />{toast}</motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>{qrOpen && <QrModal onClose={() => setQrOpen(false)} />}</AnimatePresence>
      <AnimatePresence>{installOpen && <InstallModal onClose={() => setInstallOpen(false)} />}</AnimatePresence>
    </div>
  );
}

function Intro({ onSkip }: { onSkip: () => void }) {
  return (
    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .8 }}
      className="fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#080c14]">
      <div className="orb pulse-gold h-[26rem] w-[26rem]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(205,155,66,.12),transparent_48%)]" />
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.img initial={{ opacity: 0, scale: .86, filter: 'brightness(.25)' }} animate={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
          transition={{ delay: .8, duration: 2.5, ease: [.22, 1, .36, 1] }} src={LOGO} alt="KOT JINGRWAI KHASI logo"
          className="h-44 w-44 rounded-full object-cover shadow-[0_0_80px_rgba(216,173,88,.22)] sm:h-60 sm:w-60" />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.9, duration: 1 }}
          className="mt-8">
          <p className="serif text-xl tracking-wide text-[#f4e5c4] sm:text-3xl">KOT JINGRWAI KHASI</p>
          <p className="mt-3 text-[10px] uppercase tracking-[.3em] text-[#a9a69e]">Ka Ktien U Blei · Ki Jingrwai · Ka Jingngeit</p>
          <p className="mono mt-5 text-[10px] uppercase tracking-[.28em] text-[#d8ad58]">DA U JAMES SHYLLA</p>
        </motion.div>
      </div>
      <button onClick={onSkip} data-testid="button-skip-intro" className="absolute bottom-7 right-7 mono text-[10px] uppercase tracking-[.22em] text-[#8c929d] transition-colors hover:text-[#e5bb63]">Skip intro <ChevronRight size={13} className="ml-1 inline" /></button>
    </motion.div>
  );
}

function Header({ menu, setMenu }: { menu: boolean; setMenu: (open: boolean) => void }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/[.06] bg-[#0b1019]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <button onClick={() => scrollToId('home')} data-testid="button-home-nav" className="flex items-center gap-3 text-left">
          <img src={LOGO} alt="KOT JINGRWAI KHASI" className="h-10 w-10 rounded-full object-cover ring-1 ring-[#d8ad58]/40" />
          <span className="hidden text-[11px] font-semibold leading-tight tracking-[.18em] text-[#e7e1d4] sm:block">KOT JINGRWAI<br /><span className="text-[#d8ad58]">KHASI</span></span>
        </button>
        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map(([label, id]) => <button key={id} onClick={() => scrollToId(id)} data-testid={`link-nav-${id}`} className="mono text-[10px] uppercase tracking-[.12em] text-[#9da3ad] transition-colors hover:text-[#e5bb63]">{label}</button>)}
        </nav>
        <button onClick={() => setMenu(!menu)} data-testid="button-mobile-menu" className="rounded-full border border-white/10 p-2 text-[#e5bb63] md:hidden" aria-label="Open navigation">
          {menu ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      <AnimatePresence>{menu && <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-white/[.06] bg-[#111825] px-6 py-4 md:hidden">
        {navItems.map(([label, id]) => <button key={id} onClick={() => { scrollToId(id); setMenu(false); }} data-testid={`link-mobile-${id}`} className="block w-full border-b border-white/[.06] py-4 text-left mono text-[11px] uppercase tracking-[.15em] text-[#b8bbc0] last:border-0">{label}<ArrowRight size={14} className="float-right text-[#d8ad58]" /></button>)}
      </motion.nav>}</AnimatePresence>
    </header>
  );
}

function Hero({ onDownload }: { onDownload: () => void }) {
  return (
    <section id="home" className="relative min-h-[820px] overflow-hidden pt-28 sm:min-h-[850px]">
      <div className="hero-grid absolute inset-0 opacity-60" /><div className="orb left-[46%] top-32 h-72 w-72" /><div className="orb -right-24 top-1/2 h-96 w-96 opacity-[.05]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15, duration: .8 }}>
          <div className="eyebrow flex items-center gap-3"><span className="h-px w-8 bg-[#d8ad58]" />Official Khasi Christian Library</div>
          <h1 className="serif mt-7 max-w-3xl text-[clamp(3.3rem,9vw,7.8rem)] leading-[.91] tracking-[-.055em] text-[#f1e8d9]">Faith, <em className="font-normal text-[#d8ad58]">kept</em><br />close.</h1>
          <p className="serif mt-8 text-xl leading-relaxed text-[#d7d0c4] sm:max-w-xl sm:text-2xl">Ka Ktien U Blei <span className="text-[#d8ad58]">•</span> Ki Jingrwai <span className="text-[#d8ad58]">•</span> Ka Jingngeit</p>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#9299a5]">Kawei ka offline Khasi Christian library kaba pyniasoh ïa Ka Ktien U Blei, ki jingrwai, ka jingngeit bad ka jingpule ha kawei ka app.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={APK} download="KOT-JINGRWAI-KHASI.apk" onClick={onDownload} data-testid="link-download-hero" className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#e5bb63] px-6 py-4 text-sm font-bold text-[#111722] transition-transform hover:-translate-y-0.5"><Download size={17} /> Download the app <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></a>
            <button onClick={() => scrollToId('experience')} data-testid="button-explore-app" className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 px-6 py-4 text-sm font-semibold text-[#ddd8cd] transition-colors hover:border-[#d8ad58]/60 hover:text-[#e5bb63]">Explore the app <ChevronDown size={16} /></button>
          </div>
          <div className="mono mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[9px] uppercase tracking-[.15em] text-[#737c89]"><span>Android app</span><span className="text-[#d8ad58]">•</span><span>Version 1.0</span><span className="text-[#d8ad58]">•</span><span>Offline first</span></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: .92, y: 22 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: .35, duration: 1, ease: [.22, 1, .36, 1] }} className="relative mx-auto w-full max-w-[470px] lg:ml-auto">
          <div className="float relative aspect-square rounded-full p-[10px] shadow-[0_28px_100px_rgba(0,0,0,.5)]">
            <div className="absolute inset-0 rounded-full border border-[#d8ad58]/30" /><div className="absolute inset-4 rounded-full border border-[#d8ad58]/10" />
            <img src={LOGO} alt="Official KOT JINGRWAI KHASI artwork" className="relative h-full w-full rounded-full object-cover" />
          </div>
          <div className="glass absolute -bottom-5 -left-2 rounded-2xl px-4 py-3 sm:-left-8"><p className="mono text-[9px] uppercase tracking-[.16em] text-[#7f8793]">Built with purpose</p><p className="mt-1 text-sm text-[#e7dfd0]">Praise · Read · Sing · Grow</p></div>
          <div className="glass absolute -right-2 top-12 rounded-2xl px-4 py-3 sm:-right-8"><p className="mono text-[9px] uppercase tracking-[.16em] text-[#7f8793]">Always close</p><p className="mt-1 flex items-center gap-2 text-sm text-[#e7dfd0]"><span className="h-2 w-2 rounded-full bg-[#d8ad58]" />No internet required</p></div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 mx-auto flex max-w-7xl items-center gap-5 px-5 pb-7 sm:px-8 lg:px-12"><span className="mono text-[9px] tracking-[.2em] text-[#646c78]">01 / 09</span><div className="h-px flex-1 bg-white/10" /><span className="mono text-[9px] uppercase tracking-[.2em] text-[#646c78]">Scroll to discover</span></div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, children, align = 'left' }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode; align?: 'left' | 'center' }) {
  return <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}><div className="eyebrow">{eyebrow}</div><h2 className="serif mt-5 text-4xl leading-[1.04] tracking-[-.04em] text-[#ede6d8] sm:text-6xl">{title}</h2>{children && <p className="mt-6 text-base leading-8 text-[#9098a6]">{children}</p>}</div>;
}

function Story() {
  return <section id="about" className="relative border-t border-white/[.06] py-28 sm:py-36">
    <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"><div className="grid items-center gap-14 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
      <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .7 }} className="relative mx-auto w-full max-w-sm">
        <div className="absolute -inset-3 rounded-[2rem] border border-[#d8ad58]/20" /><div className="absolute -inset-8 rounded-[2rem] bg-[#d8ad58]/[.04]" />
        <img src={PORTRAIT} alt="James Shylla, developer and creator" data-testid="img-developer-portrait" className="relative aspect-[4/5] w-full rounded-[1.5rem] object-cover object-top grayscale-[.15]" />
        <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/15 bg-[#101621]/85 p-4 backdrop-blur-md"><p className="eyebrow">The creator</p><p className="serif mt-1 text-xl">James Shylla</p><p className="mt-1 text-xs text-[#9da3ad]">Developer & Creator</p></div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .7, delay: .1 }}>
        <SectionHeading eyebrow="A project with a heartbeat" title={<>Technology <em className="font-normal text-[#d8ad58]">with purpose.</em></>} />
        <p className="mt-8 text-lg leading-8 text-[#cec7ba]">James Shylla is the developer and creator of KOT JINGRWAI KHASI, a project created to bring Christian faith, the Khasi language, and technology together in one accessible application.</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2"><div><p className="eyebrow">The story behind it</p><p className="mt-3 text-sm leading-7 text-[#8f97a4]">Created to make the Word of God, Christian songs, choruses, confession and faith resources easier to find, read and use.</p></div><div><p className="eyebrow">My vision</p><p className="mt-3 text-sm leading-7 text-[#8f97a4]">Technology should solve real problems, be accessible, respect privacy and serve a meaningful purpose.</p></div></div>
        <div className="mt-10 flex flex-wrap gap-2">{['Privacy', 'Security', 'Offline First', 'No Advertisements', 'Simple & Accessible', 'Technology with Purpose'].map(item => <span key={item} className="rounded-full border border-white/10 bg-white/[.03] px-3 py-2 text-xs text-[#b9b5ad]">{item}</span>)}</div>
      </motion.div>
    </div></div>
  </section>;
}

function DownloadSection({ onDownload, onInstall }: { onDownload: () => void; onInstall: () => void }) {
  return <section id="download" className="relative py-16 sm:py-24"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"><div className="glass relative overflow-hidden rounded-[2rem] p-7 sm:p-12 lg:p-16"><div className="orb -right-10 -top-24 h-72 w-72 opacity-[.14]" /><div className="relative grid items-center gap-12 lg:grid-cols-[1fr_auto]"><div><div className="eyebrow">The official release</div><h2 className="serif mt-5 text-4xl tracking-[-.04em] text-[#eee7d9] sm:text-6xl">Download the<br /><span className="text-[#d8ad58]">library.</span></h2><p className="mt-6 max-w-lg text-base leading-8 text-[#9ea5b0]">Download the official Android application directly to your device. Your faith resources, ready when you are.</p><div className="mt-8 flex flex-wrap gap-2">{['Version 1.0', 'Android', 'Offline-first', 'No ads', 'No tracking'].map((x, i) => <span key={x} className="mono rounded-full border border-[#d8ad58]/20 px-3 py-2 text-[9px] uppercase tracking-[.12em] text-[#b4a98d]">{i === 0 ? '01 · ' : ''}{x}</span>)}</div></div><div className="flex flex-col items-start gap-4 lg:items-end"><a href={APK} download="KOT-JINGRWAI-KHASI.apk" onClick={onDownload} data-testid="link-download-apk" className="inline-flex items-center gap-3 rounded-full bg-[#e5bb63] px-7 py-4 text-sm font-bold text-[#111722] transition-transform hover:-translate-y-0.5"><Download size={18} /> Download APK</a><button onClick={onInstall} data-testid="button-install-guide" className="inline-flex items-center gap-2 px-3 py-2 text-sm text-[#aeb3ba] hover:text-[#e5bb63]">How to install <ArrowRight size={15} /></button></div></div></div></div></section>;
}

const features = [
  [BookOpen, 'Kotbah Bible', 'Ka Baibl Khasi kaba don baroh 66 tylli ki kitab.'],
  [Music2, 'Kot Jingrwai', 'Tynrai 1–639 bad Chorus 1–38.'],
  [Sparkles, 'Ka Jingngeit', 'Ki jingïarap ban pynskhem ïa ka jingngeit.'],
  [ShieldCheck, 'Shiphew Hukum', 'Ki hukum ban pule bad pyrkhat man la ka sngi.'],
  [Search, 'Search', 'Lap kloi ïa ka ktien kaba phi wad.'],
  [Heart, 'Favorites', 'Buh kyrpang ïa ki bynta kiba donkam.'],
  [Star, 'Recently opened', 'Nangta biang ha kaba phi la sah.'],
  [Smartphone, 'Offline', 'Ka library jong phi, wat khlem internet.'],
] as const;

function Features() {
  return <section id="features" className="border-t border-white/[.06] py-28 sm:py-36"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"><SectionHeading eyebrow="A pocket-sized library" title={<>Ka Aip <em className="font-normal text-[#d8ad58]">Ka Aiu?</em></>} align="center">Everything you need for reading, singing, listening and growing — brought together in one quiet place.</SectionHeading><div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[.08] bg-white/[.08] sm:grid-cols-2 lg:grid-cols-4">{features.map(([Icon, title, text], index) => <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ delay: index * .05 }} className="group bg-[#101722] p-6 transition-colors hover:bg-[#17202d]"><div className="flex items-center justify-between"><Icon size={21} strokeWidth={1.5} className="text-[#d8ad58]" /><span className="mono text-[9px] text-[#596371]">0{index + 1}</span></div><h3 className="serif mt-10 text-xl text-[#e2dcd0]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#808996]">{text}</p></motion.div>)}</div></div></section>;
}

function Experience() {
  const panels = useMemo(() => [{ label: 'Home', accent: 'A daily place to return to', icon: <BookOpen /> }, { label: 'Bible', accent: 'The Word in Khasi', icon: <BookOpen /> }, { label: 'Songs', accent: 'Praise that travels with you', icon: <Music2 /> }], []);
  return <section id="experience" className="relative overflow-hidden border-t border-white/[.06] py-28 sm:py-36"><div className="orb -left-40 top-20 h-96 w-96" /><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"><div className="grid gap-16 lg:grid-cols-[.75fr_1.25fr] lg:items-center"><SectionHeading eyebrow="Inside the app" title={<>A quiet place<br /><em className="font-normal text-[#d8ad58]">to return to.</em></>}><span className="serif text-2xl text-[#d2c9b8]">Pule. Rwih. Sngap. Pyrkhat.</span><br />Tip jingïaleh. Nangroi ha ka jingngeit.</SectionHeading><div className="relative grid grid-cols-3 items-end gap-3 sm:gap-5">{panels.map((p, i) => <motion.div key={p.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .14 }} className={`glass overflow-hidden rounded-[1.5rem] ${i === 1 ? 'float -translate-y-8' : ''}`}><div className="flex items-center gap-2 border-b border-white/10 px-3 py-3 sm:px-4"><span className="text-[#d8ad58] [&>svg]:h-3 [&>svg]:w-3">{p.icon}</span><span className="text-[10px] text-[#dcd6cb] sm:text-xs">{p.label}</span></div><div className="relative aspect-[.62] bg-[#e8e0ce] p-3 text-[#141b25] sm:p-5"><div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-[#c99c47]" /><div className="pt-7"><p className="serif text-base sm:text-2xl">KOT<br />JINGRWAI</p><div className="mt-6 h-1 w-10 bg-[#c99c47]" /><p className="mt-3 text-[8px] leading-4 text-[#536171] sm:text-[10px]">{p.accent}</p></div><div className="absolute bottom-3 left-3 right-3 border-t border-[#141b25]/15 pt-2 text-[7px] uppercase tracking-wider text-[#536171] sm:bottom-5 sm:left-5 sm:right-5">Praise · Read · Sing · Grow</div></div></motion.div>)}</div></div></div></section>;
}

function Offline() {
  return <section className="relative border-y border-white/[.06] bg-[#0e1520] py-28 sm:py-36"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"><div className="grid items-center gap-12 lg:grid-cols-[1fr_.8fr]"><div><div className="eyebrow">Designed for real life</div><h2 className="serif mt-5 max-w-xl text-5xl leading-[.98] tracking-[-.05em] text-[#eee6d7] sm:text-7xl">Offline.<br /><span className="text-[#d8ad58]">Always close.</span></h2><p className="mt-8 max-w-xl text-lg leading-8 text-[#a1a8b2]">Ka app la pynwandur ban treikam offline, khnang ba ki jingthoh bad ki jingrwai kin long hajan jong phi wat haba ym don internet.</p></div><div className="grid gap-3">{['No constant internet required', 'No advertisements', 'No unnecessary tracking'].map((x, i) => <div key={x} className="glass flex items-center gap-4 rounded-xl p-5"><span className="mono text-xs text-[#d8ad58]">0{i + 1}</span><span className="text-sm text-[#dcd6cb]">{x}</span><Check size={16} className="ml-auto text-[#d8ad58]" /></div>)}</div></div></div></section>;
}

function Install({ onInstall }: { onInstall: () => void }) {
  return <section className="py-28 sm:py-36"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><SectionHeading eyebrow="A gentle beginning" title={<>Kumno ban<br /><em className="font-normal text-[#d8ad58]">install.</em></>}><button onClick={onInstall} data-testid="button-open-install" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#e5bb63]">View the full guide <ArrowRight size={15} /></button></SectionHeading><div className="grid gap-0 sm:grid-cols-3">{[['01', 'Download the APK', 'Tap the download button and save the official file.'], ['02', 'Open the downloaded APK', 'Find it in your Downloads folder and open it.'], ['03', "Follow Android's instructions", 'Allow installation when prompted, then begin.']].map(([n, t, d]) => <div key={n} className="border-l border-white/10 py-5 pl-5 sm:py-2"><span className="mono text-[10px] text-[#d8ad58]">STEP {n}</span><h3 className="serif mt-5 text-2xl text-[#ddd6ca]">{t}</h3><p className="mt-3 text-sm leading-6 text-[#828b98]">{d}</p></div>)}</div></div></div></section>;
}

function Support({ onCopy, onPay, onViewQr }: { onCopy: () => void; onPay: () => void; onViewQr: () => void }) {
  return <section id="support" className="border-t border-white/[.06] bg-[#101722] py-28 sm:py-36"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"><div className="grid items-center gap-14 lg:grid-cols-[1fr_.9fr]"><div><div className="eyebrow flex items-center gap-2"><Heart size={13} /> A project held by many hands</div><h2 className="serif mt-5 max-w-xl text-5xl leading-[1] tracking-[-.05em] text-[#eee6d7] sm:text-7xl">Support the<br /><span className="text-[#d8ad58]">project.</span></h2><p className="mt-8 max-w-lg text-base leading-8 text-[#b1b4b6]">Lada phi sngewtynnad ïa kane ka project bad phi kwah ban kyrshan ïa ka jingtrei, phi lah ban ai jingïarap lyngba ka donation.</p><div className="mt-8 flex flex-wrap items-center gap-3"><button onClick={onCopy} data-testid="button-copy-upi" className="inline-flex items-center gap-2 rounded-full bg-[#e5bb63] px-5 py-3 text-sm font-semibold text-[#121923]"><Clipboard size={15} /> Copy UPI ID</button><button onClick={onPay} data-testid="button-pay-upi" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-[#e6dfd2] hover:border-[#d8ad58]/60"><ExternalLink size={15} /> Pay with UPI</button></div><div className="mt-5 flex items-center gap-3 rounded-lg border border-white/10 bg-black/10 px-4 py-3"><span className="mono text-xs text-[#d8ad58]">UPI</span><span className="select-all text-sm text-[#d3cec3]" data-testid="text-upi-id">{UPI}</span></div><p className="mt-4 text-xs leading-5 text-[#737d89]">No UPI PIN, OTP, card details or passwords are collected here. Payment is handled by your chosen UPI app.</p></div><div className="mx-auto w-full max-w-sm"><div className="rounded-[1.75rem] bg-[#f5f2eb] p-5 shadow-2xl shadow-black/30 sm:p-7"><img src={QR} alt="Official UPI QR code for supporting KOT JINGRWAI KHASI" data-testid="img-upi-qr" className="h-auto w-full" /><button onClick={onViewQr} data-testid="button-view-qr" className="mt-4 flex w-full items-center justify-between border-t border-black/10 pt-4 text-left text-sm font-semibold text-[#20242a]">View QR larger <ArrowRight size={15} /></button></div><p className="mono mt-5 text-center text-[9px] uppercase tracking-[.18em] text-[#68717e]">Scan with any supported UPI app</p></div></div></div></section>;
}

function Scripture({ onDownload }: { onDownload: () => void }) {
  return <section className="relative overflow-hidden py-32 sm:py-48"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(189,143,57,.11),transparent_48%)]" /><div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8"><div className="eyebrow">A word to carry with you</div><blockquote className="serif mt-8 text-3xl leading-[1.15] tracking-[-.03em] text-[#eee7d9] sm:text-6xl">“Whatever you do, do it all for the glory of God.”</blockquote><p className="mono mt-7 text-[10px] uppercase tracking-[.2em] text-[#d8ad58]">1 Corinthians 10:31</p><div className="my-16 section-line" /><p className="mx-auto max-w-2xl text-base leading-8 text-[#969eaa]">This project was created to make Christian resources easier to access. It is built with faith, purpose and love for the Khasi community. Anyone who finds the application useful is welcome to support its continued development.</p><p className="serif mt-10 text-4xl text-[#d8ad58]">Amen.</p><div className="mt-20"><p className="eyebrow">Ready to begin?</p><h2 className="serif mt-5 text-4xl text-[#eee7d9] sm:text-6xl">KOT JINGRWAI KHASI</h2><p className="mt-4 text-sm text-[#9ca3ae]">Ka Ktien U Blei <span className="text-[#d8ad58]">•</span> Ki Jingrwai <span className="text-[#d8ad58]">•</span> Ka Jingngeit</p><a href={APK} download="KOT-JINGRWAI-KHASI.apk" onClick={onDownload} data-testid="link-download-final" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#e5bb63] px-7 py-4 text-sm font-bold text-[#111722]"><Download size={17} /> Download the app</a><p className="mono mt-5 text-[9px] uppercase tracking-[.18em] text-[#727b88]">Android · Version 1.0 · Offline first</p></div></div></section>;
}

function Footer({ onNavigate }: { onNavigate: (id: string) => void }) {
  return <footer className="border-t border-white/[.08] bg-[#090e16] py-12"><div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 sm:px-8 lg:px-12"><div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start"><div className="flex items-center gap-3"><img src={LOGO} alt="KOT JINGRWAI KHASI logo" className="h-12 w-12 rounded-full object-cover" /><div><p className="text-xs font-bold tracking-[.16em] text-[#ddd6ca]">KOT JINGRWAI KHASI</p><p className="mt-2 text-xs text-[#7d8591]">Ka Ktien U Blei · Ki Jingrwai · Ka Jingngeit</p><p className="mt-2 mono text-[9px] uppercase tracking-[.12em] text-[#d8ad58]">Da u James Shylla · Developer & Creator</p></div></div><div className="flex flex-wrap gap-x-6 gap-y-3 sm:justify-end">{[['Home', 'home'], ['About', 'about'], ['Features', 'features'], ['Download', 'download'], ['Support', 'support']].map(([x, id]) => <button key={id} onClick={() => onNavigate(id)} data-testid={`link-footer-${id}`} className="text-xs text-[#8b939f] hover:text-[#e5bb63]">{x}</button>)}</div></div><div className="section-line" /><div className="flex flex-col justify-between gap-3 text-[10px] text-[#626c79] sm:flex-row"><span>© 2026 KOT JINGRWAI KHASI</span><span>Made with faith, purpose and care.</span></div></div></footer>;
}

function QrModal({ onClose }: { onClose: () => void }) {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-[#05080d]/90 p-5 backdrop-blur-md" onClick={onClose}><motion.div initial={{ scale: .92, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .92, y: 14 }} onClick={e => e.stopPropagation()} className="relative w-full max-w-md rounded-3xl bg-[#f5f2eb] p-5 shadow-2xl"><button onClick={onClose} data-testid="button-close-qr" className="absolute right-3 top-3 rounded-full bg-black/10 p-2 text-[#111722]" aria-label="Close QR viewer"><X size={17} /></button><img src={QR} alt="Enlarged official UPI QR code" className="w-full" /><p className="mt-3 text-center text-xs text-[#31363d]">UPI ID: {UPI}</p></motion.div></motion.div>;
}

function InstallModal({ onClose }: { onClose: () => void }) {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-[#05080d]/85 p-5 backdrop-blur-md" onClick={onClose}><motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onClick={e => e.stopPropagation()} className="glass relative w-full max-w-lg rounded-3xl p-7 sm:p-10"><button onClick={onClose} data-testid="button-close-install" className="absolute right-5 top-5 rounded-full border border-white/10 p-2 text-[#aeb5bf]" aria-label="Close installation guide"><X size={17} /></button><div className="eyebrow">Android installation</div><h2 className="serif mt-4 text-4xl text-[#eee7d9]">Kumno ban install</h2><div className="mt-8 space-y-5">{[['01', 'Download the APK', 'Use the official download button on this page.'], ['02', 'Open the downloaded APK', 'Open your Downloads folder and tap the file.'], ['03', "Follow Android's instructions", 'If Android asks, allow this source for installation. Then follow the prompts.']].map(([n, t, d]) => <div key={n} className="flex gap-4 border-b border-white/10 pb-5 last:border-0"><span className="mono pt-1 text-[10px] text-[#d8ad58]">{n}</span><div><h3 className="font-semibold text-[#e0d9cd]">{t}</h3><p className="mt-1 text-sm leading-6 text-[#8e97a4]">{d}</p></div></div>)}</div><button onClick={onClose} data-testid="button-done-install" className="mt-5 rounded-full border border-[#d8ad58]/40 px-5 py-3 text-sm text-[#e5bb63]">Done</button></motion.div></motion.div>;
}

export default App;