(function () {
  const WA_URL = "https://wa.me/559885375067";
  const header = document.querySelector(".header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const modal = document.getElementById("project-modal");
  const lightbox = document.getElementById("lightbox");
  const langButtons = document.querySelectorAll("[data-lang]");

  let currentLang = localStorage.getItem("lang") || "pt";
  let lightboxIndex = 0;
  let lightboxImages = [];

  function t(key) {
    const keys = key.split(".");
    let val = window.SiteI18n?.[currentLang];
    for (const k of keys) val = val?.[k];
    return val ?? key;
  }

  function applyLanguage(lang) {
    if (!window.SiteI18n?.[lang]) return;
    currentLang = lang;
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      el.alt = t(el.dataset.i18nAlt);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.dataset.i18nAria));
    });

    document.title = t("meta.title");
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = t("meta.description");

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.content = t("og.title");
    if (ogDesc) ogDesc.content = t("og.description");

    document.querySelectorAll(".project-card").forEach((card, i) => {
      const n = i + 1;
      const tag = card.querySelector(".project-card__tag");
      const title = card.querySelector(".project-card__overlay h3");
      if (tag) tag.textContent = t(`portfolio.p${n}Tag`);
      if (title) title.textContent = t(`portfolio.p${n}Title`);
      card.dataset.tag = t(`portfolio.p${n}Tag`);
      card.dataset.title = t(`portfolio.p${n}Title`);
      card.dataset.description = t(`portfolio.p${n}Desc`);
    });

    const ctaWa = document.querySelector("[data-wa-cta]");
    if (ctaWa) {
      ctaWa.href = `${WA_URL}?text=${encodeURIComponent(t("cta.waText"))}`;
    }

    langButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
      btn.setAttribute("aria-pressed", btn.dataset.lang === lang ? "true" : "false");
    });

    const modalClose = modal?.querySelector(".modal__close");
    if (modalClose) modalClose.setAttribute("aria-label", t("modal.close"));

    const lbClose = lightbox?.querySelector(".lightbox__close");
    const lbPrev = lightbox?.querySelector(".lightbox__prev");
    const lbNext = lightbox?.querySelector(".lightbox__next");
    if (lbClose) lbClose.setAttribute("aria-label", t("lightbox.close"));
    if (lbPrev) lbPrev.setAttribute("aria-label", t("lightbox.prev"));
    if (lbNext) lbNext.setAttribute("aria-label", t("lightbox.next"));

    const waFloat = document.querySelector(".whatsapp-float");
    if (waFloat) {
      waFloat.setAttribute("aria-label", t("whatsapp.aria"));
      waFloat.querySelector(".whatsapp-float__text") &&
        (waFloat.querySelector(".whatsapp-float__text").textContent = t("whatsapp.label"));
    }
  }

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
  });

  applyLanguage(currentLang);

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
