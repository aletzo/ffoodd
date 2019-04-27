import { Mongo } from 'meteor/mongo'

import { Games } from '/imports/api/Games.js'

export const Players = new Mongo.Collection('players')

Meteor.methods({

  'players.done' (playerId) {
    const game = Games.findOne()

    const playersDone = game.playersDone

    let score = 0
    let hasFart = false
    let hasWetFart = false

    switch (playersDone) {
      case 0: score = 10; break
      case 1: score = 7; break
      case 2: score = 5; break
      case 3: score = 3; break
      case 4: score = 1; break

      default:
        hasFart = true
    }

    const roundDone = game.playersDone + 1 === game.playersCount

    let gameDone = roundDone
      ? game.round + 1 === game.roundsCount
      : false

    let round = game.round

    if (roundDone) {
      hasWetFart = true

      round++

      if (!gameDone) {
        setTimeout(() => {
          Games.update(game._id, {
            $set: { eating: true }
          })
        }, 10000)
      }
    }

    Games.update(game._id, {
      $set: {
        eating: !roundDone,
        gameDone,
        playersDone: playersDone + 1,
        round
      }
    })

    Players.update(playerId, {
      $inc: {
        score
      },
      $set: {
        done: true,
        hasFart,
        hasWetFart
      }
    })
  },

  'players.fart' (playerId) {
    Players.update({
      _id: {
        $ne: playerId
      }
    }, {
      $set: { isFarted: true }
    })

    setTimeout(() => {
      Players.update({}, {
        $set: { isFarted: false }
      })
    }, 2000)
  },

  'players.join' (username) {
    let player = Players.findOne({
      username
    })

    if (player === undefined) {
      Players.insert({
        done: false,
        hasFart: false,
        hasWetFart: false,
        isFarted: false,
        score: 0,
        username
      })

      player = Players.findOne({
        username
      })
    }

    return player
  },

  'players.wetFart' (playerId) {
    Players.update({}, {
      $set: { isFarted: true }
    })

    setTimeout(() => {
      Players.update(playerId, {
        $set: { isFarted: false }
      })
    }, 2000)

    setTimeout(() => {
      Players.update({
        _id: {
          $ne: playerId
        }
      }, {
        $set: { isFarted: false }
      })
    }, 5000)
  }

})
