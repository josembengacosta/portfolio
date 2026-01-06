document.addEventListener("DOMContentLoaded", function () {
  // Apenas marca como PWA instalado
  const isPWA = window.matchMedia("(display-mode: standalone)").matches;

  if (isPWA) {
    document.body.classList.add("pwa-installed");
    console.log("PWA detectado");

    // Apenas ajustes mínimos
    document.documentElement.style.setProperty("--pwa-mode", "active");

    // Ajuste simples para header
    setTimeout(() => {
      const header = document.querySelector(".header");
      if (header) {
        header.style.paddingTop = "calc(1rem + env(safe-area-inset-top))";
      }
    }, 100);
  }
});
