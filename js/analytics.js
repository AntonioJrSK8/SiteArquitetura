(function () {
  var ADS_ID = "AW-18393325599";
  /* Rótulos do Google Ads > Metas > Conversões (formato: AbC-D_efG-h12_34-567).
     Deixe vazio até criar a ação; os eventos generate_lead e contact já são enviados. */
  var CONV_LEAD = "";
  var CONV_WHATSAPP = "";

  function gtagReady() {
    return typeof window.gtag === "function";
  }

  function fireEvent(name, params) {
    if (!gtagReady()) return;
    window.gtag("event", name, params || {});
  }

  function fireAdsConversion(label, extra) {
    if (!gtagReady() || !label) return;
    var payload = extra || {};
    payload.send_to = ADS_ID + "/" + label;
    window.gtag("event", "conversion", payload);
  }

  function onceCallback(fn, timeoutMs) {
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      if (typeof fn === "function") fn();
    }
    setTimeout(finish, timeoutMs || 1800);
    return finish;
  }

  function trackWhatsApp() {
    fireEvent("contact", {
      method: "WhatsApp",
      event_category: "engagement",
      event_label: "WhatsApp",
    });
    fireAdsConversion(CONV_WHATSAPP);
  }

  function trackLead(callback) {
    var finish = onceCallback(callback, 1800);
    if (!gtagReady()) {
      finish();
      return;
    }
    fireEvent("generate_lead", {
      currency: "BRL",
      value: 1,
      event_callback: finish,
      event_timeout: 1800,
    });
    fireAdsConversion(CONV_LEAD, {
      event_callback: finish,
      event_timeout: 1800,
    });
  }

  window.trackQuoteLead = trackLead;
  window.trackWhatsAppClick = trackWhatsApp;

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href*='wa.me'], a[href*='whatsapp.com']");
    if (link) trackWhatsApp();
  });
})();
