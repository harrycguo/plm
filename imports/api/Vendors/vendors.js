import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
 
export const Vendors = new Mongo.Collection('vendors');


Meteor.methods({
    'vendors.insert'(name, contact, FCC) {
      
   
      // Make sure the user is logged in before inserting a task
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized');
      }
      
      Vendors.insert({
        vendor: name,
        contact: contact,
        FCC: FCC,
        createdAt: new Date(),
      });
    },

    'vendors.remove'(vendorID) {
      Vendors.remove(vendorID);
    },
    
    'vendors.edit'(id, name, contact, FCC) {
      Vendors.update({_id: id}, { $set: { vendor: name, contact: contact,
        FCC: FCC}})
    },
  });

if (Meteor.isServer) {
  Meteor.publish('vendors', function() {
    return Vendors.find();
  });
}


