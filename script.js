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
// KORRIGIERTE SCHMETTERLINGS-FUNKTION (Mit Absturz-Schutz für Unterseiten)
// ==========================================================================
function moveButterfly(bf) {
  // Falls kein Schmetterling auf der Seite existiert, wird die Funktion sofort beendet
  if (!bf || bf === undefined) return;

  const currentX = parseFloat(bf.style.left) || 50;
  const randomX = Math.floor(Math.random() * 85);
  const randomY = Math.floor(Math.random() * 75) + 15;
  let rotation = 0;
  if (randomX > currentX) {
    rotation = 180;
  }
  bf.style.left = randomX + "%";
  bf.style.top = randomY + "%";
  bf.style.transform = `rotateY(${rotation}deg)`;
  const randomTime = Math.random() * 4000 + 5000;
  bf.style.transition = `top ${randomTime}ms ease-in-out, left ${randomTime}ms ease-in-out, transform 1.5s ease-in-out`;
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

  // 1. Erstelle das Bienen-Element dynamisch im DOM
  const beeFollower = document.createElement("div");
  beeFollower.className = "trailing-bee-cursor";
  document.body.appendChild(beeFollower);

  // Einstellbare Physik-Werte für die Flugbahn
  let mouseX = 0,
    mouseY = 0;
  let beeX = 0,
    beeY = 0;
  let angle = 0;
  const easing = 0.07; // Wie stark die Biene hinterherzieht (kleiner = träger)

  // Maus-Tracking
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Mathematische Render-Schleife (Ruckelfrei, GPU-unterstützt)
  function renderLoop() {
    // Annäherung berechnen
    beeX += (mouseX - beeX) * easing;
    beeY += (mouseY - beeY) * easing;

    // Organische Kreisschwingung berechnen, wenn die Maus steht
    angle += 0.04;
    const circleRadius = 24;

    // -32px sorgt für das optische Zentrum des Bildes (angepasst an große Biene)
    const finalX = beeX + Math.cos(angle) * circleRadius - 32;
    const finalY = beeY + Math.sin(angle) * circleRadius - 32;

    // Variables für CSS-Animationen bereitstellen
    beeFollower.style.setProperty("--bee-x", `${finalX}px`);
    beeFollower.style.setProperty("--bee-y", `${finalY}px`);

    /* KORREKTUR FÜR RÜCKWÄRTSFLIEGEN:
       Wenn mouseX > beeX ist (Maus bewegt sich nach rechts), spiegeln wir das Bild jetzt auf -1.
       Wenn sie sich nach links bewegt, bleibt es bei 1.
    */
    const direction = mouseX > beeX ? -1 : 1;

    // Transformieren, solange der Hover-Blinkmodus nicht aktiv ist
    if (!beeFollower.classList.contains("bee-hovering")) {
      beeFollower.style.transform = `translate3d(${finalX}px, ${finalY}px, 0) scaleX(${direction})`;
    }

    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);

  // 2. HOVER-DETEKTION FÜR LINKS UND BUTTONS (Blinken aktivieren)
  const interactiveTargets = document.querySelectorAll(
    "a, button, .buy-btn, .paypal-button, .gallery-item",
  );

  interactiveTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      beeFollower.classList.add("bee-hovering");
    });
    target.addEventListener("mouseleave", () => {
      beeFollower.classList.remove("bee-hovering");
    });
  });
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
