function animate({ timing, draw, duration }) {

  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction goes from 0 to 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // calculate the current animation state
    let progress = timing(timeFraction)

    draw(progress); // draw it

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}

function linear(timeFraction) {
  return timeFraction;
}

function quad(timeFraction) {
  return Math.pow(timeFraction, 2)
}

function cube(timeFraction) {
  return Math.pow(timeFraction, 3)
}

export { animate, linear, quad, cube }