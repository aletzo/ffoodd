import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import { Games } from '/imports/api/Games.js'
import { Players } from '/imports/api/Players.js'

import './controls.html'

Template.controls.onCreated(function modeOnCreated () {
  this.game = new ReactiveVar(Games.findOne())

  const player = Players.findOne({
    username: document.querySelector('#username')
  })

  this.player = new ReactiveVar(player)
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
    const player = Template.instance().player.get()

    Meteor.call('players.fart', player._id)
  },

  'click #wetFart' (event, instance) {
    const player = Template.instance().player.get()

    Meteor.call('players.wetFart', player._id)
  },

  'click .eat' (event, instance) {
    event.target.classList.add('hidden')

    if (event.target.classList.contains('hidden')) {
      return
    }

    const countEaten = document.querySelectorAll('.eat.hidden').length
    const countToBeEaten = document.querySelectorAll('.eat').length

    if (countEaten === countToBeEaten) {
      const player = Template.instance().player.get()

      Meteor.call('players.done', player._id)
    }
  }
})
