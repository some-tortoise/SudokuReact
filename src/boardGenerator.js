let initialBoard=[
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0]
];

let currentBoard=[
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0]
];

let solvedBoard=[
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0]
];

export function getInitialBoardValAtSq(i){
  return initialBoard[Math.floor(i/9)][i%9] != 0 ? initialBoard[Math.floor(i/9)][i%9] : undefined;
}

export function getBoard(){
  return currentBoard;
}

export function setBoard(input){
  currentBoard = input;
}

export function getBoardValAtSq(i) {
  return currentBoard[Math.floor(i/9)][i%9] != 0 ? currentBoard[Math.floor(i/9)][i%9] : undefined;
}

export function setBoardValAtSq(i,val){
  console.log(currentBoard);
  currentBoard[Math.floor(i/9)][i%9] = val;
}

export function isBaseValue(i) {
  return initialBoard[Math.floor(i/9)][i%9] != 0 ? "baseValue" : "";
}

export function isDisabled(i) {
  return initialBoard[Math.floor(i/9)][i%9] != 0 ? true : false;
}

export function isSolvableFromPosition(){
  let copyGrid = extractArray(currentBoard);
  counter=0;
  solveGrid(copyGrid);
  if(counter != 1){
    return false;
  }else{
    currentBoard = extractArray(solvedBoard);
    return true;
  }
}

/************************************************************************/
/************************************************************************/
/************************************************************************/


let counter = 1;
let numList = [1,2,3,4,5,6,7,8,9];
createSolvedBoard(solvedBoard);
initialBoard = extractArray(solvedBoard);
createBoardFromSolvedBoard(initialBoard);
currentBoard = extractArray(initialBoard);

export function createSolvedBoard(grid){
  let row, col, val;
  for (var i = 0; i < 81; i++) {
    row=floor(i/9);
    col=i%9;
    shuffleArray(numList);
    if(grid[row][col] == 0){
      for (var j = 0; j < numList.length; j++) {
        val=numList[j];
        //Check for Horizontal Collisions
        if (grid[row].every(x => x != val)) {
          //Check for Vertical Collisions
          if(numList.every(x => grid[x-1][col] != val)){
            //Check for In-Square Collisions
            if(numList.every(x => grid[row - (row%3) + floor((x-1)/3)][col - (col%3) + (x-1)%3] != val)){
              grid[row][col] = val;
              //If grid is done, then return true
              if(checkGrid(grid)){
                return true;
              }
              //Else, call a version of this function at this point of the board; if this point leads to a broken board it will come back to this point returning false, otherwise, it will have created a finished board
              else if(createSolvedBoard(grid)){
                return true;
              }
            }
          }
        }
      }
      //we only reach this point if a sq has no possible values; if that happens we want to immediately break out and return false
      break;
    }
  }
  grid[row][col] = 0;
  return false;
}

export function solveGrid(grid){
  let row, col;
  for (var i = 0; i < 81; i++) {
    row=floor(i/9);
    col=i%9;
    if(grid[row][col] == 0){
      for (var val = 1; val < 10; val++) {
        //Check for Horizontal Collisions
        if (grid[row].every(x => x != val)) {
          //Check for Vertical Collisions
          if(numList.every(x => grid[x-1][col] != val)){
            //Check for In-Square Collisions
            if(numList.every(x => grid[row - (row%3) + floor((x-1)/3)][col - (col%3) + (x-1)%3] != val)){
              grid[row][col] = val;
              //If grid is done, then return true
              if(checkGrid(grid)){
                counter+=1;
                break;
              }
              //Else, call a version of this function at this point of the board; if this point leads to a broken board it will come back to this point returning false, otherwise, it will have created a finished board
              else if(solveGrid(grid)){
                return true;
              }
            }
          }
        }
      }
      //we only reach this point if a sq has no possible values; if that happens we want to immediately break out and return false
      break;
    }
  }
  grid[row][col] = 0;
  return false;
}

export function createBoardFromSolvedBoard(grid){
  let attempts = 5;
  let copyGrid;
  let row, col;
  while (attempts > 0){
    //returns
    row = randomOneToNine();
    col = randomOneToNine();
    while (grid[row][col] == 0) {
      row = randomOneToNine();
      col = randomOneToNine();
    }
    let backup = grid[row][col];
    grid[row][col] = 0;

    copyGrid = extractArray(grid);
    counter = 0;
    solveGrid(copyGrid);

    if(counter != 1){
      grid[row][col] = backup;
      attempts -= 1;
    }
  }
}

function floor(x){
  return Math.floor(x);
}

function randomOneToNine(){
  return Math.floor(Math.random()*9);
}

function checkGrid(grid){
  for (var row = 0; row < 9; row++) {
    for (var col = 0; col < 9; col++) {
      if (grid[row][col] == 0) {
        return false;
      }
    }
  }

  return true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function extractArray(currentArray) {
  var newArray = currentArray.map(function(arr) {
    return arr.slice();
  });
  return newArray;
}
