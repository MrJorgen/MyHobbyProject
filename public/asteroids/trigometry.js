document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.querySelector("#canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    context.clearRect(0, 0, width, height);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.save();
    context.strokeStyle = "white";
    context.translate(0, height / 2);
    context.scale(1, -1);
    context.lineWidth = 4;
    context.beginPath();
    for (let angle = 0; angle < Math.PI * 2; angle += .01) {
        let x = angle * 600,
            y = Math.sin(angle) * 600;
        context.lineTo(x, y);
    }
    context.stroke();
    context.beginPath();
    for (let angle = 0; angle < Math.PI * 2; angle += .01) {
        let x = angle * 600,
            y = Math.cos(angle) * 600;
        context.lineTo(x, y);
    }
    context.stroke();

}, false);
