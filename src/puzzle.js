import React, { Component } from 'react';
import "./puzzle.css"


class Puzzle extends Component {
  constructor(){
    super();
    this.state =  {
      puzzle: [
        [0, 9, 0, 3, 1, 5, 0, 0, 0],
        [0, 0, 0, 0, 0, 6, 9, 5, 8],
        [6, 2, 0, 0, 9, 0, 4, 0, 0],
        [4, 0, 6, 0, 0, 0, 2, 0, 5],
        [0, 0, 1, 8, 5, 0, 0, 4, 0],
        [0, 7, 2, 1, 6, 0, 0, 8, 0],
        [3, 0, 0, 5, 0, 9, 0, 0, 4],
        [0, 5, 0, 0, 7, 3, 0, 0, 6],
        [2, 4, 7, 0, 0, 0, 5, 9, 0]
      ],
      N: 9,
      changeRow: -1,
      changeCol: -1,
      savedVal: -1,
      invalid: false,
      invalidVal: -1,
      noSolution: false
    }
  }
  componentDidMount() {
      document.addEventListener("keydown", this.onKeyPressed);
  }

  componentWillUnmount() {
      document.removeEventListener("keydown", this.onKeyPressed);
  }

  solveSudokuRunner = () =>{
    console.log(this.state.puzzle)
    if(this.solveSudoku()){
        console.log("YAY");
    } else {
      console.log("NO");
      this.setState({noSolution: true})
    }
    console.log(this.state.puzzle);
  }

  solveSudoku(){

    let {row, col} = this.getNextLocation();
    if(row == null){
      return true;
    }
    for(let value = 1; value <= 9; value++){
      if(this.isSafe(row, col, value)){
        // this.state.puzzle[row][col] = value;
        this.setItem(row, col, value);
        if(this.solveSudoku()){
          return true;
        }
        this.setItem(row, col, 0);
      }
    }
    return false;
  }

  setItem(row, col, value){
    let newPuzzle = this.state.puzzle.slice();
    newPuzzle[row][col] = value;
    this.setState({puzzle: newPuzzle});
  }

  getNextLocation(){
    for (let row = 0; row < this.state.N; row++){
      for (let col = 0; col < this.state.N; col++){
        if (this.state.puzzle[row][col] === 0){
          return {row: row, col: col};
        }
      }
    }
    return {row: null, col: null};
  }

  isSafe(row, col, val){
    return (
      !this.usedInRow(row, val) && !this.usedInCol(col, val) &&
      !this.usedInBox(row - row % 3, col - col % 3, val) &&
      this.state.puzzle[row][col] === 0
    );
  }

  usedInRow(row, num){
    for(let i = 0; i < this.state.N; i++){
        if(this.state.puzzle[row][i] === num){
          return true;
        }
    }
    return false;
  }

  usedInCol(col, num){
    for(let i = 0; i < this.state.N; i++){
        if(this.state.puzzle[i][col] === num){
          return true;
        }
    }
    return false;
  }

  usedInBox(row, col, num){
    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        if (this.state.puzzle[i+row][j+col] === num){
          return true;
        }
      }
    }
        return false;
  }

  changeItemClick = (row, col)=>{
      if(row === this.state.changeRow && col == this.state.changeCol){
        if(this.state.changeRow !== -1 && this.state.savedVal !== -1){
          this.setItem(this.state.changeRow, this.state.changeCol, this.state.savedVal);
        }
        this.setState({changeRow: -1, changeCol: -1, savedVal: -1})
      } else {
        this.setState({changeRow: row, changeCol: col, savedVal: this.state.puzzle[row][col]})
        if(this.state.changeRow !== -1 && this.state.savedVal !== -1){
          this.setItem(this.state.changeRow, this.state.changeCol, this.state.savedVal);
        }
        this.setItem(row, col, 0);
      }
      this.setState({noSolution: false})
      

    }

  onKeyPressed = (e) =>{
    let row = this.state.changeRow;
    let col = this.state.changeCol;
    if(row != -1 && col != -1){
      console.log(e.keyCode)
      if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {

      // 0-9 only
        let val = Number(String.fromCharCode(e.keyCode));
        console.log(val)
        if(val === 0 ){
          this.setItem(row, col, val);
          this.setState({savedVal: val, invalid: false})
        }
        else if(!this.usedInRow(row, val) && !this.usedInCol(col, val) &&
          !this.usedInBox(row - row % 3, col - col % 3, val)){
            this.setItem(row, col, val);
            this.setState({savedVal: val, invalid: false})
        } else {
          //INVALID INPUT
          console.log("INVALID INPUT", val)
          this.setState({invalid: true, invalidVal: val})
        }
      }
    }
    this.setState({noSolution: false})
  }

  clearPuzzle = () =>{
    let newPuzzle = this.state.puzzle.slice();
    for(let i = 0; i < this.state.N; i++){
      for(let j = 0; j < this.state.N; j++){
        newPuzzle[i][j] = 0;
      }
    }
    this.setState({puzzle: newPuzzle});
  }

  render(){
    return (
      <React.Fragment>
      <button className="button solve-button" onClick={this.solveSudokuRunner}> Solve Puzzle </button>
      <button className="button clear-button" onClick={this.clearPuzzle}> Clear Puzzle </button>

      <div className="puzzle-container" tabIndex = "0">
      {this.state.puzzle.map((row, index)=>{
        let borderStyle, finalBorder;
        if(index%3 == 0){
          borderStyle = "3px solid black";
        } else {
          borderStyle = "1px solid black";
        }
        if(index === this.state.N - 1){
          finalBorder = "3px solid black";
        } else {
          finalBorder = "0px";
        }
        return (
          <div className="row" style={{borderTop: borderStyle, borderBottom: finalBorder}}>
          {row.map((item, jindex)=>{
            if(item === 0) item = " ";
            let borderStyle, backgroundStyle;
            if(jindex%3 == 0){
              borderStyle = "3px solid black";
            } else {
              borderStyle = "1px solid black";
            }
            if(index === this.state.changeRow && jindex === this.state.changeCol){
              backgroundStyle = "#2196f3";
            } else {
              backgroundStyle = "white";
            }
            return <div className="item" style={{borderLeft: borderStyle, backgroundColor: backgroundStyle}} onClick={(e)=>this.changeItemClick(index, jindex)}>{item}</div>
          })}
          </div>
        )
      })}
      </div>
      {this.state.invalid &&
          <div className="invalid">{this.state.invalidVal}: Invalid Input</div>
        }

      {this.state.noSolution && <div className="invalid">No Solution!</div>}
      </React.Fragment>
    )
  }

}
export default Puzzle;
