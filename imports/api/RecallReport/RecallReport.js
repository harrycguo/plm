import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { RecallReportSchema } from '../Ingredients/Schemas.js';

RecallReport = new Mongo.Collection('recallreport');

//Attach a schema to the collection for automatic validation on insert/update operations
RecallReport.attachSchema(RecallReportSchema);

export default RecallReport;

if(Meteor.isServer) {
	Meteor.publish('recallreport', function() {
		return RecallReport.find();
	})
}