const canvas1 = document.getElementById("player1Board");
const canvas2 = document.getElementById("player2Board");
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const floor = 20;

let intervalID;
let size1 = 20;
let size2 = 20;

let player1 = {
    x: 25,
    y: canvas1.clientHeight - floor - size1,
    jumpHeight: 250,
}

let player2 = {
    x: 25,
    y: canvas2.clientHeight - floor - size2,
    jumpHeight: 250,
}

function setup(){
    ctx1.fillStyle = "white";
    ctx2.fillStyle = "white";

    ctx1.fillRect(player1.x, player1.y, size1, size1);
    ctx2.fillRect(player2.x, player2.y, size1, size1);

    ctx1.fillRect(0, canvas1.clientHeight - floor, canvas1.clientWidth, floor);
    ctx2.fillRect(0, canvas2.clientHeight - floor, canvas2.clientWidth, floor);

    ctx1.fillStyle = "black";
    ctx2.fillStyle = "black";
    ctx1.strokeRect(player1.x, player1.y, size1, size1);
    ctx2.strokeRect(player2.x, player2.y, size2, size2);
    
}

setup();

intervalID = setInterval(()=>{
    setup();
}, 10)
