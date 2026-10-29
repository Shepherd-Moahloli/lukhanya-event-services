const gallery = document.querySelector(".gallery");

if (gallery) {
  // Clone all items to create infinite loop effect
  const items = gallery.querySelectorAll(".photo");
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    gallery.appendChild(clone);
  });

  let scrollPos = 0;
  const scrollSpeed = 1; // pixels per frame
  const animationDuration = 20000; // 20 seconds for full scroll

  function animateGallery() {
    scrollPos += scrollSpeed;
    gallery.style.transform = `translateX(-${scrollPos}px)`;

    // Reset position when halfway through (seamless loop)
    if (scrollPos >= gallery.scrollWidth / 2) {
      scrollPos = 0;
    }

    requestAnimationFrame(animateGallery);
  }

  animateGallery();
}
