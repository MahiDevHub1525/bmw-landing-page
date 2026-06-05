import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Models", "Technology", "Experience", "Innovation", "Contact"];

const STATS = [
  { value: "3.9s", label: "0–100 km/h" },
  { value: "340", label: "km/h Top Speed" },
  { value: "600", label: "HP Engine Power" },
  { value: "2024", label: "Design Award" },
];

const FEATURES = [
  {
    id: "01",
    title: "Aerodynamic Mastery",
    desc: "Every curve sculpted by wind tunnel precision. The body generates active downforce at speed, keeping you planted while minimizing drag to its physical limit.",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  {
    id: "02",
    title: "Adaptive Intelligence",
    desc: "Neural network driving dynamics that learn your preferences in real-time. The car anticipates the road, not just reacts to it — corner by corner, sensation by sensation.",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2",
  },
  {
    id: "03",
    title: "Pure Electric Soul",
    desc: "Twin electric motors delivering instant torque across every rev range. Zero emissions, maximum presence. The future of performance has arrived — and it is silent thunder.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    id: "04",
    title: "Cockpit Immersion",
    desc: "A curved panoramic display wraps the driver in 32 inches of OLED presence. Every control is where instinct expects it — designed for the driver, not the passenger.",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  },
];

const MODELS = [
  { name: "M Vision NEXT", tag: "CONCEPT 2024", color: "#00d4ff" },
  { name: "i8 Prophecy", tag: "HYBRID SPORTS", color: "#ff6b35" },
  { name: "M4 CSL Ghost", tag: "TRACK EDITION", color: "#a855f7" },
];

// ─── UTILITY ─────────────────────────────────────────────────────────────────

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const isFloat = target.toString().includes(".");
    const numTarget = parseFloat(target);
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(isFloat ? (numTarget * eased).toFixed(1) : Math.floor(numTarget * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e) => setHovered(e.target.closest("button, a, [data-cursor]") !== null);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, []);
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-[#00d4ff] rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{ x: pos.x - 6, y: pos.y - 6, scale: hovered ? 2.5 : 1 }}
        transition={{ type: "spring", stiffness: 800, damping: 35 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-[#00d4ff]/40 rounded-full pointer-events-none z-[9998]"
        animate={{ x: pos.x - 16, y: pos.y - 16, scale: hovered ? 1.5 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      />
    </>
  );
}

function Navbar({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
          <div className="w-10 h-10 relative">
            <div className="absolute inset-0 rounded-full border-2 border-white/20 bg-black/60 backdrop-blur-sm" />
            <div className="absolute inset-[3px] rounded-full border border-[#00d4ff]/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-black text-xs tracking-tight leading-none text-center">BMW</span>
            </div>
          </div>
          <div>
            <div className="text-white font-semibold text-sm tracking-[0.2em] uppercase">BMW</div>
            <div className="text-white/40 text-[9px] tracking-[0.4em] uppercase">Concept Series</div>
          </div>
        </motion.div>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link, i) => (
            <motion.a
              key={link}
              href="#"
              className="text-white/60 hover:text-white text-sm tracking-[0.15em] uppercase transition-colors relative group"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
            >
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00d4ff] group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <motion.button
            className="text-white/60 hover:text-white text-sm tracking-[0.15em] uppercase transition-colors"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          >
            Sign In
          </motion.button>
          <motion.button
            className="px-5 py-2.5 bg-[#00d4ff] text-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Configure
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <motion.span className="w-6 h-px bg-white block" animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }} />
          <motion.span className="w-4 h-px bg-white block" animate={{ opacity: menuOpen ? 0 : 1 }} />
          <motion.span className="w-6 h-px bg-white block" animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/5 px-6 py-8 flex flex-col gap-6"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
          >
            {NAV_LINKS.map((link) => (
              <a key={link} href="#" className="text-white/60 hover:text-white text-lg tracking-[0.2em] uppercase transition-colors">{link}</a>
            ))}
            <button className="mt-4 w-full py-4 bg-[#00d4ff] text-black text-sm font-bold tracking-[0.2em] uppercase">Configure Now</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-black">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.15) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)"
        }} />
      </div>

      {/* Glow orbs */}
      <motion.div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)" }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Car silhouette / hero visual */}
      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ y, scale }}>
        <div className="relative w-full max-w-5xl mx-auto px-6">
          {/* Car body SVG */}
          <motion.svg
            viewBox="0 0 1000 400"
            className="w-full max-w-3xl mx-auto opacity-90"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <defs>
              <linearGradient id="carGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a1a2e" />
                <stop offset="50%" stopColor="#16213e" />
                <stop offset="100%" stopColor="#0f3460" />
              </linearGradient>
              <linearGradient id="bodyHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <linearGradient id="neonLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,212,255,0)" />
                <stop offset="30%" stopColor="#00d4ff" />
                <stop offset="70%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="rgba(0,212,255,0)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="strongGlow">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Ground reflection */}
            <ellipse cx="500" cy="370" rx="400" ry="20" fill="rgba(0,212,255,0.04)" />
            <line x1="100" y1="358" x2="900" y2="358" stroke="rgba(0,212,255,0.15)" strokeWidth="1" />

            {/* Main car body */}
            <path d="M 80 300 L 60 260 Q 60 240 80 235 L 200 220 Q 280 160 420 140 L 600 135 Q 720 135 800 165 L 900 200 Q 940 210 950 240 L 960 280 L 960 310 Z"
              fill="url(#carGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <path d="M 80 300 L 60 260 Q 60 240 80 235 L 200 220 Q 280 160 420 140 L 600 135 Q 720 135 800 165 L 900 200 Q 940 210 950 240 L 960 280"
              fill="url(#bodyHighlight)" opacity="0.6" />

            {/* Roofline */}
            <path d="M 220 220 Q 290 145 430 118 L 610 115 Q 730 115 820 155 L 880 185"
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

            {/* Windshield */}
            <path d="M 250 218 Q 310 155 440 125 L 570 122 L 630 175 Z"
              fill="rgba(0,212,255,0.04)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.5" />

            {/* Rear window */}
            <path d="M 640 175 L 720 125 Q 790 120 840 150 L 870 175 Z"
              fill="rgba(0,212,255,0.03)" stroke="rgba(0,212,255,0.15)" strokeWidth="0.5" />

            {/* Side windows */}
            <path d="M 252 215 Q 310 158 440 127 L 568 124 L 628 173 Z"
              fill="rgba(100,200,255,0.06)" />

            {/* Door lines */}
            <line x1="480" y1="135" x2="520" y2="305" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="650" y1="130" x2="670" y2="305" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

            {/* Front grille - BMW kidney */}
            <path d="M 72 255 Q 75 240 95 237 L 140 235 Q 155 235 157 255 L 155 270 Q 155 280 140 282 L 95 282 Q 80 282 72 272 Z"
              fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.4)" strokeWidth="1.5" filter="url(#glow)" />
            <line x1="115" y1="235" x2="115" y2="282" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
            {[242, 247, 252, 257, 262, 267, 272, 277].map((y, i) => (
              <line key={i} x1="72" y1={y} x2="157" y2={y} stroke="rgba(0,212,255,0.2)" strokeWidth="0.5" />
            ))}

            {/* Headlight LED strip */}
            <path d="M 65 228 Q 100 215 165 215 L 210 218"
              fill="none" stroke="#00d4ff" strokeWidth="2.5" filter="url(#glow)" opacity="0.9" />
            <path d="M 65 228 Q 100 215 165 215 L 210 218"
              fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="8" />

            {/* Taillight strip */}
            <path d="M 940 235 L 960 240 L 965 275 L 945 278"
              fill="none" stroke="rgba(255,50,50,0.8)" strokeWidth="2.5" filter="url(#glow)" />
            <path d="M 940 235 L 960 240 L 965 275 L 945 278"
              fill="none" stroke="rgba(255,50,50,0.2)" strokeWidth="8" />

            {/* Neon underline */}
            <motion.path
              d="M 150 305 L 850 305"
              fill="none" stroke="url(#neonLine)" strokeWidth="1.5"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
            />

            {/* Front wheel */}
            <circle cx="210" cy="310" r="52" fill="#0a0a0f" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <circle cx="210" cy="310" r="42" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1" filter="url(#glow)" />
            <circle cx="210" cy="310" r="20" fill="#141428" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" filter="url(#glow)" />
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line key={i}
                  x1={210 + 22 * Math.cos(rad)} y1={310 + 22 * Math.sin(rad)}
                  x2={210 + 40 * Math.cos(rad)} y2={310 + 40 * Math.sin(rad)}
                  stroke="rgba(255,255,255,0.2)" strokeWidth="2"
                />
              );
            })}

            {/* Rear wheel */}
            <circle cx="780" cy="310" r="52" fill="#0a0a0f" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <circle cx="780" cy="310" r="42" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1" filter="url(#glow)" />
            <circle cx="780" cy="310" r="20" fill="#141428" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" filter="url(#glow)" />
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line key={i}
                  x1={780 + 22 * Math.cos(rad)} y1={310 + 22 * Math.sin(rad)}
                  x2={780 + 40 * Math.cos(rad)} y2={310 + 40 * Math.sin(rad)}
                  stroke="rgba(255,255,255,0.2)" strokeWidth="2"
                />
              );
            })}
          </motion.svg>
        </div>
      </motion.div>

      {/* Hero text */}
      <motion.div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 w-full" style={{ opacity }}>
        <div className="max-w-2xl">
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="w-8 h-px bg-[#00d4ff]" />
            <span className="text-[#00d4ff] text-xs tracking-[0.4em] uppercase font-medium">2024 Concept Series</span>
          </motion.div>

          <motion.h1
            className="text-6xl lg:text-8xl xl:text-9xl font-black text-white leading-[0.9] tracking-tight mb-6"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block">THE</span>
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #00d4ff, #a855f7)" }}>
              ULTIMATE
            </span>
            <span className="block">MACHINE</span>
          </motion.h1>

          <motion.p
            className="text-white/50 text-base lg:text-lg leading-relaxed mb-10 max-w-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Born from a century of motorsport heritage. Engineered for the road ahead. Experience the convergence of electric power and analog soul.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.button
              className="group flex items-center gap-3 px-8 py-4 bg-[#00d4ff] text-black text-sm font-bold tracking-[0.2em] uppercase hover:bg-white transition-all"
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Model
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
            <motion.button
              className="flex items-center gap-3 px-8 py-4 border border-white/20 text-white/80 hover:text-white hover:border-white/60 text-sm font-medium tracking-[0.15em] uppercase transition-all backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Watch Film
              <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        style={{ opacity }}
      >
        <span className="text-white/30 text-[10px] tracking-[0.4em] uppercase">Scroll</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-[#00d4ff] to-transparent"
          animate={{ scaleY: [1, 0.3, 1], opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Side info */}
      <motion.div
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-6"
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}
      >
        {["M", "3", "4"].map((item, i) => (
          <motion.div
            key={i}
            className="w-8 h-8 border border-white/10 flex items-center justify-center text-white/30 text-xs hover:border-[#00d4ff]/50 hover:text-[#00d4ff] cursor-pointer transition-all"
            whileHover={{ scale: 1.1 }}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function StatCard({ value, label, index, inView }) {
  const numericPart = parseFloat(value);
  const suffix = value.replace(String(numericPart), "");
  const count = useCountUp(numericPart, 2000, inView);

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="border border-white/8 bg-white/2 backdrop-blur-sm p-8 relative overflow-hidden group-hover:border-[#00d4ff]/30 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="text-4xl lg:text-5xl font-black text-white mb-2">
          {count}{suffix}
        </div>
        <div className="text-white/40 text-xs tracking-[0.3em] uppercase">{label}</div>
        <div className="absolute bottom-0 left-0 w-0 h-px bg-[#00d4ff] group-hover:w-full transition-all duration-500" />
      </div>
    </motion.div>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-20 border-y border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-black py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(0,212,255,0.03) 0%, transparent 70%)" }} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#00d4ff]" />
            <span className="text-[#00d4ff] text-xs tracking-[0.4em] uppercase">Engineering Excellence</span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-white leading-tight max-w-2xl">
            Crafted at the<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #00d4ff, #a855f7)" }}>
              Limit of Physics
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Feature list */}
          <div className="space-y-0">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.id}
                className={`group cursor-pointer border-b border-white/8 py-8 relative transition-all duration-300 ${active === i ? "border-b-[#00d4ff]/30" : "hover:border-b-white/20"}`}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, x: -40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1 + 0.2 }}
              >
                <div className="flex items-start gap-6">
                  <span className={`text-xs font-mono tracking-widest transition-colors ${active === i ? "text-[#00d4ff]" : "text-white/20"}`}>
                    {feature.id}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-0">
                      <h3 className={`text-lg font-bold tracking-wide transition-colors ${active === i ? "text-white" : "text-white/60 group-hover:text-white/90"}`}>
                        {feature.title}
                      </h3>
                      <motion.svg
                        className={`w-4 h-4 transition-colors ml-auto ${active === i ? "text-[#00d4ff]" : "text-white/20"}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        animate={{ rotate: active === i ? 90 : 0 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </div>
                    <AnimatePresence>
                      {active === i && (
                        <motion.p
                          className="text-white/50 text-sm leading-relaxed mt-3"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {feature.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                {active === i && (
                  <motion.div
                    className="absolute left-0 top-0 w-0.5 h-full bg-[#00d4ff]"
                    layoutId="activeBar"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Feature visual */}
          <motion.div
            className="relative lg:sticky lg:top-32"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="relative aspect-square bg-gradient-to-br from-[#0a0a1a] to-[#050510] border border-white/5 flex items-center justify-center overflow-hidden"
                initial={{ opacity: 0, rotateY: 20 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Animated icon visualization */}
                <div className="relative">
                  {/* Outer ring */}
                  <motion.div
                    className="w-48 h-48 rounded-full border border-[#00d4ff]/10 absolute -inset-8"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="w-32 h-32 rounded-full border border-dashed border-[#00d4ff]/20 absolute -inset-2"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Icon */}
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#00d4ff]/10 to-[#a855f7]/10 flex items-center justify-center relative z-10 border border-[#00d4ff]/20">
                    <svg className="w-12 h-12 text-[#00d4ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} filter="url(#glow)">
                      <path strokeLinecap="round" strokeLinejoin="round" d={FEATURES[active].icon} />
                    </svg>
                  </div>
                </div>

                {/* Corner decorations */}
                {[["top-4 left-4", "border-t border-l"], ["top-4 right-4", "border-t border-r"], ["bottom-4 left-4", "border-b border-l"], ["bottom-4 right-4", "border-b border-r"]].map(([pos, border], i) => (
                  <div key={i} className={`absolute ${pos} w-6 h-6 ${border} border-[#00d4ff]/30`} />
                ))}

                {/* Pulsing glow */}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "radial-gradient(circle at center, rgba(0,212,255,0.08) 0%, transparent 60%)" }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Feature number */}
                <div className="absolute top-6 right-6 text-6xl font-black text-white/3">{FEATURES[active].id}</div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ModelsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[#030308] py-32 relative overflow-hidden">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,212,255,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(168,85,247,0.04) 0%, transparent 50%)`
      }} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          className="flex items-end justify-between mb-16 flex-wrap gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#00d4ff]" />
              <span className="text-[#00d4ff] text-xs tracking-[0.4em] uppercase">Vehicle Lineup</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight">
              Choose Your<br />Legend
            </h2>
          </div>
          <motion.button
            className="text-white/40 hover:text-white text-sm tracking-[0.2em] uppercase flex items-center gap-2 transition-colors group"
            whileHover={{ x: 4 }}
          >
            View All Models
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {MODELS.map((model, i) => (
            <motion.div
              key={model.name}
              className="group relative bg-gradient-to-b from-white/3 to-transparent border border-white/8 overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              {/* Model image placeholder with car illustration */}
              <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-[#0a0a1a] to-[#050510] flex items-center justify-center">
                <motion.div
                  className="w-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                >
                  <svg viewBox="0 0 400 200" className="w-full px-4">
                    <defs>
                      <linearGradient id={`modelGrad${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={`${model.color}22`} />
                        <stop offset="100%" stopColor="#0a0a1a" />
                      </linearGradient>
                    </defs>
                    {/* Simple car side view */}
                    <path d={`M 30 140 L 20 110 Q 20 95 35 90 L 90 82 Q 140 45 200 40 L 290 40 Q 345 40 375 65 L 390 90 Q 400 100 400 120 L 400 145 Z`}
                      fill={`url(#modelGrad${i})`} stroke={`${model.color}40`} strokeWidth="1" />
                    <path d={`M 100 90 Q 155 50 205 42 L 285 40 Q 335 42 370 62 L 390 85`}
                      fill="none" stroke={`${model.color}80`} strokeWidth="1.5" />
                    {/* Windshield */}
                    <path d="M 110 88 Q 155 55 210 44 L 268 43 L 295 82 Z" fill={`${model.color}08`} stroke={`${model.color}30`} strokeWidth="0.8" />
                    {/* Front headlight */}
                    <path d="M 25 95 Q 45 80 70 80 L 90 82" fill="none" stroke={model.color} strokeWidth="2" opacity="0.8" />
                    {/* Tail light */}
                    <path d="M 395 90 L 400 110 L 395 125" fill="none" stroke="rgba(255,50,50,0.7)" strokeWidth="2" />
                    {/* Front wheel */}
                    <circle cx="100" cy="148" r="28" fill="#050510" stroke={`${model.color}40`} strokeWidth="1.5" />
                    <circle cx="100" cy="148" r="12" fill="#0a0a1a" stroke={`${model.color}60`} strokeWidth="1.5" />
                    {/* Rear wheel */}
                    <circle cx="310" cy="148" r="28" fill="#050510" stroke={`${model.color}40`} strokeWidth="1.5" />
                    <circle cx="310" cy="148" r="12" fill="#0a0a1a" stroke={`${model.color}60`} strokeWidth="1.5" />
                    {/* Neon glow under car */}
                    <line x1="60" y1="172" x2="350" y2="172" stroke={model.color} strokeWidth="1" opacity="0.3" />
                    <ellipse cx="205" cy="172" rx="180" ry="6" fill={model.color} opacity="0.05" />
                  </svg>
                </motion.div>

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${model.color}08, transparent)` }}
                />

                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] tracking-[0.3em] uppercase font-medium px-2 py-1 border"
                    style={{ color: model.color, borderColor: `${model.color}40`, background: `${model.color}10` }}>
                    {model.tag}
                  </span>
                </div>
              </div>

              {/* Card info */}
              <div className="p-6">
                <h3 className="text-white text-xl font-bold tracking-wide mb-2 group-hover:text-white transition-colors">
                  {model.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-xs tracking-[0.2em] uppercase">From €124,900</span>
                  <motion.button
                    className="w-8 h-8 border flex items-center justify-center text-xs group-hover:bg-[#00d4ff] group-hover:border-[#00d4ff] group-hover:text-black transition-all"
                    style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)" }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500"
                style={{ backgroundColor: model.color }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const specs = [
    { label: "Engine", value: "4.4L TwinPower Turbo V8" },
    { label: "Power Output", value: "600 HP / 750 Nm" },
    { label: "Transmission", value: "8-Speed M Steptronic" },
    { label: "Drive System", value: "M xDrive AWD" },
    { label: "Wheelbase", value: "2,985 mm" },
    { label: "Kerb Weight", value: "1,770 kg" },
  ];

  return (
    <section ref={ref} className="bg-black py-32 relative overflow-hidden">
      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[20vw] font-black text-white/[0.015] select-none whitespace-nowrap">POWER</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#00d4ff]" />
              <span className="text-[#00d4ff] text-xs tracking-[0.4em] uppercase">Specifications</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-8">
              Pure<br />Performance<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #00d4ff, #a855f7)" }}>
                Data
              </span>
            </h2>
            <p className="text-white/40 leading-relaxed mb-12 max-w-md">
              Numbers don't lie. The M Vision NEXT translates decades of motorsport DNA into measurable supremacy on both track and street.
            </p>
            <motion.button
              className="flex items-center gap-3 px-8 py-4 border border-[#00d4ff]/30 text-[#00d4ff] text-sm font-medium tracking-[0.2em] uppercase hover:bg-[#00d4ff] hover:text-black transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Full Specifications
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-0"
          >
            {specs.map((spec, i) => (
              <motion.div
                key={spec.label}
                className="flex items-center justify-between py-5 border-b border-white/5 group hover:border-white/15 transition-colors"
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 + 0.4 }}
              >
                <span className="text-white/30 text-sm tracking-[0.15em] uppercase group-hover:text-white/50 transition-colors">{spec.label}</span>
                <span className="text-white text-sm font-semibold tracking-wide">{spec.value}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-[#030308] py-32 relative overflow-hidden">
      {/* Animated grid lines */}
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.3 } : {}}
        transition={{ duration: 1.5 }}
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%)"
        }}
      />

      {/* Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,212,255,0.06) 0%, transparent 70%)" }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-px bg-[#00d4ff]/50" />
            <span className="text-[#00d4ff] text-xs tracking-[0.4em] uppercase">Reserve Today</span>
            <div className="w-12 h-px bg-[#00d4ff]/50" />
          </div>

          <h2 className="text-6xl lg:text-8xl font-black text-white leading-tight mb-8">
            Your Legend<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #00d4ff 0%, #a855f7 50%, #00d4ff 100%)", backgroundSize: "200% 100%" }}>
              Awaits
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Configure your BMW M Vision NEXT. Every detail, your choice. Production limited to 500 units worldwide.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.button
              className="px-10 py-5 bg-[#00d4ff] text-black text-sm font-bold tracking-[0.25em] uppercase hover:bg-white transition-all"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Begin Configuration
            </motion.button>
            <motion.button
              className="px-10 py-5 border border-white/20 text-white/70 hover:text-white hover:border-white/50 text-sm font-medium tracking-[0.2em] uppercase transition-all backdrop-blur-sm"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Book Test Drive
            </motion.button>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-12 text-center">
            {["Free Delivery", "5-Year Warranty", "Lifetime Support"].map((item, i) => (
              <motion.div
                key={item}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <div className="w-4 h-4 rounded-full bg-[#00d4ff]/20 border border-[#00d4ff]/40 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" />
                </div>
                <span className="text-white/40 text-xs tracking-[0.2em] uppercase">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const links = {
    "Models": ["M3 Competition", "M4 CSL", "M8 Gran Coupé", "iX M60", "M Vision"],
    "Technology": ["M TwinPower", "xDrive", "M Chassis", "Digital Cockpit", "Connected Car"],
    "Company": ["About BMW", "Innovation", "Sustainability", "Press", "Careers"],
    "Support": ["Find Dealer", "Contact Us", "FAQ", "Warranty", "Roadside"],
  };

  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full border-2 border-white/15 flex items-center justify-center bg-black">
                <span className="text-white font-black text-xs">BMW</span>
              </div>
            </div>
            <p className="text-white/30 text-sm leading-relaxed mb-6">
              The Ultimate Driving Machine. Since 1916, setting the standard for performance, luxury, and innovation.
            </p>
            <div className="flex gap-4">
              {["TW", "IG", "YT", "LI"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="w-8 h-8 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/40 text-[10px] font-bold tracking-wider transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white text-xs font-bold tracking-[0.3em] uppercase mb-6">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/30 hover:text-white/70 text-sm transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-white/20 text-xs tracking-wider">© 2024 BMW AG. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            {["Privacy Policy", "Terms of Use", "Cookie Settings", "Legal"].map((item) => (
              <a key={item} href="#" className="text-white/20 hover:text-white/50 text-xs tracking-wider transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-black min-h-screen" style={{ cursor: "none" }}>
      <Cursor />
      <Navbar scrolled={scrolled} />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <ModelsSection />
        <TechSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
