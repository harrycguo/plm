import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
 
export const StorageCapacities = new Mongo.Collection('storageCapacities');


Meteor.methods({
    'vendors.insert'(name, contact, FCC) {
      
   
      // Make sure the user is logged in before inserting a task
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized');
      }
      
      StorageCapacities.insert({
        vendor: name,
        contact: contact,
        FCC: FCC,
        createdAt: new Date(),
      });
    },

    'vendors.remove'(vendorID) {
      StorageCapacities.remove(vendorID);
    },
    
    'vendors.edit'(id, name, contact, FCC) {
      StorageCapacities.update({_id: id}, { $set: { vendor: name, contact: contact,
        FCC: FCC}})
    },
  });

if (Meteor.isServer) {
  Meteor.publish('vendors', function() {
    return Vendors.find();
  });
}


