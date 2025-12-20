const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

// size canvas to match CSS
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 2;

// handle resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 2;
});

// load snowflake sprite
const snowImg = new Image();
snowImg.src = "snow.png";

// snowflake setup
const numSnow = 5000; // number of snowflakes
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

    for(let f of snowflakes){
        // apply shake
        const shakeOffset = shake ? (Math.random() - 0.5) * 100 : 0;

        // move snowflake
        f.y += f.speed;
        f.x += f.drift;

        // wrap around vertically
        if(f.y > canvas.height) f.y = 0;
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

