// 修改score为个位数增加之后，相关常量的修改

// 获取 HTML 元素
let playAreaCanvas, playAreaCtx;
let backgroundImg, characterImg, characterLieImg, lowObstacleImg, highObstacleImg;
let obstacles = [];
let character; // 定义角色对象
let isJumping = false, isLying = false, jumpSpeed = -9;
let obstacleSpeed = -5, backgroundSpeed = -1;
let lastObstacleTime = Date.now();
let backgroundX = 0, characterY;

// 常量
const GRAVITY = 0.2;
const CHARACTER_WIDTH_RATIO = 1 / 20;
const CHARACTER_HEIGHT_RATIO = 1 / 3;
const OBSTACLE_WIDTH_RATIO = 1 / 20;
const OBSTACLE_HEIGHT_RATIO = 1 / 6;
const HIGH_OBSTACLE_WIDTH_RATIO = 1 / 3;
const HIGH_OBSTACLE_HEIGHT_RATIO = 1 / 15;
const GROUND_HEIGHT_RATIO = 2 / 3;
const JUMP_SPEED_INITIAL = jumpSpeed;
const CREATE_OBSTACLE_TIME = 1000;

// 加载图片资源
import backgroundImgSrc from '@/assets/background.webp';
import characterImgSrc from '@/assets/pingzewei.webp';
import characterLieImgSrc from '@/assets/pingzeweiLie.png';
import lowObstacleImgSrc from '@/assets/lowObstacle.webp';
import highObstacleImgSrc from '@/assets/highObstacle.webp';

// 创建图像对象并设置 src
backgroundImg = new Image();
characterImg = new Image();
characterLieImg = new Image();
lowObstacleImg = new Image();
highObstacleImg = new Image();

backgroundImg.src = backgroundImgSrc;
characterImg.src = characterImgSrc;
characterLieImg.src = characterLieImgSrc;
lowObstacleImg.src = lowObstacleImgSrc;
highObstacleImg.src = highObstacleImgSrc;

// 初始化游戏
export function initializeGame(canvasElement, updateGameStatus, isGameOver) {
  playAreaCanvas = canvasElement;
  playAreaCtx = playAreaCanvas.getContext('2d');

  // 设置 canvas 大小
  playAreaCanvas.width = playArea.clientWidth;
  playAreaCanvas.height = playArea.clientHeight;

  characterY = playAreaCanvas.height * GROUND_HEIGHT_RATIO;

  // 初始化角色对象
  character = new Character(characterImg, 0, characterY, playAreaCanvas.width * CHARACTER_WIDTH_RATIO, playAreaCanvas.height * CHARACTER_HEIGHT_RATIO);

  backgroundImg.onload = updateBackground; // 等待背景图加载
  document.addEventListener('keydown', handleKeydown); // 键盘按下事件监听
  document.addEventListener('keyup', handleKeyup); // 添加键盘松开事件监听

  // 开始游戏循环
  gameLoop(updateGameStatus, isGameOver);
}

// 游戏主循环
export function gameLoop(updateGameStatus, isGameOver) {
  playAreaCtx.clearRect(0, 0, playAreaCanvas.width, playAreaCanvas.height);

  updateBackground();
  character.draw();
  updateObstacles();

  // 创建新障碍物 一段时间生成一个障碍物
  // Date.now 比 setInterval的性能更好，同步性也更好
  if (Date.now() - lastObstacleTime > CREATE_OBSTACLE_TIME) {
    createObstacle();
    lastObstacleTime = Date.now();
  }

  
  // 碰撞检测
  obstacles.forEach(obstacle => {
    if (isColliding(character, obstacle)) {
      updateGameStatus(true);
      isGameOver = true;
    }
  });

  if(!isGameOver){
    requestAnimationFrame(() => gameLoop(updateGameStatus));
    obstacleSpeed -= 0.001; 
    backgroundSpeed -= 0.0005;
  }
  
  console.log(obstacleSpeed,backgroundSpeed);
}
// 重置函数
export function resetGame() {
  obstacles = []; // 清空障碍物数组
  obstacleSpeed = -5; // 重置障碍物速度
  backgroundSpeed = -1; // 重置背景速度
  lastObstacleTime = Date.now(); // 重置障碍物生成时间
  isJumping = false; // 重置跳跃状态
  isLying = false; // 重置趴下状态
  characterY = playAreaCanvas.height * GROUND_HEIGHT_RATIO; // 重置角色 Y 坐标
  backgroundX = 0; // 重置背景
}

// 渲染背景
function updateBackground() {
  backgroundX += backgroundSpeed;
  if (backgroundX < -playAreaCanvas.width * 3) backgroundX = 0;
  
  playAreaCtx.drawImage(backgroundImg, backgroundX, 0, playAreaCanvas.width * 3, playAreaCanvas.height);
  playAreaCtx.drawImage(backgroundImg, backgroundX + playAreaCanvas.width * 3, 0, playAreaCanvas.width * 3, playAreaCanvas.height);
}


// 键盘事件
function handleKeydown(event) {
  if (event.key === 'j') {
    character.jump();
  } else if (event.key === 's') {
    character.lieDown();
  }
}

function handleKeyup(event) {
  if (event.key === 's') {
    character.standUp();
  }
}

// 创建障碍物
function createObstacle() {
  const type = Math.random() < 0.5 ? 'low' : 'high';
  const obstacle = new Obstacle(playAreaCanvas.width, type);
  obstacles.push(obstacle);
}

// 更新障碍物
function updateObstacles() {
  obstacles.forEach((obstacle, index) => {
    obstacle.update();
    obstacle.draw();
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
    }
  });
}

// 角色类
class Character {
  constructor(image, x, y, width, height) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    playAreaCtx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  jump() {
    if (isJumping || isLying) return;
    isJumping = true;
    const initialY = this.y;

    const updateJump = () => {
      jumpSpeed += GRAVITY;
      this.y += jumpSpeed;
      if (this.y > initialY) {
        this.y = initialY;
        isJumping = false;
        jumpSpeed = JUMP_SPEED_INITIAL;
      }
      if (isJumping) {
        requestAnimationFrame(updateJump);
      }
    };

    updateJump();
  }

  lieDown() {
    if (isJumping || isLying) return;
    isLying = true;

    this.image = characterLieImg;
    this.width = playAreaCanvas.height / 3;
    this.height = playAreaCanvas.width / 20;
    this.y = playAreaCanvas.height - this.height;

    // 按下蹲一定时间后恢复站立
    // 松开蹲后恢复站立
  }

  standUp() {
    isLying = false;
    this.image = characterImg;
    this.width = playAreaCanvas.width * CHARACTER_WIDTH_RATIO;
    this.height = playAreaCanvas.height * CHARACTER_HEIGHT_RATIO;
    this.y = characterY;
  }
}

// 障碍物类
class Obstacle {
  constructor(x, type) {
    this.x = x;
    this.type = type;
    this.image = type === 'low' ? lowObstacleImg : highObstacleImg;
    this.width = type === 'low' ? playAreaCanvas.width * OBSTACLE_WIDTH_RATIO : playAreaCanvas.height * HIGH_OBSTACLE_WIDTH_RATIO;
    this.height = type === 'low' ? playAreaCanvas.height * OBSTACLE_HEIGHT_RATIO : playAreaCanvas.width * HIGH_OBSTACLE_HEIGHT_RATIO;
    this.y = type === 'low' ? playAreaCanvas.height / 6 * 5 : playAreaCanvas.height / 3 * 2;
  }

  draw() {
    playAreaCtx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += obstacleSpeed;
  }
}

// 碰撞检测
function isColliding(objA, objB) {
  return objA.x < objB.x + objB.width &&
    objA.x + objA.width > objB.x &&
    objA.y < objB.y + objB.height &&
    objA.y + objA.height > objB.y;
}