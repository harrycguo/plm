import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const LotNumberSystem = new Mongo.Collection('lotNumberSystem')

if(Meteor.isServer) {
	Meteor.publish('lotNumberSystem', function() {
		return LotNumberSystem.find();
	})
}