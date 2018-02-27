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

      Meteor.call('systemlog.insert',"Vendor", name, FCC, "Added", name);

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
      var myVendor = Vendors.findOne({_id: vendorID})
      Meteor.call('systemlog.insert',"Vendor", myVendor.vendor, myVendor.FCC, "Removed", "")

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

      Meteor.call('systemlog.insert',"Vendor", oldName, FCC, "Modified - Name", name)
      Meteor.call('systemlog.insert',"Vendor", name, FCC, "Modified - Contact", contact)
      Meteor.call('systemlog.insert',"Vendor", name, FCC, "Modified - FCC", FCC)

    
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


