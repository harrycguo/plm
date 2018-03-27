import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { LotsSchema, LotIngredientSchema } from '../Ingredients/Schemas.js';

Lots = new Mongo.Collection('lots');

//Attach a schema to the collection for automatic validation on insert/update operations
Lots.attachSchema(LotsSchema);

export default Lots;

if(Meteor.isServer) {
	Meteor.publish('lots', function() {
		return Lots.find();
	})
}