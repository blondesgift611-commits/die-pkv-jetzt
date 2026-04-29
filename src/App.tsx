import React, { useState, useEffect, useRef } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.screen.width <= 430 || window.innerWidth <= 430;
  });
  useEffect(() => {
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1";
      document.head.appendChild(meta);
    }
    const handler = () => setIsMobile(window.screen.width <= 430 || window.innerWidth <= 430);
    window.addEventListener("resize", handler);
    handler();
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView] as [React.RefObject<HTMLDivElement>, boolean];
}

function Fade({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>{children}</div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }): React.ReactElement {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{ borderBottom: "1px solid rgba(0,0,0,.08)", padding: "1.3rem 0", cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: ".97rem", fontWeight: 600, color: "#0a0a0a", lineHeight: 1.4 }}>{q}</span>
        <span style={{ color: "#185FA5", fontSize: "1.3rem", flexShrink: 0, transition: "transform .3s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </div>
      <div style={{ maxHeight: open ? "300px" : "0", overflow: "hidden", transition: "max-height .4s ease" }}>
        <p style={{ fontSize: ".9rem", color: "#5F5E5A", lineHeight: 1.75, marginTop: ".8rem", paddingRight: "2rem" }}>{a}</p>
      </div>
    </div>
  );
}

export default function JetztPKV() {
  const isMobile = useIsMobile();
  const [form, setForm] = useState<Record<string, string>>({ vorname: "", nachname: "", telefon: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [showImpressum, setShowImpressum] = useState(false);
  const [showDatenschutz, setShowDatenschutz] = useState(false);
  const [showAGB, setShowAGB] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  const scrollToCTA = () => { ctaRef.current?.scrollIntoView({ behavior: "smooth" }); };
  const updateForm = (field: string) => (e: React.ChangeEvent<HTMLInputElement>): void => setForm((f: Record<string, string>) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.vorname) return;
    fetch("https://hooks.zapier.com/hooks/catch/2155057/ujvatnv/", {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ ...form, source: "JetztPKV" }).toString(),
    });
    setSubmitted(true);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #fff; color: #0a0a0a; font-family: 'DM Sans', system-ui, sans-serif; }
    ::selection { background: #185FA5; color: #fff; }
    button { cursor: pointer; border: none; background: none; font-family: inherit; }
    input { outline: none; font-family: inherit; }
    @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.5 } }
    .btn-primary { background: linear-gradient(135deg,#1a6fc4,#185FA5); color:#fff; font-weight:700; font-size:1rem; padding:.9rem 2.2rem; border-radius:8px; transition:transform .2s, box-shadow .2s; box-shadow:0 4px 20px rgba(24,95,165,.35); }
    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(24,95,165,.45); }
    .btn-ghost { background: transparent; color: #185FA5; font-weight: 600; font-size: .9rem; padding: .8rem 1.8rem; border-radius: 8px; border: 1.5px solid #CBD5E1; transition: border-color .2s; }
    .btn-ghost:hover { border-color: #185FA5; }
    .nav-link-j { color:#5F5E5A; text-decoration:none; font-size:.88rem; font-weight:500; transition:color .2s; }
    .nav-link-j:hover { color:#185FA5; }
    .input-field { padding:.85rem 1.1rem; border:1.5px solid rgba(0,0,0,.12); border-radius:8px; font-size:.93rem; color:#0a0a0a; width:100%; background:#fff; transition:border-color .2s; }
    .input-field:focus { border-color:#185FA5; }
    .tag { display:inline-block; font-size:.65rem; font-weight:700; letter-spacing:.05em; text-transform:uppercase; padding:.2rem .6rem; border-radius:4px; }
  `;

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,.07)", padding: isMobile ? ".9rem 1.2rem" : "1rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
            <div style={{ background: "linear-gradient(135deg,#1a6fc4,#185FA5)", borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1rem" }}>J</span>
            </div>
            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#0a0a0a" }}>
              Jetzt<span style={{ background: "linear-gradient(135deg,#1a6fc4,#185FA5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PKV</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? ".8rem" : "1.5rem" }}>
            {!isMobile && <button onClick={() => document.getElementById("reform")?.scrollIntoView({behavior:"smooth"})} className="nav-link-j" style={{background:"none",border:"none",cursor:"pointer"}}>GKV-Reform</button>}
            {!isMobile && <button onClick={() => document.getElementById("warum-jetzt")?.scrollIntoView({behavior:"smooth"})} className="nav-link-j" style={{background:"none",border:"none",cursor:"pointer"}}>Warum jetzt?</button>}
            <button className="btn-primary" onClick={scrollToCTA} style={{ fontSize: ".82rem", padding: ".6rem 1.2rem" }}>Kostenlos prüfen</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(160deg, #EFF6FF 0%, #fff 60%)", padding: isMobile ? "3.5rem 1.2rem 3rem" : "6rem 2rem 5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "500px", height: "500px", background: "radial-gradient(circle at top right, rgba(24,95,165,.08), transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "780px", margin: "0 auto", position: "relative" }}>
          <Fade>
            <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", border: "1px solid rgba(24,95,165,.2)", borderRadius: "6px", padding: ".35rem .9rem", marginBottom: "1.8rem", background: "rgba(255,255,255,.8)" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#185FA5" }}></div>
              <span style={{ fontSize: ".75rem", color: "#185FA5", fontWeight: 600, letterSpacing: ".04em" }}>JAEG 2027 · Voraussichtlich 80.550 €</span>
            </div>

            <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: isMobile ? "2.2rem" : "3.8rem", fontWeight: 800, lineHeight: 1.07, color: "#0a0a0a", marginBottom: "1.2rem" }}>
              Die GKV wird teurer.<br />
              <span style={{ background: "linear-gradient(135deg,#1a6fc4,#185FA5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Wer kann, wechselt jetzt.</span>
            </h1>

            <p style={{ fontSize: isMobile ? ".95rem" : "1.1rem", color: "#5F5E5A", lineHeight: 1.85, marginBottom: "2.2rem", maxWidth: "540px", fontWeight: 300 }}>
              Die GKV-Reform ist beschlossen. Wer über der Einkommensgrenze liegt, sollte den Wechsel in die PKV jetzt ernsthaft prüfen.
            </p>

            <div style={{ display: "flex", gap: ".9rem", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={scrollToCTA} style={{ fontSize: ".95rem", padding: ".9rem 2.2rem" }}>
                Jetzt kostenlos prüfen →
              </button>
              <button onClick={() => document.getElementById("reform")?.scrollIntoView({behavior:"smooth"})} className="btn-ghost" style={{ display: "inline-flex", alignItems: "center" }}>
                Was hat sich geändert?
              </button>
            </div>
          </Fade>
        </div>
      </section>

      {/* REFORM FACTS */}
      <section id="reform" style={{ background: "#fff", padding: isMobile ? "2.5rem 1.2rem" : "4rem 2rem", borderTop: "1px solid rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Fade>
            <div style={{ fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#888780", marginBottom: ".6rem" }}>– der kabinettsbeschluss –</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: isMobile ? "1.9rem" : "2.8rem", fontWeight: 700, marginBottom: ".8rem", lineHeight: 1.15 }}>Was sich konkret ändert.</h2>
            <p style={{ color: "#5F5E5A", fontSize: ".95rem", lineHeight: 1.75, marginBottom: "1.5rem", maxWidth: "540px", fontWeight: 300 }}>
              Die beschlossene GKV-Reform trifft Gutverdiener an mehreren Stellen. Das sind die relevanten Punkte für deine Entscheidung.
            </p>
          </Fade>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: "1rem" }}>
            {[
              { icon: "↑", title: "Beiträge steigen weiter", text: "Der Gesamtbeitrag könnte bis 2030 auf bis zu 19,3% steigen. Gebremst, aber nicht gestoppt.", tag: "Langfristig", tagColor: "#1D4ED8", tagBg: "#EFF6FF" },
              { icon: "⊘", title: "Familienversicherung eingeschränkt", text: "Nicht erwerbstätige Partner zahlen künftig 2,5% des Einkommens des arbeitenden Partners. Nicht mehr kostenlos.", tag: "Ab 2027", tagColor: "#B45309", tagBg: "#FFFBEB" },
              { icon: "◷", title: "JAEG 2027 voraussichtlich 80.550 €", text: "Die Einkommensgrenze wächst jedes Jahr. 2026: 77.400 €. Prognose 2027: ca. 80.550 €. Wer jetzt wechseln kann, sollte es nicht verschieben.", tag: "Handlungsfenster", tagColor: "#065F46", tagBg: "#ECFDF5" },
              { icon: "+", title: "Höhere Zuzahlungen", text: "Versicherte sollen 2,5 Milliarden Euro mehr selbst tragen. Mehr Eigenanteil, weniger Leistung.", tag: "Sofortige Wirkung", tagColor: "#991B1B", tagBg: "#FEF2F2" },
            ].map((f, i) => (
              <Fade key={i} delay={i * 0.07}>
                <div style={{ border: "1.5px solid rgba(0,0,0,.08)", borderRadius: "12px", padding: "1.3rem", display: "flex", gap: ".9rem", alignItems: "flex-start" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#185FA5" }}>{f.icon}</div>
                  <div>
                    <span className="tag" style={{ color: f.tagColor, background: f.tagBg, marginBottom: ".4rem" }}>{f.tag}</span>
                    <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: ".93rem", fontWeight: 700, marginBottom: ".3rem", color: "#0a0a0a", marginTop: ".3rem" }}>{f.title}</h3>
                    <p style={{ fontSize: ".84rem", color: "#5F5E5A", lineHeight: 1.65 }}>{f.text}</p>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* WARUM JETZT */}
      <section id="warum-jetzt" style={{ background: "linear-gradient(135deg,#042C53,#0C447C,#185FA5)", padding: isMobile ? "3rem 1.2rem" : "6rem 2rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(55,138,221,.15), transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
          <Fade>
            <div style={{ fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: ".6rem" }}>– warum jetzt und nicht später –</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: isMobile ? "1.9rem" : "2.8rem", fontWeight: 700, color: "#fff", marginBottom: "3rem", lineHeight: 1.15 }}>
              Das Zeitfenster schließt sich.
            </h2>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: "2rem" }}>
            {[
              { nr: "01", title: "Die JAEG steigt jedes Jahr", text: "2025 lag die Grenze bei 73.800 €. 2026 bei 77.400 €. 2027 voraussichtlich bei 80.550 €. Wer heute wechseln kann, kann es morgen vielleicht nicht mehr." },
              { nr: "02", title: "Alter ist der teuerste Faktor", text: "In der PKV richtet sich der Beitrag nach Alter und Gesundheit beim Einstieg. Jedes Jahr, das vergeht, erhöht den Beitrag. Wer jung ist, profitiert maximal." },
              { nr: "03", title: "Altersrückstellungen aufbauen", text: "Je früher du in die PKV einsteigst, desto mehr Kapital wird für dich angespart. Diese Rückstellungen stabilisieren deinen Beitrag im Alter." },
              { nr: "04", title: "GKV wird strukturell teurer", text: "Die demografische Kurve ist unausweichlich: Mehr Ältere, weniger Junge. Die GKV wird nicht günstiger – das ist keine Meinung, sondern Mathematik." },
            ].map((item, i) => (
              <Fade key={i} delay={i * 0.1}>
                <div style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start" }}>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontSize: "2.5rem", fontWeight: 800, color: "rgba(255,255,255,.15)", lineHeight: 1, flexShrink: 0 }}>{item.nr}</div>
                  <div>
                    <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: ".5rem" }}>{item.title}</h3>
                    <p style={{ fontSize: ".88rem", color: "rgba(255,255,255,.65)", lineHeight: 1.75 }}>{item.text}</p>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section style={{ background: "#F8FAFF", padding: isMobile ? "3rem 1.2rem" : "6rem 2rem", borderTop: "1px solid rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Fade>
            <div style={{ fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#888780", marginBottom: ".6rem" }}>– für wen ist das relevant –</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: isMobile ? "1.9rem" : "2.6rem", fontWeight: 700, marginBottom: "3rem", lineHeight: 1.15 }}>
              Bist du betroffen?
            </h2>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: "1.2rem" }}>
            {[
              { emoji: "01", title: "Angestellte ab ~77.400 €", text: "Du liegst über der Einkommensgrenze (JAEG). Wann genau ein Wechsel möglich ist, hängt von deiner Situation ab. Jetzt ist der richtige Zeitpunkt zur Analyse." },
              { emoji: "02", title: "Selbstständige & Freiberufler", text: "Für dich gilt die JAEG nicht. Du kannst jederzeit wechseln und profitierst oft besonders stark von günstigeren Tarifen." },
              { emoji: "03", title: "Beamte & Anwärter", text: "Mit Beihilfe versicherst du nur einen Teil deiner Kosten privat. Die PKV ist für Beamte in der Regel die wirtschaftlichste Lösung." },
            ].map((c, i) => (
              <Fade key={i} delay={i * 0.1}>
                <div style={{ background: "#fff", borderRadius: "12px", padding: "2rem", border: "1.5px solid rgba(24,95,165,.12)", textAlign: "left" }}>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: ".72rem", fontWeight: 700, color: "#185FA5", letterSpacing: ".1em", background: "#EFF6FF", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "8px", marginBottom: "1rem" }}>{c.emoji}</div>
                  <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 700, marginBottom: ".5rem" }}>{c.title}</h3>
                  <p style={{ fontSize: ".87rem", color: "#5F5E5A", lineHeight: 1.7 }}>{c.text}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: "#fff", padding: isMobile ? "3rem 1.2rem" : "6rem 2rem", borderTop: "1px solid rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Fade>
            <div style={{ fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#888780", marginBottom: ".6rem" }}>– stimmen aus der community –</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: isMobile ? "1.9rem" : "2.6rem", fontWeight: 700, marginBottom: "3rem", lineHeight: 1.15 }}>
              Was andere sagen.
            </h2>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: "1.5rem" }}>
            {[
              { initials: "MT", name: "Markus T.", role: "Angestellter, 37", quote: "Ich lag knapp über der Grenze und dachte, es lohnt sich nicht. Nach dem Gespräch war klar: Ich hätte schon früher wechseln sollen. Einfach, klar, ehrlich." },
              { initials: "SK", name: "Sandra K.", role: "Selbstständige, 34", quote: "Kein Verkaufsdruck, keine versteckten Empfehlungen. Man hat mir auch erklärt, was dagegen sprechen könnte. Das hat mich überzeugt." },
              { initials: "FL", name: "Felix L.", role: "IT-Unternehmer, 41", quote: "Die Erklärung zur JAEG und den Altersrückstellungen hat mir in 20 Minuten mehr gebracht als alle Artikel die ich vorher gelesen hatte." },
            ].map((t, i) => (
              <Fade key={i} delay={i * 0.1}>
                <div style={{ background: "#F8FAFF", borderRadius: "12px", padding: "2rem", border: "1.5px solid rgba(24,95,165,.08)" }}>
                  <div style={{ display: "flex", gap: ".3rem", marginBottom: "1.2rem" }}>
                    {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#185FA5", fontSize: "1rem" }}>★</span>)}
                  </div>
                  <p style={{ fontFamily: "'Sora',sans-serif", fontSize: ".93rem", color: "#0a0a0a", lineHeight: 1.75, fontStyle: "italic", marginBottom: "1.5rem" }}>
                    "{t.quote}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg,#1a6fc4,#185FA5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".72rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>{t.initials}</div>
                    <div>
                      <div style={{ fontSize: ".88rem", fontWeight: 700, color: "#0a0a0a" }}>{t.name}</div>
                      <div style={{ fontSize: ".75rem", color: "#888780" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* PROZESS */}
      <section style={{ background: "#F8FAFF", padding: isMobile ? "3rem 1.2rem" : "6rem 2rem", borderTop: "1px solid rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Fade>
            <div style={{ fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#888780", marginBottom: ".6rem" }}>– so begleiten wir dich –</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: isMobile ? "1.9rem" : "2.6rem", fontWeight: 700, marginBottom: ".8rem", lineHeight: 1.15 }}>
              Vom ersten Interesse bis zum Abschluss.
            </h2>
            <p style={{ fontSize: ".95rem", color: "#5F5E5A", lineHeight: 1.75, marginBottom: "3rem", maxWidth: "540px", fontWeight: 300 }}>
              Wir sind unabhängig und arbeiten mit allen relevanten PKV-Anbietern in Deutschland. Keine Provision steuert unsere Empfehlung – nur deine Situation.
            </p>
          </Fade>

          <div style={{ position: "relative" }}>
            {/* Connector line desktop */}
            {!isMobile && <div style={{ position: "absolute", top: "22px", left: "calc(10% + 18px)", right: "calc(10% + 18px)", height: "2px", background: "linear-gradient(90deg,#185FA5,#1a6fc4)", zIndex: 0, opacity: .2 }} />}

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(5,1fr)", gap: isMobile ? "1.2rem" : "1rem", position: "relative", zIndex: 1 }}>
              {[
                { nr: "01", title: "Eintragen", desc: "Du füllst das kurze Formular aus. Kein Spam, kein Verkaufsdruck – nur ein Rückruf von uns." },
                { nr: "02", title: "Erstgespräch", desc: "Wir klären deine Situation, dein Einkommen und deine Wechselmöglichkeit – offen und ehrlich." },
                { nr: "03", title: "Analyse", desc: "Wir vergleichen alle relevanten PKV-Anbieter unabhängig und finden den passenden Tarif für dich." },
                { nr: "04", title: "Empfehlung", desc: "Du bekommst einen konkreten Vorschlag mit allen Vor- und Nachteilen. Ohne Druck." },
                { nr: "05", title: "Antrag & Abschluss", desc: "Wir begleiten dich durch Gesundheitsprüfung, Antrag und Kündigung der GKV – bis alles abgeschlossen ist." },
              ].map((s, i) => (
                <Fade key={i} delay={i * 0.08}>
                  <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", border: "1.5px solid rgba(24,95,165,.1)", textAlign: "center" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg,#1a6fc4,#185FA5)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontFamily: "'Sora',sans-serif", fontSize: ".75rem", fontWeight: 700, color: "#fff", letterSpacing: ".05em" }}>{s.nr}</div>
                    <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: ".97rem", fontWeight: 700, marginBottom: ".5rem", color: "#0a0a0a" }}>{s.title}</h3>
                    <p style={{ fontSize: ".82rem", color: "#5F5E5A", lineHeight: 1.7 }}>{s.desc}</p>
                  </div>
                </Fade>
              ))}
            </div>
          </div>

          <Fade>
            <div style={{ marginTop: "2.5rem", padding: "1.2rem 1.8rem", background: "#EFF6FF", borderRadius: "10px", border: "1.5px solid rgba(24,95,165,.15)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "linear-gradient(135deg,#1a6fc4,#185FA5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: "1rem", fontWeight: 700 }}>✓</span>
              </div>
              <p style={{ fontSize: ".9rem", color: "#185FA5", fontWeight: 500, lineHeight: 1.6 }}>
                Wir sind unabhängig und können alle PKV-Anbieter in Deutschland empfehlen. Unsere Vergütung kommt vom Versicherer – nur wenn du wechselst. Für dich entstehen keine Kosten.
              </p>
            </div>
          </Fade>
        </div>
      </section>

      {/* LEAD CAPTURE */}
      <section id="kontakt" ref={ctaRef} style={{ background: "#fff", padding: isMobile ? "3rem 1.2rem" : "6rem 2rem", borderTop: "1px solid rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <Fade>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: isMobile ? "1.9rem" : "2.4rem", fontWeight: 700, lineHeight: 1.15, marginBottom: ".8rem" }}>
                Kostenloser PKV-Check.<br />
                <span style={{ background: "linear-gradient(135deg,#1a6fc4,#185FA5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Jetzt anfragen.</span>
              </h2>
              <p style={{ fontSize: ".95rem", color: "#5F5E5A", lineHeight: 1.75, fontWeight: 300 }}>
                30 Minuten. Kein Verkaufsdruck. Wir prüfen ob sich der Wechsel für dich lohnt, und wenn nicht, sagen wir das auch.
              </p>
            </div>
          </Fade>

          <div style={{ background: "#F8FAFF", border: "1.5px solid rgba(24,95,165,.12)", borderRadius: "16px", padding: isMobile ? "1.8rem 1.2rem" : "2.5rem" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(135deg,#1a6fc4,#185FA5)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.2rem", fontSize: "1.6rem", color: "#fff" }}>✓</div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>Anfrage eingegangen!</h3>
                <p style={{ fontSize: ".9rem", color: "#5F5E5A", lineHeight: 1.7 }}>Wir melden uns innerhalb von 24 Stunden. Kein Druck, kein Spam.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: ".9rem" }}>
                  <input className="input-field" type="text" placeholder="Vorname" required value={form.vorname} onChange={updateForm("vorname")} />
                  <input className="input-field" type="text" placeholder="Nachname" required value={form.nachname} onChange={updateForm("nachname")} />
                </div>
                <input className="input-field" type="tel" placeholder="Telefonnummer" value={form.telefon} onChange={updateForm("telefon")} />
                <input className="input-field" type="email" placeholder="E-Mail-Adresse" required value={form.email} onChange={updateForm("email")} />
                <button type="submit" className="btn-primary" style={{ padding: "1rem", fontSize: ".93rem", marginTop: ".4rem", width: "100%", textAlign: "center" }}>
                  Kostenlosen Check anfragen →
                </button>
                <p style={{ fontSize: ".72rem", color: "#9CA3AF", textAlign: "center" }}>Kein Newsletter. Kein Spam. Nur ein Gespräch, wenn du willst.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#F8FAFF", padding: isMobile ? "3rem 1.2rem" : "5rem 2rem", borderTop: "1px solid rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <Fade>
            <div style={{ fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#888780", marginBottom: ".6rem" }}>– faq –</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: isMobile ? "1.7rem" : "2.2rem", fontWeight: 700, marginBottom: "2rem" }}>Häufige Fragen.</h2>
          </Fade>
          <div style={{ background: "#fff", borderRadius: "12px", padding: isMobile ? "1rem 1.2rem" : "1rem 2rem" }}>
            {[
              { q: "Wann genau kann ich wechseln?", a: "Das hängt von deiner Situation ab. Wer den Job wechselt und beim neuen Arbeitgeber direkt über der JAEG liegt, kann sofort wechseln. Wer beim gleichen Arbeitgeber 2025 und 2026 über der Grenze liegt, kann bereits 2026 wechseln. Wer 2026 erstmals über die JAEG kommt, wechselt zum 01.01.2027. Selbstständige und Beamte können jederzeit wechseln." },
              { q: "Was passiert, wenn mein Gehalt später wieder sinkt?", a: "Sinkt dein Einkommen unter die JAEG, tritt wieder GKV-Pflicht ein. Du hast dann 3 Monate Zeit, einen Befreiungsantrag zu stellen. Ab 55 Jahren ist eine Rückkehr in die GKV stark eingeschränkt." },
              { q: "Ist die Beratung wirklich kostenlos?", a: "Ja. Wir werden ausschließlich von der Versicherung vergütet, nur im Fall eines Vertragsabschlusses. Für dich entstehen keine Kosten." },
              { q: "Was ist die Familienversicherung und warum ändert sich das?", a: "Bisher konnten nicht erwerbstätige Partner kostenlos in der GKV mitversichert sein. Ab 2027 zahlen diese Partner 2,5% des Einkommens des arbeitenden Partners, ein klarer Nachteil der GKV-Reform." },
              { q: "Warum jetzt und nicht nächstes Jahr?", a: "Weil die JAEG 2027 voraussichtlich auf ca. 80.550 € steigt. Wer heute knapp drüber liegt, könnte dann darunter fallen. Außerdem gilt: Je älter, desto höher der PKV-Beitrag beim Einstieg." },
            ].map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: "linear-gradient(135deg,#042C53,#185FA5)", padding: isMobile ? "4rem 1.2rem" : "6rem 2rem", textAlign: "center" }}>
        <Fade>
          <div style={{ maxWidth: "560px", margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: isMobile ? "2rem" : "3rem", fontWeight: 800, color: "#fff", marginBottom: ".8rem", lineHeight: 1.1 }}>
              Wer kann, wechselt jetzt.
            </h2>
            <p style={{ color: "rgba(255,255,255,.7)", fontSize: "1rem", marginBottom: "2.5rem", fontWeight: 300, lineHeight: 1.7 }}>
              Die Reform ist beschlossen. Die Kosten steigen. Das Zeitfenster ist offen.
            </p>
            <button onClick={scrollToCTA} className="btn-primary" style={{ fontSize: "1rem", padding: "1rem 2.5rem" }}>
              Jetzt kostenlos prüfen →
            </button>
          </div>
        </Fade>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#fff", borderTop: "1px solid rgba(0,0,0,.06)", padding: isMobile ? "1.5rem 1.2rem" : "2rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", gap: "1rem", textAlign: isMobile ? "center" : "left" }}>
          <div style={{ fontSize: ".82rem", color: "#888780" }}>© 2026 SalesHub Financial Commerce GmbH · JetztPKV ist eine Marke der SalesHub Financial Commerce GmbH</div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <button onClick={() => setShowImpressum(true)} style={{ fontSize: ".82rem", color: "#888780", background: "none", border: "none", cursor: "pointer" }}>Impressum</button>
            <button onClick={() => setShowDatenschutz(true)} style={{ fontSize: ".82rem", color: "#888780", background: "none", border: "none", cursor: "pointer" }}>Datenschutz</button>
            <button onClick={() => setShowAGB(true)} style={{ fontSize: ".82rem", color: "#888780", background: "none", border: "none", cursor: "pointer" }}>AGB</button>
          </div>
        </div>
      </footer>

      {/* IMPRESSUM MODAL */}
      {showImpressum && (
        <div onClick={() => setShowImpressum(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", backdropFilter: "blur(8px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", maxWidth: "700px", width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "2.5rem", position: "relative", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
            <button onClick={() => setShowImpressum(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "#888780", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
            <div style={{ fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#185FA5", marginBottom: ".8rem" }}>Rechtliches</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.8rem", fontWeight: 700, marginBottom: "2rem" }}>Impressum</h2>
            <div style={{ borderBottom: "1px solid rgba(0,0,0,.08)", marginBottom: "1.5rem", paddingBottom: "1.5rem" }}>
              <p style={{ fontSize: ".85rem", color: "#5F5E5A", marginBottom: ".6rem", lineHeight: 1.7 }}>JetztPKV ist eine Marke der SalesHub Financial Commerce GmbH</p>
              <p style={{ fontSize: ".75rem", color: "#185FA5", letterSpacing: ".08em", textTransform: "uppercase" }}>Anbieterkennzeichnung nach § 5 TMG und § 18 Abs. 2 MStV</p>
            </div>
            {[
              { label: "Unternehmen", lines: ["SalesHub Financial Commerce GmbH", "Planegger Straße 9a, 81241 München"] },
              { label: "Kontakt", lines: ["Telefon: 089 / 4522 5696", "E-Mail: inbox@saleshub.finance", "Web: https://saleshub.finance"] },
              { label: "Handelsregister", lines: ["Sitz der Gesellschaft", "Amtsgericht München HRB 287769"] },
              { label: "Geschäftsführung", lines: ["Marcus Börner"] },
              { label: "Steuer", lines: ["USt-IdNr: ist beantragt", "StNr: ist beantragt", "Finanzamt München"] },
              { label: "Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)", lines: ["Marcus Börner"] },
            ].map(({ label, lines }) => (
              <div key={label} style={{ marginBottom: "1.4rem" }}>
                <div style={{ fontSize: ".72rem", color: "#888780", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".4rem" }}>{label}</div>
                {lines.map((l, i) => <p key={i} style={{ fontSize: ".88rem", color: "#0a0a0a", lineHeight: 1.7 }}>{l}</p>)}
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(0,0,0,.08)", marginTop: "1.5rem", paddingTop: "1.5rem" }}>
              <div style={{ fontSize: ".72rem", color: "#888780", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".6rem" }}>Haftungshinweis</div>
              <p style={{ fontSize: ".83rem", color: "#5F5E5A", lineHeight: 1.75 }}>Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich. Des Weiteren übernehmen wir keine Haftung für die Erreichbarkeit von internen und externen verlinkten Seiten.</p>
            </div>
            <button onClick={() => setShowImpressum(false)} className="btn-primary" style={{ marginTop: "2rem", padding: ".7rem 1.8rem" }}>Schließen</button>
          </div>
        </div>
      )}

      {/* DATENSCHUTZ MODAL */}
      {showDatenschutz && (
        <div onClick={() => setShowDatenschutz(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", backdropFilter: "blur(8px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", maxWidth: "700px", width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "2.5rem", position: "relative", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
            <button onClick={() => setShowDatenschutz(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "#888780", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
            <div style={{ fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#185FA5", marginBottom: ".8rem" }}>Rechtliches</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.8rem", fontWeight: 700, marginBottom: ".6rem" }}>Datenschutzerklärung</h2>
            <p style={{ fontSize: ".78rem", color: "#888780", marginBottom: "2rem" }}>Diese Datenschutzerklärung gilt für alle von der SalesHub Financial Commerce GmbH betriebenen Websites.</p>
            {[
              { title: "Verantwortlicher", text: "SalesHub Financial Commerce GmbH\nPlanegger Straße 9a, 81241 München\nTelefon: 089 / 4522 5696\nE-Mail: inbox@saleshub.finance\nWeb: https://saleshub.finance\n\nStand: 29.11.2023" },
              { title: "Arten der verarbeiteten Daten", text: "Bestandsdaten, Kontaktdaten, Inhaltsdaten, Vertragsdaten, Nutzungsdaten sowie Meta- und Kommunikationsdaten." },
              { title: "Zwecke der Verarbeitung", text: "Erbringung vertraglicher Leistungen und Kundenservice, Kontaktanfragen und Kommunikation, Sicherheitsmaßnahmen, Direktmarketing, Reichweitenmessung sowie Bereitstellung des Onlineangebotes." },
              { title: "Rechtsgrundlagen", text: "Einwilligung (Art. 6 Abs. 1 S. 1 lit. a. DSGVO), Vertragserfüllung (Art. 6 Abs. 1 S. 1 lit. b. DSGVO), Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c. DSGVO) sowie Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f. DSGVO)." },
              { title: "Sicherheitsmaßnahmen", text: "SSL-Verschlüsselung (https) sowie IP-Masking zur Pseudonymisierung von IP-Adressen." },
              { title: "Lösch- und Speicherfristen", text: "Vertragsdaten werden grundsätzlich nach 4 Jahren gelöscht, steuerrelevante Daten nach 10 Jahren." },
              { title: "Cookies", text: "Temporäre Cookies werden nach Sitzungsende gelöscht, permanente Cookies können bis zu zwei Jahre gespeichert werden." },
              { title: "Webanalyse und Tracking", text: "Wir nutzen Google Analytics mit IP-Masking. Opt-Out: https://tools.google.com/dlpage/gaoptout" },
              { title: "Ihre Rechte", text: "Widerspruchsrecht, Widerrufsrecht, Auskunftsrecht, Recht auf Berichtigung, Löschung, Einschränkung und Datenübertragbarkeit (Art. 15-21 DSGVO)." },
            ].map(({ title, text }) => (
              <div key={title} style={{ borderBottom: "1px solid rgba(0,0,0,.06)", paddingBottom: "1.2rem", marginBottom: "1.2rem" }}>
                <div style={{ fontSize: ".72rem", color: "#185FA5", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".4rem" }}>{title}</div>
                <p style={{ fontSize: ".83rem", color: "#5F5E5A", lineHeight: 1.75, whiteSpace: "pre-line" }}>{text}</p>
              </div>
            ))}
            <button onClick={() => setShowDatenschutz(false)} className="btn-primary" style={{ marginTop: "1rem", padding: ".7rem 1.8rem" }}>Schließen</button>
          </div>
        </div>
      )}

      {/* AGB MODAL */}
      {showAGB && (
        <div onClick={() => setShowAGB(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", backdropFilter: "blur(8px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", maxWidth: "700px", width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "2.5rem", position: "relative", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
            <button onClick={() => setShowAGB(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "#888780", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
            <div style={{ fontSize: ".72rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#185FA5", marginBottom: ".8rem" }}>Rechtliches</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.8rem", fontWeight: 700, marginBottom: "2rem" }}>Allgemeine Geschäftsbedingungen</h2>
            {[
              { title: "§ 1 Geltungsbereich", text: "Diese Allgemeinen Geschäftsbedingungen gelten für alle Leistungen der SalesHub Financial Commerce GmbH, Planegger Straße 9a, 81241 München gegenüber den Nutzern der Website und der darüber angebotenen Dienstleistungen." },
              { title: "§ 2 Leistungsbeschreibung", text: "Der Anbieter erbringt unabhängige Beratungsleistungen im Bereich der privaten Krankenversicherung (PKV). Die Beratung ist für den Nutzer kostenlos. Eine Vergütung erfolgt ausschließlich durch den jeweiligen Versicherungsanbieter im Falle eines Vertragsabschlusses." },
              { title: "§ 3 Vertragsschluss", text: "Die Nutzung des Online-Formulars und die Kontaktaufnahme stellen kein verbindliches Angebot dar. Ein Beratungsvertrag kommt erst durch die ausdrückliche Bestätigung beider Parteien zustande." },
              { title: "§ 4 Datenschutz", text: "Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung und den geltenden datenschutzrechtlichen Bestimmungen, insbesondere der DSGVO." },
              { title: "§ 5 Haftung", text: "Der Anbieter haftet nicht für Schäden, die durch die Nutzung oder Nichtnutzung der auf der Website bereitgestellten Informationen entstehen, sofern kein vorsätzliches oder grob fahrlässiges Handeln des Anbieters vorliegt." },
              { title: "§ 6 Anwendbares Recht", text: "Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist München." },
            ].map(({ title, text }) => (
              <div key={title} style={{ borderBottom: "1px solid rgba(0,0,0,.06)", paddingBottom: "1.2rem", marginBottom: "1.2rem" }}>
                <div style={{ fontSize: ".88rem", fontWeight: 700, color: "#0a0a0a", marginBottom: ".5rem" }}>{title}</div>
                <p style={{ fontSize: ".83rem", color: "#5F5E5A", lineHeight: 1.75 }}>{text}</p>
              </div>
            ))}
            <button onClick={() => setShowAGB(false)} className="btn-primary" style={{ marginTop: "1rem", padding: ".7rem 1.8rem" }}>Schließen</button>
          </div>
        </div>
      )}
    </>
  );
}