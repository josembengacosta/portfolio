document.addEventListener("DOMContentLoaded", function () {
  const isPWA = window.matchMedia("(display-mode: standalone)").matches;
  if (isPWA) {
    document.body.classList.add("pwa-installed");
    console.log("PWA funcionando sem splash screen");
  }
});
