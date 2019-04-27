import { Mongo } from 'meteor/mongo'

import { Players } from '/imports/api/Players.js'

export const Games = new Mongo.Collection('games')

Meteor.methods({
  'games.create' () {
    Games.remove({})
    Players.remove({})

    Games.insert({
      eating: false,
      round: 0,
      roundsCount: 10
    })
  },

  'games.reset' () {
    Games.remove({})
    Players.remove({})
  },

  'games.start' () {
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
