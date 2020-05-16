export function resolveSprites(img, size, entity) {
  let width = size,
    height = size,
    tmpArray = [],
    temp = {};

  for (let key in entity) {
    tmpArray = [];
    if (entity[key].length === undefined || entity[key].length <= 1) {
      temp = resolveSprite(img, size, entity);
    }
    else {
      for (let i = 0; i < entity[key].length; i++) {
        let tmpCanvas = document.createElement("canvas"),
          tmpContext = tmpCanvas.getContext("2d");
        tmpCanvas.width = width;
        tmpCanvas.height = height;
        tmpContext.drawImage(img, entity[key][i].x * width, entity[key][i].y * height, width, height, 0, 0, width, height);
        tmpArray.push(tmpCanvas);
      }
      temp[key] = tmpArray;
    }
  }
  return temp;

}
function resolveSprite(img, size, entity) {
  let width = size,
    height = size,
    temp = {};

  for (let key in entity) {
    let tmpCanvas = document.createElement("canvas"),
      tmpContext = tmpCanvas.getContext("2d");
    tmpCanvas.width = width;
    tmpCanvas.height = height;
    tmpContext.drawImage(img, entity[key].x * width, entity[key].y * height, width, height, 0, 0, width, height);
    temp[key] = tmpCanvas;
  }
  return temp;
}