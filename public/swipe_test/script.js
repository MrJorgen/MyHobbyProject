const pages = [document.querySelector(".page0"), document.querySelector(".page1"), document.querySelector(".page2")],
  WIDTH = innerWidth;
let startX = null;


pages.forEach((ele) => {
  ele.addEventListener("touchstart", (evt) => {
    evt.preventDefault();
    startHandler(evt, ele);
  });
  ele.addEventListener("touchmove", (evt) => {
    evt.preventDefault();
    moveHandler(evt, ele);
  });
  ele.addEventListener("touchend", (evt) => {
    evt.preventDefault();
    endHandler(evt, ele);
  });
});

function startHandler(evt, ele) {
  if (evt.touches.length !== 1) {
    return;
  }
  startX = Math.floor(evt.changedTouches[0].clientX);
}

function moveHandler(evt, ele) {
  if (startX === null) {
    return;
  }
  const diff = evt.changedTouches[0].clientX - startX;
  let index = pages.indexOf(ele);
  console.log(Math.floor(evt.changedTouches[0].clientX));

  ele.style.left = diff + "px";
  
  if (index >= 1 && diff > 0) {
    pages[index - 1].style.display = "block";
    pages[index - 1].style.left = "calc(-100% + " + diff + "px)";
  }
  else if (index <= 1 && diff < 0) {
    pages[index + 1].style.display = "block";
    pages[index + 1].style.left = "calc(100% - " + Math.abs(diff) + "px)";
  }
  
}

function endHandler(evt, ele) {
  const diff = evt.changedTouches[0].clientX - startX;
  let index = pages.indexOf(ele), swipe = true, threshold = WIDTH / 4;
  
  pages.forEach((page) => {
    page.classList.add("animate");
  });

  if (diff < -threshold) {
    ele.style.left = "-100%";
    pages[index + 1].style.left = "0px";
  }
  else if (diff > threshold) {
    ele.style.left = "100%";
    pages[index - 1].style.left = "0px";
  }
  else {
    swipe = false;
    pages.forEach((page) => {
      page.style.removeProperty("left");
    });
  }
  setTimeout(() => {
    pages.forEach((page) => {
      if (!swipe) {
        page.removeAttribute("style");
      }
      page.classList.remove("animate");
    });
  }, 500);
}
