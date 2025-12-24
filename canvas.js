// 1. globals
const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

canvas.style.touchAction = "none";

const bgCanvas = document.createElement("canvas");
const bgCtx = bgCanvas.getContext("2d");

const snowCanvas = document.createElement("canvas");
const snowCtx = snowCanvas.getContext("2d");

const bgSound = document.getElementById("bgSound");

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let clickBuffer = null;

fetch("firework.mp3")
    .then(r => r.arrayBuffer())
    .then(b => audioCtx.decodeAudioData(b))
    .then(buf => clickBuffer = buf);

const messages = [
    "[klik]",
    "lyn,",
    "ik wens je\nwarme en fijne\ndagen om 2O25\nmee af te sluiten.",
    "moge 2O26 lief voor\nje zijn, en je veel\nvreugde en mooie\nmomenten brengen!",
    "ik ben dankbaar\ndat ik je ken :)",
    "",
    "koen",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "leuk vuurwerk he :)\n                                                                                                                                                                           ",
    ""
];

const textcolors = [
    "#FAEC72",
    "#fc7e7e",
    "#78ea59",
    "#59eaba",
    "#c374fc",
]


const firework1_colors = [
    "#d3b03b",
    "#43f95b",
    "#f20edf",
    "#0793f7",
    "#d3b03b",
    "#ef1010",
    "#ffffff"
];

const firework2_colors = [
    "#fcbe05",
    "#62ad6c",
    "#db6fd2",
    "#c7e5f9",
    "#f20edf",
    "#fc3535",
    "#6d25fc"
];

const firework3_colors = [
    "#aa985d",
    "#667c69",
    "#aa8fa8",
    "#4c687c",
    "#aa8fa8",
    "#bc8a44",
    "#775bad",
];


let length_fireworks = firework1_colors.length;
let firework_index = 0;

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
    "",
bgImg.src = "background-snow-gray2.png";
bgImg.onload = () => {
    bgReady = true;
    resizeCanvas();
    updatePixelSize();
    initSnowflakes(500);
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


function startSound() {
    bgSound.volume = 1;
    bgSound.play();
}

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

    snowCanvas.width  = canvas.clientWidth;
    snowCanvas.height = canvas.clientHeight;
    
    snowCtx.setTransform(pixelSize, 0, 0, pixelSize, 0, 0);
    snowCtx.imageSmoothingEnabled = false;
}

window.addEventListener("resize", resizeCanvas);

let skip = false;

canvas.addEventListener("click", (e) => {

    if (skip == true) {
        return;
    }

    if(displayedText === messages[currentMessage]){
        currentMessage = (currentMessage + 1) % messages.length;
        displayedText = "";
        charIndex = 0;
        messages[currentMessage - 1] = "";
    }
    if (bgSound.paused) {
            startSound();
            skip = true;
        }
    if (!clickBuffer) return;

    if (audioCtx.state === "suspended") {
        audioCtx.resume();
        skip = true;
    }

    const src = audioCtx.createBufferSource();
    src.buffer = clickBuffer;
    
    const gain = audioCtx.createGain();
    gain.gain.value = 0.3 + Math.random() * 0.3;
    
    src.connect(gain);
    gain.connect(audioCtx.destination);
    
    src.playbackRate.value = 0.85 + Math.random() * 0.3;
    src.start();

    firework_index = (firework_index + 1 + Math.floor(Math.random()*(length_fireworks-2))) % length_fireworks;
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / pixelSize;
    const cy = (e.clientY - rect.top) / pixelSize;

    for (let f of snowflakes) {
        const dx = f.x - cx;
        const dy = f.y - cy;
        const dist = Math.hypot(dx, dy);

        const radius = Math.random() * 25 + 10;

        if (dist < radius) {
            const strength_x = (radius - dist) * 0.0001 * radius;
            f.mvx = (f.mvx || 0) + dx * strength_x;

            const strength_y = (radius - dist) * 0.0001 * radius;
            f.mspeed = (f.mspeed || 0) + dy * strength_y;
        }
    }

});

canvas.addEventListener("touchstart", () => {

    if (bgSound.paused) {
        return    
    }

    if (audioCtx.state === "suspended") {
        return
    }

    if(displayedText === messages[currentMessage]){
        currentMessage = (currentMessage + 1) % messages.length;
        displayedText = "";
        charIndex = 0;
        messages[currentMessage - 1] = "";
    }


    const src = audioCtx.createBufferSource();
    src.buffer = clickBuffer;
    
    const gain = audioCtx.createGain();
    gain.gain.value = 0.3 + Math.random() * 0.3;
    
    src.connect(gain);
    gain.connect(audioCtx.destination);
    
    src.playbackRate.value = 0.85 + Math.random() * 0.3;
    src.start();

});


canvas.addEventListener("pointerdown", (e) => {

    if (bgSound.paused) {
        return    
    }

    if (audioCtx.state === "suspended") {
        return
    }
    firework_index = (firework_index + 1 + Math.floor(Math.random()*(length_fireworks-2))) % length_fireworks;
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / pixelSize;
    const cy = (e.clientY - rect.top) / pixelSize;

    for (let f of snowflakes) {
        const dx = f.x - cx;
        const dy = f.y - cy;
        const dist = Math.hypot(dx, dy);

        const radius = Math.random() * 25 + 10;

        if (dist < radius) {
            const strength_x = (radius - dist) * 0.0001 * radius;
            f.mvx = (f.mvx || 0) + dx * strength_x;

            const strength_y = (radius - dist) * 0.0001 * radius;
            f.mspeed = (f.mspeed || 0) + dy * strength_y;
        }
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


    wind = -0.02 
    for (let i = 0; i < n; i++) {
        snowflakes.push({
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight),
            vx: wind + Math.random() * 0.01,
            mvx: 0,
            mspeed: 0,
            speed: 0.1 + Math.random()**2 * 0.5
        });
    }
}

function animate() {
    snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

    for (let f of snowflakes) {
        f.y += f.speed + f.mspeed;
        f.x += f.vx + f.mvx;
        f.mvx = f.mvx * 0.9;
        f.mspeed = f.mspeed * 0.9;

        if (f.y > gridHeight) {
            f.y = 0;
            f.x = Math.floor(Math.random() * gridWidth);
        }
        if (f.x < 0) {
            f.x = gridWidth;
        }
        if (f.x > gridWidth) {
            f.x = 0;
         }

        
        const ix = f.x | 0; // fast floor
        const iy = f.y | 0;
        
        const rand = random_array[ix] || 0;
        const mvx = Math.abs(f.mvx);
        const ms  = Math.abs(f.mspeed);
        
        const y1 = gridHeight / 4.5 + rand;
        const y2 = gridHeight / 5.5 + rand;

        
        let color;
        
        if (f.y > y1) {
            if (f.speed >= 0.1) {
                color = rand > 20 ? "#fff" : "#999";
            } else {
                color = "#aaa";
            }
        } else if (f.y > y2) {
            color = "#7a7a7a";
        } else {
            color = "#444";
        }


        if (mvx > 0.01) {
            color = firework1_colors[firework_index];
        } else if (mvx > 0.001) {
            color = firework2_colors[firework_index];
        } else if (mvx > 0.0001) {
            color = firework3_colors[firework_index];
        }


        let w = 1;
        if (mvx > 0.5)      w = 4;
        else if (mvx > 0.001) w = 3;
        else if (mvx > 0.0001) w = 2;
        
        let h = 1;
        if (ms > 0.5)      h = 4;
        else if (ms > 0.001) h = 3;
        else if (ms > 0.0001) h = 2;


        snowCtx.fillStyle = color;
        snowCtx.fillRect(ix, iy, w, h);

        }


    ctx.drawImage(bgCanvas, 0, 0);

    ctx.imageSmoothingEnabled = false;
    
    ctx.drawImage(snowCanvas, 0, 0);


    if(charIndex < messages[currentMessage].length){
        charIndex += typeSpeed;
        if(charIndex > messages[currentMessage].length) charIndex = messages[currentMessage].length;
        displayedText = messages[currentMessage].slice(0, charIndex);
    }

    ctx.fillStyle = textcolors[currentMessage % textcolors.length];
    ctx.font = "60px 'peaberry'";
    ctx.textAlign = "center";
    
    const wind = Math.sin(performance.now() * 0.002) * 30;

    
    const lines = displayedText.split("\n");
    const lineHeight = 90;
    
    lines.forEach((line, i) => {
        ctx.fillText(
            line,
            canvas.clientWidth / 2,
            canvas.clientHeight / 3.5 + wind + i * lineHeight
        );
});

    requestAnimationFrame(animate);
}
