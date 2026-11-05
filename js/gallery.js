document.addEventListener("DOMContentLoaded", function () {
  const gallery = document.querySelector(".gallery");

  if (gallery) {
    // Clone all items for seamless loop
    const items = Array.from(gallery.querySelectorAll(".photo"));
    const itemCount = items.length;

    if (itemCount > 0) {
      items.forEach((item) => {
        const clone = item.cloneNode(true);
        gallery.appendChild(clone);
      });

      let scrollPos = 0;
      const scrollSpeed = 0.8;
      const itemWidth = 320 + 24; // photo width (320px) + gap (24px)
      const singleSetWidth = itemWidth * itemCount;
      let isAnimating = true;

      function animateGallery() {
        if (isAnimating) {
          scrollPos += scrollSpeed;
          gallery.style.transform = `translateX(-${scrollPos}px)`;

          // Reset seamlessly when halfway through
          if (scrollPos >= singleSetWidth) {
            scrollPos = 0;
          }
        }

        requestAnimationFrame(animateGallery);
      }

      animateGallery();

      // Add hover effect for photos
      const photos = gallery.querySelectorAll(".photo");
      photos.forEach((photo) => {
        photo.style.cursor = "pointer";
        photo.style.transition = "transform 0.3s ease";
        photo.style.transformOrigin = "center center";

        photo.addEventListener("mouseenter", () => {
          isAnimating = false;
          photo.style.transform = "scale(1.3)";
          photo.style.zIndex = "10";
        });

        photo.addEventListener("mouseleave", () => {
          isAnimating = true;
          photo.style.transform = "scale(1)";
          photo.style.zIndex = "1";
        });
      });
    }
  }
});
