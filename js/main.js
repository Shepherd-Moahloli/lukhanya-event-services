document.addEventListener("DOMContentLoaded", () => {
  // List your hero images here (relative to project root /images)
  const images = [
    "images/3T4A8020.webp",
    "images/felixton9_2048x.jpg",
    "images/Paytons+sweet+16-6770.jpg",
    "images/Special-Function-Event-Pros.jpg",
  ]; // <-- update filenames to match the files shown in your images/ folder

  const slidesEl = document.getElementById("hsSlides");
  const heroSlider = document.querySelector(".hero-slider");
  const heroContent = document.querySelector(".hero-content");

  // make the slider a top-level element so it can be full-bleed (not constrained by .container)
  if (heroSlider && heroSlider.parentElement !== document.body) {
    document.body.insertBefore(heroSlider, document.body.firstChild);
  }

  // helper to size hero to available viewport (fills page behind content)
  function adjustHeroHeight() {
    if (!heroSlider) return;
    const topbar = document.querySelector(".topbar");
    const nav = document.querySelector(".nav");
    const topbarHeight = topbar ? topbar.offsetHeight : 0;
    const navHeight = nav ? nav.offsetHeight : 0;
    const used = topbarHeight + navHeight;

    // expose header heights to CSS if needed
    document.documentElement.style.setProperty(
      "--topbar-height",
      topbarHeight + "px",
    );
    document.documentElement.style.setProperty(
      "--nav-height",
      navHeight + "px",
    );
    document.documentElement.style.setProperty(
      "--header-used-height",
      used + "px",
    );

    // ensure the slider is full viewport sized
    heroSlider.style.minHeight = "100vh";
    heroSlider.style.height = "100vh";

    // keep hero content pushed below the header
    if (heroContent) heroContent.style.paddingTop = used + "px";

    // compute usable hero area: prefer the actual rendered hero height
    const sliderRect = heroSlider.getBoundingClientRect();
    const sliderHeight =
      isFinite(sliderRect.height) && sliderRect.height > 0
        ? sliderRect.height
        : window.innerHeight || heroSlider.offsetHeight || 0;

    // visibleHero is the part of the slider not covered by header (can't be negative)
    let visibleHero = Math.max(0, sliderHeight - used);

    // clamp to a reasonable maximum (dont push content further than the slider height)
    visibleHero = Math.min(visibleHero, sliderHeight);

    // final px string (safe numeric check)
    let px = isFinite(visibleHero) ? Math.round(visibleHero) + "px" : "0px";

    // find element to push down (main/content)
    let followEl =
      heroContent?.nextElementSibling ||
      document.querySelector(
        "main, .site-main, .content, .page-content, .site-content",
      );

    // If the element is the <main> element, force 300px margin-top
    if (followEl && followEl.tagName === "MAIN") {
      followEl.style.marginTop = "150px";
    } else if (followEl) {
      followEl.style.marginTop = px;
    } else {
      document.body.style.paddingTop = px;
    }

    // Optional debug (uncomment while testing)
    // console.log({ topbarHeight, navHeight, used, sliderHeight, visibleHero, px, followEl });
  }

  if (heroSlider) {
    // Ensure basic positioning so slides sit behind content
    // make slider cover the viewport area behind content
    heroSlider.style.position = "absolute";
    heroSlider.style.inset = "0";
    heroSlider.style.top = "0";
    // center and ensure full-viewport width regardless of any parent container
    heroSlider.style.left = "50%";
    heroSlider.style.transform = "translateX(-50%)";
    heroSlider.style.background = "transparent";
    // set first image as background while slides load (prevents white flash)
    if (images && images[0]) {
      heroSlider.style.backgroundImage = `url("${images[0]}")`;
      heroSlider.style.backgroundSize = "cover";
      heroSlider.style.backgroundPosition = "center";
    }
    // make the slider full-bleed so it fills the page width (even inside .container)
    heroSlider.style.width = "100vw";
    heroSlider.style.maxWidth = "100vw";
    heroSlider.style.maxWidth = "none";
    if (heroContent) heroContent.style.position = "relative";
    // ensure headers/nav sit above the slider and hero content sits above slides
    // put the slider at the back, hero content above slides, and header/nav at top
    heroSlider.style.zIndex = "0";
    if (heroContent) heroContent.style.zIndex = "2";
    // make sure hero content can receive pointer events while slider does not block clicks
    heroSlider.style.pointerEvents = "none";
    if (heroContent) heroContent.style.pointerEvents = "auto";

    adjustHeroHeight();
    window.addEventListener("resize", adjustHeroHeight);
  }

  if (!slidesEl) {
    // nothing to do if slider container is missing
    console.warn("hsSlides element not found — skipping hero slider init.");
  } else {
    // create slides
    images.forEach((src, i) => {
      const s = document.createElement("div");
      s.className = "hs__slide";
      s.style.backgroundImage = `url("${src}")`;
      s.style.backgroundSize = "cover";
      s.style.backgroundPosition = "center";
      s.style.backgroundRepeat = "no-repeat";
      s.style.position = "absolute";
      s.style.inset = "0";
      s.style.width = "100%";
      s.style.height = "100vh"; // ensure each slide fills the viewport height
      s.style.transition = "opacity 300ms ease"; // faster transition
      s.style.opacity = i === 0 ? "1" : "0";
      s.style.willChange = "opacity, transform";
      s.setAttribute("data-index", i);
      if (i === 0) s.classList.add("active");
      slidesEl.appendChild(s);

      // preload image to reduce flash on slower connections
      const img = new Image();
      img.src = src;
    });

    // ensure slides container fills
    slidesEl.style.position = "absolute";
    slidesEl.style.inset = "0";
    slidesEl.style.width = "100%";
    slidesEl.style.height = "100vh";
    slidesEl.style.background = "transparent";
    // keep slides behind hero content but behind page header/nav
    slidesEl.style.zIndex = "0";

    let idx = 0;
    const total = images.length;
    let timer = null;
    const interval = 2500; // slightly quicker autoplay

    const go = (to) => {
      const slides = slidesEl.querySelectorAll(".hs__slide");
      idx = (to + total) % total;
      slides.forEach((el, i) => {
        el.classList.toggle("active", i === idx);
        el.style.opacity = i === idx ? "1" : "0";
      });
    };

    const next = () => go(idx + 1);
    const prev = () => go(idx - 1);

    function start() {
      stop();
      timer = setInterval(next, interval);
    }
    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    const nextBtn = document.getElementById("hsNext");
    const prevBtn = document.getElementById("hsPrev");
    if (nextBtn)
      nextBtn.addEventListener("click", () => {
        next();
        start();
      });
    if (prevBtn)
      prevBtn.addEventListener("click", () => {
        prev();
        start();
      });

    slidesEl.addEventListener("mouseenter", stop);
    slidesEl.addEventListener("mouseleave", start);

    // start autoplay
    start();
  }

  // set footer year safely
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// sendQuote (called from contact form)
function sendQuote(e) {
  e.preventDefault();
  const nameEl = document.getElementById("name");
  const name = ((nameEl && nameEl.value) || "").trim();
  if (!name) {
    alert("Please enter your name.");
    if (nameEl) nameEl.focus();
    return;
  }
  const type = (document.getElementById("type")?.value || "").trim() || "Event";
  const date = document.getElementById("date")?.value || "Not specified";
  const guests = document.getElementById("guests")?.value || "Not specified";
  const message =
    (document.getElementById("message")?.value || "").trim() ||
    "No additional message";

  const text = `Hello Lukhanya Event Services,\n\nName: ${name}\nEvent: ${type}\nDate: ${date}\nGuests: ${guests}\n\n${message}`;
  const waUrl = `https://wa.me/27798357630?text=${encodeURIComponent(text)}`;

  // Try to open WhatsApp in a new tab/window. If blocked, fallback to email.
  const win = window.open(waUrl, "_blank", "noopener");
  if (!win) {
    const subject = `Quote request from ${name}`;
    const body = `Name: ${name}\nEvent: ${type}\nDate: ${date}\nGuests: ${guests}\n\n${message}`;
    window.location.href = `mailto:info@lukhanyapro.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}

// open modal (safe checks)
function openWAForm() {
  const m = document.getElementById("waModal");
  if (!m) return;
  m.classList.add("open");
  m.setAttribute("aria-hidden", "false");

  const phone = document.getElementById("wa_phone");
  if (phone && !phone.value) phone.value = "+27 78 468 0610";

  const name = document.getElementById("wa_name");
  if (name) setTimeout(() => name.focus(), 50);

  const waForm = document.getElementById("waForm");
  if (waForm) waForm.hidden = false;
  const waConfirm = document.getElementById("waConfirm");
  if (waConfirm) waConfirm.hidden = true;
}

function closeWAForm() {
  const m = document.getElementById("waModal");
  if (!m) return;
  m.classList.remove("open");
  m.setAttribute("aria-hidden", "true");
}

function submitWAForm(e) {
  e.preventDefault();
  const name = (document.getElementById("wa_name")?.value || "").trim();
  const phone = (document.getElementById("wa_phone")?.value || "").trim();
  const message = (document.getElementById("wa_message")?.value || "").trim();

  if (!name || !message) {
    alert("Please enter your name and a short message.");
    return;
  }

  // TEMP TEST: send to your number (digits only)
  const recipient = "27784680610"; // <-- your number for testing

  const senderPhone = phone || "Not provided";

  const body = `Hello Lukhanya Event Services,\n\nName: ${name}\nSender phone: ${senderPhone}\n\nMessage:\n${message}`;

  const url = `https://wa.me/${recipient}?text=${encodeURIComponent(body)}`;

  const record = {
    name,
    phone: senderPhone,
    message,
    to: recipient,
    ts: new Date().toISOString(),
  };
  try {
    const logs = JSON.parse(localStorage.getItem("waLogs") || "[]");
    logs.push(record);
    localStorage.setItem("waLogs", JSON.stringify(logs));
  } catch (err) {
    /* ignore storage errors */
  }

  // send a copy to a webhook for immediate confirmation (optional)
  fetch("<YOUR_WEBHOOK_URL>", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  }).catch(() => {});

  const win = window.open(url, "_blank", "noopener");

  const waForm = document.getElementById("waForm");
  if (waForm) waForm.hidden = true;
  const waConfirm = document.getElementById("waConfirm");
  if (waConfirm) waConfirm.hidden = false;

  if (!win) {
    const subject = `Quote request from ${name}`;
    const bodyMail = `Name: ${name}\nEvent enquiry:\n${message}\n\nSender phone: ${senderPhone}`;
    window.location.href = `mailto:info@lukhanyapro.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyMail)}`;
  }
}

function retryWA() {
  const waForm = document.getElementById("waForm");
  const waConfirm = document.getElementById("waConfirm");
  if (waForm) waForm.hidden = false;
  if (waConfirm) waConfirm.hidden = true;
  setTimeout(() => document.getElementById("wa_message")?.focus(), 50);
}

function markAsSent() {
  const panel = document.querySelector(".wa-modal__panel");
  if (!panel) return;
  panel.innerHTML =
    '<p style="font-weight:700">Thanks — your message was opened in WhatsApp. Lukhanya will reply there. You can close this window.</p><div style="margin-top:14px"><button class="btn" onclick="closeWAForm()">Close</button></div>';
}

// close on ESC
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape") closeWAForm();
});
