/*
TO-DO:


1. Update so that the moment a mistake is entered there will be highlighting on the squares
2. Make prettier

EXTRA:
1. Grade sudoku's on difficulty
2. Introduce notes
3. Introduce player highlighting
4. Introduce multiplayer?
5. Give player hints to let them move on
6. Create timer to measure time for player to complete
7. Create an autochecker option
8. Make a pop-up that explains hints when they are given

*/

import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import * as board from "./boardGenerator.js";

function Square(props){

  return(
    <>
      <input
      maxLength = "1"
      className = {"input-sq-"+props.value+" square"}
      /*value={board.getBoardValAtSq(this.props.value)}*/
      />
    </>
  );
}

class Board extends React.Component{

  renderBoxBorders(i){
    let returnStatement="";
    if (i%3==2 && (i%9 != 8)) {
      returnStatement += "rightBorder ";
    }

    if(Math.floor(i/9)%3==2 && Math.floor(i/9) != 8){
      returnStatement += "bottomBorder ";
    }

    return returnStatement;
  }

  renderSquare(i) {
    return <td className={"sq-"+i+" "+this.renderBoxBorders(i)} key={"sq-"+i}><Square value={i}/></td>;
  }

  renderRow(rowSize,i) {
    let returnStatement = [];
    for (var j = 0; j < rowSize; j++) {
      returnStatement.push( this.renderSquare(i*rowSize+j) );
    }
    return <tr key={"row-"+i} className={"row-"+i}>{returnStatement}</tr>;
  }

  renderBoard(boardWidth) {
    let board = [];
    for (var i = 0; i < boardWidth; i++) {
      board.push( this.renderRow(boardWidth,i) );
    }
    return <tbody>{board}</tbody>;
  }


  render() {
    return(
      <table cellSpacing="0">{this.renderBoard(9)}</table>
    );


  }
}

function SolveButton(){
  function handleClick() {
    console.log("solvin'...");
    if (board.isSolvableFromPosition()) {
      updateBoard();
    }else{
      alert("Board is not solvable from that position");
    }
  }


    return(
      <button onClick={() => handleClick()}> Solve</button>
    );

}

function NewBoardButton() {
  function handleClick(){
    board.generateBoard();
    updateBoard();
  }

  return(
    <button onClick={() => handleClick()}> New Board</button>
  );
}



class Game extends React.Component{
  render(){
    return(
      <>
        <Board />
        <SolveButton />
        <NewBoardButton />
      </>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
updateBoard();


function updateBoard() {
  for (var i = 0; i < 81; i++) {
    if (board.getBoardValAtSq(i) != 0) {
      $("input")[i].value = board.getBoardValAtSq(i);
      $("input")[i].disabled = true;
    }else{
      $("input")[i].value = null;
      $("input")[i].disabled = false;
    }
  }
}

//LIMIT INPUT TO NUMBERS USING JQUERY EVENT LISTENERS AND UPDATE BOARD BASED ON INPUTS

$("input").on("keydown", function (e) {
  if (!(1 <= event.key && event.key <= 9) && event.keyCode != 8) {
    $(this).prop("readOnly",true);
  } else if(event.key >= 1 && event.key <= 9){
    let inputSq = parseInt($(this)[0].className.match(/\d/g).join(""));
    if(board.getInitialBoardValAtSq(inputSq) == undefined){
      $(this)[0].value = event.key;
      board.setBoardValAtSq(inputSq, parseInt(event.key));
    }
  } else if (event.keyCode == 8){
    let inputSq = parseInt($(this)[0].className.match(/\d/g).join(""));
    if (board.getInitialBoardValAtSq(inputSq) == undefined) {
      board.setBoardValAtSq(inputSq, 0);
    }
  }
});

$("input").on("keyup", function (e) {
  $(this).prop("readOnly",false);
});
