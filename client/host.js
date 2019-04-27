import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import { Games } from '/imports/api/Games.js'

import './leaderboard.js'

import './host.html'

Template.host.onCreated(function hostOnCreated () {
  this.game = new ReactiveVar(Games.findOne())
})

Template.host.helpers({
  gameCreated () {
    const game = Template.instance().game.get()

    if (game === undefined) {
      return false
    }

    return 'round' in game
  },

  round0 () {
    const game = Template.instance().game.get()

    return game.round === 0
  }
})

Template.host.events({
  'click #create' (event, instance) {
    Meteor.call('games.create')
  },

  'click #reset' (event, instance) {
    Meteor.call('games.reset')
  },

  'click #start' (event, instance) {
    Meteor.call('games.start')
  }
})
