import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Roles } from 'meteor/alanning:roles';
 
export const SystemLog = new Mongo.Collection('log');

Meteor.methods({
    'systemlog.insert'(type, name, _id, change, _from, to) {

      SystemLog.insert({
        type: type,
        name: name,
        change: change,
        from: _from,
        to: to,
        user: this.userId,
        time: Date.now(),
        id: _id,
      });
    },
  });

if (Meteor.isServer) {
  Meteor.publish('log', function() {
    return SystemLog.find();
  });
}


