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

let platforms1 = [
    
];

let platforms2 = [
    
];

let goals1 = [
   
];
let goals2 = [
];

let redButtons1 = [{}];
let redButtons2 = [{}];

function drawPlatforms1(ctx) {
    ctx.fillStyle = "white"; 
    for (let p of platforms1) {
        ctx.fillRect(p.x, p.y, p.width, p.height);
        if (p.isBridge && !p.active) {
            continue;
        }
        else if (p.isBridge && p.active){
            ctx2.fillStyle = p.isBridge ? "orange" : "black"; 
            ctx2.fillRect(p.x, p.y, p.width, p.height);
        }
        
    }
    ctx.fillStyle = "lightgreen";
    for (let g of goals1) {
        ctx.fillRect(g.x, g.y, g.width, g.height);
    }
}

function checkButton(){
    for(let r of redButtons1){
        let hitButtonX = (player1.x + player1.size > r.x) && (player1.x < r.x + r.width);
        let hitButtonY = (player1.y + player1.size >= r.y) && (player1.y <= r.y + r.height);

        if (hitButtonX && hitButtonY) {
            r.pressed = true;
            for (let p of platforms2) {
                if (p.isBridge) {
                    p.active = true;
                }
            }
        }
    }

    for(let r of redButtons2){
        let hitButtonX = (player2.x + player2.size > r.x) && (player2.x < r.x + r.width);
        let hitButtonY = (player2.y + player2.size >= r.y) && (player2.y <= r.y + r.height);

        if (hitButtonX && hitButtonY) {
            r.pressed = true;
            for (let p of platforms2) {
                if (p.isBridge) {
                    p.active = true;
                }
            }
        }
    }
}

function drawPlatforms2(ctx) {
    ctx.fillStyle = "white"; 
    for (let p of platforms2) {
        ctx.fillRect(p.x, p.y, p.width, p.height);
        if (p.isBridge && !p.active) {
            continue;
        }
        else if (p.isBridge && p.active){
            ctx2.fillStyle = p.isBridge ? "orange" : "black"; 
            ctx2.fillRect(p.x, p.y, p.width, p.height);
        }
    }
    ctx.fillStyle = "lightgreen";
    for (let g of goals2) {
        ctx.fillRect(g.x, g.y, g.width, g.height);
    }
}

function setup(){
    updatePlayer(player1, canvas1, platforms1, goals1);
    updatePlayer(player2, canvas2, platforms2, goals2);
       
    ctx1.fillStyle = "red";
    ctx1.fillRect(player1.x, player1.y, size1, size1);
    ctx2.fillStyle = "lightblue";
    ctx2.fillRect(player2.x, player2.y, size1, size1);

    drawPlatforms1(ctx1);
    drawPlatforms2(ctx2);
    ctx1.fillStyle = "white";
    ctx2.fillStyle = "white";
    ctx1.fillRect(0, canvas1.clientHeight - floor, canvas1.clientWidth, floor);
    ctx2.fillRect(0, canvas2.clientHeight - floor, canvas2.clientWidth, floor);

    ctx1.fillStyle = "black";
    ctx2.fillStyle = "black";
    ctx1.strokeRect(player1.x, player1.y, size1, size1);
    ctx2.strokeRect(player2.x, player2.y, size2, size2);
    checkButton();
}


function clearBoard(){
    ctx1.fillStyle = "black";
    ctx2.fillStyle = "black";

    ctx1.fillRect(0,0,canvas1.clientWidth, canvas1.clientHeight);
    ctx2.fillRect(0,0,canvas2.clientWidth, canvas2.clientHeight);
}

function updatePlayer(player, canvas, currentPlatforms, currentGoals) {
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

    for (let p of currentPlatforms) {
        if (p.isBridge && !p.active){ 
            continue;
        };

        let horizontalOverlap = (player.x + player.size > p.x) && (player.x < p.x + p.width);

        if (horizontalOverlap && player.vy >= 0 && playerBottomPrev <= p.y && playerBottomCurr >= p.y) {
            player.y = p.y - player.size;
            player.vy = 0;
            player.isGrounded = true;
            break;
        }
    }



    for (let g of currentGoals) {
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
const congrats = document.getElementById("congrats");

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
        congrats.textContent = `Complete Stage ${stage}, Congratulations!`
    }
}

let stage = 0;
function loadStage(){
     player1 = {
        x: 25,
        y: canvas1.clientHeight - floor - size1,
        vy: 0,
        isGrounded: false,
        size: size1,
        finish: false,
    }

    player2 = {
        x: 25,
        y: canvas2.clientHeight - floor - size2,
        vy: 0,
        isGrounded: false,
        size:size2,
        finish: false,
    }

    switch(stage){
        case 0:
            stage0();
        case 1:
            stage1();
        default:
            stage0();
    }
}



function stage0(){
    platforms1 = [
        { x: 140, y: 70, width: 80, height: 15 },
        { x: 290, y: 160, width: 90, height: 15 },
        
        { x: 380, y: 250, width: 100, height: 15 },
        { x: 480, y: 290, width: 70, height: 15 },
        { x: 410, y: 390, width: 90, height: 15 },
        
        { x: 520, y: 500, width: 110, height: 15 },
        { x: 670, y: 430, width: 80, height: 15 }
    ];

    platforms2 = [
        { x: 140, y: 70, width: 80, height: 15 },
        { x: 290, y: 160, width: 90, height: 15 },
        
        { x: 380, y: 250, width: 100, height: 15 },
        { x: 480, y: 290, width: 70, height: 15 },
        { x: 410, y: 390, width: 90, height: 15 },
        
        { x: 520, y: 500, width: 110, height: 15 },
        { x: 670, y: 430, width: 80, height: 15 }
    ];

    goals1 = [
         {x: 100, y: 20, width:50, height:15},
    ]
    goals2 = [
        {x: 100, y: 20, width:50, height:15},
    ]
    redButtons1 = [{}];
    redButtons2 = [{}];
}

function stage1(){
    platforms1 = [
        { x: 140, y: 70, width: 80, height: 15 },
        { x: 290, y: 160, width: 90, height: 15 },
        { x: 380, y: 250, width: 100, height: 15 },
    ];

     redButtons1= [{
        x: 300,
        y: 145, 
        width: 30,
        height: 15,
        pressed: false
    }];

     goals1 = [
        { x: 100, y: 20, width: 50, height: 15 },
    ];


     platforms2 = [
        { x: 410, y: 390, width: 90, height: 15 },
        { x: 520, y: 500, width: 110, height: 15 },
        { x: 670, y: 430, width: 80, height: 15 },
        { x: 300, y: 300, width: 90, height: 15, isBridge: true, active: false }
    ];

    redButtons2= [{}];

     goals2 = [
        { x: 700, y: 380, width: 50, height: 15 },
    ];
}

loadStage();

const next= document.getElementById("next");
const reset = document.getElementById("reset");

next.addEventListener("click", ()=>{
    stage += 1;
    loadStage();
    completeScreen.classList.remove("finish");
})

reset.addEventListener("click", ()=>{
    loadStage();
    completeScreen.classList.remove("finish");
})