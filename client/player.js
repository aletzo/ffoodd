import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import { Games } from '/imports/api/Games.js'

import './player.html'

import './controls.js'

Template.player.onCreated(function playerOnCreated () {
  this.game = new ReactiveVar(Games.findOne())
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

    const player = Meteor.call('players.join', username)

    instance.player.set(player)
  }
})
