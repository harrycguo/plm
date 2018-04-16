import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

 
export const SystemLog = new Mongo.Collection('log');

Meteor.methods({
    'systemlog.insert'(type, name, _id, change, to) {
      let user = Meteor.users.findOne(this.userId)
      SystemLog.insert({
        type: type,
        name: name,
        change: change,
        to: to,
        user: user.username,
        time: Date.now(),
        id: _id,
      })
    },
  });

if (Meteor.isServer) {
  Meteor.publish('log', function() {
    return SystemLog.find();
  });
}


