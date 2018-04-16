import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { ProfitabilityReportSchema } from '../Ingredients/Schemas.js';

ProfReport = new Mongo.Collection('profreport');

//Attach a schema to the collection for automatic validation on insert/update operations
ProfReport.attachSchema(ProfitabilityReportSchema);

export default ProfReport;

if(Meteor.isServer) {
	Meteor.publish('profreport', function() {
		return ProfReport.find();
	})
}