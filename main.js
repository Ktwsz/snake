//set up some necessary variables
const game_size = {width: 500, height: 500};

const canvas = document.getElementById('game');
canvas.width = game_size.width;
canvas.height = game_size.height;
const ctx = canvas.getContext('2d');

//score_value counts our score(obviously)
const score = document.getElementById('score');
let score_value;

//graphic representation of the snake
//each cell of array is respectively 'part' of snake with defined coordinates on canvas and direction 
//in which this part is heading during next update
let snake_array;

//function resets canvas, sets score to 0 etc. etc.
function reset() {
    score_value = 0;
    score.innerHTML = score_value;
    snake_array = [{x: 10, y: 9, direction: 'right'}, {x: 9, y: 9, direction: 'right'}, {x: 8, y: 9, direction: 'right'}];
    ctx.clearRect(0, 0, game_size.width, game_size.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, game_size.width, game_size.height);

    ctx.fillStyle = 'white'
    for (elem of snake_array) ctx.fillRect(elem.x*25, elem.y*25, 25, 25);
    
    generatepoint();
    ctx.fillStyle = 'red';
    ctx.fillRect(point.x*25, point.y*25, 25, 25);
}

//coordinates of point
let point;

//function generates point's coordinates
function generatepoint() {
    let new_point_array = [];
    for (let x = 0; x < 20; x++) {
        for (let y = 0; y < 20; y++) {
            //if this field isn't occupied by the snake throw it into the array
            if (snake_array.find(elem => (elem.x == x && elem.y == y)) == undefined) new_point_array.push({x: x, y: y});
        }
    }
    //randomly choose one of fields
    point = new_point_array[Math.floor(Math.random()*new_point_array.length)];
    console.log(new_point_array.length);
}

//set up canvas
reset();


function updatesnake() {
    //clear the canvas
    ctx.clearRect(0, 0, game_size.width, game_size.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, game_size.width, game_size.height);

    //'previous' will store data about the part of snake which was updated the most recently
    let previous;
    //keep track of snake's updated coordinates to know when snakes hits itself
    let current_pos = [];

    //update our snake
    for (let i = 0; i < snake_array.length; i++) {
        //update coorinates based on direction
        switch (snake_array[i].direction) {
            case 'left':
                snake_array[i].x -= 1;
                break;
            case 'right':
                snake_array[i].x += 1;
                break;
            case 'up':
                snake_array[i].y -= 1;
                break;
            case 'down':
                snake_array[i].y += 1;
                break;
            default: {}
        }

        //if snake goes out of our canvas draw him on the other side
        if (snake_array[i].x > 19) snake_array[i].x = 0;
        else if (snake_array[i].x < 0) snake_array[i].x = 19;
        if (snake_array[i].y > 19) snake_array[i].y = 0;
        else if (snake_array[i].y < 0) snake_array[i].y = 19;

        if (i != 0) {
            //if this 'part' of snake isn't his head just update the direction
            let temp_previous = snake_array[i].direction;
            snake_array[i].direction = previous;
            previous = temp_previous;
        } else {
            //set previous
            previous = snake_array[i].direction;
            //check if player got a point
            if (point.x == snake_array[i].x && point.y == snake_array[i].y) {
                score_value++;
                score.innerHTML = score_value;
                //copy tail of snake and set the coordinates so that this part is our new tail
                let obj = Object.assign({}, snake_array[snake_array.length-1]);
                switch (obj.direction) {
                    case 'left': 
                        obj.x += 1;
                        break;
                    case 'right':
                        obj.x -= 1;
                        break;
                    case 'up':
                        obj.y += 1;
                        break;
                    case 'down':
                        obj.y -= 1;
                        break;
                    default: {}
                }
                snake_array.push(obj);

                //generate new point
                generatepoint();
            }
        }

        //draw the snake
        ctx.fillStyle = 'white';
        switch (snake_array[i].direction) {
            //fancy switch to make our snake look better and more readable
            //(we dont want to draw just 25x25 squares it looks terrible, trust me)
            case 'up':
                ctx.fillRect(snake_array[i].x*25+2, snake_array[i].y*25-2, 21, 25);
                break;
            case 'down':
                ctx.fillRect(snake_array[i].x*25+2, snake_array[i].y*25+2, 21, 25);
                break;
            case 'left':
                ctx.fillRect(snake_array[i].x*25-2, snake_array[i].y*25+2, 25, 21);
                break;
            case 'right':
                ctx.fillRect(snake_array[i].x*25+2, snake_array[i].y*25+2, 25, 21);
                break;
            default: {}
        }

        //check if snake hit itself
        if (current_pos.find(elem => (elem.x == snake_array[i].x && elem.y == snake_array[i].y)) == undefined) current_pos.push(snake_array[i]);
        else {
            clearInterval(game);
            gameon = false;
        }
    }

    //at last draw point
    
    ctx.fillStyle = 'red';
    ctx.fillRect(point.x*25, point.y*25, 25, 25);
}

let gameon = false;
let game;

//if game is on update the direction of snake's head
//else start the game 
document.addEventListener('keydown', key => {
    switch (key.keyCode) {
        case 40:
            if (gameon) snake_array[0].direction = 'down';
            else {
                reset();
                game = setInterval(updatesnake, 250);
                gameon = true;
            }
            break;
        case 38:
            if (gameon) snake_array[0].direction = 'up';
            else {
                reset();
                game = setInterval(updatesnake, 250);
                gameon = true;
            }
            break;
        case 37:
            if (gameon) snake_array[0].direction = 'left';
            else {
                reset();
                game = setInterval(updatesnake, 250);
                gameon = true;
            }
            break;
        case 39:
            if (gameon) snake_array[0].direction = 'right';
            else {
                reset();
                game = setInterval(updatesnake, 250);
                gameon = true;
            }
            break;
        default: {}
    }
});