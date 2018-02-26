import { Mongo } from 'meteor/mongo';
import {  } from '../ingredients/Schemas.js';
import { Vendors } from '../Vendors/vendors.js';

Logs = new Mongo.Collection('logs');

//Attach a schema to the collection for automatic validation on insert/update operations
Logs.attachSchema(IngredientSchema);

export default IngredientsList;

if(Meteor.isServer) {
	Meteor.publish('logs', function() {
		return Logs.find();
	})
}