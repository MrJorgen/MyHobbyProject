var totalWidth = 0;
var timerRunning = false;
var numberWidth = false;
var sepWidth = false;
var startTimeStamp = 0;

document.onkeydown = keyHit;
document.ontouchstart = keyHit;
//document.addEventListener("onkeydown", keyHit, true);
//document.addEventListener("touchstart", keyHit, false);
function keyHit(evt) {
    evt = evt || window.event;
    //alert(evt.type);
    if (evt.type == 'keydown') {
        captureKey(evt.which ? evt.which : evt.keyCode);
    }
    else if (evt.type == 'touchstart') {
        captureKey(32);
    }
}

// reads dimension of the images to be used and makes
// the wrapping div the right size
function init() {
    var wrapper = document.getElementById("wrapper");
    var img1 = new Image();
    img1.onload = function () {
        numberWidth = this.naturalWidth;
        totalWidth += this.naturalWidth * 6;
        wrapper.style.width = totalWidth + 'px';
        reset();
    }
    img1.src = './Images/0.png';
    var img2 = new Image();
    img2.onload = function () {
        sepWidth = this.naturalWidth;
        totalWidth += this.naturalWidth * 2;
        wrapper.style.width = totalWidth + 'px';
    }
    img2.src = './Images/DotsEmpty.png';
}

// does this really need explaining? :)
function captureKey(charCode) {
    // spacebar
    if (charCode == 32 || charCode == undefined) {
        timerToggle();
    };
    // r
    if (charCode == 82) {
        if(!timerRunning){ reset(); };
    };
}

// toggles the timer on and off
function timerToggle() {
    var firstSep = document.getElementById("firstSep");
    if (!timerRunning) {
        startTimeStamp = Date.now();
        test();
        //setTimeout(function () { firstSep.style.visibility = 'hidden' }, 500);
        blinkOn = setInterval(function () {
            firstSep.style.visibility = 'visible';
        }, 1000);
        setTimeout(function () {
            blinkOff = setInterval(function () {
                firstSep.style.visibility = 'hidden';
            }, 1000);
        }, 500);
        timerRunning = true;
    }
    else {
        clearInterval(blinkOff);
        clearInterval(blinkOn);
        clearInterval(mainTimer);
        firstSep.style.visibility = 'visible';
        timerRunning = false;
    };
}

function reset() {
    var minutes = document.getElementById("minutes");
    var seconds = document.getElementById("seconds");
    var fractions = document.getElementById("fractions");
    minutes.innerHTML = '';
    seconds.innerHTML = '';
    fractions.innerHTML = '';
    for (i = 0; i <= 1; i++) {
        addZeros(minutes, i);
        addZeros(seconds, i);
        addZeros(fractions, i);
    };
    var firstSep = document.getElementById("firstSep");
    var secondSep = document.getElementById("secondSep");
    firstSep.innerHTML = '';
    secondSep.innerHTML = '';
    var oImg = document.createElement('img');
    oImg.setAttribute('src', './Images/DotsFilled.png');
    oImg.setAttribute('class', 'numbers');
    oImg.style.top = '0px';
    oImg.style.left = '0px';
    firstSep.appendChild(oImg);
    var oImg = document.createElement('img');
    oImg.setAttribute('src', './Images/DotsEmpty.png');
    fractions.style.height = oImg.naturalHeight + 'px';
    secondSep.appendChild(oImg);
    secondSep.style.visibility = 'hidden';
}

function addZeros(ele, i) {
    var oImg = document.createElement('img');
    oImg.setAttribute('src', './Images/0.png');
    oImg.setAttribute('class', 'numbers');
    oImg.setAttribute('id', ele.getAttribute('id') + i);
    oImg.style.top = '0px';
    if (ele.getAttribute('id') == 'fractions') {
        oImg.style.width = oImg.naturalWidth * .75 + 'px';
        oImg.style.height = oImg.naturalHeight * .75 + 'px';
        //oImg.style.marginTop = oImg.naturalHeight * .25 + 'px';
    };
    ele.appendChild(oImg);
}

function test() {
    var minutes = document.getElementById("minutes");
    var seconds = document.getElementById("seconds");
    var fractions = document.getElementById("fractions");
    mainTimer = setInterval(function () {
        timeElapsed = parseInt((Date.now() - startTimeStamp) / 10);
        drawNumbers(timeElapsed % 10, fractions, 1);
        drawNumbers(parseInt((timeElapsed / 10) % 10), fractions, 0);
        drawNumbers(parseInt((timeElapsed / 100) % 10), seconds, 1);
        drawNumbers(parseInt((timeElapsed / 1000) % 6) % 10, seconds, 0);
        drawNumbers(parseInt((timeElapsed / 6000) % 10), minutes, 1);
        drawNumbers(parseInt((timeElapsed / 60000) % 10), minutes, 0);
    }, 10);
}

function drawNumbers(number, ele, pos) {
    document.getElementById(ele.getAttribute('id') + pos).src = './Images/' + number + '.png';
}