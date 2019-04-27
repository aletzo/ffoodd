import { Mongo } from 'meteor/mongo'

export const Players = new Mongo.Collection('players')

Meteor.methods({
  'players.truncate' () {
    console.log('inside players.truncate')
    Players.remove({})
  }
})
