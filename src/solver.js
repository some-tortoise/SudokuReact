import * as board from "./boardGenerator.js";

let a=0;
let depth = 0;
let location;
let newValue = 1;
let lastTestFailed = false;
let solved = false;
let currentBoard = extractArray(board.getBoard());

console.log("solvin'...");

function getNumOfZeroes() {
  let numOfZeroes = 0;
  for (var i = 0; i < 81; i++) {
    numOfZeroes += (currentBoard[Math.floor(i/9)][i%9]==0) ? 1 : 0;
  }
  return numOfZeroes;
}

function findFirstZero() {
  let numOfZeroes = 0;
  for (var i = 0; i < 81; i++) {
    if(history[depth][0][Math.floor(i/9)][i%9]==0){
      return i;
    }
  }
  return -1;
}
console.log(getNumOfZeroes());
let history = new Array(getNumOfZeroes()+1).fill(null);
//each point in history will hold the array at that point alongside the location of the square changed at that depth and the new value entered
for (var i = 0; i < history.length; i++) {
  history[i] = new Array(3).fill(null);
}
//input the starting board
history[0][0] = board.getBoard();



while(!solved && a<10000){
  a+=1;
  solveStep();
}

currentBoard = history[depth][0];
board.setBoard(extractArray(currentBoard));

export function solveStep() {

    if(findFirstZero() != -1){
      depth += 1;
    }

    //make the next array equal to the previous one
    history[depth][0] = extractArray(history[depth-1][0]);


    //set the location to the next zero if the board has no issues, otherwise make the location equal to the location at that depth
    location = (history[depth][1]==null) ? findFirstZero() : history[depth][1];
    //define the location at each depth as you go along
    history[depth][1] = location;
    history[depth][2] = newValue;

    //set the new value at location
    history[depth][0][Math.floor(location/9)][location%9] = newValue;

    // check board
    if (isBoardBroken()) {

      depth-=1;
      lastTestFailed = true;

      if(newValue<=9){
        newValue++;
      }
      while(newValue>9){
        newValue = history[depth][2] + 1;
        depth-=1;
      }


    }else{
      newValue=1;
      lastTestFailed = false;
    }

    if(!isBoardBroken() && findFirstZero() == -1){
      solved = true;
      console.log("solved!");
    }
}

function isBoardBroken() {
  if(thereAreNoHorizontalCollisions() && thereAreNoVerticalCollisions() && thereAreNoInSqCollisions()){
    return(false);
  }else{
    return(true);
  }
}

function thereAreNoHorizontalCollisions() {
  let count = 0;
  for (var i = 0; i < 9; i++) {
    if (history[depth][0][Math.floor(location/9)][i] == newValue){
      count++;
    }
  }
  return (count == 1) ? true : false;
}

function thereAreNoVerticalCollisions() {
  let count = 0;
  for (var i = 0; i < 9; i++) {
    if (history[depth][0][i][location%9] == newValue){
      count++;
    }
  }
  return (count == 1) ? true : false;
}

function thereAreNoInSqCollisions() {
  let count = 0;
  for (var i = 0; i < 9; i++) {
    if (history[depth][0][Math.floor(location/9) - Math.floor(location/9)%3 + Math.floor(i/3)][location%9 - location%3 + i%3] == newValue){
      count++;
    }
  }
  return (count == 1) ? true : false;
}

function extractArray(currentArray) {
  var newArray = currentArray.map(function(arr) {
    return arr.slice();
  });
  return newArray;
}
