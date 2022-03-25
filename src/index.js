import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class Square extends React.Component{
  render(){
    return(
      <>
        <input maxLength = "1" className = "square" />
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

    console.log(i+": "+returnStatement);

    return returnStatement;
  }

  renderSquare(i) {
    return <td className={"sq"+i+" "+this.renderBoxBorders(i)} key={i}><Square /></td>;
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

class Game extends React.Component{
  render(){
    return(
      <>
        <Board />
      </>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

const $input = document.querySelector("#birthnumber");
const BIRTHNUMBER_ALLOWED_CHARS_REGEXP = /[0-9\/]+/;
$input.addEventListener("keypress", event => {
  if (!BIRTHNUMBER_ALLOWED_CHARS_REGEXP.test(event.key)) {
    event.preventDefault();
  }
});
