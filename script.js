let Dir = {
    Top: 0,
    Bot: 2,
    Left: 1,
    Right: 3,
};
let canvas = document.getElementById("window");
let ctx = canvas.getContext("2d");
let dim;
let width;
let height;
let snake;
let fruit;
let cellWidth;
let cellHeight;
let dir;
let lastDir;
let keyMap = {
  68: Dir.Right,
  81: Dir.Left,
  90: Dir.Top,
  83: Dir.Bot
}

start();

function start(){
    // Initalise the game values
    dim = 1;
    width = Math.round(32 * dim);
    height = Math.round(16 * dim);
    snake = [[3,2], [4,2], [5,2]];
    fruit = [0,0];
    spawnFruit();
    cellWidth = canvas.width/width;
    cellHeight = canvas.height/height;
    dir = Dir.Top;
}

function main(){
    window.addEventListener("keydown", keydown, false);
    requestAnimationFrame(mainLoop);
}

function rgbToHex(rgb) {
    // Convert a single decimal value to hexadecimal
    let hex = Number(Math.round(rgb)).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}

function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}

function hslToRgb(h, s, l) {
    // Convert HSL representation of color to RBG Hex string
    let r, g, b;
    if (s == 0) {
        r = g = b = l; // Achromatic
    } else {
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    let hexColor = `#${rgbToHex(r * 255)}${rgbToHex(g * 255)}${rgbToHex(b * 255)}`;
    console.log(hexColor);
    return hexColor;
}

function display(){
    // Display the snake
    for (let i = 0; i < snake.length; i++){
        // Go through the entire color pallet
        ctx.fillStyle = hslToRgb(i / snake.length, 0.5, 0.5);
        ctx.fillRect(snake[i][0]*cellWidth, snake[i][1]*cellHeight, cellWidth, cellHeight);
    }
    // Display the fruit
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(fruit[0]*cellWidth, fruit[1]*cellHeight, cellWidth, cellHeight);

}

function spawnFruit(){
    // Spawn the fruit on the grid
    fruit[0] = Math.floor(Math.random() * width);
    fruit[1] = Math.floor(Math.random() * height);
    for(let i=0; i < snake.length; i++){
        if (snake[i][0] == fruit[0] && snake[i][1] == fruit[1]){
            spawnFruit();
            break;
        }
    }
}

function stretchSnake(){
    // Add a copy of the tail at the end of the snake
    snake.push([snake[snake.length - 1][0], snake[snake.length - 1][1]]);
}

function checkDefeat(){
    // Chech if part of the snake is touching its head
    for(let i=1; i < snake.length; i++){
        if (snake[i][0] == snake[0][0] && snake[i][1] == snake[0][1]){
            alert(`Perdu ! Votre score est de : ${snake.length - 3}`);
            start();
            break;
        }
    }
}

function moveSnake(){
    // Shift the body of the snake
    for (i = snake.length - 1; i > 0; i--){
        snake[i][0] = snake[i - 1][0];
        snake[i][1] = snake[i - 1][1];
    }
    // Move the head of the snake
    switch(dir){
        case Dir.Top:
        snake[0][1] --;
        break;
        case Dir.Bot:
        snake[0][1] ++;
        break;
        case Dir.Left:
        snake[0][0] --;
        break;
        case Dir.Right:
        snake[0][0] ++;
        break;
    }
    // Let the snake pass through the wall and pop out from the other side
    snake[0][0] = modulo(snake[0][0], width);
    snake[0][1] = modulo(snake[0][1], height);
    // Verify if the snake hit or not a fruit
    if (snake[0][0] == fruit[0] && snake[0][1] == fruit[1]){
        spawnFruit();
        stretchSnake();
    }
    checkDefeat();
    // Store the last direction the snake had
    lastDir = dir;
}

function mainLoop(){
    // Make the program infinite
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    display();
    // Slow down the game loop to make it playeable
    sleep(100);
    requestAnimationFrame(mainLoop);
}

function sleep(ms){
    // Manual await function
    let start = new Date().getTime();
    while (new Date().getTime() - start < ms){}
}

function modulo(x, k){
    let result = x % k;
    if (result < 0){
        result += k;
    }
    return result;
}

function isOpposite(newDir){
    // Check if both of the directions are even or odd and different
    return lastDir % 2 == newDir % 2 && lastDir != newDir;
}

function keydown(event) {
    if (event.keyCode in keyMap){
        let newDir = keyMap[event.keyCode];
        if (!isOpposite(newDir)){
            dir = newDir;
            console.log(dir);
        }
    }
}

main();
