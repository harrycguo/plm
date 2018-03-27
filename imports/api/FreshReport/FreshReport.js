import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { FreshReportSchema } from '../Ingredients/Schemas.js';

FreshReport = new Mongo.Collection('freshreport');

//Attach a schema to the collection for automatic validation on insert/update operations
FreshReport.attachSchema(FreshReportSchema);

export default FreshReport;

if(Meteor.isServer) {
	Meteor.publish('freshreport', function() {
		return FreshReport.find();
	})
}