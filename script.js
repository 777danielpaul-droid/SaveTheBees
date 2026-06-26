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
  const randomX = Math.floor(Math.random() * 85);
  const factor1 = Math.random(),
    factor2 = Math.random();
  const weightedFactor = Math.max(factor1, factor2);
  const randomY = Math.floor(20 + weightedFactor * 68);
  const randomScale = Math.random() * 0.5 + 0.9;
  let direction = 1;
  if (randomX > currentX) {
    direction = -1;
  }
  bumble.style.left = randomX + "%";
  bumble.style.top = randomY + "%";
  bumble.style.transform = `scaleX(${direction}) scale(${randomScale})`;
  const randomTime = Math.random() * 4000 + 5000;
  bumble.style.transition = `top ${randomTime}ms ease-in-out, left ${randomTime}ms ease-in-out, transform 1.5s ease-in-out`;
  setTimeout(() => {
    moveBumbleBee(bumble);
  }, randomTime);
}

function moveButterfly(bf) {
  if (!bf) return;
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
});
