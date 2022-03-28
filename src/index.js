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
import logo from "../settingsLogo.png";

let autocheck = false;

function Square(props){
  return(
    <>
      <input
      type = "text"
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
    return <td className={"sudoku-grid sq-"+i+" "+this.renderBoxBorders(i)} key={"sq-"+i}><Square value={i}/></td>;
  }

  renderRow(rowSize,i) {
    let returnStatement = [];
    for (var j = 0; j < rowSize; j++) {
      returnStatement.push( this.renderSquare(i*rowSize+j) );
    }
    return <tr key={"row-"+i} className={"sudoku-grid row-"+i}>{returnStatement}</tr>;
  }

  renderBoard(boardWidth) {
    let board = [];
    for (var i = 0; i < boardWidth; i++) {
      board.push( this.renderRow(boardWidth,i) );
    }
    return <tbody className="sudoku-grid">{board}</tbody>;
  }


  render() {
    return(
      <table className="sudoku-grid" cellSpacing="0">{this.renderBoard(9)}</table>
    );


  }
}

function SolveButton(){
  function handleClick() {
    console.log("solvin'...");
    $("td").removeClass("wrong");
    $(".square").removeClass("wrong");
    if (board.isSolvableFromPosition()) {
      board.solveBoard();
      updateBoard();
    }else if(!board.returnTrueIfSolved()){
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
    console.log("hintin'...");
    let hintGiven = false;
    $("td").removeClass("focused");
    for (var i = 0; i < 81; i++) {
      if (board.getBoardValAtSq(i) != 0) {
        if($("input")[i].value != board.getSolvedBoardValAtSq(i)){
          $("td").has("."+$("input")[i].className.split(" ")[0]).addClass("wrong");
          hintGiven = true;
          break;
        }
      }
    }
    if(!hintGiven){
      let pos = board.findRandomZero();
      $("input")[pos].value = board.getSolvedBoardValAtSq(pos);
      board.setBoardValAtSq(pos, board.getSolvedBoardValAtSq(pos));
      $("input")[pos].disabled = true;
      $("input")[pos].className = $("input")[pos].className + " baseValue";
      $("td").has("."+$("input")[pos].className.split(" ")[0]).addClass("baseValParent");
      $("td").has("."+$("input")[pos].className.split(" ")[0]).addClass("justHinted");
      hintGiven = true;
    }
  }

  return(
    <button className = "hint-button" onClick={() => handleClick()}> Hint</button>
  );
}

function CheckButton() {
  function handleClick(){
    console.log("checkin'...");
    checkBoard();
  }

  return(
    <button className = "check-button" onClick={() => handleClick()}> Check</button>
  );
}

function AutoCheckButton() {
  function handleClick(){
    autocheck = !autocheck;
    checkBoard();
    if (autocheck) {
      $(".auto-checker-text").text("Turn off auto-check");
    }else{
      $(".auto-checker-text").text("Turn on auto-check");
    }

  }

  return(
    <label className = "auto-checker-container">
      <input type = "checkbox" className = "auto-check-button" onClick={() => handleClick()} />
      <div className = "auto-checker-text">Turn on auto-check</div>
    </label>
  );
}

function SettingsButton(){
  function handleClick(){
    alert("That functionality is not avaiable yet");
  }

  return(
    <div className="settings-logo-container" onClick={() => handleClick()}><img className="settings-logo" src={logo} alt="Settings" /></div>
  );
}

function NumberButton(props) {
  function handleClick(){
    if(!$(".focused").hasClass("baseValParent")){
      $(".focused").children()[0].value = props.value;
      let inputSq = parseInt($(".focused").children()[0].className.match(/\d/g).join(""));
      board.setBoardValAtSq(inputSq, parseInt(event.key));
      $("td")[inputSq].classList.remove("wrong");
      $("input")[inputSq].classList.remove("wrong");
      if(autocheck){
        checkBoard();
      }
      if(board.returnTrueIfSolved()){
        alert("Nice, you solved the Sudoku!");
      }
    }
  }

  return(
    <button className = "number-button" onClick={() => handleClick()}>{props.value}</button>
  );
}

class NumberGrid extends React.Component{

  renderSquare(i) {
    return <td className={"num-button num-button-"+i+1} key={"num-button-"+i+1}><NumberButton value={i+1}/></td>;
  }

  renderRow(rowSize,i) {
    let returnStatement = [];
    for (var j = 0; j < rowSize; j++) {
      returnStatement.push( this.renderSquare(i*rowSize+j) );
    }
    return <tr key={"num-row-"+i} className={"num-row-"+i}>{returnStatement}</tr>;
  }

  renderBoard(){
    let board = [];
    for (var i = 0; i < 3; i++) {
      board.push( this.renderRow(3,i) );
    }
    return <tbody>{board}</tbody>;
  }

  render(){
    return(
      <table cellSpacing="0">{this.renderBoard()}</table>
    );
  }
}




class Game extends React.Component{
  render(){
    return(
      <>
        <header>Sudoku<SettingsButton /></header>
        <div className = "game-container">
          <div className = "board-container">
            <Board />
          </div>
          <div className = "all-buttons-container">
            <div className = "top-buttons-container">
              <NewBoardButton />
              <SolveButton />
              <HintButton />
              <CheckButton />
              <AutoCheckButton />
            </div>
            <div className = "number-grid-container">
              <NumberGrid />
            </div>
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
      $("td")[i].classList.remove("justHinted");
      $("td")[i].classList.remove("baseValParent");
      $("input")[i].classList.remove("baseValue");
      $("input")[i].value = null;
      $("input")[i].disabled = false;
    }
  }
}

function checkBoard() {
  for (var i = 0; i < 81; i++) {
    if (board.getBoardValAtSq(i) != 0) {
      if($("input")[i].value != board.getSolvedBoardValAtSq(i)){
        $("td").has("."+$("input")[i].className.split(" ")[0]).addClass("wrong");
      }else{
        $("input")[i].disabled = true;
        $("input")[i].className = $("input")[i].className + " baseValue";
        $("td").has("."+$("input")[i].className.split(" ")[0]).addClass("baseValParent");
      }
    }
  }
}

$(".square").on("focus", function (e) {
  $("td").removeClass("focused");
  $("td").removeClass("justHinted");
  $(this).parent().addClass("focused");
});

//LIMIT INPUT TO NUMBERS USING JQUERY EVENT LISTENERS AND UPDATE BOARD BASED ON INPUTS

$(".square").on("keydown", function (e) {
  if (!(1 <= event.key && event.key <= 9) && event.keyCode != 8) {
    $(this).prop("readOnly",true);
  } else if(event.key >= 1 && event.key <= 9){
    let inputSq = parseInt($(this)[0].className.match(/\d/g).join(""));
    if(board.getInitialBoardValAtSq(inputSq) == undefined){
      $("td")[inputSq].classList.remove("wrong");
      $("input")[inputSq].classList.remove("wrong");
      $(this)[0].value = event.key;
      board.setBoardValAtSq(inputSq, parseInt(event.key));
    }
    if(autocheck){
      checkBoard();
    }
    if(board.returnTrueIfSolved()){
      alert("Nice, you solved the Sudoku!");
    }
  } else if (event.keyCode == 8){
    let inputSq = parseInt($(this)[0].className.match(/\d/g).join(""));
    if (board.getInitialBoardValAtSq(inputSq) == undefined) {
      $(this)[0].value = null;
      board.setBoardValAtSq(inputSq, 0);
    }
    if (autocheck) {
      checkBoard();
    }
    $("td")[inputSq].classList.remove("wrong");
    $("input")[inputSq].classList.remove("wrong");
  }
});

$(".square").on("keyup", function (e) {
  $(this).prop("readOnly",false);
});
