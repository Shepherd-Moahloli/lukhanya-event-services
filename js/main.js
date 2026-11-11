document.addEventListener("DOMContentLoaded", () => {
  // List your hero images here (relative to project root /images)
  const images = [
    "images/3T4A8020.webp",
    "images/felixton9_2048x.jpg",
    "images/Paytons+sweet+16-6770.jpg",
    "images/Special-Function-Event-Pros.jpg",
  ];

  const slidesEl = document.getElementById("hsSlides");
  const heroSlider = document.querySelector(".hero-slider");
  const heroContent = document.querySelector(".hero-content");

  // make the slider a top-level element so it can be full-bleed
  if (heroSlider && heroSlider.parentElement !== document.body) {
    document.body.insertBefore(heroSlider, document.body.firstChild);
  }

  // helper to size hero to available viewport
  function adjustHeroHeight() {
    if (!heroSlider) return;
    const topbar = document.querySelector(".topbar");
    const nav = document.querySelector(".nav");
    const topbarHeight = topbar ? topbar.offsetHeight : 0;
    const navHeight = nav ? nav.offsetHeight : 0;
    const used = topbarHeight + navHeight;

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

    heroSlider.style.minHeight = "100vh";
    heroSlider.style.height = "100vh";

    if (heroContent) heroContent.style.paddingTop = used + "px";

    const sliderRect = heroSlider.getBoundingClientRect();
    const sliderHeight =
      isFinite(sliderRect.height) && sliderRect.height > 0
        ? sliderRect.height
        : window.innerHeight || heroSlider.offsetHeight || 0;

    let visibleHero = Math.max(0, sliderHeight - used);
    visibleHero = Math.min(visibleHero, sliderHeight);

    let px = isFinite(visibleHero) ? Math.round(visibleHero) + "px" : "0px";

    let followEl =
      heroContent?.nextElementSibling ||
      document.querySelector(
        "main, .site-main, .content, .page-content, .site-content",
      );

    if (followEl && followEl.tagName === "MAIN") {
      followEl.style.marginTop = "150px";
    } else if (followEl) {
      followEl.style.marginTop = px;
    } else {
      document.body.style.paddingTop = px;
    }
  }

  if (heroSlider) {
    heroSlider.style.position = "absolute";
    heroSlider.style.inset = "0";
    heroSlider.style.top = "0";
    heroSlider.style.left = "50%";
    heroSlider.style.transform = "translateX(-50%)";
    heroSlider.style.background = "transparent";
    if (images && images[0]) {
      heroSlider.style.backgroundImage = `url("${images[0]}")`;
      heroSlider.style.backgroundSize = "cover";
      heroSlider.style.backgroundPosition = "center";
    }
    heroSlider.style.width = "100vw";
    heroSlider.style.maxWidth = "100vw";
    if (heroContent) heroContent.style.position = "relative";
    heroSlider.style.zIndex = "0";
    if (heroContent) {
      heroContent.style.zIndex = "2";
      heroContent.style.pointerEvents = "auto";
    }
    heroSlider.style.pointerEvents = "none";

    adjustHeroHeight();
    window.addEventListener("resize", adjustHeroHeight);
  }

  if (!slidesEl) {
    console.warn("hsSlides element not found — skipping hero slider init.");
  } else {
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
      s.style.height = "100vh";
      s.style.transition = "opacity 300ms ease";
      s.style.opacity = i === 0 ? "1" : "0";
      s.style.willChange = "opacity, transform";
      s.setAttribute("data-index", i);
      if (i === 0) s.classList.add("active");
      slidesEl.appendChild(s);

      const img = new Image();
      img.src = src;
    });

    slidesEl.style.position = "absolute";
    slidesEl.style.inset = "0";
    slidesEl.style.width = "100%";
    slidesEl.style.height = "100vh";
    slidesEl.style.background = "transparent";
    slidesEl.style.zIndex = "0";

    let idx = 0;
    const total = images.length;
    let timer = null;
    const interval = 2500;

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

    start();
  }

  // set footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile hamburger menu toggle
  const hamburger = document.querySelector(".hamburger");
  const links = document.querySelector(".links");
  const body = document.body;

  if (hamburger && links) {
    hamburger.addEventListener("click", function (e) {
      e.preventDefault();
      hamburger.classList.toggle("active");
      links.classList.toggle("active");
      body.classList.toggle("menu-open");
      hamburger.setAttribute(
        "aria-expanded",
        hamburger.classList.contains("active"),
      );
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        links.classList.remove("active");
        body.classList.remove("menu-open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth scroll to sections
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "#home") return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});

// Gallery auto-scroll functionality
document.addEventListener("DOMContentLoaded", function () {
  const gallery = document.querySelector(".gallery");
  const galleryWrapper = document.querySelector(".gallery-wrapper");
  const prevBtn = document.querySelector(".gallery-nav.prev");
  const nextBtn = document.querySelector(".gallery-nav.next");

  let autoScrollInterval;
  const autoScrollSpeed = 20;
  const scrollAmount = 4;

  function startAutoScroll() {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(() => {
      if (gallery) {
        gallery.scrollLeft += scrollAmount;
        if (
          gallery.scrollLeft >=
          gallery.scrollWidth - gallery.clientWidth - 10
        ) {
          gallery.scrollLeft = 0;
        }
      }
    }, autoScrollSpeed);
  }

  function stopAutoScroll() {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
  }

  if (gallery) {
    startAutoScroll();
    gallery.addEventListener("mouseenter", stopAutoScroll);
    gallery.addEventListener("mouseleave", startAutoScroll);
    if (galleryWrapper) {
      galleryWrapper.addEventListener("mouseenter", stopAutoScroll);
      galleryWrapper.addEventListener("mouseleave", startAutoScroll);
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stopAutoScroll();
      if (gallery) gallery.scrollLeft -= 400;
      setTimeout(startAutoScroll, 3000);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stopAutoScroll();
      if (gallery) gallery.scrollLeft += 400;
      setTimeout(startAutoScroll, 3000);
    });
  }
});
