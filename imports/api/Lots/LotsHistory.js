import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { LotsHistorySchema } from '../Ingredients/Schemas.js';

LotsHistory = new Mongo.Collection('lotshistory');

//Attach a schema to the collection for automatic validation on insert/update operations
LotsHistory.attachSchema(LotsHistorySchema);

export default LotsHistory;

if(Meteor.isServer) {
	Meteor.publish('lotshistory', function() {
		return LotsHistory.find();
	})
}