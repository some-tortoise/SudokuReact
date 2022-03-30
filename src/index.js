/*

TO-DO:
1. Make solve screen nicer
2. Create timer and add option for timer in settings
3. Add dark mode

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
      className = {"input-sq-"+props.value+" square light"}
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
    return <td className={"light sudoku-grid sudoku-grid-td sq-"+i+" "+this.renderBoxBorders(i)} key={"sq-"+i}><Square value={i}/></td>;
  }

  renderRow(rowSize,i) {
    let returnStatement = [];
    for (var j = 0; j < rowSize; j++) {
      returnStatement.push( this.renderSquare(i*rowSize+j) );
    }
    return <tr key={"row-"+i} className={"sudoku-grid light row-"+i}>{returnStatement}</tr>;
  }

  renderBoard(boardWidth) {
    let board = [];
    for (var i = 0; i < boardWidth; i++) {
      board.push( this.renderRow(boardWidth,i) );
    }
    return <tbody className="sudoku-grid light">{board}</tbody>;
  }


  render() {
    return(
      <table className="sudoku-grid light" cellSpacing="0">{this.renderBoard(9)}</table>
    );


  }
}

function SolveButton(){
  function handleClick() {
    console.log("solvin'...");
    $(".sudoku-grid-td").removeClass("wrong");
    $(".square").removeClass("wrong");
    if (board.isSolvableFromPosition()) {
      board.solveBoard();
      updateBoard();
    }else if(!board.returnTrueIfSolved()){
      alert("Board is not solvable from that position");
    }
  }


    return(
      <button className = "solve-button light" onClick={() => handleClick()}> Solve</button>
    );

}

function NewBoardButton(props) {
  return(
    <button className = "new-board-button light" onClick = {() => props.onClick()}> New Board</button>
  );
}

function HintButton() {
  function handleClick(){

    if(board.returnTrueIfSolved()){
      return;
    }
    console.log("hintin'...");
    let hintGiven = false;
    $(".sudoku-grid-td").removeClass("focused");
    for (var i = 0; i < 81; i++) {
      if (board.getBoardValAtSq(i) != 0) {
        if($(".square")[i].value != board.getSolvedBoardValAtSq(i)){
          $(".sudoku-grid-td").has("."+$(".square")[i].className.split(" ")[0]).addClass("wrong");
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
    <button className = "hint-button light" onClick={() => handleClick()}> Hint</button>
  );
}

function CheckButton() {
  function handleClick(){
    console.log("checkin'...");
    checkBoard();
  }

  return(
    <button className = "check-button light" onClick={() => handleClick()}> Check</button>
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
    <label className = "auto-checker-container light">
      <input type = "checkbox" className = "auto-check-button light" onClick={() => handleClick()} />
      <div className = "auto-checker-text light">Turn on auto-check</div>
    </label>
  );
}

function SettingsButton(props){
  return(
    <div className="settings-logo-container light" onClick={() => props.onClick()}><img className="settings-logo" src={logo} alt="Settings" /></div>
  );
}

function NumberButton(props) {
  function handleClick(){
    if(!$(".focused").hasClass("baseValParent")){
      $(".focused").children()[0].value = props.value;
      let inputSq = parseInt($(".focused").children()[0].className.match(/\d/g).join(""));
      board.setBoardValAtSq(inputSq, parseInt(event.key));
      $(".sudoku-grid-td")[inputSq].classList.remove("wrong");
      $(".square")[inputSq].classList.remove("wrong");
      if(autocheck){
        checkBoard();
      }
      if(board.returnTrueIfSolved()){
        alert("Nice, you solved the Sudoku!");
      }
    }
  }

  return(
    <button className = "number-button light" onClick={() => handleClick()}>{props.value}</button>
  );
}

class NumberGrid extends React.Component{

  renderSquare(i) {
    return <td className={"num-button light num-button-"+i+1} key={"num-button-"+i+1}><NumberButton value={i+1}/></td>;
  }

  renderRow(rowSize,i) {
    let returnStatement = [];
    for (var j = 0; j < rowSize; j++) {
      returnStatement.push( this.renderSquare(i*rowSize+j) );
    }
    return <tr key={"num-row-"+i} className={"light num-row-"+i}>{returnStatement}</tr>;
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

function DifficultyLevelButton(props){
  return(
    <button onClick = {() => props.onClick(props.value)} className = {"difficulty-level-button light difficulty-button-"+props.value}>{props.value}</button>
  );
}

class ChooseDifficultyPanel extends React.Component {
  renderDifficulty(diff){
    return < DifficultyLevelButton key = {diff} value = {diff} onClick = {(attempts) => this.props.handleDifficultyClick(attempts)}/>;
  }
  renderPanel(){
    let panel = [];
    panel.push(this.renderDifficulty("Easy"));
    panel.push(this.renderDifficulty("Medium"));
    panel.push(this.renderDifficulty("Hard"));
    return panel;
  }


  render(){
    return(
      <div className = {"choose-difficulty-panel "+ (this.props.showVal ? "shown" : "hidden")+" "+this.props.theme}>
        <div className= "choose-difficulty-header light">
          Choose Difficulty
        </div>

        {this.renderPanel()}
        <div className = "arrow-right light">
        </div>
      </div>
    );
  }
}

function SettingsPanel(props) {

  return (

    <div className = {"settings-panel-super-container " + (props.showVal ? "shown" : "hidden") + " "+ props.theme}>
      <div className = {"settings-panel-container "+props.theme}>
        <div className = {"settings-panel-header "+props.theme}>
        Settings
        </div>

        <div className = {"settings-panel-close-button-container "+props.theme} onClick = {() => props.onClose()}>
          <div>
            x
          </div>
        </div>

        <div className = {"settings-panel-theme-container "+props.theme}>
          <div className = {"settings-panel-theme-header "+props.theme}>
          Theme
          </div>

          <input type="radio" id="light-radio" onClick = {() => props.handleThemeChangeHandler("light")} className="settings-panel-theme-radio light" name="themes" value="light" defaultChecked/><label htmlFor="light-radio" className={"settings-panel-theme-label "+props.theme}>Light Theme</label><br />
          <input type="radio" id="dark-radio" onClick = {() => props.handleThemeChangeHandler("dark")} className="settings-panel-theme-radio light" name="themes"  value="dark"/><label htmlFor="dark-radio" className={"settings-panel-theme-label "+props.theme}>Dark Theme</label>
        </div>

        <div className={"settings-panel-get-board-string-container "+props.theme}>
          <div className="settings-panel-get-board-string-header light">
          Export
          </div>
          <button className = {"settings-panel-get-board-string-button " + props.theme} onClick = {() => props.handleExportClicks()} >Get String</button>
          <input type="text" className = {"settings-panel-get-board-string-input "+props.theme} defaultValue={props.sudokuStringCode == "" ? "" : "String: "+props.sudokuStringCode}/>

        </div>
      </div>
    </div>
  );
}

class Game extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showDifficultyPanel: false,
      showSettingsPanel: false,
      sudokuStringCode: "",
      colorTheme: "light",
    };

  }

  newBoardClick(){
    this.setState({
      showDifficultyPanel: !this.state.showDifficultyPanel,
    });
  }

  handleClick(){
    if(this.state.showDifficultyPanel){
      this.setState({
        showDifficultyPanel: !this.state.showDifficultyPanel,
      });
    }
  }

  handleDifficultyClick(difficulty){
    console.log(difficulty);
    if(difficulty == "Easy"){
      board.generateBoard(5);
    }else if(difficulty == "Medium"){
      board.generateBoard(10);
    }else if(difficulty == "Hard"){
      board.generateBoard(18);
    }else{
      alert("Error Occurred");
    }

    updateBoard();
    $(".sudoku-grid-td").removeClass("justHinted");
    this.setState({
      showDifficultyPanel: !this.state.showDifficultyPanel,
    });
  }

  handleThemeChange(theme){
    if(theme == "dark"){
      this.setState({
        colorTheme: "dark",
      });
      $(".light").addClass("dark");
      $(".dark").removeClass("light");
    }else{
      this.setState({
        colorTheme: "light",
      });
      $(".dark").addClass("light");
      $(".light").removeClass("dark");
    }


  }

  handleOpenSettingsClick(){
    this.setState({
      showSettingsPanel: true,
      sudokuStringCode: "",
    });
  }

  handleCloseSettingsClick(){
    this.setState({
      showSettingsPanel: false,
      sudokuStringCode: "",
    });
  }

  handleExportClick() {
    this.setState({
      sudokuStringCode: board.exportSudoku(),
    });
  }


  render(){
    const presentDifficultyPanel = this.state.showDifficultyPanel;
    const presentSettingsPanel = this.state.showSettingsPanel;
    return(
      <div>
        <ChooseDifficultyPanel className = "light" theme = {this.state.colorTheme} showVal = {presentDifficultyPanel} handleDifficultyClick = {(attempts) => this.handleDifficultyClick(attempts)}/>
        <div className="super-container light" onClick={() => this.handleClick()}>
          <header className = "light">Sudoku<SettingsButton onClick = {() =>this.handleOpenSettingsClick()}/></header>
          <div className = "game-container light">
            <div className = "board-container light">
              <Board />

            </div>
            <div className = "all-buttons-container light">
              <div className = "top-buttons-container light">
                <NewBoardButton onClick={() => this.newBoardClick()}/>
                <SolveButton />
                <HintButton />
                <CheckButton />
                <AutoCheckButton />
              </div>
              <div className = "number-grid-container light">
                <NumberGrid />
              </div>
            </div>
          </div>
          <footer className="light">Made by Alejandro Breen</footer>
        </div>
        <SettingsPanel className = "light" theme = {this.state.colorTheme} handleThemeChangeHandler = {(i) => this.handleThemeChange(i)} handleExportClicks = {() => this.handleExportClick()} sudokuStringCode = {this.state.sudokuStringCode} showVal = {presentSettingsPanel} onClose = {() => this.handleCloseSettingsClick()}/>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
updateBoard();


function updateBoard() {
  $(".sudoku-grid-td").removeClass("focused");
  for (var i = 0; i < 81; i++) {
    if (board.getBoardValAtSq(i) != 0) {
      $(".square")[i].value = board.getBoardValAtSq(i);
      $(".square")[i].disabled = true;
      $(".square")[i].className = $("input")[i].className + " baseValue";
      $(".sudoku-grid-td").has("."+$("input")[i].className.split(" ")[0]).addClass("baseValParent");
    }else{
      $(".sudoku-grid-td")[i].classList.remove("justHinted");
      $(".sudoku-grid-td")[i].classList.remove("baseValParent");
      $(".square")[i].classList.remove("baseValue");
      $(".square")[i].value = null;
      $(".square")[i].disabled = false;
    }
  }
}

function checkBoard() {
  for (var i = 0; i < 81; i++) {
    if (board.getBoardValAtSq(i) != 0) {
      if($(".square")[i].value != board.getSolvedBoardValAtSq(i)){
        $(".sudoku-grid-td").has("."+$(".square")[i].className.split(" ")[0]).addClass("wrong");
      }else{
        $(".square")[i].disabled = true;
        $(".square")[i].className = $(".square")[i].className + " baseValue";
        $(".sudoku-grid-td").has("."+$(".square")[i].className.split(" ")[0]).addClass("baseValParent");
      }
    }
  }
}

$(".square").on("focus", function (e) {
  $(".sudoku-grid-td").removeClass("focused");
  $(".sudoku-grid-td").removeClass("justHinted");
  $(this).parent().addClass("focused");
});


//LIMIT INPUT TO NUMBERS USING JQUERY EVENT LISTENERS AND UPDATE BOARD BASED ON INPUTS

$(".square").on("keydown", function (e) {
  if (!(1 <= event.key && event.key <= 9) && event.keyCode != 8) {
    $(this).prop("readOnly",true);
  } else if(event.key >= 1 && event.key <= 9){
    let inputSq = parseInt($(this)[0].className.match(/\d/g).join(""));
    if(board.getInitialBoardValAtSq(inputSq) == undefined){
      $(".sudoku-grid-td")[inputSq].classList.remove("wrong");
      $(".square")[inputSq].classList.remove("wrong");
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
    $(".sudoku-grid-td")[inputSq].classList.remove("wrong");
    $(".square")[inputSq].classList.remove("wrong");
  }
});

$(".square").on("keyup", function (e) {
  $(this).prop("readOnly",false);
});
