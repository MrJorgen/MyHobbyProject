export function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });
    // image.src = `./img/${src}.svg`;
    image.src = src;
  });
}
