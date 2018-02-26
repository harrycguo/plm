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

      //Vendor name must be unique
      if (Vendors.find({vendor: name.trim()}).count() > 0){
        throw new Meteor.Error('vendor already in system', 'Vendor Name Must Be Unique');
      }

      //Vendor FCC must be unique
      if (Vendors.find({FCC: FCC.toUpperCase().trim()}).count() > 0) {
        throw new Meteor.Error('vendor already in system', 'Vendor Freight Code Already In System');
      }

      Vendors.insert({
        vendor: name,
        contact: contact,
        FCC: FCC.toUpperCase(),
        createdAt: new Date(),
      });
    },

    'vendors.remove'(vendorID) {
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized', 'not-authorized');
      }
      Vendors.remove(vendorID);
    },
    
    'vendors.edit'(id, oldName, name, contact, oldFCC, FCC) {
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized', 'not-authorized');
      }

      //Vendor names must be unique
      if (Vendors.find({vendor: name.trim()}).count() > 0 && !(oldName == name)) {
        throw new Meteor.Error('vendor already in system', 'Vendor Name Must Be Unique');
      }

      
      //Vendors FCC must be unique
      if (Vendors.find({FCC: FCC.toUpperCase().trim()}).count() > 0 && !(oldFCC.toUpperCase() == FCC.toUpperCase())) {
        throw new Meteor.Error('vendor already in system', 'Vendor Freight Code Already In System');
      }

      Vendors.update({_id: id}, { $set: { 
        vendor: name, 
        contact: contact,
        FCC: FCC.toUpperCase()
      }})
    },
    'getVendorById'(vendorID) {

        return Vendors.findOne({_id: vendorID})
    }
  });

if (Meteor.isServer) {
  Meteor.publish('vendors', function() {
    return Vendors.find();
  });
}


