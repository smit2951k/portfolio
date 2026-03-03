
'use client';
/* eslint-disable */


import { useEffect } from 'react';

export default function Home() {

  useEffect(() => {
    // Dynamic import to prevent SSR issues for window/document manipulation

    /* ── CURSOR ── */
    const cd = document.getElementById('cur-dot'), cr = document.getElementById('cur-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cd.style.left = mx + 'px'; cd.style.top = my + 'px'; });
    (function lp() { rx += (mx - rx) * .1; ry += (my - ry) * .1; cr.style.left = rx + 'px'; cr.style.top = ry + 'px'; requestAnimationFrame(lp); })();

    /* ── CLOCK ── */
    function tick() { const n = new Date(), h = n.getHours() % 12 || 12, m = String(n.getMinutes()).padStart(2, '0'); document.getElementById('nClock').textContent = `${String(h).padStart(2, '0')}:${m} ${n.getHours() >= 12 ? 'PM' : 'AM'}`; }
    tick(); setInterval(tick, 60000);

    /* ── STARS ── */
    const sc_ = document.getElementById('starCanvas'), sc = sc_.getContext('2d');
    const sts = [];
    function rsz() { sc_.width = window.innerWidth; sc_.height = window.innerHeight; }
    rsz(); window.addEventListener('resize', rsz);
    for (let i = 0; i < 200; i++)sts.push({ x: Math.random(), y: Math.random() * .48, r: Math.random() * 1.1 + .2, o: Math.random() * .7 + .2, tw: Math.random() * 4000 + 2000, ph: Math.random() * Math.PI * 2 });
    function dStar(ts) {
      sc.clearRect(0, 0, sc_.width, sc_.height);
      sts.forEach(s => {
        const op = s.o * (.5 + .5 * Math.sin(ts / s.tw + s.ph));
        sc.beginPath(); sc.arc(s.x * sc_.width, s.y * sc_.height, s.r, 0, Math.PI * 2);
        sc.fillStyle = `rgba(210,230,255,${op})`; sc.fill();
        if (s.r > .9 && op > .5) { sc.strokeStyle = `rgba(210,230,255,${op * .22})`; sc.lineWidth = .5; sc.beginPath(); sc.moveTo(s.x * sc_.width - 3, s.y * sc_.height); sc.lineTo(s.x * sc_.width + 3, s.y * sc_.height); sc.moveTo(s.x * sc_.width, s.y * sc_.height - 3); sc.lineTo(s.x * sc_.width, s.y * sc_.height + 3); sc.stroke(); }
      });
      requestAnimationFrame(dStar);
    } requestAnimationFrame(dStar);

    /* ── WATER ── */
    const wc_ = document.getElementById('waterCanvas'), wc = wc_.getContext('2d');
    function rwsz() { wc_.width = window.innerWidth; wc_.height = window.innerHeight; }
    rwsz(); window.addEventListener('resize', rwsz);
    function dWater(ts) {
      wc.clearRect(0, 0, wc_.width, wc_.height);
      const yS = wc_.height * .46, yE = wc_.height;
      for (let i = 0; i < 72; i++) {
        const p = i / 72, y = yS + (yE - yS) * p;
        const wav = Math.sin(ts * .0006 + p * 12 + Math.cos(ts * .0004) * 2) * p * 16;
        const lnW = wc_.width * (.22 + p * .78), xOff = (wc_.width - lnW) / 2;
        wc.beginPath(); wc.moveTo(xOff + wav, y);
        wc.bezierCurveTo(xOff + lnW * .25 + Math.sin(ts * .0005 + i) * wav * .5, y, xOff + lnW * .75 + Math.cos(ts * .0004 + i) * wav * .3, y, xOff + lnW + wav * .5, y);
        wc.strokeStyle = `rgba(80,155,225,${.03 + p * .068})`; wc.lineWidth = .4 + p * 2; wc.stroke();
      }
      requestAnimationFrame(dWater);
    } requestAnimationFrame(dWater);

    /* ── SVG DISTORT ── */
    const tb = document.getElementById('turbulence'); let phi = 0;
    function animT() { phi += .003; tb.setAttribute('baseFrequency', `${(.010 + Math.sin(phi) * .004).toFixed(4)} ${(.056 + Math.cos(phi * .7) * .012).toFixed(4)}`); requestAnimationFrame(animT); }
    requestAnimationFrame(animT);

    /* ── PARTICLES ── */
    const pc = document.getElementById('particles');
    for (let i = 0; i < 28; i++) { const el = document.createElement('div'); const s = Math.random() * 2.4 + .6; el.style.cssText = `position:absolute;border-radius:50%;background:#fff;width:${s}px;height:${s}px;left:${Math.random() * 100}%;top:${4 + Math.random() * 50}%;opacity:0;animation:twP ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 6}s infinite;`; pc.appendChild(el); }
    const sty = document.createElement('style'); sty.textContent = '@keyframes twP{0%,100%{opacity:0;transform:scale(.5)}50%{opacity:.9;transform:scale(1)}}'; document.head.appendChild(sty);

    /* ── MOUSE PARALLAX ── */
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - .5) * 2, y = (e.clientY / window.innerHeight - .5) * 2;
      document.querySelectorAll('.cobj').forEach((o, i) => { const d = .7 + i * .32; o.style.marginLeft = `${x * d * 8}px`; o.style.marginTop = `${y * d * 5}px`; });
    });

    /* ── SMART NAV ── */
    let lastY = 0;
    window.addEventListener('scroll', () => { const y = window.scrollY; document.getElementById('nav').classList.toggle('hide', y > lastY && y > 100); lastY = y; });

    /* ── PAGE ROUTER ── */
    function goPage(name) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById('p' + name).classList.add('active');
      document.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.page === name));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => { triggerReveal(); triggerBars(); triggerCounters(); }, 120);
    }
    document.querySelectorAll('.nav-link').forEach(a => { a.addEventListener('click', e => { e.preventDefault(); goPage(a.dataset.page); }); });
    document.querySelector('.nav-brand').addEventListener('click', () => goPage('h'));

    /* ── REVEAL ── */
    function triggerReveal() {
      const obs = new IntersectionObserver(en => { en.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }); }, { threshold: .1 });
      document.querySelectorAll('.page.active .rv,.page.active .rv2,.page.active .rv3').forEach(el => { el.classList.remove('in'); obs.observe(el); });
    }

    /* ── SKILL BARS ── */
    function triggerBars() {
      const obs = new IntersectionObserver(en => { en.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('.sk-fill').forEach(f => { setTimeout(() => { f.style.width = f.dataset.w + '%'; }, 180); }); } }); }, { threshold: .2 });
      document.querySelectorAll('.page.active .sk-card').forEach(c => obs.observe(c));
    }

    /* ── COUNTERS ── */
    function triggerCounters() {
      const obs = new IntersectionObserver(en => { en.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('.counter').forEach(c => { const t = +c.dataset.t, dur = 1600, step = dur / t; let cur = 0; const iv = setInterval(() => { cur = Math.min(cur + 1, t); c.textContent = cur + (t > 10 ? '+' : ''); if (cur >= t) clearInterval(iv); }, step); }); obs.unobserve(e.target); } }); }, { threshold: .3 });
      document.querySelectorAll('.page.active .stat-strip').forEach(s => obs.observe(s));
    }

    /* ── WORK FILTERS ── */
    document.querySelectorAll('.wf-btn').forEach(b => { b.addEventListener('click', () => { document.querySelectorAll('.wf-btn').forEach(x => x.classList.remove('act')); b.classList.add('act'); }); });

    /* ── INIT ── */
    setTimeout(() => {
      document.querySelectorAll('#ph .rv,#ph .rv2,#ph .rv3').forEach(el => el.classList.add('in'));
      triggerCounters();
    }, 100);

    /* ── MENU TOGGLE ── */
    function toggleMenu() {
      const overlay = document.getElementById('menu-overlay');
      const btn = document.getElementById('menu-btn');
      const isOpen = overlay.classList.contains('open');
      if (isOpen) {
        overlay.classList.remove('open');
        btn.classList.remove('open');
        document.body.style.overflow = '';
      } else {
        overlay.classList.add('open');
        btn.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }

    function menuGoPage(name) {
      document.getElementById('menu-overlay').classList.remove('open');
      document.getElementById('menu-btn').classList.remove('open');
      document.body.style.overflow = '';
      document.querySelectorAll('.m-nav-link').forEach(l => {
        const oc = l.getAttribute('onclick') || '';
        l.classList.toggle('m-active', oc.includes("'" + name + "'"));
      });
      goPage(name);
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.getElementById('menu-overlay').classList.remove('open');
        document.getElementById('menu-btn').classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    /* ── CONTACT FORM API ── */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('c-submit');
        const statusDiv = document.getElementById('c-status');

        btn.textContent = 'Sending...';
        btn.disabled = true;
        statusDiv.textContent = '';

        const formData = {
          name: document.getElementById('c-name').value,
          email: document.getElementById('c-email').value,
          subject: document.getElementById('c-subject').value,
          budget: document.getElementById('c-budget').value,
          timeline: document.getElementById('c-timeline').value,
          message: document.getElementById('c-message').value
        };

        try {
          const res = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          const data = await res.json();

          if (res.ok) {
            statusDiv.style.color = '#3ddc84';
            statusDiv.textContent = 'Message sent successfully!';
            contactForm.reset();
          } else {
            statusDiv.style.color = '#ff5f57';
            statusDiv.textContent = data.errors ? data.errors[0].msg : data.error;
          }
        } catch (err) {
          statusDiv.style.color = '#ff5f57';
          statusDiv.textContent = 'Failed to send message. Is the server running?';
        } finally {
          btn.textContent = 'Send Message ◈';
          btn.disabled = false;
        }
      });
    }

    /* ── ANALYTICS TRACKING ── */
    document.addEventListener('DOMContentLoaded', () => {
      fetch('http://localhost:5000/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: window.location.pathname })
      }).catch(e => console.error('Tracking error', e));
    });


    return () => { }
  }, []);

  return (
    <>


      {/*  SVG filter  */}
      <svg className="fx">
        <defs>
          <filter id="wdist" x="-10%" y="-10%" width="120%" height="130%">
            <feTurbulence id="turbulence" type="fractalNoise" baseFrequency="0.011 0.058" numOctaves="3" seed="5"
              result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/*  Cursor  */}
      <div id="cur-dot"></div>
      <div id="cur-ring"></div>

      {/*  Fixed BG  */}
      <div className="scene-bg"></div>
      <canvas id="starCanvas"></canvas>
      <canvas id="waterCanvas"></canvas>

      {/*  Chrome objects  */}
      <div className="chrome-layer" id="cLayer">
        <div className="cobj co1"></div>
        <div className="cobj co2"></div>
        <div className="cobj co3"></div>
        <div className="cobj co4"></div>
        <div className="cobj co5"></div>
        <div className="cobj co6"></div>
      </div>

      {/*  Particles  */}
      <div id="particles" style={{ position: 'fixed', inset: '0', zIndex: '4', pointerEvents: 'none' }}></div>

      {/*  ═══════ NAV ═══════  */}
      <nav id="nav">
        <div className="nav-brand">
          CHAUHAN <em>◉</em> SMIT
          <span>Portfolio · 2025</span>
        </div>
        <div className="nav-sep"></div>
        <div className="nav-role"><b>Full Stack Developer</b>&amp; Software Engineer</div>
        <ul className="nav-links">
          <li><a data-page="h" className="nav-link active">Home</a></li>
          <li><a data-page="w" className="nav-link">Work</a></li>
          <li><a data-page="a" className="nav-link">About</a></li>
          <li><a data-page="c" className="nav-link">Contact</a></li>
        </ul>
        <div className="nav-right">
          <div className="avail-dot"></div>
          <span>Available</span>
          <span id="nClock">—</span>
        </div>
        {/*  Hamburger  */}
        <button id="menu-btn" aria-label="Menu">
          <span className="mb-line"></span>
          <span className="mb-line"></span>
          <span className="mb-line"></span>
        </button>
      </nav>

      {/*  ═══════ FULLSCREEN MENU OVERLAY ═══════  */}
      <div id="menu-overlay">
        <div className="m-center-line"></div>
        <div id="menu-inner">
          <div className="m-layout">
            <div>
              <ul className="m-nav-list">
                <li className="m-nav-item">
                  <a className="m-nav-link m-active">
                    <span className="m-num">01</span>
                    <span className="m-label">Home</span>
                  </a>
                </li>
                <li className="m-nav-item">
                  <a className="m-nav-link">
                    <span className="m-num">02</span>
                    <span className="m-label">Work</span>
                  </a>
                </li>
                <li className="m-nav-item">
                  <a className="m-nav-link">
                    <span className="m-num">03</span>
                    <span className="m-label">About</span>
                  </a>
                </li>
                <li className="m-nav-item">
                  <a className="m-nav-link">
                    <span className="m-num">04</span>
                    <span className="m-label">Contact</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="m-right">
              <div className="m-avail">
                <div className="m-avail-dot"></div>Open to Projects
              </div>
              <div className="m-info-label">&#9672; Quick Info</div>
              <ul className="m-info-list">
                <li><em>&#128100;</em>
                  <div>
                    <div
                      style={{ fontSize: '10px', color: 'rgba(90,163,232,.5)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>
                      Name</div><span>Chauhan Smit</span>
                  </div>
                </li>
                <li><em>&#128188;</em>
                  <div>
                    <div
                      style={{ fontSize: '10px', color: 'rgba(90,163,232,.5)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>
                      Role</div><span>Full Stack Developer &amp; Software Engineer</span>
                  </div>
                </li>
                <li><em>&#128205;</em>
                  <div>
                    <div
                      style={{ fontSize: '10px', color: 'rgba(90,163,232,.5)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>
                      Location</div><span>Bardoli, India</span>
                  </div>
                </li>
                <li><em>&#128231;</em>
                  <div>
                    <div
                      style={{ fontSize: '10px', color: 'rgba(90,163,232,.5)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>
                      Email</div><span>smit81447&#64;gmail.com</span>
                  </div>
                </li>
              </ul>
              <div className="m-info-label" style={{ marginTop: '24px' }}>&#9672; Follow Along</div>
              <div className="m-socials">
                <a href="#" className="m-soc" title="GitHub"><svg width="17" height="17" viewBox="0 0 24 24"
                  fill="currentColor">
                  <path
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg></a>
                <a href="#" className="m-soc" title="LinkedIn"><svg width="17" height="17" viewBox="0 0 24 24"
                  fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg></a>
                <a href="#" className="m-soc" title="Twitter/X"><svg width="17" height="17" viewBox="0 0 24 24"
                  fill="currentColor">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg></a>
                <a href="#" className="m-soc" title="Instagram"><svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
                </svg></a>
              </div>
            </div>
          </div>
        </div>
        <div className="m-footer">
          <span>&#169; 2025 Chauhan Smit</span>
          <div className="m-footer-line"></div>
          <span style={{ color: 'rgba(90,163,232,.5)' }}>Built with obsession</span>
          <div className="m-footer-line"></div>
          <span>Available for hire</span>
        </div>
      </div>

      {/*  ═══════════════════════════════════════
     PAGE: HOME
═══════════════════════════════════════  */}
      <div id="ph" className="page active">
        <div className="h-hero">
          <div className="h-text">
            {/*  Main headline  */}
            <div className="h-row rv">
              <span className="dw">DESIGN</span>
              <span className="dw dw-accent">BUILD</span>
            </div>
            <div className="h-row2 rv2">
              <span className="dw" style={{ paddingLeft: '9vw' }}>SHIP</span>
              <span className="dw dw-italic">WONDER</span>
            </div>
            {/*  horizon  */}
            <div className="horizon-line" style={{ marginTop: '10px' }}></div>
            {/*  reflection  */}
            <div className="refl-wrap rv3">
              <div className="h-row"><span className="dw">DESIGN</span><span className="dw dw-accent">BUILD</span></div>
              <div className="h-row2"><span className="dw" style={{ paddingLeft: '9vw' }}>SHIP</span><span
                className="dw dw-italic">WONDER</span></div>
              <div className="refl-fade"></div>
            </div>
          </div>
          <div className="scroll-hint">
            <div className="sh-line"></div>scroll
          </div>
        </div>

        {/*  Stat Strip  */}
        <div className="stat-strip rv">
          <div className="stat-cell">
            <div className="stat-n counter" data-t="2">0</div>
            <div className="stat-t">Years of Experience</div>
            <div className="stat-d">Building scalable software across web, mobile and cloud.</div>
          </div>
          <div className="stat-cell">
            <div className="stat-n counter" data-t="32">0</div>
            <div className="stat-t">Projects Shipped</div>
            <div className="stat-d">From concept to deployment — end-to-end full stack solutions.</div>
          </div>
          <div className="stat-cell">
            <div className="stat-n counter" data-t="21">0</div>
            <div className="stat-t">Happy Clients</div>
            <div className="stat-d">Clients across India, UK and US trust my delivery.</div>
          </div>
          <div className="stat-cell">
            <div className="stat-n counter" data-t="99">0</div>
            <div className="stat-t">Lighthouse Score</div>
            <div className="stat-d">Clean code, optimised builds, zero-compromise quality.</div>
          </div>
        </div>

        {/*  Services  */}
        <div className="services">
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div className="sec-label rv">◈ What I Do</div>
            <h2 className="sec-title rv2">MY CRAFT<br />& SERVICES</h2>
          </div>
          <div className="srv-grid">
            <div className="gc srv-card rv">
              <div className="srv-num">01</div>
              <div className="srv-icon">⚡</div>
              <div className="srv-title">Frontend Engineering</div>
              <div className="srv-text">Crafting fast, responsive and pixel-perfect interfaces with React and Next.js. Focused
                on performance, smooth animations and delightful user experiences.</div>
              <div className="srv-tags"><span className="srv-tag">React</span><span className="srv-tag">Next.js</span><span
                className="srv-tag">TypeScript</span><span className="srv-tag">Framer Motion</span></div>
            </div>
            <div className="gc srv-card rv2">
              <div className="srv-num">02</div>
              <div className="srv-icon">🔧</div>
              <div className="srv-title">Backend & APIs</div>
              <div className="srv-text">Robust server-side systems using Node.js, Express and PostgreSQL. REST & GraphQL APIs,
                real-time WebSocket features and microservices architecture.</div>
              <div className="srv-tags"><span className="srv-tag">Node.js</span><span className="srv-tag">PostgreSQL</span><span
                className="srv-tag">Redis</span><span className="srv-tag">GraphQL</span></div>
            </div>
            <div className="gc srv-card rv3">
              <div className="srv-num">03</div>
              <div className="srv-icon">🎨</div>
              <div className="srv-title">UI/UX Design</div>
              <div className="srv-text">Clean UI/UX design in Figma, design system creation and interactive prototyping. I
                translate ideas into interfaces that feel intuitive and look premium.</div>
              <div className="srv-tags"><span className="srv-tag">Figma</span><span className="srv-tag">Design Systems</span><span
                className="srv-tag">Prototyping</span><span className="srv-tag">Branding</span></div>
            </div>
          </div>
        </div>
      </div>

      {/*  ═══════════════════════════════════════
     PAGE: WORK
═══════════════════════════════════════  */}
      <div id="pw" className="page">
        <div className="w-hero">
          <div className="sec-label rv">◈ Selected Projects 2020–2025</div>
          <h1 className="w-title rv2">SELECTED<br /><span className="dw-accent">WORK</span></h1>
          <div className="w-filter rv3">
            <button className="wf-btn act">All Projects</button>
            <button className="wf-btn">Web Apps</button>
            <button className="wf-btn">Mobile</button>
            <button className="wf-btn">Design</button>
            <button className="wf-btn">Open Source</button>
          </div>

          <div className="proj-list">
            {/*  Featured wide  */}
            <div className="rv">
              <div className="gc p-card feat">
                <div className="p-mock" style={{ aspectRatio: '21/7' }}>
                  <div className="p-mock-bar">
                    <div className="p-mock-dot"></div>
                    <div className="p-mock-dot"></div>
                    <div className="p-mock-dot"></div>
                    <div className="p-mock-url">nexus-analytics.vercel.app</div>
                  </div>
                  <div className="p-mock-inner" style={{ height: 'calc(100% - 30px)' }}>🌊</div>
                  <div className="p-overlay"><a href="#" className="p-overlay-link">View Project ↗</a></div>
                </div>
                <div className="p-body">
                  <div className="p-num">◈ PROJECT 001 · FEATURED · WEB APP</div>
                  <div className="p-title">Nexus — Real-Time Analytics Platform</div>
                  <div className="p-desc">Processing 10M+ events/day with live dashboards, custom funnel reporting, cohort
                    analysis and team collaboration tools. Built from zero to 12k MAU in 8 months.</div>
                  <div className="p-foot">
                    <div className="p-tags"><span className="p-tag">Next.js</span><span className="p-tag">TypeScript</span><span
                      className="p-tag">D3.js</span><span className="p-tag">Postgres</span><span className="p-tag">Redis</span></div>
                    <div className="p-links"><a href="#" className="p-link">GitHub →</a><a href="#" className="p-link">Live →</a></div>
                  </div>
                </div>
              </div>
            </div>

            {/*  Row 2  */}
            <div className="proj-row rv">
              <div className="gc p-card">
                <div className="p-mock" style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg,#180a38,#2a1060)' }}>
                  <div className="p-mock-bar">
                    <div className="p-mock-dot"></div>
                    <div className="p-mock-dot"></div>
                    <div className="p-mock-dot"></div>
                  </div>
                  <div className="p-mock-inner" style={{ height: 'calc(100% - 30px)' }}>🔮</div>
                  <div className="p-overlay"><a href="#" className="p-overlay-link">View Project ↗</a></div>
                </div>
                <div className="p-body">
                  <div className="p-num">◈ PROJECT 002 · SOCIAL PLATFORM</div>
                  <div className="p-title">Orbit — Developer Community</div>
                  <div className="p-desc">Real-time messaging, code sharing, collaborative debugging, and AI-powered PR reviews
                    in one platform. 6k developers onboarded in first month.</div>
                  <div className="p-foot">
                    <div className="p-tags"><span className="p-tag">React</span><span className="p-tag">Socket.io</span><span
                      className="p-tag">Redis</span></div>
                    <div className="p-links"><a href="#" className="p-link">Live →</a></div>
                  </div>
                </div>
              </div>
              <div className="gc p-card">
                <div className="p-mock" style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg,#0a2015,#0d4020)' }}>
                  <div className="p-mock-bar">
                    <div className="p-mock-dot"></div>
                    <div className="p-mock-dot"></div>
                    <div className="p-mock-dot"></div>
                  </div>
                  <div className="p-mock-inner" style={{ height: 'calc(100% - 30px)' }}>💹</div>
                  <div className="p-overlay"><a href="#" className="p-overlay-link">View Project ↗</a></div>
                </div>
                <div className="p-body">
                  <div className="p-num">◈ PROJECT 003 · FINTECH</div>
                  <div className="p-title">Pulse — Personal Finance App</div>
                  <div className="p-desc">AI-powered spending insights, budget forecasting, portfolio tracking and bill
                    management. Featured in Product Hunt Top 5 of the day.</div>
                  <div className="p-foot">
                    <div className="p-tags"><span className="p-tag">React Native</span><span className="p-tag">Python</span><span
                      className="p-tag">AWS</span></div>
                    <div className="p-links"><a href="#" className="p-link">App Store →</a></div>
                  </div>
                </div>
              </div>
            </div>

            {/*  Row 3  */}
            <div className="proj-row rv">
              <div className="gc p-card">
                <div className="p-mock" style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg,#201010,#3c1824)' }}>
                  <div className="p-mock-bar">
                    <div className="p-mock-dot"></div>
                    <div className="p-mock-dot"></div>
                    <div className="p-mock-dot"></div>
                  </div>
                  <div className="p-mock-inner" style={{ height: 'calc(100% - 30px)' }}>🎨</div>
                  <div className="p-overlay"><a href="#" className="p-overlay-link">View Project ↗</a></div>
                </div>
                <div className="p-body">
                  <div className="p-num">◈ PROJECT 004 · DESIGN TOOL</div>
                  <div className="p-title">Prism — Design Token Manager</div>
                  <div className="p-desc">Visual design token editor with multi-brand theming, live Figma sync, and automated
                    CSS/iOS/Android export. Used by 200+ design teams.</div>
                  <div className="p-foot">
                    <div className="p-tags"><span className="p-tag">Electron</span><span className="p-tag">Figma API</span><span
                      className="p-tag">Vue</span></div>
                    <div className="p-links"><a href="#" className="p-link">GitHub →</a></div>
                  </div>
                </div>
              </div>
              <div className="gc p-card">
                <div className="p-mock" style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg,#0f2228,#1a3840)' }}>
                  <div className="p-mock-bar">
                    <div className="p-mock-dot"></div>
                    <div className="p-mock-dot"></div>
                    <div className="p-mock-dot"></div>
                  </div>
                  <div className="p-mock-inner" style={{ height: 'calc(100% - 30px)' }}>📦</div>
                  <div className="p-overlay"><a href="#" className="p-overlay-link">View Project ↗</a></div>
                </div>
                <div className="p-body">
                  <div className="p-num">◈ PROJECT 005 · HEADLESS CMS</div>
                  <div className="p-title">Forge — Visual CMS Platform</div>
                  <div className="p-desc">Headless CMS with drag-and-drop page builder, multi-tenant architecture, plugin
                    marketplace and live preview. 40+ enterprise clients.</div>
                  <div className="p-foot">
                    <div className="p-tags"><span className="p-tag">Node.js</span><span className="p-tag">GraphQL</span><span
                      className="p-tag">Docker</span></div>
                    <div className="p-links"><a href="#" className="p-link">Live →</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  ═══════════════════════════════════════
     PAGE: ABOUT
═══════════════════════════════════════  */}
      <div id="pa" className="page">
        <div className="a-hero">
          <div className="sec-label rv">◈ The Person Behind the Work</div>
          <h1 className="a-title rv2">ABOUT<br /><span className="dw-accent">ME</span></h1>
          <div className="a-grid">
            {/*  Bio  */}
            <div className="gc a-bio-card rv">
              <div className="a-bio-label">◈ Who I Am</div>
              <div className="a-bio-title">CODE<br />MEETS<br />CRAFT</div>
              <div className="a-bio-text">
                I'm Chauhan Smit — a Full Stack Developer with a passion for building end-to-end digital products that are
                fast, scalable and beautifully crafted.
              </div>
              <div className="a-bio-text">
                I believe great software should be invisible — it just works. From architecting APIs to crafting
                pixel-perfect UIs, I care deeply about every layer of the stack.
              </div>
              <div className="a-bio-text">
                When I'm not coding, I'm exploring new technologies, contributing to open source projects or mentoring
                aspiring developers in my community.
              </div>
              <div className="a-bio-sign">Chauhan Smit ◈</div>
            </div>
            {/*  Terminal  */}
            <div className="gc a-terminal rv2">
              <div className="t-bar">
                <div className="t-d r"></div>
                <div className="t-d y"></div>
                <div className="t-d g"></div>
                <div className="t-ttl">smit@portfolio ~ zsh</div>
              </div>
              <div className="t-body">
                <div><span className="t-pr">❯ </span><span className="t-cmd">whoami</span></div>
                <span className="t-out">Chauhan Smit · Full Stack Developer</span>
                <div style={{ marginTop: '12px' }}><span className="t-pr">❯ </span><span className="t-cmd">cat skills.json</span></div>
                <span className="t-out">frontend: <span className="t-hi">["React","Next.js","TypeScript","CSS"]</span></span>
                <span className="t-out">backend: <span className="t-hi">["Node.js","PostgreSQL","Redis","AWS"]</span></span>
                <span className="t-out">design: <span className="t-hi">["Figma","Motion","Design Systems"]</span></span>
                <div style={{ marginTop: '12px' }}><span className="t-pr">❯ </span><span className="t-cmd">cat values.txt</span></div>
                <span className="t-out"><span className="t-hi2">→</span> Performance is a feature</span>
                <span className="t-out"><span className="t-hi2">→</span> Design with empathy</span>
                <span className="t-out"><span className="t-hi2">→</span> Ship fast, iterate forever</span>
                <span className="t-out"><span className="t-hi2">→</span> Open source everything you can</span>
                <div style={{ marginTop: '12px' }}><span className="t-pr">❯ </span><span className="t-cmd">cat location.txt</span></div>
                <span className="t-out">📍 Bardoli, Bardoli, India-first</span>
                <div style={{ marginTop: '12px' }}><span className="t-pr" style={{ color: 'rgba(60,200,120,.8)' }}>❯ </span><span
                  className="t-caret"> </span></div>
              </div>
            </div>
          </div>
        </div>

        {/*  Skills  */}
        <div className="a-skills" style={{ padding: '0 50px 60px' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div className="sec-label rv">◈ Technical Arsenal</div>
            <h2 className="sec-title rv2" style={{ marginBottom: '44px' }}>SKILLS &<br />EXPERTISE</h2>
            <div className="sk-grid">
              <div className="gc sk-card sk-w7 rv">
                <div className="sk-icon">⚡</div>
                <div className="sk-title">Frontend Development</div>
                <div className="sk-text">Pixel-perfect, performant UIs with modern frameworks and obsessive animation craft.
                </div>
                <div className="sk-bar-wrap">
                  <div className="sk-row">
                    <div className="sk-meta"><span>React / Next.js</span><span style={{ color: 'var(--accent)' }}>96%</span></div>
                    <div className="sk-track">
                      <div className="sk-fill" data-w="96"></div>
                    </div>
                  </div>
                  <div className="sk-row">
                    <div className="sk-meta"><span>TypeScript</span><span style={{ color: 'var(--accent)' }}>92%</span></div>
                    <div className="sk-track">
                      <div className="sk-fill" data-w="92"></div>
                    </div>
                  </div>
                  <div className="sk-row">
                    <div className="sk-meta"><span>CSS / Animation</span><span style={{ color: 'var(--accent)' }}>94%</span></div>
                    <div className="sk-track">
                      <div className="sk-fill" data-w="94"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="gc sk-card sk-w5 rv2">
                <div className="sk-icon">🔧</div>
                <div className="sk-title">Backend & APIs</div>
                <div className="sk-text">Scalable, real-time server architecture with robust data modelling.</div>
                <div className="sk-bar-wrap">
                  <div className="sk-row">
                    <div className="sk-meta"><span>Node.js</span><span style={{ color: '#88bbdd' }}>88%</span></div>
                    <div className="sk-track">
                      <div className="sk-fill" data-w="88" style={{ background: 'linear-gradient(90deg,#2255aa,#5599cc)' }}></div>
                    </div>
                  </div>
                  <div className="sk-row">
                    <div className="sk-meta"><span>PostgreSQL</span><span style={{ color: '#88bbdd' }}>84%</span></div>
                    <div className="sk-track">
                      <div className="sk-fill" data-w="84" style={{ background: 'linear-gradient(90deg,#2255aa,#5599cc)' }}></div>
                    </div>
                  </div>
                  <div className="sk-row">
                    <div className="sk-meta"><span>AWS / DevOps</span><span style={{ color: '#88bbdd' }}>78%</span></div>
                    <div className="sk-track">
                      <div className="sk-fill" data-w="78" style={{ background: 'linear-gradient(90deg,#2255aa,#5599cc)' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="gc sk-card sk-w6 rv">
                <div className="sk-icon">🚀</div>
                <div className="sk-title">Full Stack Toolkit</div>
                <div className="badge-cloud">
                  <span className="badge">React</span><span className="badge">Next.js</span><span className="badge">TypeScript</span>
                  <span className="badge">Node.js</span><span className="badge">Tailwind</span><span className="badge">PostgreSQL</span>
                  <span className="badge">Docker</span><span className="badge">Redis</span><span className="badge">AWS</span>
                  <span className="badge">Figma</span><span className="badge">GraphQL</span><span className="badge">Prisma</span>
                  <span className="badge">Vercel</span><span className="badge">Git</span><span className="badge">Java</span><span
                    className="badge">Python</span>
                </div>
              </div>
              <div className="gc sk-card sk-w6 rv2">
                <div className="sk-icon">🎨</div>
                <div className="sk-title">Design & Systems</div>
                <div className="sk-text">Token-based design systems, component libraries, accessibility-first prototyping, and
                  brand identity work.</div>
                <div className="sk-bar-wrap">
                  <div className="sk-row">
                    <div className="sk-meta"><span>UI / UX Design</span><span style={{ color: '#c06090' }}>88%</span></div>
                    <div className="sk-track">
                      <div className="sk-fill" data-w="88" style={{ background: 'linear-gradient(90deg,#802050,#c06090)' }}></div>
                    </div>
                  </div>
                  <div className="sk-row">
                    <div className="sk-meta"><span>Design Systems</span><span style={{ color: '#c06090' }}>82%</span></div>
                    <div className="sk-track">
                      <div className="sk-fill" data-w="82" style={{ background: 'linear-gradient(90deg,#802050,#c06090)' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  Timeline  */}
        <div className="a-timeline">
          <div className="sec-label rv">◈ Career Journey</div>
          <h2 className="sec-title rv2" style={{ marginBottom: '52px' }}>WORK<br />EXPERIENCE</h2>
          <div className="tl-track">
            <div className="tl-item rv">
              <div className="tl-node" style={{ borderColor: '#88bbdd', boxShadow: '0 0 16px rgba(136,187,221,.5)' }}></div>
              <div className="gc tl-card">
                <div className="tl-meta">
                  <div>
                    <div className="tl-role">Full Stack Developer</div>
                    <div className="tl-co" style={{ color: '#88bbdd' }}>◈ Freelance & Remote Clients</div>
                  </div>
                  <div className="tl-date">2021 — 2023</div>
                </div>
                <ul className="tl-list">
                  <li>Delivered 15+ full stack web applications for clients across e-commerce, edtech and SaaS sectors.</li>
                  <li>Implemented real-time chat, notifications and live dashboards using Socket.io and Redis.</li>
                  <li>Managed end-to-end project delivery — from requirement gathering to post-launch support.</li>
                </ul>
              </div>
            </div>
            <div className="tl-item rv3">
              <div className="tl-node" style={{ borderColor: '#3ddc84', boxShadow: '0 0 16px rgba(61,220,132,.4)' }}></div>
              <div className="gc tl-card">
                <div className="tl-meta">
                  <div>
                    <div className="tl-role">Frontend Developer</div>
                    <div className="tl-co" style={{ color: '#3ddc84' }}>◈ Junior Developer · Startup</div>
                  </div>
                  <div className="tl-date">2019 — 2021</div>
                </div>
                <ul className="tl-list">
                  <li>Built React SPAs and REST APIs, achieving 95+ Lighthouse scores and fast load times.</li>
                  <li>Learned full stack fundamentals: authentication flows, database design and deployment pipelines.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  ═══════════════════════════════════════
     PAGE: CONTACT
═══════════════════════════════════════  */}
      <div id="pc" className="page">
        <div className="c-hero">
          <div className="sec-label rv">◈ Let's Build Something Together</div>
          <h1 className="c-title rv2">GET IN<br /><span className="ac">TOUCH</span></h1>

          <div className="c-layout">
            {/*  Info  */}
            <div className="gc c-info-card rv">
              <div className="c-avail">
                <div className="c-avail-dot"></div>Available for New Projects
              </div>
              <div className="c-info-title">Contact Details</div>
              <div className="c-detail-row">
                <div className="c-di">📧</div>
                <div>
                  <div className="c-dl">Email</div>
                  <div className="c-dv">smit81447&#64;gmail.com</div>
                </div>
              </div>
              <div className="c-detail-row">
                <div className="c-di">📞</div>
                <div>
                  <div className="c-dl">Phone / WhatsApp</div>
                  <div className="c-dv">+91 8200878170</div>
                </div>
              </div>
              <div className="c-detail-row">
                <div className="c-di">📍</div>
                <div>
                  <div className="c-dl">Location</div>
                  <div className="c-dv">Bardoli, India<br /><span style={{ color: 'var(--muted)', fontSize: '12px' }}>Gujarat · Available
                    Remotely</span></div>
                </div>
              </div>
              <div className="c-detail-row">
                <div className="c-di">⏰</div>
                <div>
                  <div className="c-dl">Response Time</div>
                  <div className="c-dv">Within 24 hours</div>
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,.05)' }}>
                <div className="c-info-title" style={{ fontSize: '16px', marginBottom: '16px' }}>Find Me Online</div>
                <div className="c-socials">
                  <a href="#" className="c-soc-btn" title="GitHub">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                  <a href="#" className="c-soc-btn" title="LinkedIn">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                  <a href="#" className="c-soc-btn" title="X / Twitter">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a href="#" className="c-soc-btn" title="Instagram">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                      stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/*  Form  */}
            <div className="gc c-form-card rv2">
              <div className="c-form-title">Send a Message</div>
              <form className="c-form" id="contact-form">
                <div className="c-form-row">
                  <input type="text" id="c-name" className="c-inp" placeholder="Your Name" required />
                  <input type="email" id="c-email" className="c-inp" placeholder="Email Address" required />
                </div>
                <input type="text" id="c-subject" className="c-inp" placeholder="Subject — What are you working on?" required />
                <div className="c-form-row">
                  <input type="text" id="c-budget" className="c-inp" placeholder="Budget Range (optional)" />
                  <input type="text" id="c-timeline" className="c-inp" placeholder="Timeline (optional)" />
                </div>
                <textarea id="c-message" className="c-area"
                  placeholder="Tell me about your project — the vision, the challenge, the ambition..." required></textarea>
                <button type="submit" id="c-submit" className="c-submit">Send Message ◈</button>
                <div id="c-status" style={{ marginTop: '10px', fontSize: '13px' }}></div>
              </form>
            </div>
          </div>

          {/*  CTA orb section  */}
          <div className="c-cta-wrap rv">
            <div className="c-orb">
              <div className="c-orb-out"></div>
              <div className="c-orb-in">◈</div>
            </div>
            <h2 className="c-cta-big">READY TO BUILD<br />SOMETHING<br /><span className="ac">REMARKABLE?</span></h2>
            <p className="c-cta-sub">Whether it's a product from scratch, a design system overhaul, or a performance audit — I
              bring the same obsession to every engagement.</p>
          </div>
        </div>
      </div>

      {/*  Bottom Bar  */}
      <div className="bbar">
        <div className="bb-label">Chauhan Smit · Portfolio 2025</div>
        <div className="bb-right">
          <div className="bb-name">Chauhan Smit</div>
          <button className="bb-btn">Hire Me</button>
        </div>
      </div>

      {/*  ═══════════════════════════ SCRIPTS ═══════════════════════════  */}


    </>
  );
}
