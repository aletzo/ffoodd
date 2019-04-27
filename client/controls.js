import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import { Games } from '/imports/api/Games.js'
import { Players } from '/imports/api/Players.js'

import './controls.html'

Template.controls.onCreated(function modeOnCreated () {
  this.game = new ReactiveVar({})
  this.player = new ReactiveVar({})
})

Template.controls.helpers({
  game () {
    return Template.instance().game.get()
  },

  player () {
    return Template.instance().player.get()
  }
})

Template.controls.events({
  'click #fart' (event, instance) {
    const player = Players.findOne({
      username: document.querySelector('#username')
    })

    Players.update({
      _id: {
        $ne: player._id
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

  'click #wetFart' (event, instance) {
    const player = Players.findOne({
      username: document.querySelector('#username')
    })

    Players.update({}, {
      $set: { isFarted: true }
    })

    setTimeout(() => {
      Players.update({}, {
        $set: { isFarted: false }
      })
    }, 2000)

    setTimeout(() => {
      Players.update({
        _id: {
          $ne: player._id
        }
      }, {
        $set: { isFarted: false }
      })
    }, 5000)
  },

  'click .eat' (event, instance) {
    event.target.classList.add('hidden')

    if (event.target.classList.contains('hidden')) {
      return
    }

    const countEaten = document.querySelectorAll('.eat.hidden').length
    const countToBeEaten = document.querySelectorAll('.eat').length

    if (countEaten === countToBeEaten) {
      const game = Games.findOne()

      Template.instance().game.set(game)

      const player = Players.findOne({
        username: document.querySelector('#username')
      })

      Template.instance().player.set(player)

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

      Players.update(player._id, {
        $set: {
          done: true,
          hasFart,
          hasWetFart,
          score: player.score + score
        }
      })
    }
  }
})
