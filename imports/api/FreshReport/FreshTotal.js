import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { FreshTotalSchema } from '../Ingredients/Schemas.js';

FreshTotal = new Mongo.Collection('freshtotal');

//Attach a schema to the collection for automatic validation on insert/update operations
FreshTotal.attachSchema(FreshTotalSchema);

export default FreshTotal;

if(Meteor.isServer) {
	Meteor.publish('freshtotal', function() {
		return FreshTotal.find();
	})
}