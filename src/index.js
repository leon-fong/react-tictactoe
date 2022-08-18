import React ,{ useState, useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function Clock() {
  const [date, setDate] = useState(new Date())
  useEffect(() => {
    const timerID = setInterval(()=> setDate(new Date()) , 1000)
    return () => clearInterval(timerID)
  },[])
  return <FormattedDate date={date} />
}

function FormattedDate(props) {
  return  <h2>{props.date.toLocaleTimeString()}</h2>
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Square(props){
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  )
}

function Board(props){
  return (
    <div>
      {
        Array.from({length:3},(_, i) => (
          <div className="board-row" key={i}>{
            Array.from({length:3},(_, j) => (
              <Square value={ props.squares[(i * 3) + j] } onClick={()=> props.onClick((i * 3) + j)}  key={(i * 3) + j}/>
            ))
          }</div>
        ))
      }
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if(calculateWinner(squares) || squares[i]) return
    squares[i] = this.state.xIsNext ? 'X' :'O'
    this.setState({
      history:history.concat([{
        squares:squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start'
      return (
        <li key={move}>
          <button onClick={()=> this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })
    const status = winner ? 'Winner: ' + winner : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O'); 

    return <>
      <h1>React Tic Tac Toe</h1>
      <Clock />
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i)=>this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
      </>
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
