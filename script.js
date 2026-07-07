function moveBee(bee) {
  if (!bee) return;
  const currentX = parseFloat(bee.style.left) || 50;
  const randomX = Math.floor(Math.random() * 90);
  const factor1 = Math.random(),
    factor2 = Math.random();
  const weightedFactor = Math.max(factor1, factor2);
  const randomY = Math.floor(15 + weightedFactor * 73);
  const randomScale = Math.random() * 0.6 + 0.8;
  let direction = 1;
  if (randomX > currentX) {
    direction = -1;
  }
  bee.style.left = randomX + "%";
  bee.style.top = randomY + "%";
  bee.style.transform = `scaleX(${direction}) scale(${randomScale})`;
  const randomTime = Math.random() * 4000 + 4000;
  bee.style.transition = `top ${randomTime}ms ease-in-out, left ${randomTime}ms ease-in-out, transform 1.2s ease-in-out`;
  setTimeout(() => {
    moveBee(bee);
  }, randomTime);
}

function moveBumbleBee(bumble) {
  if (!bumble) return;
  const currentX = parseFloat(bumble.style.left) || 50;

  // Begrenzt X auf 10% bis 75% (damit er links und rechts nicht rausfliegt)
  const randomX = Math.floor(10 + Math.random() * 65);

  const factor1 = Math.random(),
    factor2 = Math.random();
  const weightedFactor = Math.max(factor1, factor2);

  // Begrenzt Y auf 20% bis 65% (damit er oben und unten im Sichtfeld bleibt)
  const randomY = Math.floor(20 + weightedFactor * 45);

  const randomScale = Math.random() * 0.4 + 1.0; // Bleibt schön groß
  let direction = 1;
  if (randomX > currentX) {
    direction = -1;
  }

  bumble.style.left = randomX + "%";
  bumble.style.top = randomY + "%";
  bumble.style.transform = `scaleX(${direction}) scale(${randomScale})`;

  const randomTime = Math.random() * 4000 + 4000;
  bumble.style.transition = `top ${randomTime}ms ease-in-out, left ${randomTime}ms ease-in-out, transform 1.2s ease-in-out`;

  setTimeout(() => {
    moveBumbleBee(bumble);
  }, randomTime);
}

// ==========================================================================
// KORRIGIERTE SCHMETTERLINGS-FUNKTION (Kopfstand-Fix & ohne Spiegelung)
// ==========================================================================
function moveButterfly(bf) {
  if (!bf || bf === undefined) return;

  // Berechnet rein die neuen Koordinaten im Raum
  const randomX = Math.floor(Math.random() * 85);
  const randomY = Math.floor(Math.random() * 75) + 15;

  bf.style.left = randomX + "%";
  bf.style.top = randomY + "%";

  const randomTime = Math.random() * 4000 + 5000;
  bf.style.transition = `top ${randomTime}ms ease-in-out, left ${randomTime}ms ease-in-out`;

  setTimeout(() => {
    moveButterfly(bf);
  }, randomTime);
}

// ==========================================================================
// MAUS-SCHWÄRM-LOGIK (REQUEST ANIMATION FRAME ARCHITECTURE)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const bees = document.querySelectorAll(".bee");
  const bumbles = document.querySelectorAll(".bumblebee");
  const butterflies = document.querySelectorAll(".butterfly");

  if (bees.length > 0) {
    bees.forEach((bee) => {
      setTimeout(() => {
        moveBee(bee);
      }, 200);
    });
  }
  if (bumbles.length > 0) {
    bumbles.forEach((bumble) => {
      setTimeout(() => {
        moveBumbleBee(bumble);
      }, 400);
    });
  }
  if (butterflies.length > 0) {
    butterflies.forEach((bf) => {
      setTimeout(() => {
        moveButterfly(bf);
      }, 600);
    });
  }

  // Smasher-Weiche: Mobilgeräte oder Tablets herausfiltern
  const isMobileDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth <= 768;

  if (isMobileDevice) {
    // MOBIL-MODUS: Erstelle die Cursor-Biene als freies Fluginsekt!
    const mobileHumblebee = document.createElement("div");
    mobileHumblebee.className = "bumblebee mobile-hummel";
    mobileHumblebee.style.backgroundImage = "url('CursorBee.png')";

    // In den Insekten-Layer einsetzen
    const layer = document.querySelector(".insect-layer");
    if (layer) {
      layer.appendChild(mobileHumblebee);
      setTimeout(() => {
        moveBumbleBee(mobileHumblebee);
      }, 500);
    }
  } else {
    // DESKTOP-MODUS: Normaler Mauszeiger-Folger
    const beeFollower = document.createElement("div");
    beeFollower.className = "trailing-bee-cursor";
    document.body.appendChild(beeFollower);

    let mouseX = 0,
      mouseY = 0;
    let beeX = 0,
      beeY = 0;
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

    // Strategische Hover-Detektion (Nur für Desktop!)
    const moneyTargets = document.querySelectorAll(
      'a[href="shop.html"], a[href="donate.html"]',
    );

    moneyTargets.forEach((target) => {
      target.addEventListener("mouseenter", () => {
        beeFollower.classList.add("bee-hovering");
      });
      target.addEventListener("mouseleave", () => {
        beeFollower.classList.remove("bee-hovering");
      });
    });
  }
});

// ==========================================================================
// DIE LOGIK FÜR DAS BLÄTTERN DER 4 SEITEN
// ==========================================================================
let currentPageNumber = 1;
const totalPages = 5;

function nextPage() {
  if (currentPageNumber < totalPages) {
    const currentPage = document.getElementById(`page${currentPageNumber}`);
    currentPageNumber++;
    const nextPage = document.getElementById(`page${currentPageNumber}`);

    if (currentPage && nextPage) {
      currentPage.classList.remove("active-page");
      nextPage.classList.add("active-page");
    }
  }
}

function prevPage() {
  if (currentPageNumber > 1) {
    const currentPage = document.getElementById(`page${currentPageNumber}`);
    currentPageNumber--;
    const prevPage = document.getElementById(`page${currentPageNumber}`);

    if (currentPage && prevPage) {
      currentPage.classList.remove("active-page");
      prevPage.classList.add("active-page");
      prevPage.style.opacity = "1";
    }
  }
}

function closeStory() {
  const currentPage = document.getElementById(`page${currentPageNumber}`);
  if (currentPage) {
    currentPage.classList.remove("active-page");
  }

  const textContainer = document.querySelector(".text-container");
  if (textContainer) {
    textContainer.style.display = "none";
  }
}

// ==========================================================================
// NEU: INTRO ÜBERSPRINGEN LOGIK
// ==========================================================================
function skipIntro() {
  const introTexts = document.querySelectorAll(".animated-text");
  introTexts.forEach((txt) => {
    txt.style.animation = "none";
    txt.style.opacity = "0";
  });

  const skipBtn = document.getElementById("skip-intro-btn");
  if (skipBtn) {
    skipBtn.style.display = "none";
  }

  const page1 = document.getElementById("page1");
  if (page1) {
    page1.style.animation = "none";
    page1.classList.add("active-page");
    page1.style.opacity = "1";
  }

  currentPageNumber = 1;
}
