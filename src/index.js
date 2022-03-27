/*

EXTRA:
1. Grade sudoku's on difficulty
2. Introduce notes
3. Update so that the moment a mistake is entered there will be highlighting on the squares
4. Introduce player highlighting
5. Introduce multiplayer?
6. Give player hints to let them move on
7. Create timer to measure time for player to complete
8. Create an autochecker option
9. Make a pop-up that explains hints when they are given

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
      <button className = "solve-button" onClick={() => handleClick()}> Solve</button>
    );

}

function NewBoardButton() {
  function handleClick(){
    board.generateBoard();
    updateBoard();
  }

  return(
    <button className = "new-board-button" onClick={() => handleClick()}> New Board</button>
  );
}

function HintButton() {
  function handleClick(){
    alert("This functionality is not available yet");
  }

  return(
    <button className = "hint-button" onClick={() => handleClick()}> Hint</button>
  );
}



class Game extends React.Component{
  render(){
    return(
      <>
        <header>Sudoku</header>
        <div className = "game-container">
          <div className = "board-container">
            <Board />
          </div>
          <div className = "buttons-container">
            <NewBoardButton />
            <SolveButton />
            <HintButton />
          </div>
        </div>
        <footer>Made by Alejandro Breen</footer>
      </>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
updateBoard();


function updateBoard() {
  $("td").removeClass("focused");
  for (var i = 0; i < 81; i++) {
    if (board.getBoardValAtSq(i) != 0) {
      $("input")[i].value = board.getBoardValAtSq(i);
      $("input")[i].disabled = true;
      $("input")[i].className = $("input")[i].className + " baseValue";
      $("td").has("."+$("input")[i].className.split(" ")[0]).addClass("baseValParent");
    }else{
      $("td")[i].classList.remove("baseValParent");
      $("input")[i].classList.remove("baseValue");
      $("input")[i].value = null;
      $("input")[i].disabled = false;
    }
  }
}

$("input").on("focus", function (e) {
  $("td").removeClass("focused");
  $(this).parent().addClass("focused");
});

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
