document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    let frameCounter = 0,
        timeElapsed = 0;

    update();

    function update(timeElapsed) {
        context.clearRect(0, 0, width, height);
        context.save();

        context.restore();
        frameCounter = requestAnimationFrame(update);
    }

})