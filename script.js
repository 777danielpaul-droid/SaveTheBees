document.addEventListener("DOMContentLoaded", () => {
  const bees = document.querySelectorAll(".bee");
  const bumbles = document.querySelectorAll(".bumblebee");
  const butterflies = document.querySelectorAll(".butterfly");

  // Zentrale, sichere Bewegungsfunktion für alle Insekten
  function moveInsect(element) {
    if (!element) return;
    setInterval(() => {
      const randomX = Math.floor(Math.random() * 80) + 10; // 10% bis 90%
      const randomY = Math.floor(Math.random() * 80) + 10;

      element.style.setProperty("--x", `${randomX}%`);
      element.style.setProperty("--y", `${randomY}%`);
      element.style.transition = "left 5s ease-in-out, top 5s ease-in-out";
      element.style.left = `${randomX}%`;
      element.style.top = `${randomY}%`;
    }, 5000);
  }

  // Insekten sicher starten
  if (bees.length > 0)
    bees.forEach((b) => setTimeout(() => moveInsect(b), 200));
  if (bumbles.length > 0)
    bumbles.forEach((b) => setTimeout(() => moveInsect(b), 400));
  if (butterflies.length > 0)
    butterflies.forEach((bf) => setTimeout(() => moveInsect(bf), 600));

  // Smasher-Weiche: Mobilgeräte oder Tablets herausfiltern
  const isMobileDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth <= 768;

  if (isMobileDevice) {
    // MOBIL-MODUS: Erstelle die Cursor-Biene als freies Fluginsekt!
    const mobileHumblebee = document.createElement("div");
    mobileHumblebee.className = "mobile-hummel";

    // Startet exakt in der Mitte des Bildschirms
    mobileHumblebee.style.position = "fixed";
    mobileHumblebee.style.left = "50%";
    mobileHumblebee.style.top = "50%";
    mobileHumblebee.style.transform = "translate(-50%, -50%)";

    // Direkt an den Body hängen, damit sie unabhängig vorn fliegen kann!
    document.body.appendChild(mobileHumblebee);

    // Erst nach einer kurzen Verzögerung losfliegen lassen, wenn das Layout steht
    setTimeout(() => {
      mobileHumblebee.style.left = "40%";
      mobileHumblebee.style.top = "40%";
      moveInsect(mobileHumblebee);
    }, 1000);
  } else {
    // DESKTOP-MODUS: Normaler Mauszeiger-Folger
    const beeFollower = document.createElement("div");
    beeFollower.className = "trailing-bee-cursor";
    document.body.appendChild(beeFollower);

    let mouseX = window.innerWidth / 2,
      mouseY = window.innerHeight / 2;
    let beeX = mouseX,
      beeY = mouseY;
    let angle = 0;
    const easing = 0.07;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderLoop() {
      beeX += (mouseX - beeX) * easing;
      beeY += (mouseY - beeY) * easing;
      angle += 0.04;
      const circleRadius = 24;
      const finalX = beeX + Math.cos(angle) * circleRadius - 32;
      const finalY = beeY + Math.sin(angle) * circleRadius - 32;

      beeFollower.style.setProperty("--bee-x", `${finalX}px`);
      beeFollower.style.setProperty("--bee-y", `${finalY}px`);

      const direction = mouseX > beeX ? -1 : 1;
      if (!beeFollower.classList.contains("bee-hovering")) {
        beeFollower.style.transform = `translate3d(${finalX}px, ${finalY}px, 0) scaleX(${direction})`;
      }
      requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);

    const moneyTargets = document.querySelectorAll(
      'a[href="shop.html"], a[href="donate.html"]',
    );
    moneyTargets.forEach((target) => {
      target.addEventListener("mouseenter", () =>
        beeFollower.classList.add("bee-hovering"),
      );
      target.addEventListener("mouseleave", () =>
        beeFollower.classList.remove("bee-hovering"),
      );
    });
  }
});

/* ==========================================================================
   GESCHICHTEN-SYSTEM (Wird von den HTML-Buttons aufgerufen)
   ========================================================================== */
let currentPage = 1;
const totalPages = 5;

window.skipIntro = function () {
  document
    .querySelectorAll(".animated-text")
    .forEach((el) => (el.style.display = "none"));
  const btn = document.getElementById("skip-intro-btn");
  if (btn) btn.style.display = "none";
  currentPage = 1;
  window.updateStoryPage();
};

window.nextPage = function () {
  if (currentPage < totalPages) {
    currentPage++;
    window.updateStoryPage();
  }
};

window.prevPage = function () {
  if (currentPage > 1) {
    currentPage--;
    window.updateStoryPage();
  }
};

window.closeStory = function () {
  document
    .querySelectorAll(".story-page")
    .forEach((p) => p.classList.remove("active-page"));
};

window.updateStoryPage = function () {
  document
    .querySelectorAll(".story-page")
    .forEach((p) => p.classList.remove("active-page"));
  const currentEl = document.getElementById(`page${currentPage}`);
  if (currentEl) {
    currentEl.classList.add("active-page");
  }
};
