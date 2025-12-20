// 1. globals
const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

const bgCanvas = document.createElement("canvas");
const bgCtx = bgCanvas.getContext("2d");

let pixelSize = 1;
let gridWidth = 0;
let gridHeight = 0;
const snowflakes = [];

// 2. load background
const bgImg = new Image();
bgImg.src = "background.png"; // must be 111 px wide for pixel alignment

bgImg.onload = () => {
    resizeCanvas();
    updatePixelSize();
    initSnowflakes(1000);
    redrawBackground();
    animate();
};

// 3. resize & pixel scaling
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bgCtx.imageSmoothingEnabled = false;

    if (bgImg.complete) {
        updatePixelSize();
        redrawBackground();
    }
}

window.addEventListener("resize", resizeCanvas);

function updatePixelSize() {
    pixelSize = Math.max(1, canvas.clientWidth / bgImg.width);
}

// 4. background draw (bottom-aligned)


function redrawBackground() {
    const dpr = window.devicePixelRatio || 1;

    // set bgCanvas to device pixels
    bgCanvas.width = canvas.width;
    bgCanvas.height = canvas.height;

    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bgCtx.imageSmoothingEnabled = false;

    // scale based on CSS pixels (clientWidth)
    const scale = canvas.clientWidth / bgImg.width;
    const drawWidth = bgImg.width * scale / dpr;   // device pixels
    const drawHeight = bgImg.height * scale / dpr; // device pixels

    const x = 0;
    const y = (canvas.clientHeight - drawHeight * dpr) / dpr; // bottom aligned in device pixels

    bgCtx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    bgCtx.drawImage(bgImg, x, y, drawWidth, drawHeight);
}




// 5. snowflake init
function initSnowflakes(n = 120) {
    snowflakes.length = 0;

    gridWidth = bgImg.width;
    gridHeight = Math.floor(canvas.clientHeight / pixelSize);

    for (let i = 0; i < n; i++) {
        snowflakes.push({
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight),
            speed: 0.3 + Math.random() * 0.7
        });
    }
}

// 6. animate snow
function animate() {
    // draw cached background
    ctx.drawImage(bgCanvas, 0, 0);

    for (let f of snowflakes) {
        f.y += f.speed;
        if (f.y > gridHeight) {
            f.y = 0;
            f.x = Math.floor(Math.random() * gridWidth);
        }

        const drawX = Math.floor(f.x * pixelSize);
        const drawY = Math.floor(f.y * pixelSize);

        ctx.fillStyle = "#fff";
        ctx.fillRect(drawX, drawY, pixelSize, pixelSize);
    }

    requestAnimationFrame(animate);
}
