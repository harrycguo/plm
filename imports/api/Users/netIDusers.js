import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const NetIDusers = new Mongo.Collection('netIDusers');

Meteor.methods({
    'netIDusers.insert'(netID){
    	Meteor.call('systemlog.insert',
      		"User", netID, netID, 
        "Added", netID);
        NetIDusers.insert({
            user: netID,
          });
    }
})

if (Meteor.isServer) {
    Meteor.publish('netIDusers', function() {
      return NetIDusers.find();
    });
  }