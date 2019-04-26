import { Mongo } from 'meteor/mongo'

export default Games = new Mongo.Collection('games')

if (Meteor.isServer) {
  Meteor.publish('games', function gamesPublication () {
    return Games.find()
  })
}
