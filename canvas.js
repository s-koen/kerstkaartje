// 1. globals
const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

const bgCanvas = document.createElement("canvas");
const bgCtx = bgCanvas.getContext("2d");

const snowCanvas = document.createElement("canvas");
const snowCtx = snowCanvas.getContext("2d");

const messages = [
    "",
    "fijne feestdagen!",
    "van mij voor jou :)",
];
let currentMessage = 0;
let displayedText = "";
let charIndex = 0;
let typeSpeed = 1; // letters per frame

let pixelSize = 1;
let gridWidth = 0;
let gridHeight = 0;
const snowflakes = [];


let bgReady = false;
let fontReady = false;

const bgImg = new Image();
bgImg.src = "background-snow.png";
bgImg.onload = () => {
    bgReady = true;
    resizeCanvas();
    updatePixelSize();
    initSnowflakes(1000);
    redrawBackground();
    startIfReady();
};

// wait for font
document.fonts.ready.then(() => {
    fontReady = true;
    startIfReady();
});

function startIfReady() {
    if (bgReady && fontReady) {
        animate();
    }
}


function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    snowCanvas.width = bgImg.width;
    snowCanvas.height = bgImg.height;

    snowCtx.setTransform(1, 0, 0, 1, 0, 0);
    snowCtx.imageSmoothingEnabled = false;
    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bgCtx.imageSmoothingEnabled = false;

    if (bgImg.complete) {
        updatePixelSize();
        redrawBackground();
    }
}

window.addEventListener("resize", resizeCanvas);


canvas.addEventListener("click", () => {

    if(displayedText === messages[currentMessage]){
        currentMessage = (currentMessage + 1) % messages.length;
        displayedText = "";
        charIndex = 0;
    }
});

function updatePixelSize() {
    pixelSize = Math.max(1, canvas.clientWidth / bgImg.width);
}



function redrawBackground() {
    const dpr = window.devicePixelRatio || 1;

    bgCanvas.width = canvas.width;
    bgCanvas.height = canvas.height;

    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bgCtx.imageSmoothingEnabled = false;

    const scale = canvas.clientWidth / bgImg.width;
    const drawWidth = bgImg.width * scale / dpr;
    const drawHeight = bgImg.height * scale / dpr;

    const x = 0;
    const y = (canvas.clientHeight - drawHeight * dpr) / dpr;

    bgCtx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    bgCtx.drawImage(bgImg, x, y, drawWidth, drawHeight);
}




function initSnowflakes(n = 120) {
    snowflakes.length = 0;

    gridWidth = bgImg.width;
    gridHeight = bgImg.height;

    random_array = Array.from({length: gridWidth}, () => Math.floor(Math.random() * 100 - 2.5));


    for (let i = 0; i < n; i++) {
        snowflakes.push({
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight),
            speed: 0.1 + Math.random()**2 * 0.7
        });
    }
}

function animate() {
    snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

    for (let f of snowflakes) {
        f.y += f.speed;
        if (f.y > gridHeight) {
            f.y = 0;
            f.x = Math.floor(Math.random() * gridWidth);
        }

        if (f.y > gridHeight / 2.5 + random_array[f.x]) {
            if (f.speed >= 0.4){
                snowCtx.fillStyle = "#fff";
            } else {
                snowCtx.fillStyle = "#BDBDBD";
            }
        } else if (f.y > gridHeight / 3.5 + random_array[f.x]){
            snowCtx.fillStyle = "#888";
        } else {
            snowCtx.fillStyle = "#373745";
        }
        snowCtx.fillRect(f.x, Math.floor(f.y), 1, 1);
    }

    ctx.drawImage(bgCanvas, 0, 0);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
        snowCanvas,
        0, 0, snowCanvas.width, snowCanvas.height,
        0, 0, canvas.clientWidth, canvas.clientHeight
    );

    if(charIndex < messages[currentMessage].length){
        charIndex += typeSpeed;
        if(charIndex > messages[currentMessage].length) charIndex = messages[currentMessage].length;
        displayedText = messages[currentMessage].slice(0, charIndex);
    }

    ctx.fillStyle = "#FFE6CC";
    ctx.font = "60px 'peaberry'";
    ctx.textAlign = "center";
    ctx.fillText(displayedText, canvas.clientWidth / 2, canvas.clientHeight /2.5);

    requestAnimationFrame(animate);
}
