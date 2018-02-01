import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
 
export const Vendors = new Mongo.Collection('vendors');


Meteor.methods({
    'vendors.insert'(name, contact, FCC) {
    
      // Make sure the user is logged in before inserting a task
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized', 'not-authorized');
      }

      if (Vendors.find({FCC: FCC}).count() > 0) {
        throw new Meteor.Error('vendor already in system', 'Vendor Already In System');
      }
      
      Vendors.insert({
        vendor: name,
        contact: contact,
        FCC: FCC,
        createdAt: new Date(),
      });
    },

    'vendors.remove'(vendorID) {
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized', 'not-authorized');
      }
      Vendors.remove(vendorID);
    },
    
    'vendors.edit'(id, name, contact, oldFCC, FCC) {
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized', 'not-authorized');
      }

      console.log('yee')
      console.log(Vendors.find({_id: id}))

      if (Vendors.find({FCC: FCC}).count() > 0 && !(oldFCC == FCC)) {
        throw new Meteor.Error('vendor already in system', 'Vendor Already In System');
      }

      Vendors.update({_id: id}, { $set: { vendor: name, contact: contact,
        FCC: FCC}})
    },
  });

if (Meteor.isServer) {
  Meteor.publish('vendors', function() {
    return Vendors.find();
  });
}


