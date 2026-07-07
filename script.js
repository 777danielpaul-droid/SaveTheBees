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
    mobileHumblebee.className = "mobile-hummel"; // Eigene saubere Klasse

    // WICHTIG: Startwerte setzen, damit moveBumbleBee() nicht abstürzt!
    mobileHumblebee.style.left = "50%";
    mobileHumblebee.style.top = "50%";

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
