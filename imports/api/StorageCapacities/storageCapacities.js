import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
 
export const StorageCapacities = new Mongo.Collection('storageCapacities');

Meteor.methods({
    'sc.insert'(type, capacity, used) {
    
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized', 'not-authorized');
      }
      
      StorageCapacities.insert({
        type: name,
        capacity: Number(capacity),
        used: Number(used),
      });
    },

    'sc.remove'(scID) {
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized', 'not-authorized');
      }
      StorageCapacities.remove(scID);
    },
    
    'sc.editCapacity'(scID, capacity) {
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized', 'not-authorized');
      }

      //Check capacity
      check(capacity, Number)
      let current = StorageCapacities.findOne({_id: scID}, { used: 1, _id:0 })
      if (capacity < current.used) {
        throw new Meteor.Error('capacity under currently used', 'New Capacity is below currently used for ' + current.name);
      }
      
      Meteor.call('systemlog.insert',"Storage Capacities", current.name, scID, "Modified - Capacity", capacity)
      StorageCapacities.update({_id: scID}, 
        { $set: 
        { capacity: Number(capacity),
        }})
    },

    //can be used to both add and remove used capacity
    'sc.editUsed'(scID, used) {
      if (! this.userId) {
        throw new Meteor.Error('not-authorized', 'User Not Logged In');
      }

      //Check capacity used
      check(used, Number)
      let current = StorageCapacities.findOne({_id: scID})
      if (used > current.capacity) {
        throw new Meteor.Error('Exceeding Capacity', 'Exceeding Capacity For ' + current.name);
      }
      
      StorageCapacities.update({_id: scID}, 
        { $set: 
        { used: Number(used),
        }})
    },

  });

if (Meteor.isServer) {
  Meteor.publish('storageCapacities', function() {
    return StorageCapacities.find();
  });
}


