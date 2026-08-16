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

  /* Compartilhar */
  const SHARE_TITLE = "Isabelle Oliveira — Arquitetura & Design de Interiores";
  const SHARE_TEXT =
    "Conheci projetos lindos de arquitetura e design de interiores que transformam qualquer espaço em um lar acolhedor. Se você sonha em renovar sua casa, vale conhecer a Isabelle Oliveira!";

  const shareModal = document.getElementById("share-modal");
  const shareMessageEl = document.getElementById("share-message");
  const shareUrlEl = document.getElementById("share-url");
  const shareFeedback = document.getElementById("share-feedback");

  function getSharePayload() {
    const url = window.location.href;
    const fullText = `${SHARE_TEXT}\n\n${url}`;
    return { url, fullText };
  }

  function openShareModal() {
    if (!shareModal) return;
    const { url, fullText } = getSharePayload();
    if (shareMessageEl) shareMessageEl.textContent = SHARE_TEXT;
    if (shareUrlEl) shareUrlEl.textContent = url;
    shareModal.hidden = false;
    document.body.style.overflow = "hidden";
    if (shareFeedback) shareFeedback.textContent = "";
    shareModal.querySelector(".share-modal__close")?.focus();
  }

  function closeShareModal() {
    if (!shareModal) return;
    shareModal.hidden = true;
    document.body.style.overflow = "";
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }

  function showShareFeedback(msg) {
    if (shareFeedback) shareFeedback.textContent = msg;
  }

  async function shareSite() {
    const { url, fullText } = getSharePayload();
    if (navigator.share) {
      try {
        await navigator.share({
          title: SHARE_TITLE,
          text: SHARE_TEXT,
          url,
        });
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }
    openShareModal();
  }

  document.querySelectorAll("[data-share]").forEach((btn) => {
    btn.addEventListener("click", shareSite);
  });

  document.getElementById("share-copy-full")?.addEventListener("click", async () => {
    try {
      await copyText(getSharePayload().fullText);
      showShareFeedback("Mensagem copiada! Cole no WhatsApp ou redes sociais.");
    } catch {
      showShareFeedback("Não foi possível copiar. Selecione o texto manualmente.");
    }
  });

  document.getElementById("share-copy-link")?.addEventListener("click", async () => {
    try {
      await copyText(getSharePayload().url);
      showShareFeedback("Link copiado!");
    } catch {
      showShareFeedback("Não foi possível copiar o link.");
    }
  });

  shareModal?.querySelectorAll("[data-share-close]").forEach((el) => {
    el.addEventListener("click", closeShareModal);
  });

  /* Formulário de orçamento */
  const WA_NUMBER = "559885375067";
  const quoteForm = document.getElementById("quote-form");
  const quoteStatus = document.getElementById("quote-status");
  const briefingIntro = document.getElementById("briefing");
  const quoteSection = document.getElementById("formulario");
  const startBriefing = document.getElementById("start-briefing");
  const TIPO_ALIASES = {
    residencial: "Projeto residencial",
    interiores: "Design de interiores",
    gourmet: "Área gourmet e lazer",
    comercial: "Projeto comercial",
    "3d": "Imagens 3D",
    avaliacao: "Avaliação gratuita do ambiente",
  };

  function showQuoteForm(options = {}) {
    if (briefingIntro) briefingIntro.hidden = true;
    if (quoteSection) quoteSection.hidden = false;
    quoteSection?.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    if (options.scroll !== false) {
      quoteSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function shouldSkipBriefing() {
    const params = new URLSearchParams(window.location.search);
    return Boolean(params.get("tipo")) || window.location.hash === "#formulario";
  }

  startBriefing?.addEventListener("click", (e) => {
    e.preventDefault();
    history.replaceState(null, "", "#formulario");
    showQuoteForm();
  });

  if (quoteSection && shouldSkipBriefing()) {
    showQuoteForm({ scroll: false });
  }

  function setQuoteError(name, message) {
    const el = quoteForm?.querySelector(`[data-error-for="${name}"]`);
    if (!el) return;
    el.hidden = !message;
    el.textContent = message || "";
  }

  function preselectQuoteType() {
    if (!quoteForm) return;
    const tipo = new URLSearchParams(window.location.search).get("tipo");
    const value = TIPO_ALIASES[tipo] || tipo;
    if (!value) return;
    const radio = [...quoteForm.querySelectorAll('input[name="tipo"]')].find(
      (input) => input.value === value
    );
    if (radio) radio.checked = true;
  }

  function buildQuoteMessage(form) {
    const data = new FormData(form);
    const lines = [
      "Olá Isabelle, gostaria de solicitar um orçamento de projeto.",
      "",
      `Nome: ${data.get("nome") || "—"}`,
      `WhatsApp: ${data.get("telefone") || "—"}`,
      `Tipo de projeto: ${data.get("tipo") || "—"}`,
    ];
    const mensagem = (data.get("mensagem") || "").trim();
    if (mensagem) {
      lines.push("", "Sobre o projeto:", mensagem);
    }
    return lines.join("\n");
  }

  preselectQuoteType();

  quoteForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    setQuoteError("tipo", "");
    setQuoteError("consentimento", "");
    if (quoteStatus) quoteStatus.textContent = "";

    const tipo = quoteForm.querySelector('input[name="tipo"]:checked');
    const consentimento = quoteForm.querySelector('input[name="consentimento"]');
    let valid = true;

    if (!tipo) {
      setQuoteError("tipo", "Escolha o tipo de projeto.");
      valid = false;
    }
    if (!quoteForm.nome.value.trim()) {
      quoteForm.nome.reportValidity();
      valid = false;
    } else if (!quoteForm.telefone.value.trim()) {
      quoteForm.telefone.reportValidity();
      valid = false;
    }
    if (!consentimento?.checked) {
      setQuoteError("consentimento", "Confirme o consentimento para enviar.");
      valid = false;
    }
    if (!valid) return;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildQuoteMessage(quoteForm))}`;
    const openWhatsApp = () => {
      window.open(url, "_blank", "noopener");
      if (quoteStatus) {
        quoteStatus.textContent = "WhatsApp aberto. Confira a mensagem e envie quando estiver pronta.";
      }
    };
    if (typeof window.trackQuoteLead === "function") {
      window.trackQuoteLead(openWhatsApp);
    } else {
      openWhatsApp();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeLightbox();
      closeShareModal();
    }
    if (lightbox?.classList.contains("active")) {
      if (e.key === "ArrowLeft") showLightbox(lightboxIndex - 1);
      if (e.key === "ArrowRight") showLightbox(lightboxIndex + 1);
    }
  });
})();
