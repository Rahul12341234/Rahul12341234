var PLAY = 1;
var END = 0;
var gamestate = PLAY;


var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOver, restart;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
}

function setup() {
  createCanvas(600, 200);

  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
    
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.addAnimation("collided", trex_collided);
  
  gameOver = createSprite(300, 100);
  restart = createSprite(300, 140);
  gameOver.addImage(gameOverImg);
  restart.addImage(restartImg);
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(180);
  
  if (gamestate === PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(4 + 3*score/100);
    
    if(keyDown("space") && trex.y > 159) {
      trex.velocityY = -13;
    }
    
     trex.velocityY = trex.velocityY + 0.8
  
     if (ground.x < 0){
       ground.x = ground.width/2;  
     }

    spawnClouds();
    spawnObstacles();
    
    if (obstaclesGroup.isTouching(trex)){
      gamestate = END;
    }
  }
  else if(gamestate === END){
   ground.velocityX = 0;
   obstaclesGroup.setVelocityXEach(0);
   cloudsGroup.setVelocityXEach(0);
   obstaclesGroup.setLifetimeEach(-1);
   cloudsGroup.setLifetimeEach(-1);
   gameOver.visible = true;
   restart.visible = true;
   gameOver.depth = cloud.depth + 1
   restart.depth = obstacle.depth + 1 
   trex.changeAnimation("collided", trex_collided);
   
   if (mousePressedOver(restart)){
    reset();
   }
  }
  
  text("Score: " + score, 500,50);
  trex.collide(invisibleGround);  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = ground.velocityX;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gamestate = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
  trex.changeAnimation("running", trex_running);
}
