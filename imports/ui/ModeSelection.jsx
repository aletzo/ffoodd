import React, { Component } from 'react';

export default class ModeSelection extends Component {

  state : {
    game: null,
    mode: null,
  }

  setModeHost() {
    const game = this.createGame()

    this.setState({
        game,
        mode: 'host',
    })
  }

  setModePlayer() {
    this.setState({
        mode: 'player'
    })
  }

  render() {
    return (
      <div>
        <h2>{this.state.mode}</h2>

        <button onClick={() => this.setModePlayer()}>player</button>
        <button onClick={() => this.setModeHost()}>host</button>
      </div>
    );
  }
}

