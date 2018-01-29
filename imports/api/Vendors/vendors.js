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
        createdAt: new Date(),
        contact: contact,
        FCC: FCC,
      });
    },

    'vendors.remove'(vendorID) {
      Vendors.remove(vendorID);
    },
    
    'tasks.setChecked'(taskId, setChecked) {
      check(taskId, String);
      check(setChecked, Boolean);
   
      Tasks.update(taskId, { $set: { checked: setChecked } });
    },
  });

if (Meteor.isServer) {
  console.log('publishing vendos');
  Meteor.publish('vendors', function() {
    return Vendors.find();
  });
}


