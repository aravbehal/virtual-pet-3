var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
garden=loadImage("Garden.png")
washroom=loadImage("Wash Room.png")
bedroom=loadImage("Bed Room.png")
}

function setup() {
  database=firebase.database();
  createCanvas(400,500);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  
  currentTime=hour()
  if(currentTime==(lastFed+1)){
    update("Playing")
    foodObj.garden()
  }
 else if(currentTime==(lastFed+2)){
  update("Sleeping")
  foodObj.bedroom()
}
else if(currentTime>(lastFed+1) && currentTime<=(lastFed+4)){
  update("Bathing")
  foodObj.washroom()
}
else{
  update("hungry")
  foodObj.display()
}
if(gameState!="hungry"){
  feed.hide()
  addFood.hide()
  dog.remove()
}
else {
  feed.show()
  addFood.show()
  dog.addImage(sadDog)
}
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  
  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0){
      foodObj.updateFoodStock(food_stock_val *0);
  }else{
      foodObj.updateFoodStock(food_stock_val -1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"hungry"
  })
}


function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
  
  database.ref('/').update({
   gameState:state
  })
}

