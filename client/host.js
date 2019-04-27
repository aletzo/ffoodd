import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import { Games } from '/imports/api/Games.js'
import { Players } from '/imports/api/Players.js'

import './leaderboard.js'

import './host.html'

Template.host.onCreated(function hostOnCreated () {
})

Template.host.helpers({
  gameCreated () {
    const game = Games.findOne()

    if (game === undefined) {
      return false
    }

    return 'round' in game
  },

  round0 () {
    const game = Games.findOne()

    return game.round === 0
  }
})

Template.host.events({
  'click #create' (event, instance) {
    Meteor.call('games.truncate')
    Meteor.call('players.truncate')

    Games.insert({
      eating: false,
      round: 0,
      roundsCount: 10
    })
  },

  'click #reset' (event, instance) {
    Meteor.call('games.truncate')
    Meteor.call('players.truncate')
  },

  'click #start' (event, instance) {
    const game = Games.findOne()

    game.round = 1

    Games.update(game._id, {
      $set: {
        playersCount: Players.find({}).count(),
        round: 1
      }
    })

    setTimeout(() => {
      Games.update(game._id, {
        $set: { eating: true }
      })
    }, 10000)
  }
})
