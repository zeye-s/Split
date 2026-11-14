const canvas1 = document.getElementById("player1Board");
const canvas2 = document.getElementById("player2Board");
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const floor = 20;
const gravity = 0.2;

let intervalID;
let size1 = 20;
let size2 = 20;
let jumpPower = -6.5;
let moveSpeed = 3;

const keys = {};

let player1 = {
    x: 25,
    y: canvas1.clientHeight - floor - size1,
    vy: 0,
    isGrounded: false,
    size: size1,
    finish: false,
}

let player2 = {
    x: 25,
    y: canvas2.clientHeight - floor - size2,
    vy: 0,
    isGrounded: false,
    size:size2,
    finish: false,
}

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
        e.preventDefault();
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

let platforms = [
    { x: 140, y: 70, width: 80, height: 15 },
    { x: 290, y: 160, width: 90, height: 15 },
    
    { x: 380, y: 250, width: 100, height: 15 },
    { x: 480, y: 290, width: 70, height: 15 },
    { x: 410, y: 390, width: 90, height: 15 },
    
    { x: 520, y: 500, width: 110, height: 15 },
    { x: 670, y: 430, width: 80, height: 15 }
];

let goals = [
    {x: 100, y: 20, width:50, height:15},
]

function drawPlatforms(ctx) {
    ctx.fillStyle = "white"; 
    for (let p of platforms) {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    }
    ctx.fillStyle = "lightgreen";
    for (let g of goals) {
        ctx.fillRect(g.x, g.y, g.width, g.height);
    }
}

function setup(){
    updatePlayer(player1, canvas1);
    updatePlayer(player2, canvas2);

    ctx1.fillStyle = "red";
    ctx1.fillRect(player1.x, player1.y, size1, size1);
    ctx2.fillStyle = "lightblue";
    ctx2.fillRect(player2.x, player2.y, size1, size1);

    drawPlatforms(ctx1);
    drawPlatforms(ctx2);
    ctx1.fillStyle = "white";
    ctx2.fillStyle = "white";
    ctx1.fillRect(0, canvas1.clientHeight - floor, canvas1.clientWidth, floor);
    ctx2.fillRect(0, canvas2.clientHeight - floor, canvas2.clientWidth, floor);

    ctx1.fillStyle = "black";
    ctx2.fillStyle = "black";
    ctx1.strokeRect(player1.x, player1.y, size1, size1);
    ctx2.strokeRect(player2.x, player2.y, size2, size2);
    
}

function clearBoard(){
    ctx1.fillStyle = "black";
    ctx2.fillStyle = "black";

    ctx1.fillRect(0,0,canvas1.clientWidth, canvas1.clientHeight);
    ctx2.fillRect(0,0,canvas2.clientWidth, canvas2.clientHeight);
}

function updatePlayer(player, canvas) {
    player.vy += gravity;
    player.y += player.vy;
    player.isGrounded = false;

    let groundLevel = canvas.height - floor - player.size;

    if (player.y >= groundLevel) {
        player.y = groundLevel;
        player.vy = 0;
        player.isGrounded = true;
        return;
    }

    let playerBottomPrev = (player.y - player.vy) + player.size;
    let playerBottomCurr = player.y + player.size;

    for (let p of platforms) {
        let horizontalOverlap = (player.x + player.size > p.x) && (player.x < p.x + p.width);

        if (horizontalOverlap && player.vy >= 0 && playerBottomPrev <= p.y && playerBottomCurr >= p.y) {
            player.y = p.y - player.size;
            player.vy = 0;
            player.isGrounded = true;
            break;
        }
    }
    for (let g of goals) {
        let horizontalOverlap = (player.x + player.size > g.x) && (player.x < g.x + g.width);

        if (horizontalOverlap && player.vy >= 0 && playerBottomPrev <= g.y && playerBottomCurr >= g.y) {
            player.y = g.y - player.size;
            player.vy = 0;
            player.isGrounded = true;
            player.finish = true;
            break;
        }
    }
}

function handleInput() {
    if (!player1.finish) {
        if (keys["a"]) {
            player1.x -= moveSpeed;
            if (player1.x < 0) player1.x = 0;
        }
        if (keys["d"]) {
            player1.x += moveSpeed;
            if (player1.x > canvas1.clientWidth - player1.size) {
                player1.x = canvas1.clientWidth - player1.size;
            }
        }
        if (keys["w"] && player1.isGrounded) {
            player1.vy = jumpPower;
            player1.isGrounded = false;
        }
    }

    if (!player2.finish) {
        if (keys["ArrowLeft"]) {
            player2.x -= moveSpeed;
            if (player2.x < 0) player2.x = 0;
        }
        if (keys["ArrowRight"]) {
            player2.x += moveSpeed;
            if (player2.x > canvas2.clientWidth - player2.size) {
                player2.x = canvas2.clientWidth - player2.size;
            }
        }
        if (keys["ArrowUp"] && player2.isGrounded) {
            player2.vy = jumpPower;
            player2.isGrounded = false;
        }
    }
}

setup();

intervalID = setInterval(()=>{
    clearBoard();
    setup();
    handleInput();
    checkFinish();
}, 10)

const player1Finish = document.getElementById("player1Finish");
const player2Finish = document.getElementById("player2Finish");
const completeScreen = document.getElementById("completeScreen");

function checkFinish(){
    if(player1.finish){
        player1Finish.classList.add("finish");
    }
    if(player2.finish){
        player2Finish.classList.add("finish");
    }
    if(player1.finish && player2.finish){
        player1Finish.classList.remove("finish");
        player2Finish.classList.remove("finish");
        completeScreen.classList.add("finish");
    }
}
