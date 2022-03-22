import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class Square extends React.Component{
  render(){
    return(
      <>
        <input className = "square" />
      </>
    );
  }
}


class Board extends React.Component{

  renderSquare(i) {
    return <td className={i} key={i}><Square /></td>;
  }

  renderRow(rowSize,i) {
    let returnStatement = [];
    for (var j = 0; j < rowSize; j++) {
      returnStatement.push( this.renderSquare(i*rowSize+j) );
    }
    return <tr key={i} className={i}>{returnStatement}</tr>;
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
      <table>{this.renderBoard(9)}</table>
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
