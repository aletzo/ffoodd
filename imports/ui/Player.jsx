import React, { Component } from 'react'

class Player extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      game: null,
      player: [],
    };
  }

    join() {
        //Meteor.call('players.join', gamecode, username)

        console.log('join')
    }

  render () {
    return (
      <div>
        hello fffooddie!

        <input type="text" placeholder="game code" name="gamecode">
        <br>
        <input type="text" placeholder="username" name="username">
        <br>
        <button onClick={() => this.join()}>
          join!
        </button>
      </div>
    )
  }
}

export default Player

