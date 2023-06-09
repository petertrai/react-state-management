import React, { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex)
  // You can delete them and build your own logic from scratch.

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    if (index === 0) return 'Coordinates (1,1)';
    if (index === 1) return 'Coordinates (2,1)';
    if (index === 2) return 'Coordinates (3,1)';
    if (index === 3) return 'Coordinates (1,2)';
    if (index === 4) return 'Coordinates (2,2)';
    if (index === 5) return 'Coordinates (3,2)';
    if (index === 6) return 'Coordinates (1,3)';
    if (index === 7) return 'Coordinates (2,3)';
    if (index === 8) return 'Coordinates (3,3)';
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage)
    setEmail(initialEmail)
    setSteps(initialSteps)
    setIndex(initialIndex)
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let nextIndex = index;

    switch (direction) {
      case 'left':
        if (index % 3 !== 0) {
          nextIndex = index - 1;
        }
        break;
      case 'up':
        if (index > 2) {
          nextIndex = index - 3;
        }
        break;
      case 'right':
        if (index % 3 !== 2) {
          nextIndex = index + 1;
        }
        break;
      case 'down':
        if (index < 6) {
          nextIndex = index + 3;
        }
        break;
      default:
        break;
    }

    return nextIndex;
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id
    const nextIndex = getNextIndex(direction)
    let cantGoMessage = ''

    if (nextIndex !== index) {
      setIndex(nextIndex)
      setSteps(steps + 1)
    } else {
      switch (direction) {
        case 'left':
          cantGoMessage = "You can't go left.";
          break;
        case 'up':
          cantGoMessage = "You can't go up.";
          break;
        case 'right':
          cantGoMessage = "You can't go right.";
          break;
        case 'down':
          cantGoMessage = "You can't go down.";
          break;
        default:
          break;
      }
      setMessage(cantGoMessage)
    }

  }

  function onChange(evt) {
    setEmail(evt.target.value)
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;

    const payload = {
      x: x,
      y: y,
      steps: steps,
      email: email,
    }

    axios.post('http://localhost:9000/api/result', payload)
      .then(res => {
        setMessage(res.data.message)
      })
      .catch(err => {
        console.error(err);

      })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXY()}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${index === idx ? ' active' : ''}`}>
              {index === idx ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
