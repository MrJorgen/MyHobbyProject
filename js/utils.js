document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#scroll-up").addEventListener("click", () => { scrollCastList(-5) });
  document.querySelector("#scroll-down").addEventListener("click", () => { scrollCastList(5) });

  function scrollCastList(dist) {
    let list = document.querySelectorAll(".scroll-list");

    list = Array.from(list);

    let end = list.map(el => el.hidden).lastIndexOf(false),
      start = list.map(el => el.hidden).indexOf(false) - 1;
    
    console.log(dist, start, end);
    if (start > 0) {
      // document.querySelector("#scroll-up").hidden = false;
      document.querySelector("#scroll-up").classList.remove("disabled");
    }
    
    // Hide all
    list.forEach((ele) => {
      ele.hidden = true;
    })
    
    // Show selected ones
    if (dist > 0) {
      for (let i = 1; i <= Math.abs(dist); i++) {
        if (end + i >= list.length) {
          // document.querySelector("#scroll-down").hidden = true;
          document.querySelector("#scroll-down").classList.add("disabled");
          break;
        }
        // document.querySelector("#scroll-up").hidden = false;
        document.querySelector("#scroll-up").classList.remove("disabled");
        list[end + (Math.sign(dist) * i)].hidden = false;
      }
    } else if(dist < 0) {
      if (start <= 4) {
        start = 4;
        // document.querySelector("#scroll-up").hidden = true;
        document.querySelector("#scroll-up").classList.add("disabled");
      }
      if (end < list.length) {
        // document.querySelector("#scroll-down").hidden = false;
        document.querySelector("#scroll-down").classList.remove("disabled");
      }
      for (let i = 0; i < Math.abs(dist); i++) {
        list[start - i].hidden = false;
      }
    }
  }
})
