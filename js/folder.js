(function () {
  const lightbox = document.getElementById("folder-lightbox");
  const folderImg = document.getElementById("folder-image");
  const btnFullscreen = document.getElementById("btn-fullscreen");
  const closeBtn = lightbox?.querySelector(".folder-lightbox__close");

  function openLightbox() {
    if (!lightbox) return;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  btnFullscreen?.addEventListener("click", openLightbox);
  folderImg?.addEventListener("click", openLightbox);
  closeBtn?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
  });
})();
