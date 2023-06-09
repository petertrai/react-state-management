import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState
  }
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  getXY = () => {
    if (this.state.index === 0) return 'Coordinates (1,1)';
    if (this.state.index === 1) return 'Coordinates (2,1)';
    if (this.state.index === 2) return 'Coordinates (3,1)';
    if (this.state.index === 3) return 'Coordinates (1,2)';
    if (this.state.index === 4) return 'Coordinates (2,2)';
    if (this.state.index === 5) return 'Coordinates (3,2)';
    if (this.state.index === 6) return 'Coordinates (1,3)';
    if (this.state.index === 7) return 'Coordinates (2,3)';
    if (this.state.index === 8) return 'Coordinates (3,3)';
  }

  reset = () => {
    this.setState(initialState)
  }

  getNextIndex = (direction) => {
    let nextIndex = this.state.index;

    switch (direction) {
      case 'left':
        if (this.state.index % 3 !== 0) {
          nextIndex = this.state.index - 1;
        }
        break;
      case 'up':
        if (this.state.index > 2) {
          nextIndex = this.state.index - 3;
        }
        break;
      case 'right':
        if (this.state.index % 3 !== 2) {
          nextIndex = this.state.index + 1;
        }
        break;
      case 'down':
        if (this.state.index < 6) {
          nextIndex = this.state.index + 3;
        }
        break;
      default:
        break;
    }

    return nextIndex;
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id
    const nextIndex = this.getNextIndex(direction)
    let cantGoMessage = ''

    if (nextIndex !== this.state.index) {
      this.setState((prevState) => ({
        index: nextIndex,
        steps: prevState.steps + 1,
        cantGoMessage: ''
      }));
    } else {
      switch (direction) {
        case 'left':
          cantGoMessage = "You can't go left";
          break;
        case 'up':
          cantGoMessage = "You can't go up";
          break;
        case 'right':
          cantGoMessage = "You can't go right";
          break;
        case 'down':
          cantGoMessage = "You can't go down";
          break;
        default:
          break;
      }
      this.setState({ ...this.state, message: cantGoMessage })
    }
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({
      ...this.state, email: evt.target.value
    })
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const x = (this.state.index % 3) + 1;
    const y = Math.floor(this.state.index / 3) + 1;

    const payload = {
      x: x,
      y: y,
      steps: this.state.steps,
      email: this.state.email,
    }
    
    axios.post('http://localhost:9000/api/result', payload)
      .then(res => {
        this.setState({...this.state, message: res.data.message});
      })
      .catch(err => {
        this.setState({...this.state, message: err.response.data.message})
      })
      this.setState({...this.state, email: ''})

  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXY()}</h3>
          <h3 id="steps">{`You moved ${this.state.steps} time${this.state.steps === 1 ? '':'s' }`}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input onChange={this.onChange} id="email" type="email" placeholder="type email" value={this.state.email}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
