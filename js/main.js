(function () {
  const header = document.querySelector(".header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const modal = document.getElementById("project-modal");
  const modalBackdrop = modal?.querySelector(".modal__backdrop");
  const modalClose = modal?.querySelector(".modal__close");
  const modalImage = modal?.querySelector(".modal__image img");
  const modalTag = modal?.querySelector(".modal__tag");
  const modalTitle = modal?.querySelector(".modal__title");
  const modalText = modal?.querySelector(".modal__text");

  /* Scroll header */
  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 40);
  });

  /* Mobile menu */
  menuToggle?.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    nav?.classList.toggle("open");
    document.body.style.overflow = nav?.classList.contains("open") ? "hidden" : "";
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle?.classList.remove("active");
      nav?.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll(".reveal");
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

  /* Project modal */
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
    document.body.style.overflow = "";
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
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
})();
