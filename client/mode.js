import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import './mode.html'

import './host.js'
import './player.js'

Template.mode.onCreated(function modeOnCreated () {
  this.mode = new ReactiveVar('')
})

Template.mode.helpers({
  noMode () {
    return Template.instance().mode.get() === ''
  },

  modeHost () {
    return Template.instance().mode.get() === 'host'
  },

  modePlayer () {
    return Template.instance().mode.get() === 'player'
  }
})

Template.mode.events({
  'click .mode' (event, instance) {
    instance.mode.set(event.target.innerText)
  }
})
