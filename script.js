// ── Constellation Background ──
(function () {
  const canvas = document.getElementById("constellationCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const PALETTE = [
    [99,  102, 241],
    [139, 92,  246],
    [6,   182, 212],
    [74,  222, 128],
  ];

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - 0.5) * 0.28,
      vy:    (Math.random() - 0.5) * 0.28,
      r:     Math.random() * 1.4 + 0.5,
      color: c,
      alpha: Math.random() * 0.35 + 0.12,
      phase: Math.random() * Math.PI * 2,
      pspd:  Math.random() * 0.007 + 0.003,
    };
  }

  function build() {
    const count = Math.min(Math.floor((W * H) / 13000), 95);
    particles = Array.from({ length: count }, mkParticle);
  }

  resize();
  build();
  window.addEventListener("resize", () => { resize(); build(); });

  const MAX_DIST = 165;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b  = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d >= MAX_DIST) continue;
        const op = (1 - d / MAX_DIST) * 0.055;
        const cr = (a.color[0] + b.color[0]) >> 1;
        const cg = (a.color[1] + b.color[1]) >> 1;
        const cb = (a.color[2] + b.color[2]) >> 1;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${op})`;
        ctx.lineWidth   = 0.6;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));

      p.phase += p.pspd;
      const a = p.alpha * (0.55 + 0.45 * Math.sin(p.phase));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + Math.sin(p.phase) * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${a})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();

// ── Terminal Loader ──
(function () {
  const loader    = document.getElementById("loader");
  const termBody  = document.getElementById("termBody");
  const barFill   = document.getElementById("termBarFill");
  const pctEl     = document.getElementById("termPct");

  const LINES = [
    { type: "cmd",  text: "erfan --init portfolio" },
    { type: "gap" },
    { type: "proc", text: "Brewing required coffee",           result: "☕  done" },
    { type: "proc", text: "Closing 247 browser tabs",          result: "✓" },
    { type: "proc", text: "npm install self-confidence",       result: "1 package added ✓" },
    { type: "proc", text: "Questioning life choices",          result: "✓  (normal, carry on)" },
    { type: "proc", text: "docker-compose up portfolio",       result: "✓  port 3000 ready" },
    { type: "ok",   text: "Compilation successful.  Welcome." },
  ];

  const DELAYS = [0, 350, 460, 810, 1175, 1550, 1900, 2550];

  let activeCursor = null;

  function addLine(lineObj) {
    if (lineObj.type === "gap") {
      const s = document.createElement("span");
      s.className = "term-spacer";
      termBody.appendChild(s);
      return;
    }

    const div = document.createElement("div");
    div.className = "term-line";

    const pre = document.createElement("span");
    if (lineObj.type === "cmd") {
      div.classList.add("term-line-cmd");
      pre.className = "term-prompt";
      pre.textContent = "$ ";
    } else if (lineObj.type === "proc") {
      div.classList.add("term-line-proc");
      pre.className = "term-arrow";
      pre.textContent = ">  ";
    } else {
      div.classList.add("term-line-ok");
      pre.className = "term-prompt";
      pre.textContent = "✓  ";
    }
    div.appendChild(pre);

    const txt = document.createElement("span");
    div.appendChild(txt);

    const cur = document.createElement("span");
    cur.className = "term-cursor";
    div.appendChild(cur);

    if (activeCursor) activeCursor.remove();
    activeCursor = cur;

    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;

    const fullText = lineObj.type === "proc" ? lineObj.text + "..." : lineObj.text;
    let i = 0;

    const iv = setInterval(() => {
      txt.textContent += fullText[i++];
      if (i >= fullText.length) {
        clearInterval(iv);
        cur.remove();
        if (activeCursor === cur) activeCursor = null;
        if (lineObj.result) {
          const res = document.createElement("span");
          res.className = "term-result";
          res.textContent = "  " + lineObj.result;
          div.appendChild(res);
        }
        if (lineObj.type === "ok") {
          const finalCur = document.createElement("span");
          finalCur.className = "term-cursor";
          div.appendChild(finalCur);
        }
      }
    }, 17);
  }

  let pct = 0;
  const pctInterval = setInterval(() => {
    pct = Math.min(pct + Math.floor(Math.random() * 4) + 1, 100);
    barFill.style.width = pct + "%";
    pctEl.textContent   = pct + "%";
    if (pct >= 100) clearInterval(pctInterval);
  }, 38);

  LINES.forEach((line, i) => setTimeout(() => addLine(line), DELAYS[i]));

  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
      initReveal();
      initNavTracking();
      initBgCanvas();
    }, 600);
  }, 3900);
})();

// ── Scroll Reveal ──
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

// ── Active Nav Link Tracking ──
function initNavTracking() {
  const sections = ["hero", "about", "skills", "experience", "education", "contact"];
  const navLinks = document.querySelectorAll(".nav-link");
  const scrollIndicator = document.getElementById("scrollIndicator");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle("active", link.dataset.section === id);
        });
        if (scrollIndicator) {
          scrollIndicator.classList.toggle("hidden", id !== "hero");
        }
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

// ── Smooth Scroll ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = document.getElementById("mainNav").offsetHeight;
      window.scrollTo({ top: target.offsetTop - navHeight, behavior: "smooth" });
    }
  });
});

// ── Hamburger Menu ──
const hamburger   = document.getElementById("hamburger");
const sidebarMenu = document.getElementById("sidebarMenu");
const menuOverlay = document.getElementById("menuOverlay");

function closeSidebar() {
  hamburger.classList.remove("open");
  sidebarMenu.classList.remove("open");
  menuOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", function () {
  this.classList.toggle("open");
  sidebarMenu.classList.toggle("open");
  menuOverlay.classList.toggle("active");
  document.body.style.overflow = sidebarMenu.classList.contains("open") ? "hidden" : "";
});

menuOverlay.addEventListener("click", closeSidebar);

document.querySelectorAll(".sidebar-menu a").forEach(link => {
  link.addEventListener("click", closeSidebar);
});

// ── Scroll Indicator click ──
const scrollIndicator = document.getElementById("scrollIndicator");
if (scrollIndicator) {
  scrollIndicator.addEventListener("click", () => {
    const about = document.getElementById("about");
    if (about) about.scrollIntoView({ behavior: "smooth" });
  });
}

// ── Nav logo scramble effect ──
(function () {
  const logo = document.querySelector(".nav-logo");
  if (!logo) return;

  const original = logo.textContent;
  const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%!?><_~|";
  let timerId = null;
  let iter = 0;

  function startScramble() {
    clearInterval(timerId);
    iter = 0;
    logo.classList.add("scrambling");

    timerId = setInterval(() => {
      logo.textContent = original.split("").map((char, idx) => {
        if (char === " ") return " ";
        if (idx < iter / 2) return char;
        return pool[Math.floor(Math.random() * pool.length)];
      }).join("");

      if (++iter / 2 >= original.length) {
        clearInterval(timerId);
        logo.textContent = original;
        setTimeout(() => logo.classList.remove("scrambling"), 400);
      }
    }, 30);
  }

  function stopScramble() {
    clearInterval(timerId);
    logo.textContent = original;
    logo.classList.remove("scrambling");
  }

  logo.addEventListener("mouseenter", startScramble);
  logo.addEventListener("mouseleave", stopScramble);
})();

// ── Hero background canvas – rising code chars ──
function initBgCanvas() {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;
  const ctx  = canvas.getContext("2d");
  const hero = canvas.parentElement;

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const CHARS  = [">", "_", "{", "}", "$", "#", "0", "1", "=>", "()", "[]", "//", "&&", "fn"];
  const COLORS = [
    "rgba(99,102,241,",
    "rgba(139,92,246,",
    "rgba(6,182,212,",
    "rgba(74,222,128,",
  ];

  function mkParticle(randomY) {
    const h = canvas.height || 800;
    const w = canvas.width  || 1200;
    return {
      x:     Math.random() * w,
      y:     randomY ? Math.random() * h : h + 20,
      vy:    -(Math.random() * 0.3 + 0.1),
      vx:    (Math.random() - 0.5) * 0.06,
      size:  Math.random() < 0.5 ? 11 : 13,
      char:  CHARS[Math.floor(Math.random() * CHARS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.07 + 0.025,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.007 + 0.003,
    };
  }

  const particles = Array.from({ length: 55 }, () => mkParticle(true));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y     += p.vy;
      p.x     += p.vx;
      p.phase += p.speed;
      const a  = p.alpha * (0.5 + 0.5 * Math.sin(p.phase));
      ctx.font      = `${p.size}px 'JetBrains Mono','Courier New',monospace`;
      ctx.fillStyle = p.color + a.toFixed(3) + ")";
      ctx.fillText(p.char, p.x, p.y);
      if (p.y < -20) Object.assign(p, mkParticle(false));
    });
    requestAnimationFrame(draw);
  }
  draw();
}
