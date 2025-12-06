// Game constants
const GRID_SIZE = 20;
const TILE_COUNT = 20;
const GAME_SPEED = 150; // milliseconds

// Game variables
let canvas, ctx;
let snake = [];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop;
let isGameRunning = false;

// DOM elements
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const startButton = document.getElementById('start-btn');

// Initialize the game
function init() {
    canvas = document.getElementById('game-board');
    ctx = canvas.getContext('2d');
    
    // Set up event listeners
    document.addEventListener('keydown', changeDirection);
    startButton.addEventListener('click', startGame);
    
    // Mobile controls
    document.getElementById('up-btn').addEventListener('click', () => changeDirection({ key: 'ArrowUp' }));
    document.getElementById('down-btn').addEventListener('click', () => changeDirection({ key: 'ArrowDown' }));
    document.getElementById('left-btn').addEventListener('click', () => changeDirection({ key: 'ArrowLeft' }));
    document.getElementById('right-btn').addEventListener('click', () => changeDirection({ key: 'ArrowRight' }));
    
    // Set initial high score
    highScoreElement.textContent = highScore;
    
    // Draw the initial game state
    drawGame();
}

// Start a new game
function startGame() {
    if (isGameRunning) return;
    
    // Reset game state
    snake = [
        {x: 10, y: 10}
    ];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    isGameRunning = true;
    startButton.disabled = true;
    
    // Generate initial food
    generateFood();
    
    // Start the game loop
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, GAME_SPEED);
}

// Game update function
function update() {
    // Move snake
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    // Check for collisions
    if (checkCollision(head)) {
        gameOver();
        return;
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        // Increase score
        score += 10;
        scoreElement.textContent = score;
        
        // Generate new food
        generateFood();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
    
    // Update display
    drawGame();
}

// Draw the game state
function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#2ecc71';
    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * GRID_SIZE, 
            segment.y * GRID_SIZE, 
            GRID_SIZE - 1, 
            GRID_SIZE - 1
        );
    });
    
    // Draw head differently
    if (snake[0]) {
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(
            snake[0].x * GRID_SIZE, 
            snake[0].y * GRID_SIZE, 
            GRID_SIZE - 1, 
            GRID_SIZE - 1
        );
    }
    
    // Draw food
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(
        food.x * GRID_SIZE, 
        food.y * GRID_SIZE, 
        GRID_SIZE - 1, 
        GRID_SIZE - 1
    );
}

// Generate food at random position
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    food = newFood;
}

// Check for collisions
function checkCollision(head) {
    // Wall collision
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        return true;
    }
    
    // Self collision
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// Handle direction changes
function changeDirection(event) {
    // Prevent 180-degree turns
    if (dx === 0 && (event.key === 'ArrowLeft' || event.key === 'a')) {
        dx = -1;
        dy = 0;
    } else if (dx === 0 && (event.key === 'ArrowRight' || event.key === 'd')) {
        dx = 1;
        dy = 0;
    } else if (dy === 0 && (event.key === 'ArrowUp' || event.key === 'w')) {
        dx = 0;
        dy = -1;
    } else if (dy === 0 && (event.key === 'ArrowDown' || event.key === 's')) {
        dx = 0;
        dy = 1;
    }
    
    // Prevent default for arrow keys to stop page scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(event.key)) {
        event.preventDefault();
    }
}

// Game over
function gameOver() {
    clearInterval(gameLoop);
    isGameRunning = false;
    startButton.disabled = false;
    
    // Update high score if needed
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
    
    alert(`Game Over! Your score: ${score}`);
}

// Start the game when the page loads
window.onload = init;
