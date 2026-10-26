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

// Gallery carousel functionality
document.addEventListener("DOMContentLoaded", function () {
  const gallery = document.querySelector(".gallery");
  const photos = document.querySelectorAll(".photo");
  const prevBtn = document.querySelector(".gallery-nav.prev");
  const nextBtn = document.querySelector(".gallery-nav.next");

  if (!gallery || photos.length === 0) return;

  let currentIndex = 0;
  const itemsPerView = 3;
  const totalItems = photos.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);
  const gap = 36; // matches your CSS gap

  const updateGallery = () => {
    const itemWidth = gallery.offsetWidth / itemsPerView;
    const offset = currentIndex * (itemWidth + gap);
    gallery.style.transform = `translateX(-${offset}px)`;
  };

  prevBtn?.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateGallery();
  });

  nextBtn?.addEventListener("click", () => {
    currentIndex = Math.min(maxIndex, currentIndex + 1);
    updateGallery();
  });

  updateGallery();
});

// Gallery auto-scroll functionality
const gallery = document.querySelector(".gallery");
const galleryWrapper = document.querySelector(".gallery-wrapper");
const prevBtn = document.querySelector(".gallery-nav.prev");
const nextBtn = document.querySelector(".gallery-nav.next");

let autoScrollInterval;
const autoScrollSpeed = 20; // milliseconds between scroll steps (faster)
const scrollAmount = 4; // pixels per scroll step (increased from 2)
let isAutoScrolling = true;

function startAutoScroll() {
  if (autoScrollInterval) clearInterval(autoScrollInterval);
  isAutoScrolling = true;

  autoScrollInterval = setInterval(() => {
    if (gallery) {
      gallery.scrollLeft += scrollAmount;

      // Loop back to start when reaching the end
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
  isAutoScrolling = false;
  if (autoScrollInterval) clearInterval(autoScrollInterval);
}

// Start auto-scroll on load
if (gallery) {
  startAutoScroll();

  // Pause on hover
  gallery.addEventListener("mouseenter", stopAutoScroll);
  galleryWrapper.addEventListener("mouseenter", stopAutoScroll);

  // Resume on mouse leave
  gallery.addEventListener("mouseleave", startAutoScroll);
  galleryWrapper.addEventListener("mouseleave", startAutoScroll);
}

// Manual navigation buttons
if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    stopAutoScroll();
    if (gallery) {
      gallery.scrollLeft -= 400;
    }
    setTimeout(startAutoScroll, 3000); // Resume after 3 seconds
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    stopAutoScroll();
    if (gallery) {
      gallery.scrollLeft += 400;
    }
    setTimeout(startAutoScroll, 3000); // Resume after 3 seconds
  });
}
