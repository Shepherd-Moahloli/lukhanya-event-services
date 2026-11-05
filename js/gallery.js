document.addEventListener("DOMContentLoaded", function () {
  document.body.style.overflowX = "hidden";
  const gallery = document.querySelector(".gallery");

  if (gallery) {
    gallery.style.display = "flex";
    gallery.style.gap = "24px";

    // Clone all items for seamless loop
    const items = Array.from(gallery.querySelectorAll(".photo"));
    const itemCount = items.length;

    if (itemCount > 0) {
      items.forEach((item) => {
        const clone = item.cloneNode(true);
        gallery.appendChild(clone);
      });

      let scrollPos = 0;
      const scrollSpeed = 2;
      const itemWidth = 320 + 24;
      const singleSetWidth = itemWidth * itemCount;
      let isAnimating = true;

      function animateGallery() {
        if (isAnimating) {
          scrollPos += scrollSpeed;
          gallery.style.transform = `translateX(-${scrollPos}px)`;

          if (scrollPos >= singleSetWidth) {
            scrollPos = 0;
          }
        }

        requestAnimationFrame(animateGallery);
      }

      animateGallery();

      // Create modal for enlarged image
      const modal = document.createElement("div");
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      modal.style.zIndex = "1000";
      modal.style.display = "none";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";

      const modalContent = document.createElement("div");
      modalContent.style.position = "relative";
      modalContent.style.maxWidth = "90vw";
      modalContent.style.maxHeight = "90vh";
      modalContent.style.display = "flex";
      modalContent.style.flexDirection = "column";
      modalContent.style.justifyContent = "center";
      modalContent.style.alignItems = "center";
      modalContent.style.overflow = "hidden";

      const modalImage = document.createElement("img");
      modalImage.style.width = "100%";
      modalImage.style.height = "auto";
      modalImage.style.maxHeight = "85vh";
      modalImage.style.objectFit = "contain";
      modalImage.style.borderRadius = "16px";
      modalImage.style.display = "block";

      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = "✕";
      closeBtn.style.position = "absolute";
      closeBtn.style.top = "16px";
      closeBtn.style.right = "16px";
      closeBtn.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
      closeBtn.style.border = "none";
      closeBtn.style.color = "white";
      closeBtn.style.fontSize = "32px";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.padding = "8px 12px";
      closeBtn.style.width = "auto";
      closeBtn.style.height = "auto";
      closeBtn.style.borderRadius = "12px";
      closeBtn.style.zIndex = "1001";
      closeBtn.style.transition = "all 0.2s ease";

      closeBtn.addEventListener("mouseenter", () => {
        closeBtn.style.backgroundColor = "rgba(186, 131, 31, 0.8)";
        closeBtn.style.transform = "scale(1.1)";
      });

      closeBtn.addEventListener("mouseleave", () => {
        closeBtn.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
        closeBtn.style.transform = "scale(1)";
      });

      modalContent.appendChild(closeBtn);
      modalContent.appendChild(modalImage);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      // Add hover effect for photos
      function attachPhotoListeners() {
        const photos = gallery.querySelectorAll(".photo");
        photos.forEach((photo) => {
          // Remove existing listeners to avoid duplicates
          photo.replaceWith(photo.cloneNode(true));
        });

        const photosRefreshed = gallery.querySelectorAll(".photo");
        photosRefreshed.forEach((photo) => {
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

          photo.addEventListener("click", () => {
            const imageSrc =
              photo.querySelector("img")?.src || photo.getAttribute("data-src");
            if (imageSrc && imageSrc !== "") {
              modalImage.src = imageSrc;
              modal.style.display = "flex";
              modal.style.opacity = "1";
            }
          });
        });
      }

      attachPhotoListeners();

      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
    }
  }
});
