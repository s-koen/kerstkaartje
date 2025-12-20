const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");


function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    const cssWidth  = window.innerWidth;
    const cssHeight = window.innerHeight;

    canvas.style.width  = cssWidth + "px";
    canvas.style.height = cssHeight + "px";

    canvas.width  = Math.floor(cssWidth  * dpr);
    canvas.height = Math.floor(cssHeight * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const snowImg = new Image();
snowImg.src = "snow.png";


const bgImg = new Image();
bgImg.src = "background.png";


function drawBackground() {
    const scale = canvas.clientWidth / bgImg.width;

    const drawWidth  = bgImg.width  * scale;
    const drawHeight = bgImg.height * scale;

    const x = 0;
    const y = canvas.clientHeight - drawHeight;

    ctx.drawImage(bgImg, x, y, drawWidth, drawHeight);
}


// snowflake setup
const numSnow = 4000; // number of snowflakes
const snowflakes = [];

for(let i=0; i<numSnow; i++){
    snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 1 + Math.random() * 2,
        drift: (Math.random() - 0.5) * 0.5 // horizontal drift
    });
}

// shake effect
let shake = 0;
canvas.addEventListener("click", () => {
    shake = 100; // frames of shake
});

// animation loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    drawBackground();

    for(let f of snowflakes){
        // apply shake
        const shakeOffset = shake ? (Math.random() - 0.5) * 100 : 0;

        // move snowflake
        f.y += f.speed;
        f.x += f.drift;

        // wrap around vertically
        if(f.y > canvas.height) f.y = -10;
        if(f.x < 0) f.x = canvas.width;
        if(f.x > canvas.width) f.x = 0;

        // draw
        ctx.drawImage(snowImg, f.x + shakeOffset, f.y + shakeOffset, 26, 26);
    }

    if(shake > 0) shake--; // decay shake

    requestAnimationFrame(animate);
}

// start animation when sprite loaded
snowImg.onload = animate;

