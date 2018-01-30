import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
 
export const StorageCapacities = new Mongo.Collection('storageCapacities');

Meteor.methods({
    'sc.insert'(type, capacity) {
    
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized');
      }
      
      StorageCapacities.insert({
        type: name,
        capacity: Number(capacity),
      });
    },

    'sc.remove'(scID) {
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized');
      }
      StorageCapacities.remove(scID);
    },
    
    'sc.edit'(scID, type, capacity) {
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized');
      }
      check(capacity, Number)

      StorageCapacities.update({_id: scID}, 
        { $set: 
        { type: type, 
        capacity: Number(capacity),
        }})
    },
  });

if (Meteor.isServer) {
  Meteor.publish('capacities', function() {
    return StorageCapacities.find();
  });
}


