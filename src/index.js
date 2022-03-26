/*
TO-DO:

1. create a solver that simply uses brute force to solve a given Sudoku
2. use said solver to generate sudoku puzzles based on solved boards. Details provided: https://stackoverflow.com/questions/6924216/how-to-generate-sudoku-boards-with-unique-solutions
3. create a button titled "New Board" and build a new board with the algorithm everytime the button is pressed
4. Fix "Solve" button to tell user the puzzle is broken if they messed up
5. Update so that the moment a mistake is entered there will be highlighting on the squares
6. Make prettier

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
import * as solver from "./solver.js";

class Square extends React.Component{
  render(){
    return(
      <>
        <input maxLength = "1" className = {"square "+board.isBaseValue(this.props.value)} readOnly={board.isReadOnly(this.props.value)} pattern="[0-9]" value={board.getBoardValAtSq(this.props.value)}/>
      </>
    );
  }
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
    return <td className={"sq"+i+" "+this.renderBoxBorders(i)} key={i}><Square value={i}/></td>;
  }

  renderRow(rowSize,i) {
    let returnStatement = [];
    for (var j = 0; j < rowSize; j++) {
      returnStatement.push( this.renderSquare(i*rowSize+j) );
    }
    return <tr key={i} className={"row"+i}>{returnStatement}</tr>;
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

class SolveButton extends React.Component{
  handleClick() {
    //solver;
  }

  render(){
    return(
      <button onClick={() => this.handleClick()}> Solve</button>
    );
  }
}

class Game extends React.Component{
  render(){
    return(
      <>
        <Board />
        <SolveButton />
      </>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));


//LIMIT INPUT TO NUMBERS USING JQUERY EVENT LISTENERS

$("input").on("keydown", function (e) {
  if (!(1 <= event.key && event.key <= 9) && event.keyCode != 8) {
    $(this).prop("readOnly",true);
  } else if(event.key >= 1 && event.key <= 9){
    $(this)[0].value = event.key;
  }
});

$("input").on("keyup", function (e) {
  $(this).prop("readOnly",false);
});
