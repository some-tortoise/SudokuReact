console.log("board generatin'...");

let boardArray=[
  [3,7,0,1,4,8,9,5,0],
  [5,1,0,0,0,0,0,0,8],
  [6,4,0,0,9,3,7,2,1],
  [0,0,1,0,0,6,0,0,0],
  [0,0,0,9,8,0,2,0,3],
  [0,3,0,0,0,0,6,9,0],
  [0,8,7,0,5,9,0,0,0],
  [0,9,0,0,0,0,0,0,2],
  [0,0,3,6,1,0,0,7,0]
];

export function getBoard(){
  return boardArray;
}

export function getBoardValAtSq(i) {
  return boardArray[Math.floor(i/9)][i%9] != 0 ? boardArray[Math.floor(i/9)][i%9] : undefined;
}

export function isBaseValue(i) {
  return boardArray[Math.floor(i/9)][i%9] != 0 ? "baseValue" : "";
}

export function isReadOnly(i) {
  return boardArray[Math.floor(i/9)][i%9] != 0 ? true : false;
}
