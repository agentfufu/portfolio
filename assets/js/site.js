/* =============================================================================
   site.js — page chrome + rendering. You shouldn't need to edit this file;
   the content all lives in data.js.
   ============================================================================= */
(function () {
  "use strict";

  /* -- tiny helpers -------------------------------------------------------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const el = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const ICONS = {
    sun:      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon:     '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    menu:     '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close:    '<path d="M18 6 6 18M6 6l12 12"/>',
    left:     '<path d="M15 18l-6-6 6-6"/>',
    right:    '<path d="M9 18l6-6-6-6"/>',
    arrow:    '<path d="M5 12h14M13 6l6 6-6 6"/>',
    download: '<path d="M12 3v12M7 11l5 5 5-5M4 21h16"/>',
    mail:     '<rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="M3 6.5l9 6 9-6"/>',
    pin:      '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    clock:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    github:   '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6A4.6 4.6 0 0 0 18.7 6a4.3 4.3 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.5 5.4 2.8 5.4 2.8A4.3 4.3 0 0 0 5.3 6 4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    linkedin: '<rect x="2.5" y="2.5" width="19" height="19" rx="3"/><path d="M7 10v7M7 7v.01M11.5 17v-4a2.5 2.5 0 0 1 5 0v4"/>',
    gamepad:  '<path d="M7 12h4M9 10v4M15.5 11.5v.01M17.5 13.5v.01"/><rect x="2.5" y="6.5" width="19" height="11" rx="5.5"/>',
    play:     '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z"/>',
    upwork:   '<path d="M3 8v4.5a3.5 3.5 0 0 0 7 0V8"/><path d="M10 12.5c1.6 0 2.4-1.4 3.2-2.9C14.1 8 15.1 6.5 17.2 6.5a3.9 3.9 0 0 1 0 7.8c-2.1 0-3.1-1.5-4-3"/>',
    code:     '<path d="M8 6l-5 6 5 6M16 6l5 6-5 6"/>',
    wrench:   '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 10a6 6 0 0 1-8.5 6.5L6 21a2.1 2.1 0 0 1-3-3l4.5-6.5A6 6 0 0 1 14 3l.7 3.3z"/>',
    headset:  '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="13" width="5" height="7" rx="2"/><rect x="17" y="13" width="5" height="7" rx="2"/>',
    gauge:    '<path d="M12 21a9 9 0 1 1 9-9"/><path d="M12 12l5-3"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    search:   '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'
  };
  // Set by the project/post detail renderers so initSEO() can describe the page.
  let PAGE_META = null;

  const icon = (name, size) => ICONS[name]
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"${size ? ` width="${size}" height="${size}"` : ""} aria-hidden="true">${ICONS[name]}</svg>`
    : "";

  const fmtDate = (iso) => {
    const d = new Date(iso + "T00:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };
  const byDateDesc = (a, b) => (a.date < b.date ? 1 : -1);
  const pills = (arr) => (arr || []).map((t) => `<span class="pill">${esc(t)}</span>`).join("");

  // Flattens whatever a card should be findable by into one lowercase haystack.
  const haystack = (...parts) => esc(parts.flat().filter(Boolean).join(" ").toLowerCase());

  /* -- theme --------------------------------------------------------------- */
  function initTheme() {
    const btn = el("theme-toggle");
    if (!btn) return;
    const paint = () => {
      const dark = document.documentElement.getAttribute("data-theme") !== "light";
      btn.innerHTML = icon(dark ? "sun" : "moon");
      btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    };
    paint();
    btn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* private mode */ }
      paint();
    });
  }

  /* -- header -------------------------------------------------------------- */
  function initHeader() {
    const header = $(".site-header");
    const toggle = el("nav-toggle");
    const links  = el("nav-links");

    if (header) {
      const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    if (toggle && links) {
      toggle.innerHTML = icon("menu");
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.innerHTML = icon(open ? "close" : "menu");
      });
      links.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
          links.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.innerHTML = icon("menu");
        }
      });
    }
    // mark the current page in the nav
    const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    $$("#nav-links a").forEach((a) => {
      const href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
      if (href === here || (here === "" && href === "index.html")) a.setAttribute("aria-current", "page");
    });
  }

  /* -- brand + footer ------------------------------------------------------ */
  function initChrome() {
    $$("[data-site-name]").forEach((n) => (n.textContent = SITE.name));
    $$("[data-site-initials]").forEach((n) => (n.textContent = SITE.initials));
    $$("[data-year]").forEach((n) => (n.textContent = new Date().getFullYear()));
    // Hide the CV buttons until an actual file is set, so nothing links to a 404.
    $$("[data-cv-link]").forEach((n) => {
      if (SITE.cv) n.setAttribute("href", SITE.cv);
      else n.remove();
    });

    // No profile links configured: remove the cards/columns that would be empty.
    if (!SITE.social.length) {
      $$("[data-socials]").forEach((n) => {
        const card = n.closest(".card");
        if (card && /^\s*Elsewhere\s*$/.test((card.querySelector("h3") || {}).textContent || "")) card.remove();
      });
    }

    const socialHTML = SITE.social
      .map((s) => `<a class="icon-btn" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" title="${esc(s.label)}" aria-label="${esc(s.label)}">${icon(s.icon)}</a>`)
      .join("");
    $$("[data-socials]").forEach((n) => (n.innerHTML = socialHTML));

    $$("[data-icon]").forEach((n) => (n.innerHTML = icon(n.dataset.icon)));

    const blurb = el("footer-blurb");
    if (blurb) blurb.textContent = SITE.footerBlurb;

    const fLinks = el("footer-social-links");
    if (fLinks) {
      fLinks.innerHTML = SITE.social
        .map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`)
        .join("");
    }
    $$("[data-email-link]").forEach((n) => {
      n.setAttribute("href", "mailto:" + SITE.email);
      if (n.dataset.emailLink === "text") n.textContent = SITE.email;
    });
  }

  /* -- scroll reveal ------------------------------------------------------- */
  function initReveal() {
    const items = $$("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((i) => i.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (!e.isIntersecting) return;
        setTimeout(() => e.target.classList.add("is-in"), i * 70);
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.06 });
    items.forEach((i) => io.observe(i));
  }

  /* -- cards --------------------------------------------------------------- */
  function projectCard(p) {
    return `
      <article class="card" data-reveal data-tags="${esc((p.tags || []).join("|"))}"
               data-search="${haystack(p.title, p.summary, p.role, p.year, p.tags, p.stack)}">
        <div class="card__media">
          <img src="${esc(p.cover)}" alt="${esc(p.title)} cover" loading="lazy" width="1200" height="750">
          ${p.featured ? '<span class="pill card__badge">Featured</span>' : ""}
        </div>
        <div class="card__body">
          <div class="card__meta"><span>${esc(p.year)}</span><span>&middot;</span><span>${esc(p.role)}</span></div>
          <h3 class="card__title"><a class="card__link" href="project.html?p=${encodeURIComponent(p.slug)}">${esc(p.title)}</a></h3>
          <p class="card__text">${esc(p.summary)}</p>
          <div class="card__foot pill-row">${pills((p.tags || []).slice(0, 3))}</div>
        </div>
      </article>`;
  }

  // One gallery thumbnail. data-shot is the index into GALLERY, which is what
  // the lightbox reads; data-tags/data-search let initCatalog filter them.
  function shotButton(g, i) {
    return `
      <button class="shot" type="button" data-shot="${i}"
              data-tags="${esc((g.tags || []).join("|"))}"
              data-search="${haystack(g.caption, g.alt, g.tags)}">
        <img src="${esc(g.src)}" alt="${esc(g.alt || "")}" loading="lazy" decoding="async"${g.w && g.h ? ` width="${g.w}" height="${g.h}"` : ""}>
        ${g.caption ? `<span class="shot__cap">${esc(g.caption)}</span>` : ""}
      </button>`;
  }

  function postCard(p) {
    return `
      <article class="card" data-reveal data-tags="${esc((p.tags || []).join("|"))}"
               data-search="${haystack(p.title, p.excerpt, p.tags, fmtDate(p.date))}">
        ${p.cover ? `<div class="card__media"><img src="${esc(p.cover)}" alt="" loading="lazy" width="1200" height="750"></div>` : ""}
        <div class="card__body">
          <div class="card__meta"><time datetime="${esc(p.date)}">${fmtDate(p.date)}</time></div>
          <h3 class="card__title"><a class="card__link" href="post.html?id=${encodeURIComponent(p.slug)}">${esc(p.title)}</a></h3>
          <p class="card__text">${esc(p.excerpt)}</p>
          <div class="card__foot pill-row">${pills((p.tags || []).slice(0, 3))}</div>
        </div>
      </article>`;
  }

  /* -- renderers ----------------------------------------------------------- */
  const render = {
    "hero": (n) => {
      n.innerHTML = `
        <p class="hero__eyebrow pill ${SITE.statusLive ? "pill--accent" : ""}">
          ${SITE.statusLive ? '<span class="dot dot--live"></span>' : ""}${esc(SITE.status)}
        </p>
        <h1>${SITE.headline}</h1>
        <p class="lede hero__lede">${esc(SITE.lede)}</p>
        <div class="btn-row hero__actions">
          <a class="btn" href="projects.html">See the work ${icon("arrow")}</a>
          <a class="btn btn--ghost" href="contact.html">${icon("mail")} Get in touch</a>
        </div>
        <div class="hero__foot">
          ${SITE.location ? `<span>${icon("pin", 14)} ${esc(SITE.location)}</span>` : ""}
          <span>${icon("clock", 14)} ${esc(SITE.role)}</span>
          <span class="socials" data-socials></span>
        </div>`;
    },

    "stats": (n) => {
      n.innerHTML = SITE.stats
        .map((s) => `<div class="stat"><div class="stat__value">${esc(s.value)}</div><div class="stat__label">${esc(s.label)}</div></div>`)
        .join("");
    },

    "marquee": (n) => {
      const run = SITE.marquee.map((m) => `<span class="strip__item">${esc(m)}</span>`).join("");
      n.innerHTML = run + run; // duplicated so the loop is seamless
    },

    "featured-projects": (n) => {
      const list = PROJECTS.filter((p) => p.featured).slice(0, 3);
      n.innerHTML = list.map(projectCard).join("") || '<p class="empty">No featured projects yet.</p>';
    },

    "latest-posts": (n) => {
      // Nothing written yet: hide the whole "Notes from the build" section
      // rather than advertise an empty devlog on the home page.
      if (!POSTS.length) {
        const section = n.closest("section");
        if (section) section.remove(); else n.remove();
        return;
      }
      n.innerHTML = POSTS.slice().sort(byDateDesc).slice(0, 3).map(postCard).join("");
    },

    "services-preview": (n) => {
      n.innerHTML = SERVICES.map((s) => `
        <article class="card feature" data-reveal>
          <div class="feature__icon">${icon(s.icon)}</div>
          <h3>${esc(s.title)}</h3>
          <p class="card__text">${esc(s.blurb)}</p>
        </article>`).join("");
    },

    "services": (n) => {
      n.innerHTML = SERVICES.map((s) => `
        <article class="card feature" data-reveal>
          <div class="feature__icon">${icon(s.icon)}</div>
          <h3>${esc(s.title)}</h3>
          <p class="card__text">${esc(s.blurb)}</p>
          <ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        </article>`).join("");
    },

    "testimonials": (n) => {
      // Nothing to show yet: drop the whole section rather than print a heading
      // over an empty space.
      if (!TESTIMONIALS.length && !UPWORK.stats.length) {
        const section = n.closest("section");
        if (section) section.remove(); else n.remove();
        return;
      }

      const strip = UPWORK.stats.length ? `
        <div class="stats" data-reveal>${UPWORK.stats.map((s) => `
          <div class="stat">
            <div class="stat__value">${esc(s.value)}</div>
            <div class="stat__label">${esc(s.label)}</div>
          </div>`).join("")}</div>` : "";

      // One quote in a three-column grid reads as a layout bug, so the columns
      // follow the number of reviews and a lone quote is centred instead.
      const n_t = TESTIMONIALS.length;
      const cols = n_t >= 3 ? " grid--3" : n_t === 2 ? " grid--2" : "";
      const solo = n_t === 1 ? "max-width:var(--max-prose);margin-left:auto;margin-right:auto;" : "";

      const cards = n_t ? `
        <div class="grid${cols}" style="${solo}margin-top:clamp(22px,3vw,34px)">${TESTIMONIALS.map((t) => `
          <figure class="card quote" data-reveal>
            <blockquote>${esc(t.quote)}</blockquote>
            <figcaption>
              <span class="quote__author">${esc(t.author)}</span>
              <span class="quote__role">${esc([t.role, t.source].filter(Boolean).join(" · "))}</span>
            </figcaption>
          </figure>`).join("")}</div>` : "";

      // The link is the point: it's what turns a claim into something checkable.
      const verify = UPWORK.url ? `
        <div class="btn-row" style="margin-top:clamp(22px,3vw,34px)">
          <a class="btn btn--ghost btn--sm" href="${esc(UPWORK.url)}" target="_blank" rel="noopener noreferrer">
            Verify on Upwork ${icon("external")}
          </a>
        </div>` : "";

      n.innerHTML = strip + cards + verify;
    },

    "process": (n) => {
      n.innerHTML = PROCESS.map((p) => `
        <article class="card feature" data-reveal>
          <div class="eyebrow">${esc(p.step)}</div>
          <h3>${esc(p.title)}</h3>
          <p class="card__text">${esc(p.text)}</p>
        </article>`).join("");
    },

    "faq": (n) => {
      n.innerHTML = FAQ.map((f) => `
        <details class="card" data-reveal style="padding:18px 20px">
          <summary style="cursor:pointer;font-weight:600;font-family:var(--font-display)">${esc(f.q)}</summary>
          <p class="card__text" style="margin-top:10px">${esc(f.a)}</p>
        </details>`).join("");
    },

    "projects": (n) => {
      n.innerHTML = PROJECTS.map(projectCard).join("") || '<p class="empty">No projects yet.</p>';
      initCatalog(n, "project", "project", "projects");
    },

    "posts": (n) => {
      n.innerHTML = POSTS.slice().sort(byDateDesc).map(postCard).join("")
        || '<p class="empty">Nothing here yet — the first posts are being written.</p>';
      initCatalog(n, "post", "post", "posts");
    },

    "project-detail": (n) => {
      const slug = new URLSearchParams(location.search).get("p");
      const p = PROJECTS.find((x) => x.slug === slug);
      if (!p) {
        n.innerHTML = '<div class="wrap section"><h1>Project not found</h1><p class="lede" style="margin-top:14px">That link points at something that isn\'t here.</p><p style="margin-top:24px"><a class="btn" href="projects.html">All projects</a></p></div>';
        return;
      }
      document.title = p.title + " — " + SITE.name;
      PAGE_META = { kind: "project", item: p };
      const links = (p.links || []).map((l, i) =>
        `<a class="btn ${i ? "btn--ghost" : ""}" href="${esc(l.url)}"${/^https?:/.test(l.url) ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(l.label)} ${icon(/^https?:/.test(l.url) ? "external" : "arrow")}</a>`).join("");

      // Gallery shots tagged with this project's title get their own strip
      // further down the page — same lightbox, no duplicated list to maintain.
      const shots = GALLERY
        .map((g, i) => ({ g, i }))
        .filter(({ g }) => (g.tags || []).includes(p.title));

      n.innerHTML = `
        <header class="page-head">
          <div class="wrap">
            <p class="eyebrow">${esc(p.year)} &nbsp;/&nbsp; ${esc(p.role)}</p>
            <h1>${esc(p.title)}</h1>
            <p class="lede" style="margin-top:20px;max-width:56ch">${esc(p.summary)}</p>
            <div class="pill-row" style="margin-top:22px">${pills(p.tags)}</div>
            ${links ? `<div class="btn-row" style="margin-top:26px">${links}</div>` : ""}
          </div>
        </header>
        <div class="wrap section">
          <img src="${esc(p.cover)}" alt="${esc(p.title)}" decoding="async"${p.coverW && p.coverH ? ` width="${p.coverW}" height="${p.coverH}"` : ""} style="border-radius:var(--r-lg);border:1px solid var(--line);width:100%;height:auto">
          <div class="split" style="margin-top:clamp(34px,5vw,64px)">
            <div class="prose">${p.body || ""}</div>
            <aside class="stack">
              ${p.facts && p.facts.length ? `
                <div class="card feature">
                  <h3>At a glance</h3>
                  <dl class="facts">${p.facts
                    .map((f) => `<dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd>`).join("")}</dl>
                </div>` : ""}
              ${p.highlights && p.highlights.length ? `
                <div class="card feature">
                  <h3>Highlights</h3>
                  <ul>${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
                </div>` : ""}
              ${p.stack && p.stack.length ? `
                <div class="card feature">
                  <h3>Built with</h3>
                  <div class="pill-row" style="margin-top:12px">${pills(p.stack)}</div>
                </div>` : ""}
            </aside>
          </div>
          ${shots.length ? `
          <section style="margin-top:clamp(40px,6vw,72px)">
            <p class="eyebrow">Screenshots</p>
            <div class="masonry" id="project-shots" style="margin-top:20px">
              ${shots.map(({ g, i }) => shotButton(g, i)).join("")}
            </div>
          </section>` : ""}
          <nav style="margin-top:clamp(40px,6vw,72px);display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">
            <a class="btn btn--ghost" href="projects.html">${icon("left")} All projects</a>
            <a class="btn" href="contact.html">Start a project ${icon("arrow")}</a>
          </nav>
        </div>`;

      const strip = el("project-shots");
      if (strip) initLightbox(strip);
    },

    "post-detail": (n) => {
      const slug = new URLSearchParams(location.search).get("id");
      const list = POSTS.slice().sort(byDateDesc);
      const i = list.findIndex((x) => x.slug === slug);
      const p = list[i];
      if (!p) {
        n.innerHTML = '<div class="wrap section"><h1>Post not found</h1><p class="lede" style="margin-top:14px">That link points at something that isn\'t here.</p><p style="margin-top:24px"><a class="btn" href="devlog.html">All posts</a></p></div>';
        return;
      }
      document.title = p.title + " — " + SITE.name;
      PAGE_META = { kind: "post", item: p };
      const prev = list[i + 1], next = list[i - 1];
      n.innerHTML = `
        <header class="page-head">
          <div class="wrap" style="max-width:var(--max-prose)">
            <p class="eyebrow"><time datetime="${esc(p.date)}">${fmtDate(p.date)}</time></p>
            <h1 style="font-size:var(--t-2xl)">${esc(p.title)}</h1>
            <div class="pill-row" style="margin-top:20px">${pills(p.tags)}</div>
          </div>
        </header>
        <article class="wrap section">
          <div class="prose" style="margin-inline:auto">
            <p class="lede" style="margin-bottom:1.6em">${esc(p.excerpt)}</p>
            ${p.body || ""}
          </div>
          <nav style="max-width:var(--max-prose);margin:clamp(40px,6vw,72px) auto 0;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">
            ${prev ? `<a class="btn btn--ghost btn--sm" href="post.html?id=${encodeURIComponent(prev.slug)}">${icon("left")} ${esc(prev.title)}</a>` : "<span></span>"}
            ${next ? `<a class="btn btn--ghost btn--sm" href="post.html?id=${encodeURIComponent(next.slug)}">${esc(next.title)} ${icon("right")}</a>` : "<span></span>"}
          </nav>
        </article>`;
    },

    "about-text": (n) => {
      n.innerHTML = ABOUT.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("");
    },

    "about-portrait": (n) => {
      n.innerHTML = `<img src="${esc(ABOUT.portrait)}" alt="${esc(SITE.name)}" width="800" height="900">`;
    },

    "fun-facts": (n) => {
      n.innerHTML = ABOUT.funFacts.map((f) => `<li>${esc(f)}</li>`).join("");
    },

    "skills": (n) => {
      n.innerHTML = SKILLS.map((g) => `
        <div class="card skill-group" data-reveal>
          <h3>${esc(g.group)}</h3>
          <div class="pill-row">${pills(g.items)}</div>
        </div>`).join("");
    },

    "timeline": (n) => {
      n.innerHTML = TIMELINE.map((t) => `
        <div class="tl-item" data-reveal>
          <p class="tl-item__period">${esc(t.period)}</p>
          <h3>${esc(t.role)}</h3>
          <p class="tl-item__org">${esc(t.org)}</p>
          <p>${esc(t.blurb)}</p>
          <div class="pill-row" style="margin-top:12px">${pills(t.tags)}</div>
        </div>`).join("");
    },

    "education": (n) => {
      // No entries yet: drop the block and the heading immediately before it.
      if (!EDUCATION.length) {
        const heading = n.previousElementSibling;
        if (heading && heading.classList.contains("eyebrow")) heading.remove();
        n.remove();
        return;
      }
      n.innerHTML = EDUCATION.map((t) => `
        <div class="tl-item">
          <p class="tl-item__period">${esc(t.period)}</p>
          <h3>${esc(t.title)}</h3>
          <p class="tl-item__org">${esc(t.org)}</p>
          <p>${esc(t.blurb)}</p>
        </div>`).join("");
    },

    "gallery": (n) => {
      n.innerHTML = GALLERY.map(shotButton).join("")
        || '<p class="empty">Screenshots are being put together — the shipped work is on the <a href="projects.html">projects page</a> in the meantime.</p>';
      initCatalog(n, "shot", "image", "images");
      initLightbox(n);
    },

    "contact-details": (n) => {
      n.innerHTML = `
        <a class="contact-line" href="mailto:${esc(SITE.email)}">
          ${icon("mail")}<div><span>Email</span><strong>${esc(SITE.email)}</strong></div>
        </a>
        ${SITE.location ? `<div class="contact-line">${icon("pin")}<div><span>Based in</span><strong>${esc(SITE.location)}</strong></div></div>` : ""}
        <div class="contact-line">${icon("clock")}<div><span>Status</span><strong>${esc(SITE.status)}</strong></div></div>`;
    },

    "resume-head": (n) => {
      n.innerHTML = `
        <h1 style="font-size:var(--t-2xl)">${esc(SITE.name)}</h1>
        <p class="lede" style="margin-top:8px">${esc(SITE.role)}</p>
        <p class="muted" style="margin-top:14px;font-family:var(--font-mono);font-size:var(--t-xs)">
          ${esc([SITE.email, SITE.location, ...SITE.social.map((s) => s.url.replace(/^https?:\/\//, ""))]
                .filter(Boolean).join("  ·  "))}
        </p>`;
    }
  };

  /* -- catalog: search + tag filter, both mirrored in the URL --------------
     Used by the projects grid and the devlog grid. The state lives in the
     query string (?tag=VR&q=hands) so a filtered view is linkable and
     survives a refresh or a back-button press.                              */
  function initCatalog(grid, prefix, noun, nounPlural) {
    const cards = $$("[data-search]", grid);
    if (!cards.length) {
      // Nothing to search: take the whole bar away rather than leave dead controls.
      [prefix + "-filters", prefix + "-count"].forEach((id) => { const n = el(id); if (n) n.remove(); });
      const box = el(prefix + "-search");
      if (box) { const b = box.closest(".catalog-bar"); (b || box).remove(); }
      return;
    }

    const bar    = el(prefix + "-filters");
    const input  = el(prefix + "-search");
    const clear  = el(prefix + "-search-clear");
    const status = el(prefix + "-count");

    const params = new URLSearchParams(location.search);
    let q   = (params.get("q") || "").trim();
    let tag = params.get("tag") || "All";

    const allTags = Array.from(
      new Set(cards.flatMap((c) => (c.dataset.tags || "").split("|").filter(Boolean)))
    ).sort();
    if (tag !== "All" && !allTags.includes(tag)) tag = "All";

    // Empty state lives next to the grid so it can sit in normal flow.
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.hidden = true;
    grid.after(empty);

    if (bar && allTags.length) {
      bar.innerHTML = ["All", ...allTags]
        .map((t) => `<button class="chip" type="button" data-tag="${esc(t)}" aria-pressed="${t === tag}">${esc(t)}</button>`)
        .join("");
      bar.addEventListener("click", (e) => {
        const btn = e.target.closest(".chip");
        if (!btn) return;
        tag = btn.dataset.tag;
        apply();
      });
    }

    if (input) {
      input.value = q;
      input.addEventListener("input", () => { q = input.value.trim(); apply(); });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && input.value) { e.stopPropagation(); input.value = ""; q = ""; apply(); }
      });
      // "/" focuses search from anywhere, the way most doc sites behave.
      document.addEventListener("keydown", (e) => {
        if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
        const t = e.target;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
        e.preventDefault();
        input.focus();
        input.select();
      });
    }
    if (clear) {
      clear.innerHTML = icon("close", 15);
      clear.addEventListener("click", () => {
        q = ""; tag = "All";
        if (input) { input.value = ""; input.focus(); }
        apply();
      });
    }

    function apply() {
      const needle = q.toLowerCase();
      let shown = 0;

      cards.forEach((card) => {
        const okTag = tag === "All" || (card.dataset.tags || "").split("|").includes(tag);
        const okQ   = !needle || (card.dataset.search || "").includes(needle);
        const show  = okTag && okQ;
        card.hidden = !show;
        if (show) shown++;
      });

      if (bar) $$(".chip", bar).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.tag === tag)));
      if (clear) clear.hidden = !q && tag === "All";

      const filtered = q || tag !== "All";
      empty.hidden = shown > 0;
      if (!shown) {
        empty.textContent = q
          ? `Nothing matches “${q}”${tag !== "All" ? ` in ${tag}` : ""}.`
          : `No ${nounPlural} tagged ${tag} yet.`;
      }
      if (status) {
        status.textContent = !filtered
          ? `${cards.length} ${cards.length === 1 ? noun : nounPlural}`
          : `${shown} of ${cards.length} ${nounPlural}`;
      }

      // Keep the address bar in step without adding history entries per keystroke.
      const next = new URLSearchParams(location.search);
      q ? next.set("q", q) : next.delete("q");
      tag !== "All" ? next.set("tag", tag) : next.delete("tag");
      const qs = next.toString();
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
    }

    apply();
  }

  /* -- lightbox ------------------------------------------------------------ */
  function initLightbox(grid) {
    const box = el("lightbox");
    if (!box) return;
    const img = $("img", box), cap = $("figcaption", box);
    let idx = 0;

    // Step through the shots actually on screen, so the arrows stay in step
    // with the tag filter — and so a project page only cycles its own strip.
    const visible = () => $$("[data-shot]", grid).filter((b) => !b.hidden);

    const show = (i) => {
      const list = visible();
      if (!list.length) return;
      idx = (i + list.length) % list.length;
      const g = GALLERY[Number(list[idx].dataset.shot)];
      if (!g) return;
      img.src = g.src;
      img.alt = g.alt || "";
      cap.textContent = g.caption || "";
    };
    const open = (i) => { show(i); box.classList.add("is-open"); document.body.style.overflow = "hidden"; $(".lightbox__close", box).focus(); };
    const close = () => { box.classList.remove("is-open"); document.body.style.overflow = ""; };

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-shot]");
      if (btn) open(visible().indexOf(btn));
    });
    box.addEventListener("click", (e) => {
      if (e.target === box) return close();
      if (e.target.closest(".lightbox__close")) return close();
      if (e.target.closest(".lightbox__prev")) return show(idx - 1);
      if (e.target.closest(".lightbox__next")) return show(idx + 1);
    });
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    $(".lightbox__close", box).innerHTML = icon("close");
    $(".lightbox__prev", box).innerHTML = icon("left");
    $(".lightbox__next", box).innerHTML = icon("right");
  }

  /* -- contact form --------------------------------------------------------
     With SITE.formEndpoint set, the message is POSTed and the visitor never
     leaves the page. Without it, we fall back to opening their mail client,
     so the form is never a dead end.                                        */
  function initForm() {
    const form = el("contact-form");
    if (!form) return;

    const note   = el("form-note");
    const status = el("form-status");
    const button = $('button[type="submit"]', form);
    const endpoint = (SITE.formEndpoint || "").trim();

    if (note) {
      note.textContent = endpoint
        ? "Your message goes straight to my inbox. I reply to everything that isn't a mass mailing."
        : "This opens your email app with the message filled in \u2014 nothing is sent through this site, and nothing is stored.";
    }

    const say = (msg, kind) => {
      if (!status) return;
      status.textContent = msg;
      status.className = "form__status" + (kind ? " form__status--" + kind : "");
      status.hidden = !msg;
    };

    const markInvalid = (field, bad) => {
      const wrap = field.closest(".field");
      if (wrap) wrap.classList.toggle("is-invalid", bad);
      field.setAttribute("aria-invalid", String(bad));
    };

    // Clear the error state as soon as someone starts fixing the field.
    $$("input, textarea", form).forEach((f) =>
      f.addEventListener("input", () => markInvalid(f, false)));

    function validate() {
      const bad = [];
      $$("[required]", form).forEach((f) => {
        const empty = !f.value.trim();
        const badEmail = f.type === "email" && f.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value.trim());
        const invalid = empty || badEmail;
        markInvalid(f, invalid);
        if (invalid) bad.push(f);
      });
      if (bad.length) {
        bad[0].focus();
        say("Please fill in the highlighted fields.", "error");
      }
      return !bad.length;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      say("");
      if (!validate()) return;

      const f = new FormData(form);
      if ((f.get("_gotcha") || "").toString().trim()) return;   // bot filled the honeypot

      if (!endpoint) {
        const subject = `[Portfolio] ${f.get("subject") || "New enquiry"} \u2014 ${f.get("name") || ""}`;
        const body = `${f.get("message") || ""}\n\n\u2014\n${f.get("name") || ""}\n${f.get("email") || ""}\n${f.get("company") ? "Company: " + f.get("company") : ""}`;
        location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        say("Opening your email app\u2026 if nothing happens, write to " + SITE.email + " directly.", "ok");
        return;
      }

      const label = button ? button.textContent : "";
      if (button) { button.disabled = true; button.textContent = "Sending\u2026"; }
      say("Sending\u2026");

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: f,
          headers: { Accept: "application/json" }
        });
        if (!res.ok) {
          let detail = "";
          try {
            const data = await res.json();
            detail = (data.errors || []).map((x) => x.message).join(", ");
          } catch (err) { /* non-JSON error body */ }
          throw new Error(detail || "Request failed (" + res.status + ")");
        }
        form.reset();
        say("Thanks \u2014 that's arrived. I'll get back to you, usually within a couple of days.", "ok");
      } catch (err) {
        say("That didn't send: " + err.message + ". Email me at " + SITE.email + " instead.", "error");
      } finally {
        if (button) { button.disabled = false; button.textContent = label; }
      }
    });
  }

  /* -- SEO: canonical, absolute social tags, structured data ---------------
     Done in JS so there's still exactly one place (data.js) to edit when the
     domain or the name changes. Crawlers that matter run JS; the static tags
     in each <head> remain the fallback for the ones that don't.             */
  function initSEO() {
    const head = document.head;
    const base = (SITE.url || "").replace(/\/+$/, "");
    const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    const meta = (attr, key, content) => {
      if (!content) return;
      let n = $(`meta[${attr}="${key}"]`, head);
      if (!n) { n = document.createElement("meta"); n.setAttribute(attr, key); head.appendChild(n); }
      n.setAttribute("content", content);
    };
    const abs = (path) => (!base ? "" : /^https?:/.test(path) ? path : base + "/" + String(path).replace(/^\.?\//, ""));

    // Detail pages describe themselves rather than inheriting the generic copy.
    if (PAGE_META) {
      const it = PAGE_META.item;
      const desc = (PAGE_META.kind === "project" ? it.summary : it.excerpt) || "";
      meta("name", "description", desc);
      meta("property", "og:title", it.title + " \u2014 " + SITE.name);
      meta("property", "og:description", desc);
      meta("property", "og:type", PAGE_META.kind === "post" ? "article" : "website");
      if (it.cover) meta("property", "og:image", abs(it.cover) || it.cover);
    }

    if (base) {
      const url = base + "/" + (page === "index.html" ? "" : page) + (location.search || "");
      let link = $('link[rel="canonical"]', head);
      if (!link) { link = document.createElement("link"); link.rel = "canonical"; head.appendChild(link); }
      link.href = url;
      meta("property", "og:url", url);
      // Social scrapers reject relative image paths.
      $$('meta[property="og:image"]', head).forEach((m) => m.setAttribute("content", abs(m.getAttribute("content"))));
    }

    const person = {
      "@type": "Person",
      name: SITE.name,
      jobTitle: SITE.role,
      email: "mailto:" + SITE.email,
      address: { "@type": "PostalAddress", addressLocality: SITE.location },
      sameAs: (SITE.social || []).map((x) => x.url).filter((u) => /^https?:/.test(u))
    };
    if (base) { person["@id"] = base + "/#person"; person.url = base + "/"; }
    if (typeof ABOUT !== "undefined" && ABOUT.portrait) { const img = abs(ABOUT.portrait); if (img) person.image = img; }

    const graph = [person];

    if (page === "index.html" || page === "") {
      graph.push({
        "@type": "WebSite",
        name: SITE.name + " \u2014 " + SITE.role,
        description: SITE.lede,
        ...(base ? { url: base + "/", "@id": base + "/#website" } : {}),
        publisher: base ? { "@id": base + "/#person" } : person
      });
    }

    if (PAGE_META && PAGE_META.kind === "project") {
      const it = PAGE_META.item;
      graph.push({
        "@type": "CreativeWork",
        name: it.title,
        description: it.summary,
        dateCreated: it.year,
        creator: base ? { "@id": base + "/#person" } : person,
        keywords: (it.tags || []).join(", "),
        ...(abs(it.cover) ? { image: abs(it.cover) } : {})
      });
    }

    if (PAGE_META && PAGE_META.kind === "post") {
      const it = PAGE_META.item;
      graph.push({
        "@type": "BlogPosting",
        headline: it.title,
        description: it.excerpt,
        datePublished: it.date,
        dateModified: it.date,
        author: base ? { "@id": base + "/#person" } : person,
        keywords: (it.tags || []).join(", "),
        ...(abs(it.cover) ? { image: abs(it.cover) } : {})
      });
    }

    const tag = document.createElement("script");
    tag.type = "application/ld+json";
    // A literal closing script tag inside the JSON would end this element early.
    tag.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2)
      .replace(/</g, "\\u003c");
    head.appendChild(tag);
  }

  /* -- boot ---------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initTheme();
    $$("[data-render]").forEach((node) => {
      const fn = render[node.dataset.render];
      if (fn) { try { fn(node); } catch (err) { console.error("render:" + node.dataset.render, err); } }
    });
    initChrome();   // runs after render so injected [data-socials] etc. get filled
    initForm();
    initSEO();      // after render so detail pages have set PAGE_META
    initReveal();
  });
})();
