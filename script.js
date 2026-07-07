document.addEventListener("DOMContentLoaded", () => {
  const bees = document.querySelectorAll(".bee");
  const bumbles = document.querySelectorAll(".bumblebee");
  const butterflies = document.querySelectorAll(".butterfly");

  // Insekten-Bewegungen starten
  if (bees.length > 0) {
    bees.forEach((bee) => setTimeout(() => moveInsect(bee), 200));
  }
  if (bumbles.length > 0) {
    bumbles.forEach((bumble) => setTimeout(() => moveInsect(bumble), 400));
  }
  if (butterflies.length > 0) {
    butterflies.forEach((bf) => setTimeout(() => moveInsect(bf), 600));
  }

  // Smasher-Weiche: Mobilgeräte oder Tablets herausfiltern
  const isMobileDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth <= 768;

  if (isMobileDevice) {
    // MOBIL-MODUS: Erstelle die Cursor-Biene als freies Fluginsekt!
    const mobileHumblebee = document.createElement("div");
    mobileHumblebee.className = "mobile-hummel";
    mobileHumblebee.style.left = "50%";
    mobileHumblebee.style.top = "50%";

    const layer = document.querySelector(".insect-layer");
    if (layer) {
      layer.appendChild(mobileHumblebee);
      setTimeout(() => moveInsect(mobileHumblebee), 500);
    }
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

    // Strategische Hover-Detektion (Nur für Desktop)
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
   FEHLENDE FUNKTIONEN: INSEKTEN-BEWEGUNG
   ========================================================================== */
function moveInsect(element) {
  // Sanfte Zufallsbewegung, die die CSS-Variablen updatet
  setInterval(() => {
    const randomX = Math.floor(Math.random() * 80) + 10; // 10% bis 90%
    const randomY = Math.floor(Math.random() * 80) + 10; // 10% bis 90%
    element.style.setProperty("--x", `${randomX}%`);
    element.style.setProperty("--y", `${randomY}%`);

    // Smooth Transition hinzufügen, damit sie nicht springen
    element.style.transition = "left 5s ease-in-out, top 5s ease-in-out";
    element.style.left = `var(--x)`;
    element.style.top = `var(--y)`;
  }, 5000); // Alle 5 Sekunden eine neue Position
}

/* ==========================================================================
   FEHLENDE FUNKTIONEN: GESCHICHTE (BUCH-BLÄTTER-SYSTEM)
   ========================================================================== */
let currentPage = 1;
const totalPages = 5;

function skipIntro() {
  // Versteckt die Intro-Texte und den Button
  document
    .querySelectorAll(".animated-text")
    .forEach((el) => (el.style.display = "none"));
  document.getElementById("skip-intro-btn").style.display = "none";

  // Zeigt Seite 1 an
  currentPage = 1;
  updateStoryPage();
}

function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    updateStoryPage();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    updateStoryPage();
  }
}

function closeStory() {
  document
    .querySelectorAll(".story-page")
    .forEach((page) => page.classList.remove("active-page"));
}

function updateStoryPage() {
  // Versteckt alle Seiten und zeigt nur die aktuelle an
  document
    .querySelectorAll(".story-page")
    .forEach((page) => page.classList.remove("active-page"));
  const currentEl = document.getElementById(`page${currentPage}`);
  if (currentEl) {
    currentEl.classList.add("active-page");
  }
}
