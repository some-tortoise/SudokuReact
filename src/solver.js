import * as board from "./boardGenerator.js";

let a;
let depth;
let location;
let newValue;
let lastTestFailed;
let solved;
let solvable;
let currentBoard;

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

let history;

export function solve(){
  console.log("solvin'...");
  console.log(board.getBoard());
  currentBoard = extractArray(board.getBoard());
  a=0;
  depth=0;
  newValue=1;
  lastTestFailed=false;
  solved=false;
  solvable=true;
  history = new Array(getNumOfZeroes()+1).fill(null);
  for (var i = 0; i < history.length; i++) {
    history[i] = new Array(3).fill(null);
  }

  //input the starting board
  history[0][0] = board.getBoard();
  if(!thereAreNoHorizontalCollisionsAtAll()){
    console.log("There are Horizontal Collisions");
  }
  if(!thereAreNoVerticalCollisionsAtAll()){
    console.log("There are Vertical Collisions");
  }
  if(!thereAreNoInSqCollisionsAtAll()){
    console.log("There are In-Square Collisions");
  }
  if(
    thereAreNoHorizontalCollisionsAtAll() &&
    thereAreNoVerticalCollisionsAtAll() &&
    thereAreNoInSqCollisionsAtAll()
  ){
    while(!solved && a<10000 && solvable){
      a+=1;
      solveStep();
    }
    if(!solvable){
      depth = 0;
      currentBoard = extractArray(board.getBoard());
      alert("The board was not solvable from that state");
    }
    if(a>=10000){
      alert("something went wrong");
    }
  }else{
    alert("The board was not solvable from that state");
  }


}

export function setBoardToSolvedBoard(){
  currentBoard = history[depth][0];
  console.log(currentBoard);
  board.setBoard(extractArray(currentBoard));
}

export function solveStep() {

    if(depth <= -1){
      solvable = false;
      return;
    }

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

    if(depth >= 0 && !isBoardBroken() && findFirstZero() == -1){
      solved = true;
      console.log("solved!");
    }
}

function isBoardBroken() {
  if(thereAreNoHorizontalCollisionsWithChange() && thereAreNoVerticalCollisionsWithChange() && thereAreNoInSqCollisionsWithChange()){
    return(false);
  }else{
    return(true);
  }
}

function thereAreNoHorizontalCollisionsAtAll() {
  let count = Array(9).fill(0);
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (board.getBoard()[i][j] != 0){
        count[board.getBoard()[i][j]-1]++;
      }
    }

    if (count.every(el => el <= 1)) {
      count = Array(9).fill(0);
    }else{
      return false;
    }

  }

  return true;
}

function thereAreNoVerticalCollisionsAtAll() {
  let count = Array(9).fill(0);
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (board.getBoard()[j][i] != 0){
        count[board.getBoard()[j][i]-1]++;
      }
    }

    if (count.every(el => el <= 1)) {
      count = Array(9).fill(0);
    }else{
      return false;
    }

  }

  return true;
}

function thereAreNoInSqCollisionsAtAll() {
  let count = Array(9).fill(0);
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (board.getBoard()[3*Math.floor(i/3)+Math.floor(j/3)][j%3+3*(i%3)] != 0){
        count[board.getBoard()[3*Math.floor(i/3)+Math.floor(j/3)][j%3+3*(i%3)]-1]++;
      }
    }

    if (count.every(el => el <= 1)) {
      count = Array(9).fill(0);
    }else{
      return false;
    }

  }

  return true;
}

function thereAreNoHorizontalCollisionsWithChange() {
  let count = 0;
  for (var i = 0; i < 9; i++) {
    if (history[depth][0][Math.floor(location/9)][i] == newValue){
      count++;
    }
  }
  return (count == 1) ? true : false;
}

function thereAreNoVerticalCollisionsWithChange() {
  let count = 0;
  for (var i = 0; i < 9; i++) {
    if (history[depth][0][i][location%9] == newValue){
      count++;
    }
  }
  return (count == 1) ? true : false;
}

function thereAreNoInSqCollisionsWithChange() {
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
