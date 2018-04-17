import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { ProdEfficiencySchema } from '../Ingredients/Schemas.js';

ProdEfficiency = new Mongo.Collection('prodefficiency');

//Attach a schema to the collection for automatic validation on insert/update operations
ProdEfficiency.attachSchema(ProdEfficiencySchema);

export default ProdEfficiency;

if(Meteor.isServer) {
	Meteor.publish('prodefficiency', function() {
		return ProdEfficiency.find();
	})
}