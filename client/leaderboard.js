import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import { Games } from '/imports/api/Games.js'
import { Players } from '/imports/api/Players.js'

import './leaderboard.html'

Template.leaderboard.onCreated(function leaderboardOnCreated () {
  this.game = new ReactiveVar(Games.findOne())
})

Template.leaderboard.helpers({
  round () {
    const game = Template.instance().game.get()

    if (!game) {
      return ''
    }

    return game.round
  },

  players () {
    const players = Players.find({}, { sort: { score: -1, username: 1 } })

    return players
  }
})
