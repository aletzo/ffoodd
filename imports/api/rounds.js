import { Mongo } from 'meteor/mongo'

export default Rounds = new Mongo.Collection('rounds')

if (Meteor.isServer) {
  Meteor.publish('rounds', function roundsPublication () {
    return Rounds.find()
  })
}
