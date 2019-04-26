import React, { Component } from 'react'

class Host extends Component {
  startGame () {
    // something

    console.log('start game')
  }

  render () {
    return (
      <div>
        <h2>waiting for ffoodies to join</h2>

        <button onClick={() => this.startGame()}>
          start eating!
        </button>

      </div>
    )
  }
}

export default Player
