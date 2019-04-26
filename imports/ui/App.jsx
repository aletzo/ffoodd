import React from 'react'
import Hello from './Hello.jsx'
import Info from './Info.jsx'
import ModeSelection from './ModeSelection.jsx'

import Games from '/imports/api/games'
import Players from '/imports/api/players'

import { withTracker } from 'meteor/react-meteor-data'

const App = () => (
  <div>
    <h1>ffoodd</h1>
    <ModeSelection />
  </div>
)

export default AppContainer = withTracker(() => {
  Meteor.subscribe('games')
  Meteor.subscribe('players')

  return {
    games: Games.find({}, { sort: { createdAt: -1 } }).fetch(),
    players: Players.find({}, { sort: { name: 1 } }).fetch()
  }
})(App)
