import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import { Games } from '/imports/api/Games.js'
import { Players } from '/imports/api/Players.js'

import './player.html'

import './controls.js'

Template.player.onCreated(function playerOnCreated () {
  this.game = new ReactiveVar({})
  this.player = new ReactiveVar({})
})

Template.player.helpers({
  game () {
    return Template.instance().game.get()
  },

  player () {
    return Template.instance().player.get()
  }
})

Template.player.events({
  'click #join' (event, instance) {
    const username = document.querySelector('#username').value

    const game = Games.findOne()

    instance.game.set(game)

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

    instance.player.set(player)
  }
})
