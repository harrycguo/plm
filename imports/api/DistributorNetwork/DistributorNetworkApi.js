import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

export const DistributorNetwork = new Mongo.Collection('distributors');

Meteor.methods({
    'production.produce'(formulaID, numUnitsProduce, ingList) {

    },

})

if (Meteor.isServer) {
    Meteor.publish('distributors', function () {
      return DistributorNetwork.find();
    });
  }