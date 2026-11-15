const canvas1 = document.getElementById("player1Board");
const canvas2 = document.getElementById("player2Board");
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const floor = 20;
const gravity = 0.2;
const stageSelection = document.getElementById("stageSelection");

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
    ctx.fillStyle = "red";
    for(let r of redButtons1){
        ctx.fillRect(r.x, r.y, r.width, r.height);
    }

    for (let p of platforms1) {
        if (p.isBridge && !p.active) {
            continue;
        }
        else if (p.isBridge && p.active){
            ctx.fillStyle = p.isBridge ? "orange" : "black"; 
            ctx.fillRect(p.x, p.y, p.width, p.height);
        }
         else{
            ctx.fillStyle = "white"; 
            ctx.fillRect(p.x, p.y, p.width, p.height);
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
                if (p.isBridge && r.pressed && r.targetID === p.targetID) {
                    p.active = true;
                }
            }
        }
        else{
            r.pressed = false;
        }
    }

    for(let r of redButtons2){
        let hitButtonX = (player2.x + player2.size > r.x) && (player2.x < r.x + r.width);
        let hitButtonY = (player2.y + player2.size >= r.y) && (player2.y <= r.y + r.height);

        if (hitButtonX && hitButtonY) {
            r.pressed = true;
            for (let p of platforms1) {
                if (p.isBridge && r.pressed && r.targetID === p.targetID) {
                    p.active = true;
                }
            }
        }
        else{
            r.pressed = false;
        }
    }
}

function drawPlatforms2(ctx) {
    ctx.fillStyle = "red";
    for(let r of redButtons2){
        ctx.fillRect(r.x, r.y, r.width, r.height);
    }

    for (let p of platforms2) {
        if (p.isBridge && !p.active) {
            continue;
        }
        else if (p.isBridge && p.active){
            ctx.fillStyle = p.isBridge ? "orange" : "black"; 
            ctx.fillRect(p.x, p.y, p.width, p.height);
        }
        else{
            ctx.fillStyle = "white"; 
            ctx.fillRect(p.x, p.y, p.width, p.height);
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
    if(keys["r"]){
        loadStage();
    }
    if(keys["m"]){
        stageSelection.classList.add("open");
    }
    if(keys["Escape"]){
        stageSelection.classList.remove("open");
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
            break;
        case 1:
            stage1();
            break;
        case 2:
            stage2();
            break;
        case 3:
            stage3();
            break;
        case 4:
            stage4();
            break;
        default:
            stage = 0;
    }
    stageSelection.classList.remove("open");
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
        {x:280, y: 330, width:80, height:15},
        { x: 410, y: 390, width: 90, height: 15, isBridge: true, active: false  },
        { x: 520, y: 500, width: 110, height: 15 , isBridge: true, active: false },
        { x: 670, y: 430, width: 80, height: 15, isBridge: true, active: false  },
    ];

     redButtons1= [{
        x: 300,
        y: 525, 
        width: 30,
        height: 15,
        pressed: false
    }];

     goals1 = [
        { x: 100, y: 20, width: 50, height: 15 },
    ];


     platforms2 = [
        { x: 140, y: 70, width: 80, height: 15 },
        { x: 290, y: 160, width: 90, height: 15 },
        { x: 410, y: 390, width: 90, height: 15 },
        { x: 520, y: 500, width: 110, height: 15 },
        { x: 670, y: 430, width: 80, height: 15 },
        { x: 300, y: 300, width: 90, height: 15, isBridge: true, active: false },
        {x:250, y: 240, width:100, height:15},
    ];

    redButtons2= [
        {x:250, y:235, width:30, height:10},
    ];

     goals2 = [
        { x: 100, y: 20, width: 50, height: 15 },
    ];
}

function stage2(){
     platforms1 = [
        {x:50, y:480, width:100, height:15},
        {x:220, y:390, width:80, height:15},
        {x:350, y:390, width:80, height:15, targetID: "bridgeB", isBridge:true, active:false},
        {x:490, y: 330, width:20, height:15, targetID: "bridgeB", isBridge:true, active:false},
        {x:550, y: 330, width:20, height:15, targetID: "bridgeB", isBridge:true, active:false},
        {x:390, y:250, width:80, height:15},
        {x:220, y:180, width:70, height: 15},
        {x:220, y:80, width:70, height:15, targetID: "bridgeD", isBridge:true, active:false},
    ];

     redButtons1= [
        {x:250, y:380, width:30, height:10, targetID: "bridgeA"},
        {x:canvas2.width - 10, y: 280, width:10, height:30, targetID: "bridgeC"},
        {x:220, y:70, width:30, height:15, targetID: "bridgeE"},
    ];

     goals1 = [
        { x: 100, y: 20, width: 50, height: 15 },
    ];


     platforms2 = [
       {x:70, y: 470, width:70, height:15, targetID: "bridgeA", isBridge:true, active:false},
       {x:220, y:420, width:30, height:15},
       {x:390, y:420, width:30, height:15},
       {x:540, y:420, width:30, height:15},
       {x:700, y:390, width:100, height:15},
       {x:700, y:290, width:70, height:15, targetID: "bridgeC", isBridge:true, active:false},
       {x:700, y:190, width:70, height:15},
       {x:590, y:100, width:70, height:15},
       {x:350, y:280, width:20, height:15},
       {x:170, y:210, width:60, height:15},
       {x:170, y:110, width:60, height:15, targetID: "bridgeE", isBridge:true, active:false},
    ];

    redButtons2= [
        {x:720, y:380, width:30, height:10, targetID: "bridgeB"},
        {x:170, y:200, width:30, height:15, targetID:"bridgeD"},
    ];

     goals2 = [
        { x: 100, y: 20, width: 50, height: 15 },
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

const select0 = document.getElementById("select0");
const select1 = document.getElementById("select1");
const select2 = document.getElementById("select2");
const select3 = document.getElementById("select3");
const select4 = document.getElementById("select4");

select0.addEventListener("click", ()=>{
    stage = 0;
    loadStage();
})

select1.addEventListener("click", ()=>{
    stage = 1;
    loadStage();
})

select2.addEventListener("click", ()=>{
    stage = 2;
    loadStage();
})

select3.addEventListener("click", ()=>{
    stage = 3;
    loadStage();
})

select4.addEventListener("click", ()=>{
    stage = 4;
    loadStage();
})
  
