import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { ProfReportTotalSchema } from '../Ingredients/Schemas.js';

ProfReportTotal = new Mongo.Collection('profreporttotal');

//Attach a schema to the collection for automatic validation on insert/update operations
ProfReportTotal.attachSchema(ProfReportTotalSchema);

export default ProfReportTotal;

if(Meteor.isServer) {
	Meteor.publish('profreporttotal', function() {
		return ProfReportTotal.find();
	})
}