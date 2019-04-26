import { Mongo } from 'meteor/mongo'

export default Players = new Mongo.Collection('players')

if (Meteor.isServer) {
  Meteor.publish('players', function playersPublication () {
    return Players.find()
  })
}
