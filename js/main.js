(function () {
  const header = document.querySelector(".header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const modal = document.getElementById("project-modal");
  const lightbox = document.getElementById("lightbox");

  let lightboxIndex = 0;
  let lightboxImages = [];

  /* Scroll header */
  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 40);
  });

  /* Mobile menu */
  menuToggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("open");
    menuToggle.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle?.classList.remove("active");
      menuToggle?.setAttribute("aria-expanded", "false");
      nav?.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll(".reveal");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduced) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* Project modal */
  const modalBackdrop = modal?.querySelector(".modal__backdrop");
  const modalClose = modal?.querySelector(".modal__close");
  const modalImage = modal?.querySelector(".modal__image img");
  const modalTag = modal?.querySelector(".modal__tag");
  const modalTitle = modal?.querySelector(".modal__title");
  const modalText = modal?.querySelector(".modal__text");

  function openModal(card) {
    if (!modal) return;
    modalImage.src = card.dataset.image;
    modalImage.alt = card.dataset.title;
    modalTag.textContent = card.dataset.tag;
    modalTitle.textContent = card.dataset.title;
    modalText.textContent = card.dataset.description;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal?.classList.remove("active");
    if (!lightbox?.classList.contains("active")) document.body.style.overflow = "";
  }

  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", () => openModal(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card);
      }
    });
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
  });

  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);

  /* Gallery lightbox */
  const lbImage = lightbox?.querySelector(".lightbox__image");
  const lbCaption = lightbox?.querySelector(".lightbox__caption");
  const lbBackdrop = lightbox?.querySelector(".lightbox__backdrop");
  const lbCloseBtn = lightbox?.querySelector(".lightbox__close");
  const lbPrevBtn = lightbox?.querySelector(".lightbox__prev");
  const lbNextBtn = lightbox?.querySelector(".lightbox__next");

  lightboxImages = Array.from(document.querySelectorAll(".gallery__item[data-lightbox]"));

  function showLightbox(index) {
    if (!lightbox || !lightboxImages.length) return;
    lightboxIndex = (index + lightboxImages.length) % lightboxImages.length;
    const item = lightboxImages[lightboxIndex];
    const img = item.querySelector("img");
    lbImage.src = img.src;
    lbImage.alt = img.alt;
    lbCaption.textContent = img.alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox?.classList.remove("active");
    if (!modal?.classList.contains("active")) document.body.style.overflow = "";
  }

  lightboxImages.forEach((item, index) => {
    item.addEventListener("click", () => showLightbox(index));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showLightbox(index);
      }
    });
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
  });

  lbCloseBtn?.addEventListener("click", closeLightbox);
  lbBackdrop?.addEventListener("click", closeLightbox);
  lbPrevBtn?.addEventListener("click", () => showLightbox(lightboxIndex - 1));
  lbNextBtn?.addEventListener("click", () => showLightbox(lightboxIndex + 1));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeLightbox();
    }
    if (lightbox?.classList.contains("active")) {
      if (e.key === "ArrowLeft") showLightbox(lightboxIndex - 1);
      if (e.key === "ArrowRight") showLightbox(lightboxIndex + 1);
    }
  });
})();
