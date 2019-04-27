import { Mongo } from 'meteor/mongo'

export const Games = new Mongo.Collection('games')

Meteor.methods({
  'games.truncate' () {
    console.log('inside games.truncate')
    Games.remove({})
  }
})
